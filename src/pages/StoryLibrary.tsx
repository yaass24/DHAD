import { useDispatch, useGame } from '../state/store';
import { AdSlot } from '../components/AdSlot';
import { KIDS_LEVEL_HINT, STORIES } from '../data';
import { PageHeader } from '../components/PageHeader';
import { LevelSelector } from '../components/LevelSelector';
import { StoryCard } from '../components/StoryCard';
import { Dhaw } from '../art/Mascot';

export function StoryLibrary() {
  const s = useGame();
  const dispatch = useDispatch();
  const shown = STORIES.filter((x) => s.kidsLevel === 'all' || x.level === s.kidsLevel);
  return (
    <div className="theme-kids">
      <PageHeader title="مكتبة الحكايات" lead="اختر حكاية، واقرأ مشاهدها، وأكمل حوارات الشخصيات. تُفتح الحكاية التالية في كل مستوى عندما تُنهي التي قبلها." back="/kids" backLabel="حكايات ضاد" tone="kids">
        <Dhaw mood="happy" size={80} className="ph-dhaw" />
      </PageHeader>
      <section className="section">
        <div className="container">
          <LevelSelector name="lib-kids-level" value={s.kidsLevel} hints={KIDS_LEVEL_HINT} onChange={(level) => dispatch({ type: 'setLevel', audience: 'kids', level })} />
          <p className="muted result-count" role="status">
            {shown.length} {shown.length > 2 ? 'حكايات' : shown.length === 2 ? 'حكايتان' : 'حكاية'}
          </p>
          <div className="card-grid">
            {shown.map((st) => (
              <StoryCard key={st.id} story={st} />
            ))}
          </div>
        </div>
      </section>
      <AdSlot placement="kidsLibrary" audience="kids" />
    </div>
  );
}
