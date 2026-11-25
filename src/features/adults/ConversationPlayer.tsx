import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import type { Decision, DecisionOption, Scenario } from '../../types';
import { useDispatch, useGame } from '../../state/store';
import { CRITERIA_LABEL, SCENARIO_POINTS, SKILL_LABEL, scenarioScore, stableShuffle } from '../../data';
import { ADULTS, AdultAvatar, AdultStage } from '../../art/AdultArt';
import { AnswerOption, type OptionState } from '../../components/AnswerOption';
import { BlankExercise, type BlankResult } from './BlankExercise';
import { BLANK_POINTS } from '../../data';
import { SoundToggle } from '../../components/SoundToggle';
import { ProgressBar } from '../../components/ProgressBar';
import { Icon } from '../../components/Icon';
import { Link, navigate } from '../../utils/router';
import { playSound } from '../../utils/sound';

const VERDICT = {
  good: { label: 'مناسب', icon: 'check' as const },
  weak: { label: 'يحتاج إلى تحسين', icon: 'tilde' as const },
  issue: { label: 'غير مناسب', icon: 'x' as const },
};

const RATING_TEXT = {
  best: 'صواب',
  acceptable: 'فيه خلل جزئي',
  unsuitable: 'خطأ',
};

export function CriteriaRow({ option }: { option: DecisionOption }) {
  return (
    <ul className="criteria" aria-label="تقييم الخيار">
      {(Object.keys(CRITERIA_LABEL) as (keyof typeof CRITERIA_LABEL)[]).map((k) => {
        const v = option.criteria[k];
        return (
          <li key={k} className={'crit crit-' + v}>
            <Icon name={VERDICT[v].icon} size={14} strokeWidth={3} />
            <span>
              {CRITERIA_LABEL[k]}: {VERDICT[v].label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function Transcript({ scenario, upto, answers }: { scenario: Scenario; upto: number; answers: string[] }) {
  const ref = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [upto]);
  if (upto === 0) return null;
  const roomy = typeof window !== 'undefined' && window.matchMedia?.('(min-width: 768px)').matches;
  return (
    <details className="transcript" open={roomy}>
      <summary>
        <Icon name="chat" size={16} /> سجلّ المراجعة
      </summary>
      <ol ref={ref}>
        {scenario.decisions.slice(0, upto).map((d, i) => {
          const best = d.options?.find((o) => o.rating === 'best');
          const mine = d.options?.find((o) => o.id === answers[i]);
          return (
            <li key={d.id}>
              <p className="t-them">
                <b>{ADULTS[d.speaker].name}:</b> {d.line}
              </p>
              <p className="t-you">
                <b>الصواب:</b> {d.blank ? d.blank.sentence.replace('____', d.blank.accept[0]) : best?.text}
                {mine && mine.rating !== 'best' && <small> (اخترت أولًا: «{mine.text}»)</small>}
              </p>
              <p className="t-them">
                <b>{ADULTS[d.speaker].name}:</b> {d.followUp}
              </p>
            </li>
          );
        })}
      </ol>
    </details>
  );
}

export function ConversationPlayer({ scenario }: { scenario: Scenario }) {
  const state = useGame();
  const dispatch = useDispatch();
  const p = state.scenarios[scenario.id];

  useEffect(() => {
    if (!p || p.status === 'completed') dispatch({ type: 'startScenario', id: scenario.id, restart: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario.id]);

  const step = Math.min(p?.currentStep ?? 0, scenario.decisions.length - 1);
  const d: Decision = scenario.decisions[step];
  const chosenId = p?.status === 'in-progress' ? p.runAnswers[step] : undefined;
  const chosen = d.options?.find((o) => o.id === chosenId);
  const blankResult = d.blank && chosenId ? (chosenId as BlankResult) : null;
  const answered = !!chosen || !!blankResult;
  const isLast = step === scenario.decisions.length - 1;
  const best = d.options?.find((o) => o.rating === 'best');
  const options = useMemo(() => stableShuffle(d.options ?? [], scenario.id + d.id), [d, scenario.id]);
  const score = scenarioScore(scenario, p?.runAnswers ?? []);
  const [announce, setAnnounce] = useState('');
  const feedbackRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    setAnnounce('');
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  const choose = useCallback(
    (o: DecisionOption) => {
      if (chosen || !p || p.status !== 'in-progress') return;
      playSound(o.rating === 'best' ? 'correct' : o.rating === 'acceptable' ? 'click' : 'incorrect');
      dispatch({ type: 'answerDecision', id: scenario.id, step, optionId: o.id, points: SCENARIO_POINTS[o.rating] });
      setAnnounce(`اخترت: ${o.text}. التقييم: ${RATING_TEXT[o.rating]}.`);
      setTimeout(() => {
        feedbackRef.current?.focus({ preventScroll: true });
        feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    },
    [chosen, p, dispatch, scenario.id, step],
  );

  const solveBlank = useCallback(
    (r: BlankResult) => {
      if (!p || p.status !== 'in-progress' || chosenId) return;
      dispatch({ type: 'answerDecision', id: scenario.id, step, optionId: r, points: BLANK_POINTS[r] });
      setAnnounce(r === 'revealed' ? 'عُرضت الإجابة.' : 'إجابة صحيحة.');
      setTimeout(() => {
        feedbackRef.current?.focus({ preventScroll: true });
        feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 80);
    },
    [p, chosenId, dispatch, scenario.id, step],
  );

  const next = useCallback(() => {
    if (!answered) return;
    if (isLast) {
      dispatch({ type: 'completeScenario', id: scenario.id, score: score.percent });
      playSound('complete');
      navigate(`/adults/results/${scenario.id}`);
    } else {
      playSound('transition');
      dispatch({ type: 'nextStep', id: scenario.id });
    }
  }, [answered, isLast, dispatch, scenario.id, score.percent]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const n = '١٢٣٤'.indexOf(e.key) + 1 || parseInt(e.key, 10);
      if (options.length && n >= 1 && n <= options.length && !chosen) choose(options[n - 1]);
      if (e.key === 'ArrowLeft' && answered && document.activeElement?.tagName !== 'INPUT') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [options, choose, chosen, answered, next]);

  if (!p) return <div className="player-loading">لحظة...</div>;

  const npc = ADULTS[d.speaker];
  const optState = (o: DecisionOption): OptionState => {
    if (!chosen) return 'idle';
    if (o.rating === 'best') return 'best';
    if (o.id === chosen.id) return o.rating === 'acceptable' ? 'acceptable' : 'unsuitable';
    return 'dim';
  };

  return (
    <div className="player adults-player" style={{ '--accent': '#245742' } as CSSProperties}>
      <header className="player-top" style={{ '--progress': (step + (chosen ? 1 : 0)) / scenario.decisions.length } as CSSProperties}>
        <Link to={`/adults/scenario/${scenario.id}`} className="icon-btn" aria-label="الخروج من الموقف (يُحفظ تقدّمك)">
          <Icon name="back" />
        </Link>
        <div className="player-title">
          <strong>{scenario.title}</strong>
          <span>
            المسألة {step + 1} من {scenario.decisions.length}
          </span>
        </div>
        <div className="player-progress">
          <ProgressBar value={step + (chosen ? 1 : 0)} max={scenario.decisions.length} label="تقدّمك في الموقف" />
        </div>
        <span className="score score-adult" aria-label={`نقاط هذا الموقف ${score.points} من ${score.max}`}>
          <Icon name="target" size={18} /> {score.points}/{score.max}
        </span>
        <SoundToggle compact />
      </header>

      <main className="vn-layout" id="main">
        <section className="vn-stage" aria-label="المشهد">
          <div className="vn-frame">
            <AdultStage backdrop={scenario.backdrop} speaker={d.speaker} mood={chosen ? d.followUpMood : d.mood} label={`${npc.name}، ${npc.role}`} />
            <div className="vn-dialogue" key={d.id + (chosen ? '-f' : '')}>
              <div className="vn-name">
                <AdultAvatar id={d.speaker} mood={chosen ? d.followUpMood : d.mood} size={40} />
                <div>
                  <strong>{npc.name}</strong>
                  <small>{npc.role}</small>
                </div>
              </div>
              {answered ? (
                <>
                  <p className="vn-you">
                    <b>الصواب:</b> {d.blank ? d.blank.sentence.replace('____', d.blank.accept[0]) : best?.text}
                  </p>
                  <p className="vn-line">{d.followUp}</p>
                </>
              ) : (
                <p className="vn-line">{d.line}</p>
              )}
            </div>
          </div>
          <Transcript scenario={scenario} upto={step} answers={p.runAnswers} />
        </section>

        <section className="vn-panel" aria-labelledby="vn-q">
          <div className="context-card">
            <span className="context-label">
              <Icon name="info" size={16} /> {SKILL_LABEL[d.skill]}
            </span>
            <p>{d.context}</p>
          </div>
          <h2 id="vn-q" tabIndex={-1} ref={headingRef}>
            {d.prompt}
          </h2>
          {d.blank ? (
            <BlankExercise blank={d.blank} solved={blankResult} onSolve={solveBlank} />
          ) : (
            <div className="answers answers-adult" role="group" aria-label="الصياغات المقترحة">
              {options.map((o, i) => (
                <AnswerOption key={o.id} tone="adults" label={o.text} index={i} state={optState(o)} disabled={!!chosen} onSelect={() => choose(o)} />
              ))}
            </div>
          )}
          <div className="sr-only" role="status" aria-live="polite">
            {announce}
          </div>

          {blankResult && d.blank && (
            <div className="explain" ref={feedbackRef} tabIndex={-1}>
              <div className={'verdict ' + (blankResult === 'revealed' ? 'v-unsuitable' : 'v-best')}>
                <span className="verdict-chip">
                  <Icon name={blankResult === 'revealed' ? 'x' : 'check'} size={16} strokeWidth={3} />
                  {blankResult === 'correct' ? 'إجابة صحيحة' : blankResult === 'assisted' ? 'صحيحة بعد المحاولة' : 'الإجابة الصحيحة'}
                </span>
                <p>{d.blank.rule}</p>
              </div>
              <button type="button" className="btn btn-primary btn-lg btn-block" onClick={next}>
                {isLast ? 'اعرض النتيجة' : 'المسألة التالية'} <Icon name={isLast ? 'flag' : 'next'} size={20} />
              </button>
            </div>
          )}

          {chosen && best && (
            <div className="explain" ref={feedbackRef} tabIndex={-1}>
              <div className={'verdict v-' + chosen.rating}>
                <span className="verdict-chip">
                  <Icon name={chosen.rating === 'best' ? 'check' : chosen.rating === 'acceptable' ? 'tilde' : 'x'} size={16} strokeWidth={3} />
                  {RATING_TEXT[chosen.rating]}
                </span>
                <p>{chosen.explanation}</p>
              </div>
              {chosen.rating !== 'best' && (
                <p className="better">
                  <b>الصواب:</b> «{best.text}» — {best.explanation}
                </p>
              )}
              <details className="compare">
                <summary>
                  <Icon name="layers" size={16} /> قارن كل الخيارات بالمعايير الخمسة
                </summary>
                <ul className="explain-list">
                  {[chosen, ...options.filter((o) => o.id !== chosen.id)].map((o) => (
                    <li key={o.id} className={'explain-item ex-' + o.rating}>
                      <div className="explain-head">
                        <span className={'rating-chip rc-' + o.rating}>
                          <Icon name={o.rating === 'best' ? 'check' : o.rating === 'acceptable' ? 'tilde' : 'x'} size={14} strokeWidth={3} />
                          {RATING_TEXT[o.rating]}
                        </span>
                        {o.id === chosen.id && <span className="your-pick">اختيارك</span>}
                      </div>
                      <p className="explain-quote">«{o.text}»</p>
                      {o.id !== chosen.id && o.rating !== 'best' && <p>{o.explanation}</p>}
                      <CriteriaRow option={o} />
                    </li>
                  ))}
                </ul>
              </details>
              <button type="button" className="btn btn-primary btn-lg btn-block" onClick={next}>
                {isLast ? 'اعرض النتيجة' : 'المسألة التالية'} <Icon name={isLast ? 'flag' : 'next'} size={20} />
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
