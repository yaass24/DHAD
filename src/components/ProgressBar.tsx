export function ProgressBar({ value, max, label, tone = 'green', showText = false }: { value: number; max: number; label: string; tone?: 'green' | 'gold' | 'coral' | 'light'; showText?: boolean }) {
  const pct = max ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className={'progress progress-' + tone}>
      <div className="progress-track" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} aria-valuetext={`${value} من ${max}`}>
        <div className="progress-fill" style={{ width: pct + '%' }} />
      </div>
      {showText && (
        <span className="progress-text">
          {value} / {max}
        </span>
      )}
    </div>
  );
}
