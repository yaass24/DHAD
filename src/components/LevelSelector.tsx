import type { Level } from '../types';
import { LEVEL_LABEL } from '../data';
import { playSound } from '../utils/sound';

const LEVELS: (Level | 'all')[] = ['all', 'beginner', 'intermediate', 'advanced'];

export function LevelSelector({ value, onChange, hints, name }: { value: Level | 'all'; onChange: (l: Level | 'all') => void; hints?: Record<Level, string>; name: string }) {
  return (
    <fieldset className="level-selector">
      <legend>اختر مستواك</legend>
      <div className="level-options">
        {LEVELS.map((l) => (
          <label key={l} className={'level-chip' + (value === l ? ' is-active' : '')}>
            <input
              type="radio"
              name={name}
              value={l}
              checked={value === l}
              onChange={() => {
                playSound('click');
                onChange(l);
              }}
            />
            <span className="level-name">{l === 'all' ? 'كل المستويات' : LEVEL_LABEL[l]}</span>
            {hints && l !== 'all' && <small>{hints[l]}</small>}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function LevelBadge({ level }: { level: Level }) {
  return <span className={'level-badge lv-' + level}>{LEVEL_LABEL[level]}</span>;
}
