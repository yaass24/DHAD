import { PageHeader } from '../components/PageHeader';
import { AdSlot } from '../components/AdSlot';
import { Link } from '../utils/router';
import { Icon } from '../components/Icon';
import { Dhaw } from '../art/Mascot';
import { AnswerOption } from '../components/AnswerOption';
import { firstDay } from '../data/scenarios/first-day';

export function HowToPlay() {
  const sample = firstDay.decisions[0];
  return (
    <>
      <PageHeader title="كيف نلعب؟" lead="دقيقتان تكفيان لتعرف كل شيء." back="/" backLabel="الرئيسية">
        <Dhaw mood="thinking" size={80} className="ph-dhaw" />
      </PageHeader>
      <section className="section">
        <div className="container how-grid">
          <article className="panel how-kids">
            <h2>
              <Icon name="book" /> حكايات ضاد (للصغار)
            </h2>
            <ol className="how-steps">
              <li>اختر حكاية من المكتبة، وابدأ من المشهد الأول.</li>
              <li>اقرأ المشهد وفقاعة الحوار، وابحث عن الكلمة الناقصة.</li>
              <li>اختر الكلمة المناسبة من البطاقات.</li>
              <li>إن أخطأت فلا بأس! سيعطيك ضوء تلميحًا، وتحاول مرة أخرى.</li>
              <li>بعد الإجابة الصحيحة تتابع الحكاية إلى المشهد التالي.</li>
            </ol>
            <div className="demo-answers" aria-hidden="true">
              <AnswerOption label="الحقيبة" index={0} state="correct" disabled onSelect={() => undefined} />
              <AnswerOption label="الملعقة" index={1} state="wrong" disabled onSelect={() => undefined} />
            </div>
            <p>
              <b>النجوم:</b> تحصل على ثلاث نجوم إذا أكملت الحكاية بمحاولة إضافية واحدة على الأكثر، وعلى نجمتين إذا احتجت إلى محاولتين أو ثلاث، وعلى نجمة واحدة إذا احتجت إلى أكثر من ذلك.
            </p>
            <p>
              <b>النقاط:</b> 10 نقاط للإجابة من أول مرة، و5 نقاط من المحاولة الثانية، ونقطتان بعد ذلك.
            </p>
          </article>
          <article className="panel how-adults">
            <h2>
              <Icon name="chat" /> التدريبات النحوية (للكبار)
            </h2>
            <ol className="how-steps">
              <li>اقرأ الجملة الناقصة وبطاقة الموضوع النحوي.</li>
              <li>اكتب الكلمة بصيغتها الصحيحة. محاولتك الأولى هي التي تُحتسب.</li>
              <li>إن أخطأت ظهر لك سبب الخطأ، ويمكنك طلب تلميح ثم إعادة المحاولة.</li>
              <li>بعد الإجابة تظهر القاعدة كاملة، ثم تنتقل إلى المسألة التالية.</li>
            </ol>
            <p>مثال من التدريب الأول:</p>
            <blockquote>{sample.blank?.sentence.replace('____', sample.blank.accept[0])}</blockquote>
            <p className="muted">{sample.blank?.rule}</p>
            <p>
              <b>النقاط:</b> 20 نقطة للإجابة الصحيحة من أول محاولة، و12 بعد التلميح أو بعد محاولة خاطئة، ولا نقاط إذا عُرضت الإجابة.
            </p>
          </article>
          <article className="panel how-adults">
            <h2>
              <Icon name="sparkle" /> دروس البلاغة (للكبار)
            </h2>
            <ol className="how-steps">
              <li>اقرأ بطاقتي الشرح: التعريف، وشاهد من القرآن أو الحديث أو الشعر، وملاحظة توضّح الشاهد.</li>
              <li>أجب عن ستة أسئلة تطبيقية. اختيارك الأول هو الذي يُحتسب.</li>
              <li>بعد كل إجابة يظهر الجواب الصحيح وسببه، ويمكنك الرجوع إلى الشرح قبل الإجابة.</li>
              <li>في النهاية تراجع الأسئلة التي أخطأت فيها مع شرحها.</li>
            </ol>
            <p>
              <b>النقاط:</b> 10 نقاط لكل إجابة صحيحة.
            </p>
          </article>
          <article className="panel">
            <h2>
              <Icon name="settings" /> أدوات مفيدة
            </h2>
            <ul className="how-tools">
              <li>
                <b>لوحة المفاتيح:</b> الأرقام 1–4 لاختيار الإجابة، والسهم الأيسر للانتقال إلى التالي.
              </li>
              <li>
                <b>الصوت:</b> زر السماعة في الأعلى يكتم الأصوات أو يشغّلها.
              </li>
              <li>
                <b>الحفظ:</b> يُحفظ تقدّمك تلقائيًا بعد كل مشهد، فتتابع لاحقًا من حيث توقفت.
              </li>
              <li>
                <b>المستوى:</b> اختر مستواك (مبتدئ، متوسط، متقدّم) مهما كان عمرك.
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
