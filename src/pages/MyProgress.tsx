import { LESSONS } from '../data/lessons';
import { useGame } from '../state/store';
import { SCENARIOS, STORIES } from '../data';
import { ACHIEVEMENTS } from '../features/achievements/achievements';
import { PageHeader } from '../components/PageHeader';
import { ProgressBar } from '../components/ProgressBar';
import { Stars } from '../components/ScoreCounter';
import { AchievementCard } from '../components/AchievementCard';
import { Link } from '../utils/router';
import { Icon } from '../components/Icon';
import { Dhaw } from '../art/Mascot';

export function MyProgress() {
  const s = useGame();
  const storiesDone = STORIES.filter((x) => (s.stories[x.id]?.timesCompleted ?? 0) > 0).length;
  const scenariosDone = SCENARIOS.filter((x) => (s.scenarios[x.id]?.timesCompleted ?? 0) > 0).length;
  const unlocked = ACHIEVEMENTS.filter((a) => s.achievements[a.id]).length;
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
                {scenariosDone}/{SCENARIOS.length}
              </strong>
              <span>تدريبات مكتملة</span>
            </div>
            <div className="big-stat">
              <Icon name="medal" size={32} />
              <strong>
                {unlocked}/{ACHIEVEMENTS.length}
              </strong>
              <span>إنجازات</span>
            </div>
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
                      <strong>{st.title}</strong>
                      <ProgressBar value={p?.timesCompleted ? st.scenes.length : current} max={st.scenes.length} label={'تقدّمك في ' + st.title} tone="gold" />
                      <span>{p?.timesCompleted ? <Stars count={p.bestStars} size={14} /> : p?.status === 'in-progress' ? `المشهد ${p.currentScene + 1}` : 'لم تبدأ'}</span>
                      <Link to={p?.status === 'in-progress' ? `/kids/play/${st.id}` : `/kids/story/${st.id}`}>{p?.status === 'in-progress' ? 'تابع' : 'افتح'}</Link>
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
                      <strong>{sc.title}</strong>
                      <ProgressBar value={p?.timesCompleted ? sc.decisions.length : p?.currentStep ?? 0} max={sc.decisions.length} label={'تقدّمك في ' + sc.title} />
                      <span>{p?.timesCompleted ? `${p.bestScore}%` : p?.status === 'in-progress' ? `المسألة ${p.currentStep + 1}` : 'لم يبدأ'}</span>
                      <Link to={p?.status === 'in-progress' ? `/adults/play/${sc.id}` : `/adults/scenario/${sc.id}`}>{p?.status === 'in-progress' ? 'تابع' : 'افتح'}</Link>
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

          <h2>كل الإنجازات</h2>
          <div className="ach-grid">
            {ACHIEVEMENTS.map((a) => (
              <AchievementCard key={a.id} a={a} unlockedAt={s.achievements[a.id]} />
            ))}
          </div>
          <p className="center">
            <Link to="/settings" className="btn btn-outline">
              <Icon name="settings" size={18} /> الإعدادات وإعادة الضبط
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
