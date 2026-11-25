import { getScenario, scenarioLockedBy, SKILL_LABEL, LEVEL_LABEL, ADULTS_LEVEL_HINT } from '../data';
import { useDispatch, useGame } from '../state/store';
import { AdultStage, ADULTS, AdultAvatar } from '../art/AdultArt';
import { Link, navigate } from '../utils/router';
import { Icon } from '../components/Icon';
import { ProgressBar } from '../components/ProgressBar';
import { LevelBadge } from '../components/LevelSelector';
import { NotFound } from './NotFound';
import { playSound } from '../utils/sound';

export function ScenarioDetails({ id }: { id: string }) {
  const sc = getScenario(id);
  const s = useGame();
  const dispatch = useDispatch();
  if (!sc) return <NotFound />;
  const p = s.scenarios[id];
  const lockedBy = scenarioLockedBy(s, id);
  const inProgress = p?.status === 'in-progress' && (p.currentStep > 0 || p.runAnswers.length > 0);
  const done = (p?.timesCompleted ?? 0) > 0;
  const skills = Array.from(new Set(sc.decisions.map((d) => d.skill)));
  const start = (restart: boolean) => {
    playSound('click');
    dispatch({ type: 'startScenario', id, restart });
    navigate(`/adults/play/${id}`);
  };
  return (
    <div className="theme-adults">
      <section className="details details-adult">
        <div className="container details-inner">
          <Link to="/adults/library" className="back-link">
            <Icon name="back" size={18} /> مكتبة المواقف
          </Link>
          <div className="details-grid">
            <div className="details-art">
              <AdultStage backdrop={sc.backdrop} speaker={sc.cast[0]} mood="neutral" label={sc.title} />
            </div>
            <div className="details-copy">
              <div className="card-meta">
                <LevelBadge level={sc.level} />
                <span className="muted">{sc.decisions.length} قرارات · نحو {sc.decisions.length * 2} دقائق</span>
              </div>
              <h1>{sc.title}</h1>
              <p className="lead">{sc.summary}</p>
              <dl className="facts">
                <div>
                  <dt>دورك</dt>
                  <dd>{sc.playerRole}</dd>
                </div>
                <div>
                  <dt>التركيز</dt>
                  <dd>{sc.focus}</dd>
                </div>
                <div>
                  <dt>المستوى</dt>
                  <dd>
                    {LEVEL_LABEL[sc.level]}: {ADULTS_LEVEL_HINT[sc.level]}
                  </dd>
                </div>
              </dl>
              <div className="details-cast">
                {sc.cast.map((c) => (
                  <span key={c} className="cast-chip">
                    <AdultAvatar id={c} size={36} /> {ADULTS[c].name} · {ADULTS[c].role}
                  </span>
                ))}
              </div>
              <ul className="skill-tags" aria-label="المهارات">
                {skills.map((k) => (
                  <li key={k}>{SKILL_LABEL[k]}</li>
                ))}
              </ul>
              <p className="intro-quote">{sc.intro}</p>
              {done && <p className="best-line">أفضل نتيجة: {p!.bestScore}% · مرات الإكمال: {p!.timesCompleted}</p>}
              {inProgress && (
                <div className="resume-box">
                  <span>
                    توقّفت عند المسألة {Math.min(p!.currentStep + 1, sc.decisions.length)} من {sc.decisions.length}
                  </span>
                  <ProgressBar value={p!.currentStep} max={sc.decisions.length} label="تقدّمك المحفوظ" />
                </div>
              )}
              {lockedBy ? (
                <p className="lock-note">
                  <Icon name="lock" size={16} /> هذا الموقف مقفل. أكمل موقف «{lockedBy.title}» أولًا. <Link to={`/adults/scenario/${lockedBy.id}`}>اذهب إليه</Link>
                </p>
              ) : (
                <div className="details-actions">
                  {inProgress ? (
                    <>
                      <button type="button" className="btn btn-primary btn-lg" onClick={() => start(false)}>
                        <Icon name="play" size={18} filled /> تابع من المسألة {Math.min(p!.currentStep + 1, sc.decisions.length)}
                      </button>
                      <button type="button" className="btn btn-outline" onClick={() => start(true)}>
                        <Icon name="replay" size={18} /> ابدأ من جديد
                      </button>
                    </>
                  ) : (
                    <button type="button" className="btn btn-primary btn-lg" onClick={() => start(true)}>
                      <Icon name="play" size={18} filled /> {done ? 'أعد المحاولة' : 'ابدأ الموقف'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
