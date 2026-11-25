import type { CSSProperties } from 'react';
import type { Story } from '../types';
import { KidScene } from '../art/KidScene';
import { Link } from '../utils/router';
import { useGame } from '../state/store';
import { storyLockedBy } from '../data';
import { LevelBadge } from './LevelSelector';
import { Stars } from './ScoreCounter';
import { Icon } from './Icon';
import { ProgressBar } from './ProgressBar';

export function StoryCard({ story }: { story: Story }) {
  const state = useGame();
  const p = state.stories[story.id];
  const lockedBy = storyLockedBy(state, story.id);
  const inProgress = p?.status === 'in-progress' && p.currentScene > 0;
  const done = (p?.timesCompleted ?? 0) > 0;
  const status = lockedBy ? 'مقفلة' : inProgress ? 'قيد القراءة' : done ? 'مكتملة' : 'جديدة';
  return (
    <article className={'story-card' + (lockedBy ? ' is-locked' : '')} style={{ '--accent': story.accent } as CSSProperties}>
      <div className="story-cover">
        <KidScene background={story.coverBackground} characters={story.coverCharacters} props={story.coverProps} label={'غلاف حكاية ' + story.title} />
        <span className={'status-pill st-' + (lockedBy ? 'locked' : inProgress ? 'progress' : done ? 'done' : 'new')}>
          {lockedBy ? <Icon name="lock" size={14} /> : done ? <Icon name="check" size={14} /> : null} {status}
        </span>
      </div>
      <div className="story-body">
        <div className="card-meta">
          <LevelBadge level={story.level} />
          <span className="muted">
            <Icon name="layers" size={15} /> {story.scenes.length} مشاهد
          </span>
          {done && <Stars count={p!.bestStars} size={16} />}
        </div>
        <h3>{story.title}</h3>
        <p>{story.summary}</p>
        {inProgress && <ProgressBar value={p!.currentScene} max={story.scenes.length} label={'تقدّمك في ' + story.title} tone="gold" />}
        {lockedBy ? (
          <p className="lock-note">
            <Icon name="lock" size={16} /> أكمل حكاية «{lockedBy.title}» لتفتح هذه الحكاية.
          </p>
        ) : (
          <div className="card-actions">
            <Link to={`/kids/story/${story.id}`} className="btn btn-primary">
              {inProgress ? 'تابع القراءة' : done ? 'اقرأ من جديد' : 'ابدأ الحكاية'} <Icon name="next" size={18} />
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
