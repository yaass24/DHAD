import { LESSONS } from '../data/lessons';
import { useGame } from '../state/store';
import { SCENARIOS, SKILL_LABEL } from '../data';
import { ACHIEVEMENTS } from '../features/achievements/achievements';
import { PageHeader } from '../components/PageHeader';
import { AchievementCard } from '../components/AchievementCard';
import { ProgressBar } from '../components/ProgressBar';
import { LevelBadge } from '../components/LevelSelector';
import { Link } from '../utils/router';
import type { Skill } from '../types';

export function LearningProgress() {
  const s = useGame();
  const done = SCENARIOS.filter((x) => (s.scenarios[x.id]?.timesCompleted ?? 0) > 0);
  const skill = new Map<Skill, { got: number; max: number }>();
  done.forEach((sc) => {
    const ans = s.scenarios[sc.id].lastAnswers;
    sc.decisions.forEach((d, i) => {
      const o = d.options.find((x) => x.id === ans[i]);
      const cur = skill.get(d.skill) ?? { got: 0, max: 0 };
      cur.max += 1;
      cur.got += o?.rating === 'best' ? 1 : o?.rating === 'acceptable' ? 0.4 : 0;
      skill.set(d.skill, cur);
    });
  });
  const decisions = done.reduce((n, sc) => n + sc.decisions.length, 0);
  const bestFirst = done.reduce((n, sc) => n + sc.decisions.filter((d, i) => d.options.find((o) => o.id === s.scenarios[sc.id].lastAnswers[i])?.rating === 'best').length, 0);
  const list = ACHIEVEMENTS.filter((a) => a.audience !== 'kids');
  const weakest = Array.from(skill.entries()).sort((a, b) => a[1].got / a[1].max - b[1].got / b[1].max)[0];
  return (
    <div className="theme-adults">
      <PageHeader title="تقدّمي التعليمي" lead="ملخّص أدائك في مواقف العمل ودروس البلاغة، مبنيّ على آخر محاولة مكتملة." back="/adults" backLabel="ضاد للكبار" tone="adults" />
      <section className="section">
        <div className="container">
          <div className="reward-summary">
            <div className="big-stat">
              <strong>
                {done.length}/{SCENARIOS.length}
              </strong>
              <span>مواقف مكتملة</span>
            </div>
            <div className="big-stat">
              <strong>{decisions ? Math.round((bestFirst / decisions) * 100) : 0}%</strong>
              <span>نسبة اختيار الأنسب من أول مرة</span>
            </div>
            <div className="big-stat">
              <strong>{decisions}</strong>
              <span>قرارًا حواريًا</span>
            </div>
          </div>
          <div className="results-body">
            <div className="panel">
              <h2>المهارات</h2>
              {skill.size === 0 ? (
                <p className="muted">
                  أكمل موقفًا واحدًا على الأقل لتظهر مهاراتك هنا. <Link to="/adults/library">ابدأ موقفًا</Link>
                </p>
              ) : (
                <>
                  <ul className="skill-bars">
                    {Array.from(skill.entries()).map(([k, v]) => (
                      <li key={k}>
                        <span>{SKILL_LABEL[k]}</span>
                        <ProgressBar value={Math.round((v.got / v.max) * 100)} max={100} label={'مهارة ' + SKILL_LABEL[k]} />
                        <b>{Math.round((v.got / v.max) * 100)}%</b>
                      </li>
                    ))}
                  </ul>
                  {weakest && <p className="tip">اقتراح: ركّز في محاولتك القادمة على مهارة «{SKILL_LABEL[weakest[0]]}»، واقرأ بطاقة السياق قبل الاختيار.</p>}
                </>
              )}
            </div>
            <div className="panel">
              <h2>المواقف</h2>
              <ul className="sc-progress">
                {SCENARIOS.map((sc) => {
                  const p = s.scenarios[sc.id];
                  return (
                    <li key={sc.id}>
                      <div>
                        <strong>{sc.title}</strong> <LevelBadge level={sc.level} />
                      </div>
                      <ProgressBar value={p?.bestScore ?? 0} max={100} label={'أفضل نتيجة في ' + sc.title} />
                      <span>{p?.timesCompleted ? `${p.bestScore}%` : p?.status === 'in-progress' ? 'قيد اللعب' : 'لم يبدأ'}</span>
                      {p?.timesCompleted ? <Link to={`/adults/results/${sc.id}`}>النتيجة</Link> : <Link to={`/adults/scenario/${sc.id}`}>افتح</Link>}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="panel">
              <h2>دروس البلاغة</h2>
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
              </ul>
            </div>
          </div>
          <h2>الإنجازات</h2>
          <div className="ach-grid">
            {list.map((a) => (
              <AchievementCard key={a.id} a={a} unlockedAt={s.achievements[a.id]} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
