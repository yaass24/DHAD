import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import type { Story } from '../../types';
import { useDispatch, useGame } from '../../state/store';
import { sceneState, stableShuffle } from '../../data';
import { KID_NAMES } from '../../data/characters';
import { KidScene } from '../../art/KidScene';
import { KidAvatar, LOOKS } from '../../art/KidCharacter';
import { Dhaw } from '../../art/Mascot';
import { DialogueBubble, DialogueText, bubblePlacement } from '../../components/DialogueBubble';
import { AnswerOption, type OptionState } from '../../components/AnswerOption';
import { FeedbackMessage } from '../../components/FeedbackMessage';
import { ScoreCounter } from '../../components/ScoreCounter';
import { SoundToggle } from '../../components/SoundToggle';
import { ProgressBar } from '../../components/ProgressBar';
import { Sparkles } from '../../components/Sparkles';
import { Icon } from '../../components/Icon';
import { Link, navigate } from '../../utils/router';
import { playSound } from '../../utils/sound';

const PRAISE = ['أحسنت!', 'إجابة رائعة!', 'اختيار موفّق!', 'ممتاز!'];

/** points for a scene: full on first try, half on second, a little after that */
function pointsFor(base: number, mistakes: number) {
  if (mistakes === 0) return base;
  if (mistakes === 1) return Math.round(base / 2);
  return Math.max(1, Math.round(base / 5));
}

export function StoryPlayer({ story }: { story: Story }) {
  const state = useGame();
  const dispatch = useDispatch();
  const progress = state.stories[story.id];

  // make sure a run exists (direct link / finished story → fresh run)
  useEffect(() => {
    if (!progress || progress.status === 'completed') dispatch({ type: 'startStory', id: story.id, restart: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story.id]);

  const idx = Math.min(progress?.currentScene ?? 0, story.scenes.length - 1);
  const scene = story.scenes[idx];
  const solved = progress?.status === 'in-progress' && progress.solvedScene === idx;
  const isLast = idx === story.scenes.length - 1;

  const [wrong, setWrong] = useState<string[]>([]);
  const [shake, setShake] = useState<string | null>(null);
  const [announce, setAnnounce] = useState('');
  const nextRef = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    setWrong([]);
    setShake(null);
    setAnnounce('');
    headingRef.current?.focus({ preventScroll: true });
  }, [idx]);

  const options = useMemo(() => stableShuffle(scene.options, story.id + scene.id), [scene, story.id]);
  const praise = PRAISE[idx % PRAISE.length];

  const choose = useCallback(
    (opt: string) => {
      if (solved || wrong.includes(opt) || !progress || progress.status !== 'in-progress') return;
      if (opt === scene.correctAnswer) {
        playSound('correct');
        const pts = pointsFor(scene.points, wrong.length);
        dispatch({ type: 'solveScene', id: story.id, points: pts, mistakes: wrong.length });
        setAnnounce(`${praise} الإجابة الصحيحة: ${opt}. حصلت على ${pts} نقاط.`);
        setTimeout(() => {
          nextRef.current?.focus({ preventScroll: true });
          // phones & stacked layouts: bring the praise + explanation into view
          if (window.matchMedia('(max-width: 1199px)').matches) document.querySelector('.solved-block')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 80);
      } else {
        playSound('incorrect');
        setWrong((w) => [...w, opt]);
        setShake(opt);
        setTimeout(() => setShake(null), 500);
        setAnnounce(`لا بأس، حاول مرة أخرى. تلميح: ${scene.hint}`);
      }
    },
    [solved, wrong, progress, scene, dispatch, story.id, praise],
  );

  const next = useCallback(() => {
    if (!solved) return;
    if (isLast) {
      dispatch({ type: 'completeStory', id: story.id });
      playSound('complete');
      navigate(`/kids/complete/${story.id}`);
    } else {
      playSound('transition');
      dispatch({ type: 'nextScene', id: story.id });
    }
  }, [solved, isLast, dispatch, story.id]);

  // keyboard: 1–4 choose, Enter / ← for next
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.metaKey || e.ctrlKey || e.altKey) return;
      const n = '١٢٣٤'.indexOf(e.key) + 1 || parseInt(e.key, 10);
      if (n >= 1 && n <= options.length) choose(options[n - 1]);
      if (e.key === 'ArrowLeft' && solved) next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [options, choose, next, solved]);

  if (!progress) return <div className="player-loading">لحظة...</div>;

  const { characters, props } = sceneState(scene, solved);
  const speaker = scene.speaker === 'dhaw' ? 'layan' : scene.speaker;
  const speakerChar = characters.find((c) => c.id === speaker);
  const speakerExpr = speakerChar?.expression ?? 'happy';
  const placement = bubblePlacement(speakerChar?.x ?? 400, LOOKS[speaker].adult);

  const optState = (o: string): OptionState => {
    if (solved) return o === scene.correctAnswer ? 'correct' : 'dim';
    if (wrong.includes(o)) return 'wrong';
    return 'idle';
  };

  return (
    <div className="player kids-player" style={{ '--accent': story.accent } as CSSProperties}>
      <header className="player-top" style={{ '--progress': (idx + (solved ? 1 : 0)) / story.scenes.length } as CSSProperties}>
        <Link to={`/kids/story/${story.id}`} className="icon-btn" aria-label="الخروج من الحكاية (يُحفظ تقدّمك)">
          <Icon name="back" />
        </Link>
        <div className="player-title">
          <strong>{story.title}</strong>
          <span>
            المشهد {idx + 1} من {story.scenes.length}
          </span>
        </div>
        <div className="player-progress">
          <ProgressBar value={idx + (solved ? 1 : 0)} max={story.scenes.length} label="تقدّمك في الحكاية" tone="gold" />
        </div>
        <ScoreCounter value={progress.runPoints} />
        <SoundToggle compact />
      </header>

      <main className="player-stage" id="main">
        <section className="scene-panel" aria-label="المشهد المصوّر">
          <div className="scene-frame" key={scene.id}>
            <KidScene background={scene.background} characters={characters} props={props} label={scene.narration} />
            <DialogueBubble
              speaker={KID_NAMES[scene.speaker]}
              placement={placement}
              avatar={<KidAvatar id={speaker} expression={speakerExpr} size={40} />}
            >
              <DialogueText text={scene.dialogue} filled={solved ? scene.correctAnswer : null} state={solved ? 'correct' : 'idle'} />
            </DialogueBubble>
            {solved && <Sparkles />}
          </div>
        </section>

        <section className="question-panel" aria-labelledby="q-title">
          <p className="narration">{scene.narration}</p>
          <h2 id="q-title" tabIndex={-1} ref={headingRef} className="q-prompt">
            {solved ? 'ماذا حدث بعد ذلك؟' : 'اختر الكلمة المناسبة لإكمال الحوار:'}
          </h2>

          {!solved && (
            <div className="answers" role="group" aria-label="الاختيارات">
              {options.map((o, i) => (
                <div key={o} className={shake === o ? 'shake' : undefined}>
                  <AnswerOption label={o} index={i} state={optState(o)} disabled={wrong.includes(o)} onSelect={() => choose(o)} />
                </div>
              ))}
            </div>
          )}

          <div className="sr-only" role="status" aria-live="polite">
            {announce}
          </div>

          {!solved && wrong.length > 0 && (
            <div className="fb-with-dhaw">
              <Dhaw mood="thinking" size={64} />
              <FeedbackMessage kind="hint" title="لا بأس! حاول مرة أخرى.">
                {scene.hint}
              </FeedbackMessage>
            </div>
          )}

          {solved && (
            <div className="solved-block">
              <div className="answers answers-solved">
                {options.map((o, i) => (
                  <AnswerOption key={o} label={o} index={i} state={optState(o)} disabled onSelect={() => undefined} />
                ))}
              </div>
              <div className="fb-with-dhaw">
                <Dhaw mood="excited" size={64} />
                <FeedbackMessage kind="success" title={praise}>
                  {scene.explanation}
                </FeedbackMessage>
              </div>
              <p className="reaction">{scene.reaction}</p>
            </div>
          )}
        </section>
      </main>

      <footer className="player-bottom">
        <ol className="scene-dots" aria-label="مشاهد الحكاية">
          {story.scenes.map((s, i) => (
            <li key={s.id} className={i < idx || (i === idx && solved) ? 'done' : i === idx ? 'current' : ''} aria-current={i === idx ? 'step' : undefined}>
              <span className="sr-only">
                المشهد {i + 1}
                {i < idx ? ' (مكتمل)' : ''}
              </span>
            </li>
          ))}
        </ol>
        <button type="button" ref={nextRef} className="btn btn-sun btn-lg" onClick={next} disabled={!solved}>
          {isLast ? 'أنهِ الحكاية' : 'المشهد التالي'} <Icon name={isLast ? 'flag' : 'next'} size={20} />
        </button>
      </footer>
    </div>
  );
}
