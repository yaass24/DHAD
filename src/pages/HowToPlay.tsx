import { PageHeader } from '../components/PageHeader';
import { AdSlot } from '../components/AdSlot';
import { Link } from '../utils/router';
import { Icon } from '../components/Icon';
import { Dhaw } from '../art/Mascot';
import { AnswerOption } from '../components/AnswerOption';
import { firstDay } from '../data/scenarios/first-day';

/**
 * كيف نلعب؟ — ثلاث لوحات للمسارات، ولوحة واحدة تجمع النقاط والأدوات،
 * فلا يتكرّر شرح النقاط في كل لوحة.
 */
export function HowToPlay() {
  const sample = firstDay.decisions[0];
  return (
    <>
      <PageHeader title="كيف نلعب؟" lead="دقيقتان تكفيان." back="/" backLabel="الرئيسية">
        <Dhaw mood="thinking" size={80} className="ph-dhaw" />
      </PageHeader>
      <section className="section">
        <div className="container how-grid">
          <article className="panel how-kids">
            <h2>
              <Icon name="book" /> الحكايات · للأطفال
            </h2>
            <ol className="how-steps">
              <li>اقرأ المشهد، وابحث عن الكلمة الناقصة في كلام الشخصية.</li>
              <li>اختر الكلمة المناسبة من البطاقات.</li>
              <li>إن أخطأت يعطيك ضوء تلميحًا، وتحاول مرة أخرى.</li>
            </ol>
            <div className="demo-answers" aria-hidden="true">
              <AnswerOption label="الحقيبة" index={0} state="correct" disabled onSelect={() => undefined} />
              <AnswerOption label="الملعقة" index={1} state="wrong" disabled onSelect={() => undefined} />
            </div>
          </article>

          <article className="panel how-adults">
            <h2>
              <Icon name="chat" /> تدريبات النحو · في العمل
            </h2>
            <ol className="how-steps">
              <li>اقرأ الجملة الناقصة، واكتب الكلمة بصيغتها الصحيحة.</li>
              <li>إن أخطأت ظهر سبب الخطأ، ولك تلميح ثم محاولة أخرى.</li>
              <li>بعد الإجابة تظهر القاعدة، ثم تنتقل إلى المسألة التالية.</li>
            </ol>
            <blockquote>{sample.blank?.sentence.replace('____', sample.blank.accept[0])}</blockquote>
            <p className="muted">{sample.blank?.rule}</p>
          </article>

          <article className="panel how-adults">
            <h2>
              <Icon name="sparkle" /> الدروس والرسائل · في العمل
            </h2>
            <ol className="how-steps">
              <li>في درس البلاغة: اقرأ الشرح وشاهده، ثم أجب عن ستة أسئلة.</li>
              <li>بعد كل إجابة يظهر الصواب وسببه، ولك الرجوع إلى الشرح.</li>
              <li>في الرسائل: تكتب الرسالة كاملة، ثم تُراجَع على قائمة تدقيق معدّة مسبقًا، ويُعرض نموذج للمقارنة.</li>
            </ol>
          </article>

          <article className="panel">
            <h2>
              <Icon name="settings" /> النقاط والأدوات
            </h2>
            <ul className="how-tools">
              <li>
                <b>النقاط:</b> في الحكايات 10 من أول مرة، و5 من الثانية، ونقطتان بعدها. وفي التدريبات 20 من أول محاولة، و12 بعد التلميح. وفي الدروس 10 لكل إجابة صحيحة.
              </li>
              <li>
                <b>النجوم:</b> ثلاث نجوم للحكاية بمحاولة إضافية واحدة على الأكثر، ونجمتان حتى ثلاث محاولات، ونجمة بعد ذلك.
              </li>
              <li>
                <b>لوحة المفاتيح:</b> الأرقام 1–4 للاختيار، والسهم الأيسر للانتقال.
              </li>
              <li>
                <b>الصوت والحفظ:</b> زر السماعة في الأعلى يكتم الأصوات، ويُحفظ تقدّمك بعد كل خطوة.
              </li>
            </ul>
          </article>
        </div>
        <p className="center">
          <Link to="/start" className="btn btn-primary btn-lg">
            ابدأ اللعب <Icon name="play" size={18} filled />
          </Link>
        </p>
      </section>
      <AdSlot placement="howTo" />
    </>
  );
}
