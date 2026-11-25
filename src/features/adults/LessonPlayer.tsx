import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import type { RhetoricLesson } from '../../types';
import { useDispatch, useGame } from '../../state/store';
import { stableShuffle } from '../../data';
import { LESSON_POINTS } from '../../data/lessons';
import { AnswerOption, type OptionState } from '../../components/AnswerOption';
import { FeedbackMessage } from '../../components/FeedbackMessage';
import { SoundToggle } from '../../components/SoundToggle';
import { ProgressBar } from '../../components/ProgressBar';
import { Icon } from '../../components/Icon';
import { Link, navigate } from '../../utils/router';
import { playSound } from '../../utils/sound';

export function lessonScore(lesson: RhetoricLesson, answers: string[]) {
  const right = lesson.questions.filter((q, i) => answers[i] === q.correct).length;
  return { right, total: lesson.questions.length, percent: Math.round((right / lesson.questions.length) * 100) };
}

/** The two concept cards shown before the questions (and on demand). */
export function ConceptCards({ lesson }: { lesson: RhetoricLesson }) {
  return (
    <div className="concepts">
      {lesson.concepts.map((c) => (
        <article key={c.term} className="concept-card">
          <h3>{c.term}</h3>
          <p className="concept-def">{c.definition}</p>
          <blockquote className="lesson-quote">
            <p>{c.example}</p>
            {c.source && <cite>{c.source}</cite>}
          </blockquote>
          <p className="concept-note">
            <Icon name="bulb" size={18} /> {c.note}
          </p>
        </article>
      ))}
    </div>
  );
}

export function LessonPlayer({ lesson }: { lesson: RhetoricLesson }) {
  const state = useGame();
  const dispatch = useDispatch();
  const p = state.lessons[lesson.id];

  useEffect(() => {
    if (!p || p.status === 'completed') dispatch({ type: 'startLesson', id: lesson.id, restart: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id]);

  const resumed = !!p && p.status === 'in-progress' && (p.currentStep > 0 || p.runAnswers.length > 0);
  const [phase, setPhase] = useState<'learn' | 'quiz'>(resumed ? 'quiz' : 'learn');
  const step = Math.min(p?.currentStep ?? 0, lesson.questions.length - 1);
  const q = lesson.questions[step];
  const chosenId = p?.status === 'in-progress' ? p.runAnswers[step] : undefined;
  const isLast = step === lesson.questions.length - 1;
  const options = useMemo(() => stableShuffle(q.options, lesson.id + q.id), [q, lesson.id]);
  const score = lessonScore(lesson, p?.runAnswers ?? []);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [announce, setAnnounce] = useState('');

  useEffect(() => {
    setAnnounce('');
    if (phase === 'quiz') headingRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [step, phase]);

  const choose = useCallback(
    (id: string) => {
      if (chosenId || !p || p.status !== 'in-progress') return;
      const ok = id === q.correct;
      playSound(ok ? 'correct' : 'incorrect');
      dispatch({ type: 'answerLesson', id: lesson.id, step, optionId: id, points: ok ? LESSON_POINTS : 0 });
      setAnnounce(ok ? 'إجابة صحيحة.' : 'إجابة غير صحيحة. ' + q.options.find((o) => o.id === q.correct)!.text);
      setTimeout(() => {
        feedbackRef.current?.focus({ preventScroll: true });
        feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 80);
    },
    [chosenId, p, q, dispatch, lesson.id, step],
  );

  const next = useCallback(() => {
    if (!chosenId) return;
    if (isLast) {
      dispatch({ type: 'completeLesson', id: lesson.id, score: score.percent });
      playSound('complete');
      navigate(`/adults/lesson-done/${lesson.id}`);
    } else {
      playSound('transition');
      dispatch({ type: 'nextLessonStep', id: lesson.id });
    }
  }, [chosenId, isLast, dispatch, lesson.id, score.percent]);

  useEffect(() => {
    if (phase !== 'quiz') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const n = '١٢٣٤'.indexOf(e.key) + 1 || parseInt(e.key, 10);
      if (n >= 1 && n <= options.length && !chosenId) choose(options[n - 1].id);
      if (e.key === 'ArrowLeft' && chosenId) next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, options, choose, chosenId, next]);

  if (!p) return <div className="player-loading">لحظة...</div>;

  const done = step + (chosenId ? 1 : 0);
  const optState = (id: string): OptionState => {
    if (!chosenId) return 'idle';
    if (id === q.correct) return 'best';
    if (id === chosenId) return 'unsuitable';
    return 'dim';
  };
  const right = chosenId === q.correct;

  return (
    <div className="player adults-player lesson-player" style={{ '--accent': '#245742' } as CSSProperties}>
      <header className="player-top" style={{ '--progress': phase === 'learn' ? 0 : done / lesson.questions.length } as CSSProperties}>
        <Link to="/adults/rhetoric" className="icon-btn" aria-label="الخروج من الدرس (يُحفظ تقدّمك)">
          <Icon name="back" />
        </Link>
        <div className="player-title">
          <strong>{lesson.title}</strong>
          <span>{phase === 'learn' ? 'الشرح' : `السؤال ${step + 1} من ${lesson.questions.length}`}</span>
        </div>
        <div className="player-progress">
          <ProgressBar value={phase === 'learn' ? 0 : done} max={lesson.questions.length} label="تقدّمك في الدرس" />
        </div>
        <span className="score score-adult" aria-label={`إجابات صحيحة ${score.right} من ${lesson.questions.length}`}>
          <Icon name="check" size={18} /> {score.right}/{lesson.questions.length}
        </span>
        <SoundToggle compact />
      </header>

      <main className="lesson-layout" id="main">
        {phase === 'learn' ? (
          <>
            <div className="lesson-intro">
              <p className="eyebrow">درس بلاغة · {lesson.subtitle}</p>
              <h1>{lesson.title}</h1>
              <p className="lead">{lesson.summary}</p>
            </div>
            <p className="at-work">
              <Icon name="chat" size={18} /> {lesson.atWork}
            </p>
            <ConceptCards lesson={lesson} />
            <button type="button" className="btn btn-primary btn-lg btn-block" onClick={() => setPhase('quiz')}>
              {resumed ? 'عُد إلى الأسئلة' : `ابدأ التدريب · ${lesson.questions.length} أسئلة`} <Icon name="next" size={20} />
            </button>
          </>
        ) : (
          <section className="lesson-card" aria-labelledby="lesson-q">
            <h2 id="lesson-q" tabIndex={-1} ref={headingRef}>
              {q.prompt}
            </h2>
            {q.quote && (
              <blockquote className="lesson-quote">
                <p>{q.quote}</p>
                {q.source && <cite>{q.source}</cite>}
              </blockquote>
            )}
            <div className="answers answers-adult" role="group" aria-label="الخيارات">
              {options.map((o, i) => (
                <AnswerOption key={o.id} tone="adults" label={o.text} index={i} state={optState(o.id)} disabled={!!chosenId} onSelect={() => choose(o.id)} />
              ))}
            </div>
            <div className="sr-only" role="status" aria-live="polite">
              {announce}
            </div>
            {chosenId ? (
              <div className="explain" ref={feedbackRef} tabIndex={-1}>
                <FeedbackMessage kind={right ? 'success' : 'hint'} title={right ? 'إجابة صحيحة' : `الإجابة الصحيحة: ${q.options.find((o) => o.id === q.correct)!.text}`}>
                  <p>{q.explanation}</p>
                </FeedbackMessage>
                <button type="button" className="btn btn-primary btn-lg btn-block" onClick={next}>
                  {isLast ? 'اعرض النتيجة' : 'السؤال التالي'} <Icon name={isLast ? 'flag' : 'next'} size={20} />
                </button>
              </div>
            ) : (
              <button type="button" className="btn btn-text review-link" onClick={() => setPhase('learn')}>
                <Icon name="book" size={18} /> راجع الشرح
              </button>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
