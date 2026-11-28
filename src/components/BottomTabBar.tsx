import { Link } from '../utils/router';
import { Icon, type IconName } from './Icon';

const TABS: { to: string; label: string; icon: IconName }[] = [
  { to: '/', label: 'الرئيسية', icon: 'home' },
  { to: '/kids', label: 'الحكايات', icon: 'book' },
  { to: '/adults', label: 'في العمل', icon: 'chat' },
  { to: '/progress', label: 'تقدّمي', icon: 'chart' },
];

/** App-style navigation for phones (hidden on tablet and laptop). */
export function BottomTabBar() {
  return (
    <nav className="tabbar" aria-label="التنقل السفلي">
      {TABS.map((t) => (
        <Link key={t.to} to={t.to} className="tab">
          <span className="tab-icon">
            <Icon name={t.icon} size={22} />
          </span>
          <span className="tab-label">{t.label}</span>
        </Link>
      ))}
    </nav>
  );
}
