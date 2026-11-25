import { getStory, storyLockedBy, LEVEL_LABEL, KIDS_LEVEL_HINT } from '../data';
import { useDispatch, useGame } from '../state/store';
import { KidScene } from '../art/KidScene';
import { KidAvatar } from '../art/KidCharacter';
import { KID_NAMES } from '../data/characters';
import { Link, navigate } from '../utils/router';
import { Icon } from '../components/Icon';
import { Stars } from '../components/ScoreCounter';
import { ProgressBar } from '../components/ProgressBar';
import { LevelBadge } from '../components/LevelSelector';
import { NotFound } from './NotFound';
import { playSound } from '../utils/sound';
import type { KidId } from '../types';

export function StoryDetails({ id }: { id: string }) {
  const story = getStory(id);
  const s = useGame();
  const dispatch = useDispatch();
  if (!story) return <NotFound />;
  const p = s.stories[id];
  const lockedBy = storyLockedBy(s, id);
  const inProgress = p?.status === 'in-progress' && (p.currentScene > 0 || p.solvedScene >= 0);
  const done = (p?.timesCompleted ?? 0) > 0;
  const cast = Array.from(new Set(story.scenes.flatMap((sc) => sc.characters.map((c) => c.id)))) as Exclude<KidId, 'dhaw'>[];

  const start = (restart: boolean) => {
    playSound('click');
    dispatch({ type: 'startStory', id, restart });
    navigate(`/kids/play/${id}`);
  };

  return (
    <div className="theme-kids">
      <section className="details">
        <div className="container details-inner">
          <Link to="/kids/library" className="back-link">
            <Icon name="back" size={18} /> مكتبة الحكايات
          </Link>
          <div className="details-grid">
            <div className="details-art">
              <KidScene background={story.coverBackground} characters={story.coverCharacters} props={story.coverProps} label={'غلاف ' + story.title} />
            </div>
            <div className="details-copy">
              <div className="card-meta">
                <LevelBadge level={story.level} />
                <span className="muted">
                  {story.scenes.length} مشاهد · نحو {story.scenes.length * 2} دقائق
                </span>
              </div>
              <h1>{story.title}</h1>
              <p className="lead">{story.summary}</p>
              <p className="muted">
                مستوى {LEVEL_LABEL[story.level]}: {KIDS_LEVEL_HINT[story.level]}.
              </p>
              <div className="details-cast" aria-label="شخصيات الحكاية">
                {cast.map((c) => (
                  <span key={c} className="cast-chip">
                    <KidAvatar id={c} size={36} /> {KID_NAMES[c]}
                  </span>
                ))}
              </div>
              <h2 className="h-small">كلمات ستتعلّمها</h2>
              <ul className="vocab-chips">
                {story.vocabulary.map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
              {done && (
                <p className="best-line">
                  أفضل نتيجة: <Stars count={p!.bestStars} size={18} /> · {p!.bestPoints} نقطة
                </p>
              )}
              {inProgress && (
                <div className="resume-box">
                  <span>
                    توقّفت عند المشهد {Math.min(p!.currentScene + 1, story.scenes.length)} من {story.scenes.length}
                  </span>
                  <ProgressBar value={p!.currentScene} max={story.scenes.length} label="تقدّمك المحفوظ" tone="gold" />
                </div>
              )}
              {lockedBy ? (
                <p className="lock-note">
                  <Icon name="lock" size={16} /> هذه الحكاية مقفلة. أكمل حكاية «{lockedBy.title}» أولًا.{' '}
                  <Link to={`/kids/story/${lockedBy.id}`}>اذهب إليها</Link>
                </p>
              ) : (
                <div className="details-actions">
                  {inProgress ? (
                    <>
                      <button type="button" className="btn btn-primary btn-lg" onClick={() => start(false)}>
                        <Icon name="play" size={18} filled /> تابع من المشهد {Math.min(p!.currentScene + 1, story.scenes.length)}
                      </button>
                      <button type="button" className="btn btn-outline" onClick={() => start(true)}>
                        <Icon name="replay" size={18} /> ابدأ من جديد
                      </button>
                    </>
                  ) : (
                    <button type="button" className="btn btn-primary btn-lg" onClick={() => start(true)}>
                      <Icon name="play" size={18} filled /> {done ? 'اقرأها مرة أخرى' : 'ابدأ الحكاية'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
