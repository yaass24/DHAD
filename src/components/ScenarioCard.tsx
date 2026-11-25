import type { Scenario } from '../types';
import { AdultAvatar } from '../art/AdultArt';
import { Link } from '../utils/router';
import { useGame } from '../state/store';
import { scenarioLockedBy } from '../data';
import { LevelBadge } from './LevelSelector';
import { Icon } from './Icon';
import { ProgressBar } from './ProgressBar';

export function ScenarioCard({ scenario }: { scenario: Scenario }) {
  const state = useGame();
  const p = state.scenarios[scenario.id];
  const lockedBy = scenarioLockedBy(state, scenario.id);
  const inProgress = p?.status === 'in-progress' && p.currentStep > 0;
  const done = (p?.timesCompleted ?? 0) > 0;
  return (
    <article className={'scenario-card' + (lockedBy ? ' is-locked' : '')}>
      <div className="scenario-head">
        <div className="avatars">
          {scenario.cast.map((c) => (
            <AdultAvatar key={c} id={c} size={52} />
          ))}
        </div>
        <LevelBadge level={scenario.level} />
      </div>
      <h3>{scenario.title}</h3>
      <p>{scenario.summary}</p>
      <p className="focus-line">
        <Icon name="target" size={16} /> {scenario.focus}
      </p>
      <div className="card-meta">
        <span className="muted">
          <Icon name="chat" size={15} /> {scenario.decisions.length} قرارات
        </span>
        {done && (
          <span className="result-chip">
            <Icon name="check" size={14} /> أفضل نتيجة: {p!.bestScore}%
          </span>
        )}
        {lockedBy && (
          <span className="result-chip locked">
            <Icon name="lock" size={14} /> مقفل
          </span>
        )}
      </div>
      {inProgress && <ProgressBar value={p!.currentStep} max={scenario.decisions.length} label={'تقدّمك في ' + scenario.title} />}
      {lockedBy ? (
        <p className="lock-note">أكمل موقف «{lockedBy.title}» ليُفتح هذا الموقف.</p>
      ) : (
        <Link to={`/adults/scenario/${scenario.id}`} className="btn btn-primary">
          {inProgress ? 'تابع الموقف' : done ? 'أعد المحاولة' : 'ابدأ الموقف'} <Icon name="next" size={18} />
        </Link>
      )}
    </article>
  );
}
