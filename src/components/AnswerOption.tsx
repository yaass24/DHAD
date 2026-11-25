import { Icon } from './Icon';

export type OptionState = 'idle' | 'correct' | 'wrong' | 'dim' | 'best' | 'acceptable' | 'unsuitable';

export function AnswerOption({ label, index, state, disabled, onSelect, tone = 'kids' }: { label: string; index: number; state: OptionState; disabled?: boolean; onSelect: () => void; tone?: 'kids' | 'adults' }) {
  const marker = String(index + 1);
  const icon = state === 'correct' || state === 'best' ? 'check' : state === 'wrong' || state === 'unsuitable' ? 'x' : state === 'acceptable' ? 'tilde' : null;
  const sr = state === 'correct' || state === 'best' ? ' (الإجابة الأنسب)' : state === 'wrong' ? ' (حاول مرة أخرى)' : state === 'acceptable' ? ' (مقبولة)' : state === 'unsuitable' ? ' (غير مناسبة)' : '';
  return (
    <button type="button" className={`answer answer-${tone} is-${state}`} onClick={onSelect} disabled={disabled} aria-disabled={disabled} data-key={index + 1}>
      <span className="answer-marker" aria-hidden="true">
        {icon ? <Icon name={icon} size={18} strokeWidth={3} /> : marker}
      </span>
      <span className="answer-label">{label}</span>
      <span className="sr-only">{sr}</span>
    </button>
  );
}
