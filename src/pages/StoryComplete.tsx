import { getStory, sceneState, STORIES, storyLockedBy } from '../data';
import { AdSlot } from '../components/AdSlot';
import { starsFor, useDispatch, useGame } from '../state/store';
import { Dhaw } from '../art/Mascot';
import { KidScene } from '../art/KidScene';
import { Stars } from '../components/ScoreCounter';
import { Confetti } from '../components/Sparkles';
import { Icon } from '../components/Icon';
import { Link, navigate } from '../utils/router';
import { NotFound } from './NotFound';

const MESSAGES: Record<number, string> = {
  3: 'رائع! أكملت الحكاية بإتقان.',
  2: 'أحسنت! أكملت الحكاية، وتعلّمت كلمات جديدة.',
  1: 'أكملت الحكاية! كل محاولة تقرّبك أكثر من الإتقان.',
};

export function StoryComplete({ id }: { id: string }) {
  const story = getStory(id);
  const s = useGame();
  const dispatch = useDispatch();
  if (!story) return <NotFound />;
  const p = s.stories[id];
  if (!p || p.timesCompleted === 0)
    return (
      <div className="container section center">
        <h1>لم تكتمل هذه الحكاية بعد</h1>
        <Link to={`/kids/story/${id}`} className="btn btn-primary">
          اذهب إلى الحكاية
        </Link>
      </div>
    );
  const finishedRun = p.status === 'completed';
  const stars = finishedRun ? starsFor(p.runMistakes) : p.bestStars;
  const points = finishedRun ? p.runPoints : p.bestPoints;
  const nextStory = STORIES.find((x) => x.id !== id && (s.stories[x.id]?.timesCompleted ?? 0) === 0 && !storyLockedBy(s, x.id));
  const last = story.scenes[story.scenes.length - 1];
  const after = sceneState(last, true);

  return (
    <div className="theme-kids complete-page">
      <Confetti />
      <section className="section">
        <div className="container complete-card">
          <Dhaw mood="excited" size={120} className="floaty" label="ضوء يحتفل معك" />
          <p className="eyebrow">انتهت الحكاية</p>
          <h1>{story.title}</h1>
          <Stars count={stars} size={44} />
          <p className="lead">{MESSAGES[stars]}</p>
          <div className="complete-stats">
            <div>
              <strong>{points}</strong>
              <span>نقطة</span>
            </div>
            <div>
              <strong>{story.scenes.length}</strong>
              <span>مشاهد</span>
            </div>
            <div>
              <strong>{finishedRun ? p.runMistakes : '—'}</strong>
              <span>محاولات إضافية</span>
            </div>
          </div>
          <div className="complete-scene">
            <KidScene background={last.background} characters={after.characters} props={after.props} label="المشهد الأخير" />
          </div>
          <p className="story-ending">{story.ending}</p>
          <h2 className="h-small">كلماتك الجديدة</h2>
          <ul className="vocab-chips big">
            {story.vocabulary.map((v) => (
              <li key={v}>
                <Icon name="check" size={16} strokeWidth={3} /> {v}
              </li>
            ))}
          </ul>
          <div className="details-actions center-actions">
            {nextStory && (
              <Link to={`/kids/story/${nextStory.id}`} className="btn btn-primary btn-lg">
                الحكاية التالية: {nextStory.title} <Icon name="next" size={18} />
              </Link>
            )}
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                dispatch({ type: 'startStory', id, restart: true });
                navigate(`/kids/play/${id}`);
              }}
            >
              <Icon name="replay" size={18} /> أعد القراءة
            </button>
            <Link to="/achievements" className="btn btn-outline">
              <Icon name="trophy" size={18} /> مكافآتي
            </Link>
            <Link to="/kids/library" className="btn btn-text">
              مكتبة الحكايات
            </Link>
          </div>
        </div>
      </section>
      <AdSlot placement="kidsComplete" audience="kids" />
    </div>
  );
}
