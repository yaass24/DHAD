import type { ReactNode } from 'react';
import { Icon } from './Icon';

export function FeedbackMessage({ kind, title, children }: { kind: 'success' | 'hint' | 'info' | 'warn'; title: string; children?: ReactNode }) {
  const icon = kind === 'success' ? 'check' : kind === 'hint' ? 'bulb' : kind === 'warn' ? 'tilde' : 'info';
  return (
    <div className={'feedback fb-' + kind}>
      <span className="fb-icon">
        <Icon name={icon} size={20} strokeWidth={2.6} />
      </span>
      <div>
        <strong>{title}</strong>
        {children && <div className="fb-body">{children}</div>}
      </div>
    </div>
  );
}
