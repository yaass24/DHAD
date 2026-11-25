import type { CSSProperties } from 'react';
import { AdSlot } from '../components/AdSlot';
import { getScenario, SCENARIOS, scenarioLockedBy, scenarioScore, SKILL_LABEL } from '../data';
import { useDispatch, useGame } from '../state/store';
import { Link, navigate } from '../utils/router';
import { Icon } from '../components/Icon';
import { ProgressBar } from '../components/ProgressBar';
import { NotFound } from './NotFound';
import type { Skill } from '../types';

const RATING = { best: 'الصواب', acceptable: 'فيه خلل', unsuitable: 'خطأ' } as const;

function verdict(pct: number) {
  if (pct === 100) return { title: 'إتقان كامل', text: 'أصبت الصياغة الصحيحة في كل المسائل، وأدركت علامة الإعراب في كل موضع.' };
  if (pct >= 90) return { title: 'أداء متميّز', text: 'أصبت في معظم المسائل. راجع المواضع التي أخطأت فيها، فالقاعدة فيها واحدة غالبًا.' };
  if (pct >= 60) return { title: 'أداء جيد', text: 'إعرابك سليم في الغالب. راجع المسائل التي أخطأت فيها، وانظر في علامة الرفع والنصب والجر.' };
  return { title: 'بداية مفيدة', text: 'راجع شرح كل مسألة أدناه، ثم أعد التدريب؛ علامات الإعراب تتكرّر في المواضع نفسها.' };
}

export function ScenarioResults({ id }: { id: string }) {
  const sc = getScenario(id);
  const s = useGame();
  const dispatch = useDispatch();
  if (!sc) return <NotFound />;
  const p = s.scenarios[id];
  if (!p || p.timesCompleted === 0)
    return (
      <div className="container section center">
        <h1>لم يكتمل هذا الموقف بعد</h1>
        <Link to={`/adults/scenario/${id}`} className="btn btn-primary">
          اذهب إلى الموقف
        </Link>
      </div>
    );
  const answers = p.status === 'completed' ? p.runAnswers : p.lastAnswers;
  const score = scenarioScore(sc, answers);
  const v = verdict(score.percent);
  const skillMap = new Map<Skill, { got: number; max: number }>();
  sc.decisions.forEach((d, i) => {
    const o = d.options.find((x) => x.id === answers[i]);
    const cur = skillMap.get(d.skill) ?? { got: 0, max: 0 };
    cur.max += 1;
    cur.got += o?.rating === 'best' ? 1 : o?.rating === 'acceptable' ? 0.4 : 0;
    skillMap.set(d.skill, cur);
  });
  const nextSc = SCENARIOS.find((x) => x.id !== id && (s.scenarios[x.id]?.timesCompleted ?? 0) === 0 && !scenarioLockedBy(s, x.id));

  return (
    <div className="theme-adults">
      <section className="section results-top">
        <div className="container results-grid">
          <div className="results-score">
            <div className="ring" style={{ '--p': score.percent } as CSSProperties} role="img" aria-label={`النتيجة ${score.percent} بالمئة`}>
              <strong>{score.percent}%</strong>
              <span>
                {score.points} / {score.max}
              </span>
            </div>
          </div>
          <div>
            <p className="eyebrow eyebrow-light">نتيجة الموقف</p>
            <h1>{sc.title}</h1>
            <h2 className="verdict">{v.title}</h2>
            <p className="lead">{v.text}</p>
            <p className="outro">{sc.outro}</p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container results-body">
          <div className="panel">
            <h2>المهارات</h2>
            <ul className="skill-bars">
              {Array.from(skillMap.entries()).map(([k, val]) => (
                <li key={k}>
                  <span>{SKILL_LABEL[k]}</span>
                  <ProgressBar value={Math.round((val.got / val.max) * 100)} max={100} label={'مهارة ' + SKILL_LABEL[k]} />
                  <b>{Math.round((val.got / val.max) * 100)}%</b>
                </li>
              ))}
            </ul>
            <p className="muted small">تُحسب المهارة من اختيارك الأول في كل قرار: الخيار الأنسب يُحتسب كاملًا، والمقبول جزئيًا.</p>
          </div>
          <div className="panel">
            <h2>مراجعة المسائل</h2>
            <ol className="review-list">
              {sc.decisions.map((d, i) => {
                const mine = d.options.find((o) => o.id === answers[i]);
                const best = d.options.find((o) => o.rating === 'best')!;
                return (
                  <li key={d.id} className={'review rv-' + (mine?.rating ?? 'unsuitable')}>
                    <div className="review-head">
                      <span className="review-num">{i + 1}</span>
                      <span className={'rating-chip rc-' + (mine?.rating ?? 'unsuitable')}>
                        <Icon name={mine?.rating === 'best' ? 'check' : mine?.rating === 'acceptable' ? 'tilde' : 'x'} size={14} strokeWidth={3} />
                        {RATING[mine?.rating ?? 'unsuitable']}
                      </span>
                      <small>{SKILL_LABEL[d.skill]}</small>
                    </div>
                    <p className="review-line">«{d.line}»</p>
                    {mine && mine.rating !== 'best' && (
                      <p>
                        <b>اختيارك:</b> {mine.text}
                      </p>
                    )}
                    <p>
                      <b>الصياغة الأنسب:</b> {best.text}
                    </p>
                    {mine && mine.rating !== 'best' && <p className="muted">{mine.explanation}</p>}
                  </li>
                );
              })}
            </ol>
          </div>
          <div className="details-actions">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => {
                dispatch({ type: 'startScenario', id, restart: true });
                navigate(`/adults/play/${id}`);
              }}
            >
              <Icon name="replay" size={18} /> أعد المحاولة
            </button>
            {nextSc && (
              <Link to={`/adults/scenario/${nextSc.id}`} className="btn btn-primary">
                الموقف التالي: {nextSc.title} <Icon name="next" size={18} />
              </Link>
            )}
            <Link to="/adults/progress" className="btn btn-outline">
              <Icon name="chart" size={18} /> تقدّمي التعليمي
            </Link>
            <Link to="/adults/library" className="btn btn-text">
              مكتبة المواقف
            </Link>
          </div>
        </div>
      </section>
      <AdSlot placement="adultsResults" />
    </div>
  );
}
