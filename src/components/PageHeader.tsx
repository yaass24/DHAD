import type { ReactNode } from 'react';
import { Link } from '../utils/router';
import { Icon } from './Icon';

export function PageHeader({ title, lead, back, backLabel = 'رجوع', children, tone = 'default' }: { title: string; lead?: string; back?: string; backLabel?: string; children?: ReactNode; tone?: 'default' | 'kids' | 'adults' }) {
  return (
    <section className={'page-header ph-' + tone}>
      <div className="container">
        {back && (
          <Link to={back} className="back-link">
            <Icon name="back" size={18} /> {backLabel}
          </Link>
        )}
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
        {children}
      </div>
    </section>
  );
}
