import { useMemo, useState } from 'react';
import { EMAILS, checkEmail, getEmailTask } from '../data/emails';
import { useDispatch, useGame } from '../state/store';
import { PageHeader } from '../components/PageHeader';
import { Icon } from '../components/Icon';
import { LevelBadge } from '../components/LevelSelector';
import { Link } from '../utils/router';
import { playSound } from '../utils/sound';
import { NotFound } from './NotFound';

export function EmailLibrary() {
  const s = useGame();
  return (
    <div className="theme-adults">
      <PageHeader
        title="اكتب رسالة"
        lead="تكتب الرسالة بنفسك، ثم تُراجَع على قائمة تدقيق معدّة مسبقًا: عناصر لا بدّ منها، وأخطاء شائعة. وهو تدقيق محدود لا شامل، وبلا ذكاء اصطناعي."
        back="/adults"
        backLabel="ضاد في العمل"
        tone="adults"
      />
      <section className="section">
        <div className="container lesson-list">
          {EMAILS.map((t, i) => (
            <article key={t.id} className="lesson-tile">
              <span className="lesson-num" aria-hidden="true">
                {i + 1}
              </span>
              <div className="lesson-tile-body">
                <div className="card-meta">
                  <LevelBadge level={t.level} />
                  <span className="muted">
                    <Icon name="check" size={14} /> {t.checks.length} عناصر تدقيق
                  </span>
                  {s.emails[t.id]?.done && (
                    <span className="result-chip">
                      <Icon name="check" size={14} /> مكتملة
                    </span>
                  )}
                </div>
                <h3>{t.title}</h3>
                <p>{t.situation}</p>
                <Link to={`/adults/write/${t.id}`} className="btn btn-primary">
                  {s.emails[t.id] ? 'تابع الكتابة' : 'ابدأ الكتابة'} <Icon name="next" size={18} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export function WriteEmail({ id }: { id: string }) {
  const task = getEmailTask(id);
  const s = useGame();
  const dispatch = useDispatch();
  const saved = s.emails[id];
  const [text, setText] = useState(saved?.text ?? '');
  const [checked, setChecked] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const results = useMemo(() => (task ? checkEmail(task, text) : []), [task, text]);
  if (!task) return <NotFound />;
  const passed = results.filter((r) => r.passed).length;
  const all = passed === results.length;

  function run() {
    if (!text.trim()) return;
    setChecked(true);
    const done = checkEmail(task!, text).every((r) => r.passed);
    playSound(done ? 'complete' : 'click');
    dispatch({ type: 'saveEmail', id, text, done });
  }

  return (
    <div className="theme-adults">
      <PageHeader title={task.title} lead={task.situation} back="/adults/write" backLabel="كل الرسائل" tone="adults" />
      <section className="section">
        <div className="container write-layout">
          <div className="panel write-panel">
            <h2>اكتب رسالتك</h2>
            <p className="muted">{task.brief}</p>
            <label className="sr-only" htmlFor="email-text">
              نص الرسالة
            </label>
            <textarea
              id="email-text"
              className="write-area"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setChecked(false);
              }}
              rows={14}
              placeholder={'سعادة ...\n\nتحية طيبة وبعد،\n\n...'}
              spellCheck={false}
            />
            <div className="write-actions">
              <button type="button" className="btn btn-primary btn-lg" onClick={run} disabled={!text.trim()}>
                <Icon name="check" size={18} strokeWidth={3} /> دقّق الرسالة
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  navigator.clipboard?.writeText(text).catch(() => undefined);
                }}
                disabled={!text.trim()}
              >
                <Icon name="layers" size={18} /> انسخ النص
              </button>
            </div>
          </div>

          <div className="panel write-panel">
            <h2>نتيجة التدقيق</h2>
            {!checked ? (
              <p className="muted">اكتب رسالتك ثم اضغط «دقّق الرسالة» ليفحصها ضاد على {task.checks.length} عناصر.</p>
            ) : (
              <>
                <p className={'write-score' + (all ? ' is-all' : '')}>
                  <Icon name={all ? 'check' : 'info'} size={18} strokeWidth={3} /> اجتزت {passed} من {results.length}
                  {all ? ' — رسالتك مكتملة.' : ' — أصلح ما تبقّى ثم أعد التدقيق.'}
                </p>
                <ul className="check-list">
                  {results.map((r) => (
                    <li key={r.check.id} className={r.passed ? 'is-ok' : 'is-miss'}>
                      <span className="rv-icon">
                        <Icon name={r.passed ? 'check' : 'x'} size={16} strokeWidth={3} />
                      </span>
                      <div>
                        <strong>{r.check.label}</strong>
                        {!r.passed && <p>{r.check.note}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <button type="button" className="btn btn-text" onClick={() => setShowModel((v) => !v)}>
              <Icon name="book" size={18} /> {showModel ? 'أخفِ النموذج' : 'اعرض نموذجًا للمقارنة'}
            </button>
            {showModel && (
              <>
                <pre className="model-mail">{task.model}</pre>
                <ul className="model-notes">
                  {task.notes.map((n) => (
                    <li key={n}>
                      <Icon name="bulb" size={16} /> {n}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
