import { useDispatch, useGame } from '../state/store';
import { AdSlot } from '../components/AdSlot';
import { ADULTS_LEVEL_HINT, SCENARIOS } from '../data';
import { PageHeader } from '../components/PageHeader';
import { LevelSelector } from '../components/LevelSelector';
import { ScenarioCard } from '../components/ScenarioCard';

export function ScenarioLibrary() {
  const s = useGame();
  const dispatch = useDispatch();
  const shown = SCENARIOS.filter((x) => s.adultsLevel === 'all' || x.level === s.adultsLevel);
  return (
    <div className="theme-adults">
      <PageHeader title="التدريبات النحوية" lead="يُفتح التدريب التالي في كل مستوى بعد إكمال الذي قبله." back="/adults" backLabel="ضاد في العمل" tone="adults" />
      <section className="section">
        <div className="container">
          <LevelSelector name="lib-adults-level" value={s.adultsLevel} hints={ADULTS_LEVEL_HINT} onChange={(level) => dispatch({ type: 'setLevel', audience: 'adults', level })} />
          <p className="muted result-count" role="status">
            {shown.length} {shown.length > 2 ? 'تدريبات' : shown.length === 2 ? 'تدريبان' : 'تدريب'}
          </p>
          <div className="card-grid">
            {shown.map((sc) => (
              <ScenarioCard key={sc.id} scenario={sc} />
            ))}
          </div>
        </div>
      </section>
      <AdSlot placement="adultsLibrary" />
    </div>
  );
}
