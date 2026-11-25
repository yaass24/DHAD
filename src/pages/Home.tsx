import { KidScene } from '../art/KidScene';
import { AdSlot } from '../components/AdSlot';
import { AdultStage } from '../art/AdultArt';
import { Dhaw } from '../art/Mascot';
import { KidAvatar } from '../art/KidCharacter';
import { ExperienceCard } from '../components/ExperienceCard';
import { Icon } from '../components/Icon';
import { Link } from '../utils/router';
import { useGame } from '../state/store';
import { SCENARIOS, STORIES, getScenario, getStory } from '../data';
import { CAST } from '../data/characters';
import { LESSONS, getLesson } from '../data/lessons';
import { PHONE_APP, useMedia } from '../utils/useMedia';

function ContinueCard() {
  const s = useGame();
  if (!s.last) return null;
  if (s.last.kind === 'story') {
    const st = getStory(s.last.id);
    const p = s.stories[s.last.id];
    if (!st || !p || p.status !== 'in-progress') return null;
    return (
      <Link to={`/kids/play/${st.id}`} className="continue-card">
        <span className="continue-icon kids">
          <Icon name="book" />
        </span>
        <span>
          <small>تابع من حيث توقفت</small>
          <strong>
            {st.title} · المشهد {Math.min(p.currentScene + 1, st.scenes.length)} من {st.scenes.length}
          </strong>
        </span>
        <Icon name="next" />
      </Link>
    );
  }
  if (s.last.kind === 'lesson') {
    const l = getLesson(s.last.id);
    const lp = s.lessons[s.last.id];
    if (!l || !lp || lp.status !== 'in-progress') return null;
    return (
      <Link to={`/adults/lesson/${l.id}`} className="continue-card">
        <span className="continue-icon adults">
          <Icon name="sparkle" />
        </span>
        <span>
          <small>تابع من حيث توقفت</small>
          <strong>
            {l.title} · السؤال {Math.min(lp.currentStep + 1, l.questions.length)} من {l.questions.length}
          </strong>
        </span>
        <Icon name="next" />
      </Link>
    );
  }
  const sc = getScenario(s.last.id);
  const p = s.scenarios[s.last.id];
  if (!sc || !p || p.status !== 'in-progress') return null;
  return (
    <Link to={`/adults/play/${sc.id}`} className="continue-card">
      <span className="continue-icon adults">
        <Icon name="chat" />
      </span>
      <span>
        <small>تابع من حيث توقفت</small>
        <strong>
          {sc.title} · القرار {Math.min(p.currentStep + 1, sc.decisions.length)} من {sc.decisions.length}
        </strong>
      </span>
      <Icon name="next" />
    </Link>
  );
}

/** Phone portrait: the green hero as one screen, no scrolling — like an app's home tab. */
function HomeApp() {
  return (
    <div className="home-app">
      <div className="home-app-art">
        <div className="hero-card home-app-card">
          <KidScene
            background="park"
            characters={[
              { id: 'khalid', expression: 'excited', x: 230 },
              { id: 'layan', expression: 'happy', x: 420, flip: true },
              { id: 'noura', expression: 'curious', x: 600, flip: true },
            ]}
            props={[{ id: 'butterfly', x: 330, y: 170 }]}
            label="ليان وخالد ونورة في الحديقة"
          />
          <span className="hero-badge badge-gold">
            <Icon name="book" size={18} />
            <small>حكايات</small>
          </span>
          <span className="hero-badge badge-coral">
            <Icon name="chat" size={18} />
            <small>مواقف</small>
          </span>
          <Dhaw mood="wave" size={64} className="hero-dhaw floaty" label="ضوء، رفيقك في ضاد" />
        </div>
      </div>

      <div className="home-app-copy">
        <p className="eyebrow eyebrow-light">ضاد | DHAD · عِش الحكاية، واختر كلماتك.</p>
        <h1>
          تعلّم العربية... <span className="hl">وعِش الحكاية!</span>
        </h1>
        <p className="home-app-sub">قصص مصوّرة وحوارات تفاعلية تكتشف بها العربية الفصحى، للصغار والكبار.</p>
      </div>

      <ContinueCard />

      <div className="home-app-ctas">
        <Link to="/start" className="btn btn-sun btn-lg">
          ابدأ اللعب <Icon name="play" size={18} filled />
        </Link>
        <Link to="/how" className="btn btn-ghost-light btn-lg">
          كيف نلعب؟
        </Link>
      </div>
    </div>
  );
}

export function Home() {
  const phone = useMedia(PHONE_APP);
  if (phone) return <HomeApp />;
  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="eyebrow eyebrow-light">ضاد | DHAD · عِش الحكاية، واختر كلماتك.</p>
            <h1>
              تعلّم العربية... <span className="hl">وعِش الحكاية!</span>
            </h1>
            <p className="hero-sub">في ضاد، كل كلمة تُكمل قصة، وكل اختيار يفتح موقفًا جديدًا. اكتشف العربية الفصحى من خلال قصص مصوّرة وحوارات تفاعلية تناسب الصغار والكبار.</p>
            <div className="hero-ctas">
              <Link to="/start" className="btn btn-sun btn-lg">
                ابدأ اللعب <Icon name="play" size={18} filled />
              </Link>
              <button type="button" className="btn btn-ghost-light btn-lg" onClick={() => document.getElementById('worlds')?.scrollIntoView({ behavior: 'smooth' })}>
                استكشف العوالم
              </button>
            </div>
            <ContinueCard />
          </div>
          <div className="hero-art">
            <div className="hero-card">
              <KidScene
                background="park"
                characters={[
                  { id: 'khalid', expression: 'excited', x: 230 },
                  { id: 'layan', expression: 'happy', x: 420, flip: true },
                  { id: 'noura', expression: 'curious', x: 600, flip: true },
                ]}
                props={[{ id: 'butterfly', x: 330, y: 170 }]}
                label="ليان وخالد ونورة في الحديقة"
              />
              <span className="hero-badge badge-gold">
                <Icon name="book" size={22} />
                <small>حكايات</small>
              </span>
              <span className="hero-badge badge-coral">
                <Icon name="chat" size={22} />
                <small>مواقف</small>
              </span>
              <Dhaw mood="wave" size={92} className="hero-dhaw floaty" label="ضوء، رفيقك في ضاد" />
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="worlds" aria-labelledby="worlds-title">
        <div className="container">
          <div className="section-head">
            <h2 id="worlds-title">عالمان... ولغة واحدة</h2>
            <p>اختر التجربة التي تناسبك، وتنقّل بينهما متى شئت.</p>
          </div>
          <div className="exp-grid">
            <ExperienceCard
              variant="kids"
              title="حكايات ضاد"
              subtitle="قصص مصوّرة للصغار"
              description="انطلق مع شخصيات ضاد في حكايات ممتعة، وأكمل الحوارات بالكلمات المناسبة."
              meta={`${STORIES.length} حكايات · ${STORIES.reduce((n, s) => n + s.scenes.length, 0)} مشهدًا تفاعليًا`}
              cta="استكشف الحكايات"
              to="/kids"
              art={<KidScene background="library" characters={[{ id: 'noura', expression: 'happy', x: 300 }, { id: 'layan', expression: 'excited', x: 500, flip: true }]} label="نورة وليان في المكتبة" />}
            />
            <ExperienceCard
              variant="adults"
              title="ضاد للكبار"
              subtitle="تدريبات نحوية ودروس بلاغة"
              description="اختر الصياغة الصحيحة في جمل من العمل واعرف سبب إعرابها، وتعلّم السجع والطباق والتشبيه والكناية بشواهدها."
              meta={`${SCENARIOS.length} تدريبات نحوية · ${LESSONS.length} دروس بلاغة`}
              cta="ادخل قسم الكبار"
              to="/adults"
              art={<AdultStage backdrop="office" speaker="muna" mood="smile" label="مديرة الفريق ترحّب بك" />}
            />
          </div>
        </div>
      </section>

      <AdSlot placement="home" />

      <section className="section section-cream" aria-labelledby="how-title">
        <div className="container">
          <div className="section-head">
            <h2 id="how-title">كيف تعمل ضاد؟</h2>
          </div>
          <ol className="steps">
            <li>
              <span className="step-num">1</span>
              <h3>اقرأ المشهد</h3>
              <p>تبدأ كل خطوة بمشهد مصوّر وحوار بين الشخصيات.</p>
            </li>
            <li>
              <span className="step-num">2</span>
              <h3>اختر كلمتك</h3>
              <p>أكمل الكلمة الناقصة، أو اختر الردّ الأنسب للموقف.</p>
            </li>
            <li>
              <span className="step-num">3</span>
              <h3>افهم السبب</h3>
              <p>تشرح لك ضاد لماذا كان الاختيار مناسبًا: في المعنى والنبرة والسياق.</p>
            </li>
            <li>
              <span className="step-num">4</span>
              <h3>تقدّم واجمع الإنجازات</h3>
              <p>نجوم وشارات، ويُحفظ تقدّمك لتتابع متى شئت.</p>
            </li>
          </ol>
          <p className="center">
            <Link to="/how" className="btn btn-outline">
              تفاصيل طريقة اللعب
            </Link>
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="cast-title">
        <div className="container cast-wrap">
          <div className="section-head">
            <h2 id="cast-title">تعرّف على أصدقاء ضاد</h2>
            <p>شخصيات أصلية ترافق الصغار في حكايات من الحياة اليومية.</p>
          </div>
          <div className="cast-grid">
            {CAST.map((c) => (
              <article key={c.id} className="cast-card">
                <KidAvatar id={c.id} expression="happy" size={112} />
                <h3>{c.name}</h3>
                <p>{c.trait}</p>
              </article>
            ))}
            <article className="cast-card cast-dhaw">
              <Dhaw mood="excited" size={112} />
              <h3>ضوء</h3>
              <p>رفيق صغير يضيء الطريق: يشجّعك، ويلمّح لك، ويحتفل بإنجازاتك.</p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
