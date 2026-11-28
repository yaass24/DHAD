import { LESSONS } from '../data/lessons';
import { EMAILS } from '../data/emails';
import { Link } from '../utils/router';
import { LogoMark } from '../art/Logo';
import { Icon } from '../components/Icon';
import { Reveal } from '../components/Reveal';
import { SCENARIOS, STORIES } from '../data';
import { adsEnabled } from '../config/ads';

/**
 * عن ضاد: صفحة تعريفية بالمشروع — الفكرة، والتجربتان، والجانب التقني،
 * وإعداد المحتوى والخصوصية، والتعريف بالمطوّرة وحقوق الملكية.
 */
export function About() {
  const scenes = STORIES.reduce((n, s) => n + s.scenes.length, 0);
  const blanks = SCENARIOS.reduce((n, s) => n + s.decisions.length, 0);
  const questions = LESSONS.reduce((n, l) => n + l.questions.length, 0);

  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container about-hero-inner">
          <div className="about-hero-copy">
            <p className="eyebrow eyebrow-light">منصّة ضاد</p>
            <h1>عن ضاد</h1>
            <p className="lead">منصّة تعليمية تفاعلية تجمع بين اللغة العربية والتقنية، لتجعل تعلّم الفصحى وممارستها أقرب إلى الحياة اليومية وبيئات العمل.</p>
            <p className="about-hero-link">
              <Link to="/start" className="btn btn-sun btn-lg">
                ابدأ التجربة <Icon name="next" size={18} />
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="idea-title">
        <div className="container about-idea">
          <Reveal className="about-mark">
            <LogoMark size={190} decorative={false} />
            <p>شعار ضاد زخرفة مستوحاة من النقوش التراثية: سعفٌ أخضر ينمو من قلب الرمز، تحيط به ألوان الهوية. وأمّا الاسم فمن حرف الضاد الذي عُرفت به العربية.</p>
          </Reveal>
          <Reveal>
            <h2 id="idea-title">فكرة ضاد</h2>
            <p>جاءت فكرة ضاد لتوظيف التقنية في تعزيز استخدام اللغة العربية الفصحى، وتطوير مهارات التعبير والتواصل في المواقف اليومية والمهنية.</p>
            <p>تسعى المنصّة إلى جعل تعلّم العربية تجربة عملية، بالقصص والتدريبات بدلًا من الحفظ وحده.</p>
            <p>وتنبع أهميتها من الحاجة إلى حلول رقمية تدعم حضور العربية في الشركات والمؤسسات، وتعين الأفراد على لغة أوضح في تواصلهم المهني.</p>
          </Reveal>
        </div>
      </section>

      <section className="section section-cream" aria-labelledby="offer-title">
        <div className="container">
          <Reveal className="section-head">
            <h2 id="offer-title">ماذا تقدّم ضاد؟</h2>
            <p>تجربتان، لكلٍّ منهما لغتها ومستواها.</p>
          </Reveal>
          <div className="about-cards">
            <Reveal as="article" className="about-card">
              <span className="about-card-icon">
                <Icon name="book" size={24} />
              </span>
              <h3>حكايات ضاد للأطفال</h3>
              <p>
                {STORIES.length} حكايات تفاعلية مستوحاة من مواقف الحياة اليومية، تساعد الأطفال على تعلّم الفصحى من خلال الشخصيات والقصص والاختيارات اللغوية، في {scenes} مشهدًا مصوّرًا.
              </p>
              <Link to="/kids" className="text-link">
                ادخل عالم الحكايات <Icon name="next" size={16} />
              </Link>
            </Reveal>
            <Reveal as="article" className="about-card" delay={0.1}>
              <span className="about-card-icon icon-alt">
                <Icon name="chat" size={24} />
              </span>
              <h3>ضاد في العمل</h3>
              <p>ثلاثة مسارات على جمل من بيئة العمل:</p>
              <ul className="about-list">
                <li>
                  <b>تدريبات نحوية:</b> {blanks} مسألة تكتب فيها الكلمة الناقصة بصيغتها الصحيحة، ولكل خطأ شرح إعرابي.
                </li>
                <li>
                  <b>دروس البلاغة:</b> {LESSONS.length} دروس و{questions} سؤالًا في السجع والجناس، والطباق والمقابلة، والتشبيه والاستعارة، والكناية.
                </li>
                <li>
                  <b>كتابة الرسائل:</b> {EMAILS.length} رسائل مهنية تكتبها بنفسك، ثم تُراجَع على قائمة تدقيق معدّة مسبقًا.
                </li>
              </ul>
              <Link to="/adults" className="text-link">
                ادخل مسار العمل <Icon name="next" size={16} />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section about-tech" aria-labelledby="tech-title">
        <div className="container about-narrow">
          <Reveal>
            <p className="eyebrow eyebrow-light">التقنية في خدمة العربية</p>
            <h2 id="tech-title">من الحاجة إلى تجربة رقمية</h2>
            <p>
              ويعكس المشروع جانبًا من مجال <b>نظم المعلومات الحاسوبية</b>: تحليل احتياجات المستخدمين، وتنظيم المحتوى، وتصميم واجهات وتجارب رقمية تخدم أهدافًا تعليمية وعملية.
            </p>
            <p>والهدف إبراز ما تسهم به الحلول التقنية في تطوير مهارات التواصل بالعربية.</p>
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="how-title">
        <div className="container">
          <Reveal className="section-head">
            <h2 id="how-title">إعداد المحتوى والخصوصية</h2>
          </Reveal>
          <div className="about-notes">
            <Reveal as="article" className="note-card">
              <h3>إعداد المحتوى</h3>
              <p>أسئلة وشروح معدّة مسبقًا، وإجاباتها محدّدة وفق قواعد العربية.</p>
            </Reveal>
            <Reveal as="article" className="note-card" delay={0.08}>
              <h3>الخصوصية</h3>
              <p>بلا حساب، وتقدّمك محفوظ في متصفح جهازك وحده، ويمكنك مسحه من الإعدادات.</p>
              {adsEnabled() && (
                <p className="small">
                  تظهر إعلانات في بعض الصفحات دون صفحات اللعب، وصفحات الأطفال تُطلب إعلاناتها بوسم «محتوى موجّه للأطفال».{' '}
                  <a href="https://policies.google.com/technologies/ads?hl=ar" target="_blank" rel="noopener noreferrer">
                    تفاصيل إعلانات Google
                  </a>
                  .
                </p>
              )}
            </Reveal>
            <Reveal as="article" className="note-card" delay={0.16}>
              <h3>الرسوم والأصوات</h3>
              <p>الشخصيات والمشاهد رسوم أصلية صُمّمت لضاد، والمؤثرات الصوتية مولَّدة داخل المتصفح.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section-cream" aria-labelledby="author-title">
        <div className="container about-narrow">
          <Reveal className="author-card">
            <div className="author-mark">
              <LogoMark size={64} />
            </div>
            <div>
              <p className="eyebrow">خلف ضاد</p>
              <h2 id="author-title">ياسمين المؤمن</h2>
              <p className="author-role">طالبة نظم المعلومات الحاسوبية</p>
              <p>تصميم وتطوير منصّة ضاد.</p>
              <p>نشأت فكرة ضاد من الاهتمام بتوظيف نظم المعلومات والتقنية في تطوير حلول رقمية ذات أثر، تجمع بين تجربة المستخدم والمحتوى التعليمي، وتسهم في تعزيز حضور اللغة العربية في الحياة اليومية والمهنية.</p>
            </div>
          </Reveal>
          <Reveal className="rights-note">
            <h3>حقوق الملكية الفكرية</h3>
            <p className="rights-line">© 2026 ضاد — ياسمين المؤمن</p>
            <p className="rights-line">جميع الحقوق محفوظة.</p>
            <p>ضاد مشروع تقني تعليمي مستقل وغير تجاري، أُنشئ كمبادرة مجتمعية تهدف إلى تعزيز حضور اللغة العربية وتوظيف التقنية في خدمة تعلّمها واستخدامها.</p>
            <p>تخضع الخطوط والموارد الخارجية لتراخيص أصحابها، ولا يعني استخدامها وجود أي شراكة أو ارتباط رسمي بالجهات المالكة لها.</p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
