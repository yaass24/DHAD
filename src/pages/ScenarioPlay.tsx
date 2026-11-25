import { getScenario, scenarioLockedBy } from '../data';
import { useGame } from '../state/store';
import { ConversationPlayer } from '../features/adults/ConversationPlayer';
import { NotFound } from './NotFound';
import { Link } from '../utils/router';

export function ScenarioPlay({ id }: { id: string }) {
  const sc = getScenario(id);
  const s = useGame();
  if (!sc) return <NotFound />;
  const lockedBy = scenarioLockedBy(s, id);
  if (lockedBy)
    return (
      <div className="container section center">
        <h1>هذا الموقف مقفل</h1>
        <p>أكمل موقف «{lockedBy.title}» ليُفتح.</p>
        <Link to={`/adults/scenario/${lockedBy.id}`} className="btn btn-primary">
          اذهب إلى «{lockedBy.title}»
        </Link>
      </div>
    );
  return <ConversationPlayer key={id} scenario={sc} />;
}
