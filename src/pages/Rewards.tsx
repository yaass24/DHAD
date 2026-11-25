import { useGame } from '../state/store';
import { STORIES } from '../data';
import { ACHIEVEMENTS } from '../features/achievements/achievements';
import { PageHeader } from '../components/PageHeader';
import { AchievementCard } from '../components/AchievementCard';
import { Stars } from '../components/ScoreCounter';
import { Dhaw } from '../art/Mascot';
import { KidScene } from '../art/KidScene';
import { Link } from '../utils/router';
import { Icon } from '../components/Icon';

export function Rewards() {
  const s = useGame();
  const totalStars = Object.values(s.stories).reduce((n, p) => n + p.bestStars, 0);
  const list = ACHIEVEMENTS.filter((a) => a.audience !== 'adults');
  return (
    <div className="theme-kids">
      <PageHeader title="نجومي ومكافآتي" lead="كل حكاية تُكملها تمنحك نجومًا وشارة. اجمعها كلها مع ضوء!" back="/kids" backLabel="حكايات ضاد" tone="kids">
        <Dhaw mood="excited" size={86} className="ph-dhaw floaty" />
      </PageHeader>
      <section className="section">
        <div className="container">
          <div className="reward-summary">
            <div className="big-stat">
              <Icon name="star" filled size={36} />
              <strong>{totalStars}</strong>
              <span>من {STORIES.length * 3} نجمة</span>
            </div>
            <div className="big-stat">
              <Icon name="sparkle" size={36} />
              <strong>{s.points}</strong>
              <span>نقطة</span>
            </div>
            <div className="big-stat">
              <Icon name="medal" size={36} />
              <strong>{list.filter((a) => s.achievements[a.id]).length}</strong>
              <span>من {list.length} شارات</span>
            </div>
          </div>

          <h2>شارات الحكايات</h2>
          <div className="badge-shelf">
            {STORIES.map((st) => {
              const p = s.stories[st.id];
              const done = (p?.timesCompleted ?? 0) > 0;
              return (
                <Link key={st.id} to={`/kids/story/${st.id}`} className={'story-badge' + (done ? ' is-on' : '')}>
                  <span className="badge-disc" style={{ borderColor: st.accent }}>
                    <KidScene background={st.coverBackground} characters={st.coverCharacters} />
                    {!done && (
                      <span className="badge-lock">
                        <Icon name="lock" size={22} />
                      </span>
                    )}
                  </span>
                  <strong>{st.title}</strong>
                  {done ? <Stars count={p!.bestStars} size={16} /> : <small>لم تُكمَل بعد</small>}
                </Link>
              );
            })}
          </div>

          <h2>الإنجازات</h2>
          <div className="ach-grid">
            {list.map((a) => (
              <AchievementCard key={a.id} a={a} unlockedAt={s.achievements[a.id]} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
