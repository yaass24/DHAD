import type { RhetoricLesson } from '../types';
import { useGame } from '../state/store';
import { Link } from '../utils/router';
import { LevelBadge } from './LevelSelector';
import { Icon } from './Icon';

export function LessonCard({ lesson, index }: { lesson: RhetoricLesson; index: number }) {
  const p = useGame().lessons[lesson.id];
  const inProgress = p?.status === 'in-progress' && (p.currentStep > 0 || p.runAnswers.length > 0);
  const done = (p?.timesCompleted ?? 0) > 0;
  return (
    <article className="lesson-tile">
      <span className="lesson-num" aria-hidden="true">
        {index + 1}
      </span>
      <div className="lesson-tile-body">
        <div className="card-meta">
          <LevelBadge level={lesson.level} />
          <span className="muted">
            <Icon name="layers" size={14} /> {lesson.questions.length} أسئلة
          </span>
          {done && (
            <span className="result-chip">
              <Icon name="check" size={14} /> {p!.bestScore}%
            </span>
          )}
        </div>
        <h3>{lesson.title}</h3>
        <p>{lesson.summary}</p>
        <Link to={`/adults/lesson/${lesson.id}`} className="btn btn-primary">
          {inProgress ? 'تابع الدرس' : done ? 'أعد الدرس' : 'ابدأ الدرس'} <Icon name="next" size={18} />
        </Link>
      </div>
    </article>
  );
}
