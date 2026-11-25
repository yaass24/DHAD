import type { ReactNode } from 'react';
import { Link } from '../utils/router';
import { Icon } from './Icon';

export function ExperienceCard({ variant, title, subtitle, description, cta, to, art, meta }: { variant: 'kids' | 'adults'; title: string; subtitle: string; description: string; cta: string; to: string; art: ReactNode; meta?: string }) {
  return (
    <article className={'exp-card exp-' + variant}>
      <div className="exp-art">{art}</div>
      <div className="exp-body">
        <p className="eyebrow">{subtitle}</p>
        <h3>{title}</h3>
        <p>{description}</p>
        {meta && <p className="exp-meta">{meta}</p>}
        <Link to={to} className="btn btn-primary">
          {cta} <Icon name="next" size={18} />
        </Link>
      </div>
    </article>
  );
}
