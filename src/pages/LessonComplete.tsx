import type { CSSProperties } from 'react';
import { useGame } from '../state/store';
import { LESSONS, getLesson } from '../data/lessons';
import { ConceptCards } from '../features/adults/LessonPlayer';
import { Icon } from '../components/Icon';
import { Link } from '../utils/router';
import { NotFound } from './NotFound';

export function LessonComplete({ id }: { id: string }) {
  const s = useGame();
  const lesson = getLesson(id);
  if (!lesson) return <NotFound />;
  const p = s.lessons[id];
  if (!p || !p.timesCompleted) {
    return (
      <section className="section">
        <div className="container center">
          <p>لم تُكمل هذا الدرس بعد.</p>
          <Link to={`/adults/lesson/${id}`} className="btn btn-primary">
            ابدأ الدرس
          </Link>
        </div>
      </section>
    );
  }
  const answers = p.runAnswers;
  const right = lesson.questions.filter((q, i) => answers[i] === q.correct).length;
  const pct = Math.round((right / lesson.questions.length) * 100);
  const idx = LESSONS.findIndex((l) => l.id === id);
  const nextLesson = LESSONS[idx + 1];
  const verdict = pct === 100 ? 'إتقان كامل' : pct >= 67 ? 'فهم جيد' : 'بداية مفيدة';
  const advice = pct === 100 ? 'أجبت عن كل الأسئلة إجابة صحيحة.' : pct >= 67 ? 'راجع الأسئلة التي أخطأت فيها أدناه، فشرح كل منها يوضّح الفرق.' : 'اقرأ الشرح مرة أخرى، ثم أعد الدرس: الأسئلة نفسها تساعدك على تثبيت الفروق.';
  return (
    <div className="theme-adults">
      <section className="section results-top">
        <div className="container results-grid">
          <div className="results-score">
            <div className="ring" style={{ '--p': pct } as CSSProperties} role="img" aria-label={`النتيجة ${pct} بالمئة`}>
              <strong>{pct}%</strong>
              <span>
                {right} من {lesson.questions.length}
              </span>
            </div>
          </div>
          <div>
            <p className="eyebrow eyebrow-light">نتيجة الدرس</p>
            <h1>{lesson.title}</h1>
            <h2 className="verdict">{verdict}</h2>
            <p className="lead">{advice}</p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container results-body">
          <div className="panel">
            <h2>مراجعة الأسئلة</h2>
            <ol className="lesson-review">
              {lesson.questions.map((q, i) => {
                const ok = answers[i] === q.correct;
                const mine = q.options.find((o) => o.id === answers[i]);
                const good = q.options.find((o) => o.id === q.correct)!;
                return (
                  <li key={q.id} className={ok ? 'is-ok' : 'is-miss'}>
                    <span className="rv-icon">
                      <Icon name={ok ? 'check' : 'x'} size={16} strokeWidth={3} />
                    </span>
                    <div>
                      <strong>{q.prompt}</strong>
                      {q.quote && <p className="rv-quote">«{q.quote}»</p>}
                      <p>
                        الإجابة: <b>{good.text}</b>
                        {!ok && mine && <small> (اخترت: {mine.text})</small>}
                      </p>
                      {!ok && <p className="muted">{q.explanation}</p>}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
          <div className="panel">
            <h2>خلاصة الدرس</h2>
            <ConceptCards lesson={lesson} />
          </div>
          <div className="details-actions center-actions">
            {nextLesson && (
              <Link to={`/adults/lesson/${nextLesson.id}`} className="btn btn-primary btn-lg">
                الدرس التالي: {nextLesson.title} <Icon name="next" size={18} />
              </Link>
            )}
            <Link to={`/adults/lesson/${id}`} className="btn btn-outline">
              <Icon name="replay" size={18} /> أعد الدرس
            </Link>
            <Link to="/adults/rhetoric" className="btn btn-outline">
              كل الدروس
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
