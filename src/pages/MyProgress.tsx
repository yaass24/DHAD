import { LESSONS } from '../data/lessons';
import { EMAILS } from '../data/emails';
import { useGame } from '../state/store';
import { SCENARIOS, STORIES, SKILL_LABEL } from '../data';
import { ACHIEVEMENTS } from '../features/achievements/achievements';
import { PageHeader } from '../components/PageHeader';
import { ProgressBar } from '../components/ProgressBar';
import { LevelBadge } from '../components/LevelSelector';
import { Link } from '../utils/router';
import { Icon } from '../components/Icon';
import { Dhaw } from '../art/Mascot';
import type { Skill } from '../types';

/**
 * تقدّمي — الصفحة الوحيدة للتقدّم: أرقام سريعة، ثم كل مسار في قائمة واحدة،
 * ثم ملخّص المهارات. والإنجازات لها صفحتها، فلا تتكرّر هنا.
 */
export function MyProgress() {
  const s = useGame();
  const storiesDone = STORIES.filter((x) => (s.stories[x.id]?.timesCompleted ?? 0) > 0).length;
  const drillsDone = SCENARIOS.filter((x) => (s.scenarios[x.id]?.timesCompleted ?? 0) > 0).length;
  const unlocked = ACHIEVEMENTS.filter((a) => s.achievements[a.id]).length;

  // مهارات النحو من آخر محاولة مكتملة لكل تدريب
  const skill = new Map<Skill, { got: number; max: number }>();
  SCENARIOS.forEach((sc) => {
    const p = s.scenarios[sc.id];
    if (!p?.timesCompleted) return;
    sc.decisions.forEach((d, i) => {
      const a = p.lastAnswers[i];
      const cur = skill.get(d.skill) ?? { got: 0, max: 0 };
      cur.max += 1;
      cur.got += d.blank ? (a === 'correct' ? 1 : a === 'assisted' ? 0.6 : 0) : d.options?.find((o) => o.id === a)?.rating === 'best' ? 1 : 0;
      skill.set(d.skill, cur);
    });
  });
  const weakest = [...skill.entries()].sort((a, b) => a[1].got / a[1].max - b[1].got / b[1].max)[0];

  return (
    <>
      <PageHeader title="تقدّمي" lead="كل ما أنجزته في ضاد، محفوظ على هذا الجهاز." back="/" backLabel="الرئيسية">
        <Dhaw mood="happy" size={80} className="ph-dhaw" />
      </PageHeader>
      <section className="section">
        <div className="container">
          <div className="reward-summary">
            <div className="big-stat">
              <Icon name="sparkle" size={32} />
              <strong>{s.points}</strong>
              <span>مجموع النقاط</span>
            </div>
            <div className="big-stat">
              <Icon name="book" size={32} />
              <strong>
                {storiesDone}/{STORIES.length}
              </strong>
              <span>حكايات مكتملة</span>
            </div>
            <div className="big-stat">
              <Icon name="chat" size={32} />
              <strong>
                {drillsDone}/{SCENARIOS.length}
              </strong>
              <span>تدريبات مكتملة</span>
            </div>
            <Link to="/achievements" className="big-stat big-stat-link">
              <Icon name="medal" size={32} />
              <strong>
                {unlocked}/{ACHIEVEMENTS.length}
              </strong>
              <span>
                إنجازات <Icon name="next" size={14} />
              </span>
            </Link>
          </div>

          <div className="results-body">
            <div className="panel">
              <h2>حكايات ضاد</h2>
              <ul className="sc-progress">
                {STORIES.map((st) => {
                  const p = s.stories[st.id];
                  const current = p?.status === 'in-progress' ? p.currentScene : p?.timesCompleted ? st.scenes.length : 0;
                  return (
                    <li key={st.id}>
                      <div>
                        <strong>{st.title}</strong> <LevelBadge level={st.level} />
                      </div>
                      <ProgressBar value={current} max={st.scenes.length} label={'تقدّمك في ' + st.title} />
                      <span>{p?.timesCompleted ? 'مكتملة' : p?.status === 'in-progress' ? `المشهد ${current + 1}` : 'لم تبدأ'}</span>
                      <Link to={p?.timesCompleted ? `/kids/complete/${st.id}` : `/kids/story/${st.id}`}>{p?.timesCompleted ? 'النتيجة' : 'افتح'}</Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="panel">
              <h2>التدريبات النحوية</h2>
              <ul className="sc-progress">
                {SCENARIOS.map((sc) => {
                  const p = s.scenarios[sc.id];
                  return (
                    <li key={sc.id}>
                      <div>
                        <strong>{sc.title}</strong> <LevelBadge level={sc.level} />
                      </div>
                      <ProgressBar value={p?.bestScore ?? 0} max={100} label={'أفضل نتيجة في ' + sc.title} />
                      <span>{p?.timesCompleted ? `${p.bestScore}%` : p?.status === 'in-progress' ? 'قيد الحل' : 'لم يبدأ'}</span>
                      <Link to={p?.timesCompleted ? `/adults/results/${sc.id}` : `/adults/scenario/${sc.id}`}>{p?.timesCompleted ? 'النتيجة' : 'افتح'}</Link>
                    </li>
                  );
                })}
              </ul>
              {skill.size > 0 && (
                <>
                  <h3 className="h-small">مهاراتك</h3>
                  <ul className="skill-bars">
                    {[...skill.entries()].map(([k, v]) => (
                      <li key={k}>
                        <span>{SKILL_LABEL[k]}</span>
                        <ProgressBar value={Math.round((v.got / v.max) * 100)} max={100} label={'مهارة ' + SKILL_LABEL[k]} />
                        <b>{Math.round((v.got / v.max) * 100)}%</b>
                      </li>
                    ))}
                  </ul>
                  {weakest && <p className="tip">راجع قاعدة «{SKILL_LABEL[weakest[0]]}» قبل محاولتك القادمة.</p>}
                </>
              )}
            </div>

            <div className="panel">
              <h2>دروس البلاغة والرسائل</h2>
              <ul className="sc-progress">
                {LESSONS.map((l) => {
                  const p = s.lessons[l.id];
                  const started = p?.status === 'in-progress' && (p.currentStep > 0 || p.runAnswers.length > 0);
                  return (
                    <li key={l.id}>
                      <strong>{l.title}</strong>
                      <ProgressBar value={p?.timesCompleted ? 100 : started ? Math.round((p!.runAnswers.length / l.questions.length) * 100) : 0} max={100} label={'تقدّمك في ' + l.title} />
                      <span>{p?.timesCompleted ? `${p.bestScore}%` : started ? `السؤال ${p!.currentStep + 1}` : 'لم يبدأ'}</span>
                      <Link to={p?.timesCompleted ? `/adults/lesson-done/${l.id}` : `/adults/lesson/${l.id}`}>{p?.timesCompleted ? 'النتيجة' : started ? 'تابع' : 'افتح'}</Link>
                    </li>
                  );
                })}
                {EMAILS.map((e) => {
                  const p = s.emails[e.id];
                  return (
                    <li key={e.id}>
                      <strong>رسالة: {e.title}</strong>
                      <ProgressBar value={p?.done ? 100 : p ? 40 : 0} max={100} label={'تقدّمك في ' + e.title} />
                      <span>{p?.done ? 'مكتملة' : p ? 'مسوّدة' : 'لم تبدأ'}</span>
                      <Link to={`/adults/write/${e.id}`}>{p ? 'تابع' : 'افتح'}</Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
