import { Dhaw } from '../art/Mascot';
import { Link } from '../utils/router';

export function NotFound() {
  return (
    <section className="section center">
      <div className="container">
        <Dhaw mood="thinking" size={120} />
        <h1>لم نجد هذه الصفحة</h1>
        <p>ربما تغيّر الرابط. لنعد إلى البداية.</p>
        <Link to="/" className="btn btn-primary">
          الصفحة الرئيسية
        </Link>
      </div>
    </section>
  );
}
