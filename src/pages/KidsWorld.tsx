import { KidScene } from '../art/KidScene';
import { Dhaw } from '../art/Mascot';
import { KidAvatar } from '../art/KidCharacter';
import { useDispatch, useGame } from '../state/store';
import { KIDS_LEVEL_HINT, STORIES } from '../data';
import { CAST } from '../data/characters';
import { LevelSelector } from '../components/LevelSelector';
import { StoryCard } from '../components/StoryCard';
import { Link } from '../utils/router';
import { Icon } from '../components/Icon';
import { ACHIEVEMENTS } from '../features/achievements/achievements';

export function KidsWorld() {
  const s = useGame();
  const dispatch = useDispatch();
  const done = STORIES.filter((x) => (s.stories[x.id]?.timesCompleted ?? 0) > 0).length;
  const stars = Object.values(s.stories).reduce((n, p) => n + p.bestStars, 0);
  const badges = ACHIEVEMENTS.filter((a) => a.audience !== 'adults' && s.achievements[a.id]).length;
  const shown = STORIES.filter((x) => s.kidsLevel === 'all' || x.level === s.kidsLevel);
  return (
    <div className="theme-kids">
      <section className="kids-hero world-hero">
        <div className="container kids-hero-inner">
          <div>
            <p className="eyebrow eyebrow-light">ضاد الصغير</p>
            <h1>حكايات ضاد</h1>
            <p className="lead">حكايات من حياتنا اليومية: في البيت والمدرسة والحديقة والمكتبة والسوق. أكمل حوار الشخصيات بالكلمة المناسبة، واجمع النجوم!</p>
            <div className="world-stats">
              <span>
                <Icon name="book" /> {done} / {STORIES.length} حكايات
              </span>
              <span>
                <Icon name="star" filled /> {stars} نجمة
              </span>
              <span>
                <Icon name="medal" /> {badges} شارات
              </span>
            </div>
            <div className="hero-ctas">
              <Link to="/kids/library" className="btn btn-sun btn-lg">
                مكتبة الحكايات <Icon name="next" size={18} />
              </Link>
              <Link to="/achievements" className="btn btn-ghost-light btn-lg">
                <Icon name="trophy" size={18} /> نجومي ومكافآتي
              </Link>
            </div>
          </div>
          <div className="kids-hero-art world-art">
            <KidScene background="school" characters={[{ id: 'layan', expression: 'happy', x: 260 }, { id: 'khalid', expression: 'excited', x: 420, flip: true }, { id: 'noura', expression: 'happy', x: 580, flip: true }]} label="أصدقاء ضاد أمام المدرسة" />
            <Dhaw mood="excited" size={80} className="corner-dhaw floaty" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <LevelSelector name="kids-level" value={s.kidsLevel} hints={KIDS_LEVEL_HINT} onChange={(level) => dispatch({ type: 'setLevel', audience: 'kids', level })} />
          <div className="section-head row">
            <h2>{s.kidsLevel === 'all' ? 'كل الحكايات' : 'حكايات تناسب مستواك'}</h2>
            <Link to="/kids/library" className="text-link">
              عرض المكتبة كاملة <Icon name="next" size={16} />
            </Link>
          </div>
          <div className="card-grid carousel">
            {shown.map((st) => (
              <StoryCard key={st.id} story={st} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section-cream world-people">
        <div className="container">
          <div className="section-head">
            <h2>أبطال الحكايات</h2>
          </div>
          <div className="cast-grid">
            {CAST.map((c) => (
              <article key={c.id} className="cast-card">
                <KidAvatar id={c.id} expression="excited" size={100} />
                <h3>{c.name}</h3>
                <p>{c.trait}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
