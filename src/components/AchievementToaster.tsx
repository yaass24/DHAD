import { useEffect, useState } from 'react';
import { useDispatch, useGame } from '../state/store';
import { ACHIEVEMENTS, newlyUnlocked } from '../features/achievements/achievements';
import { playSound } from '../utils/sound';
import { Dhaw } from '../art/Mascot';
import { Link } from '../utils/router';

/** Watches progress, unlocks achievements, and announces them with ضوء. */
export function AchievementToaster() {
  const state = useGame();
  const dispatch = useDispatch();
  const [queue, setQueue] = useState<string[]>([]);

  useEffect(() => {
    const ids = newlyUnlocked(state);
    if (ids.length) {
      dispatch({ type: 'unlockAchievements', ids });
      setQueue((q) => [...q, ...ids]);
    }
  }, [state, dispatch]);

  const current = queue[0];
  useEffect(() => {
    if (!current) return;
    const t1 = setTimeout(() => playSound('achievement'), 900);
    const t2 = setTimeout(() => setQueue((q) => q.slice(1)), 5200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [current]);

  const a = ACHIEVEMENTS.find((x) => x.id === current);
  return (
    <div className="toast-region" role="status" aria-live="polite">
      {a && (
        <div className="toast" key={a.id}>
          <Dhaw mood="excited" size={56} />
          <div>
            <strong>إنجاز جديد: {a.title}</strong>
            <p>{a.description}</p>
            <Link to={a.audience === 'adults' ? '/adults/progress' : '/kids/rewards'} className="toast-link">
              عرض الإنجازات
            </Link>
          </div>
          <button type="button" className="icon-btn" aria-label="إغلاق التنبيه" onClick={() => setQueue((q) => q.slice(1))}>
            ×
          </button>
        </div>
      )}
    </div>
  );
}
