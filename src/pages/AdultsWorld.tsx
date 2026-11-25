import { AdultStage } from '../art/AdultArt';
import { useGame } from '../state/store';
import { SCENARIOS } from '../data';
import { LESSONS } from '../data/lessons';
import { EMAILS } from '../data/emails';
import { Link } from '../utils/router';
import { Icon } from '../components/Icon';
import { ProgressBar } from '../components/ProgressBar';

/**
 * Adults: one hero, then two clear tracks.
 *  1) مواقف العمل — conversations, choose the most suitable wording.
 *  2) دروس البلاغة — short lessons on rhetorical devices.
 */
export function AdultsWorld() {
  const s = useGame();
  const scDone = SCENARIOS.filter((x) => (s.scenarios[x.id]?.timesCompleted ?? 0) > 0).length;
  const lsDone = LESSONS.filter((x) => (s.lessons[x.id]?.timesCompleted ?? 0) > 0).length;
  const emDone = EMAILS.filter((x) => s.emails[x.id]?.done).length;
  return (
    <div className="theme-adults">
      <section className="adults-hero world-hero">
        <div className="container adults-hero-inner">
          <div>
            <p className="eyebrow eyebrow-light">ضاد للكبار</p>
            <h1>عربيتك... بقواعدها</h1>
            <p className="lead">مساران: تدريبات نحوية على جمل من العمل تختار فيها الصياغة الصحيحة وتعرف سبب الإعراب، ودروس بلاغة بشواهد من القرآن والحديث والشعر وتطبيقها في الكتابة المهنية.</p>
            <div className="world-stats">
              <span>
                <Icon name="chat" /> {scDone} / {SCENARIOS.length} تدريبات
              </span>
              <span>
                <Icon name="sparkle" /> {lsDone} / {LESSONS.length} دروس
              </span>
              <span>
                <Icon name="book" /> {emDone} / {EMAILS.length} رسائل
              </span>
            </div>
          </div>
          <div className="adults-hero-art world-art">
            <AdultStage backdrop="boardroom" speaker="reem" mood="smile" label="مشهد من موقف التفاوض" />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="tracks-title">
        <div className="container">
          <div className="section-head">
            <h2 id="tracks-title">اختر مسارك</h2>
          </div>
          <div className="tracks">
            <article className="track-card">
              <span className="track-icon">
                <Icon name="chat" size={26} />
              </span>
              <h3>تدريبات النحو</h3>
              <p>المثنى وجمع المذكر السالم، وعلامات النصب والجر، والعدد والتمييز والهمزة، وإعراب الجمل والممنوع من الصرف — على جمل حقيقية من التقارير والمراسلات.</p>
              <ul className="track-points">
                <li>
                  <Icon name="check" size={16} /> {SCENARIOS.length} تدريبات · {SCENARIOS.reduce((n, x) => n + x.decisions.length, 0)} مسألة
                </li>
                <li>
                  <Icon name="check" size={16} /> لكل خيار سبب إعرابي مشروح
                </li>
              </ul>
              <ProgressBar value={scDone} max={SCENARIOS.length} label="تقدّمك في المواقف" />
              <Link to="/adults/library" className="btn btn-primary btn-lg">
                افتح التدريبات <Icon name="next" size={18} />
              </Link>
            </article>
            <article className="track-card">
              <span className="track-icon track-gold">
                <Icon name="sparkle" size={26} />
              </span>
              <h3>دروس البلاغة</h3>
              <p>السجع والجناس، والطباق والمقابلة، والتشبيه والاستعارة، والكناية: شرح بشواهد، وموضع كل أسلوب في الكتابة المهنية، ثم أسئلة تطبيقية.</p>
              <ul className="track-points">
                <li>
                  <Icon name="check" size={16} /> {LESSONS.length} دروس · {LESSONS.reduce((n, x) => n + x.questions.length, 0)} سؤالًا
                </li>
                <li>
                  <Icon name="check" size={16} /> شرح لسبب كل إجابة
                </li>
              </ul>
              <ProgressBar value={lsDone} max={LESSONS.length} label="تقدّمك في دروس البلاغة" />
              <Link to="/adults/rhetoric" className="btn btn-primary btn-lg">
                افتح الدروس <Icon name="next" size={18} />
              </Link>
            </article>
            <article className="track-card">
              <span className="track-icon track-ink">
                <Icon name="book" size={26} />
              </span>
              <h3>اكتب رسالة</h3>
              <p>طلب إجازة، ومتابعة طلب، واعتذار عن تأخير. تكتب الرسالة بنفسك، ثم يفحصها ضاد على قائمة تدقيق محدّدة مسبقًا.</p>
              <ul className="track-points">
                <li>
                  <Icon name="check" size={16} /> {EMAILS.length} رسائل · عناصر مطلوبة وأخطاء شائعة
                </li>
                <li>
                  <Icon name="check" size={16} /> نموذج للمقارنة بعد كتابتك
                </li>
              </ul>
              <ProgressBar value={emDone} max={EMAILS.length} label="تقدّمك في كتابة الرسائل" />
              <Link to="/adults/write" className="btn btn-primary btn-lg">
                ابدأ الكتابة <Icon name="next" size={18} />
              </Link>
            </article>
          </div>
          <p className="center">
            <Link to="/adults/progress" className="text-link">
              <Icon name="chart" size={16} /> تقدّمي التعليمي
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
