import { Link } from '../utils/router';
import { LogoMark } from '../art/Logo';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <LogoMark size={56} />
          <div>
            <strong>ضاد | DHAD</strong>
            <p>عِش الحكاية، واختر كلماتك.</p>
          </div>
        </div>
        <nav aria-label="روابط التذييل" className="footer-links">
          <Link to="/kids">حكايات ضاد</Link>
          <Link to="/adults">ضاد للكبار</Link>
          <Link to="/how">كيف نلعب؟</Link>
          <Link to="/about">عن ضاد</Link>
          <Link to="/progress">تقدّمي</Link>
          <Link to="/settings">الإعدادات</Link>
        </nav>
        <p className="footer-note">المحتوى مُعَدّ ومراجَع مسبقًا، ويُحفظ تقدّمك على هذا الجهاز فقط.</p>
      </div>
    </footer>
  );
}
