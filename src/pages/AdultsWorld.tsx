import { AdultStage } from '../art/AdultArt';
import { useGame } from '../state/store';
import { SCENARIOS } from '../data';
import { LESSONS } from '../data/lessons';
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
  return (
    <div className="theme-adults">
      <section className="adults-hero world-hero">
        <div className="container adults-hero-inner">
          <div>
            <p className="eyebrow eyebrow-light">ضاد للكبار</p>
            <h1>عربيتك... أوضح وأجمل</h1>
            <p className="lead">مساران قصيران: مواقف عملية تختار فيها الصياغة الأنسب، ودروس بلاغة تتعلّم فيها أساليب العربية بشواهد من القرآن والحديث والشعر.</p>
            <div className="world-stats">
              <span>
                <Icon name="chat" /> {scDone} / {SCENARIOS.length} مواقف
              </span>
              <span>
                <Icon name="sparkle" /> {lsDone} / {LESSONS.length} دروس
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
              <h3>مواقف العمل</h3>
              <p>محادثات من بيئة العمل: يوم أول، ومقابلة، وخدمة عملاء، وتفاوض. في كل قرار تختار الرد الأنسب، ثم تعرف السبب.</p>
              <ul className="track-points">
                <li>
                  <Icon name="check" size={16} /> {SCENARIOS.length} مواقف · {SCENARIOS.reduce((n, x) => n + x.decisions.length, 0)} قرارًا
                </li>
                <li>
                  <Icon name="check" size={16} /> تقييم بالقواعد والمعنى والنبرة والرسمية والسياق
                </li>
              </ul>
              <ProgressBar value={scDone} max={SCENARIOS.length} label="تقدّمك في المواقف" />
              <Link to="/adults/library" className="btn btn-primary btn-lg">
                افتح المواقف <Icon name="next" size={18} />
              </Link>
            </article>
            <article className="track-card">
              <span className="track-icon track-gold">
                <Icon name="sparkle" size={26} />
              </span>
              <h3>دروس البلاغة</h3>
              <p>السجع والجناس، والطباق والمقابلة، والتشبيه والاستعارة، والكناية: شرح موجز بشواهد، ثم أسئلة تطبيقية.</p>
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
