import { Link } from '../utils/router';
import { Logo } from '../art/Logo';
import { SoundToggle } from './SoundToggle';
import { Icon } from './Icon';
import { useGame } from '../state/store';

const LINKS = [
  { to: '/', label: 'الرئيسية' },
  { to: '/kids', label: 'حكايات ضاد' },
  { to: '/adults', label: 'ضاد في العمل' },
  { to: '/how', label: 'كيف نلعب؟' },
];

/**
 * Laptop: full links + secondary links with text.
 * Tablet: full links, secondary links as icons.
 * Phone: logo + points + sound only — navigation moves to the bottom tab bar.
 */
export function Navbar() {
  const { points } = useGame();
  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="brand" aria-label="ضاد، الصفحة الرئيسية">
          <Logo />
        </Link>
        <nav aria-label="التنقل الرئيسي" className="nav-links">
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="nav-link">
              {l.label}
            </Link>
          ))}
          <Link to="/progress" className="nav-link nav-secondary" aria-label="تقدّمي">
            <Icon name="chart" size={18} /> <span className="nav-secondary-text">تقدّمي</span>
          </Link>
          <Link to="/settings" className="nav-link nav-secondary" aria-label="الإعدادات">
            <Icon name="settings" size={18} /> <span className="nav-secondary-text">الإعدادات</span>
          </Link>
        </nav>
        <div className="nav-actions">
          {points > 0 && (
            <Link to="/progress" className="nav-points" aria-label={`مجموع نقاطك ${points}`}>
              <Icon name="star" filled size={16} /> {points}
            </Link>
          )}
          <Link to="/settings" className="icon-btn nav-settings-btn" aria-label="الإعدادات" title="الإعدادات">
            <Icon name="settings" />
          </Link>
          <SoundToggle compact />
          <Link to="/start" className="btn btn-primary btn-sm nav-cta">
            ابدأ اللعب
          </Link>
        </div>
      </div>
    </header>
  );
}
