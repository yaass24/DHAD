import type { Achievement } from '../features/achievements/achievements';
import { Icon } from './Icon';

export function AchievementCard({ a, unlockedAt }: { a: Achievement; unlockedAt?: number }) {
  const on = !!unlockedAt;
  return (
    <article className={'ach-card' + (on ? ' is-on' : '')}>
      <span className="ach-icon">
        <Icon name={on ? a.icon : 'lock'} size={26} filled={on && a.icon === 'star'} />
      </span>
      <div>
        <h3>{a.title}</h3>
        <p>{a.description}</p>
        <small>{on ? 'تم الحصول عليه ✓' : 'لم يُفتح بعد'}</small>
      </div>
    </article>
  );
}
