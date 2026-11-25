import { Link } from '../utils/router';
import { useState } from 'react';
import { useDispatch, useGame, type MotionPref } from '../state/store';
import { KIDS_LEVEL_HINT, ADULTS_LEVEL_HINT } from '../data';
import { PageHeader } from '../components/PageHeader';
import { LevelSelector } from '../components/LevelSelector';
import { Modal } from '../components/Modal';
import { Icon } from '../components/Icon';
import { playSound } from '../utils/sound';

export function Settings() {
  const s = useGame();
  const dispatch = useDispatch();
  const [confirm, setConfirm] = useState(false);
  const [done, setDone] = useState(false);
  return (
    <>
      <PageHeader title="الإعدادات" lead="تُحفظ إعداداتك على هذا الجهاز تلقائيًا." back="/" backLabel="الرئيسية" />
      <section className="section">
        <div className="container settings">
          <div className="panel">
            <h2>
              <Icon name="volume" /> الصوت
            </h2>
            <label className="switch-row">
              <input type="checkbox" checked={s.sound.enabled} onChange={(e) => dispatch({ type: 'setSound', enabled: e.target.checked })} />
              <span className="switch" aria-hidden="true" />
              <span>المؤثرات الصوتية {s.sound.enabled ? 'مفعّلة' : 'مكتومة'}</span>
            </label>
            <label className="range-row">
              <span>مستوى الصوت</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={s.sound.volume}
                disabled={!s.sound.enabled}
                onChange={(e) => dispatch({ type: 'setSound', volume: parseFloat(e.target.value) })}
                aria-valuetext={`${Math.round(s.sound.volume * 100)}%`}
              />
              <b>{Math.round(s.sound.volume * 100)}%</b>
            </label>
            <div className="btn-row">
              <button type="button" className="btn btn-outline btn-sm" onClick={() => playSound('correct')} disabled={!s.sound.enabled}>
                جرّب صوت الإجابة الصحيحة
              </button>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => playSound('incorrect')} disabled={!s.sound.enabled}>
                جرّب صوت المحاولة
              </button>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => playSound('complete')} disabled={!s.sound.enabled}>
                جرّب صوت الإكمال
              </button>
            </div>
            <p className="muted small">لا تُشغَّل الأصوات تلقائيًا، بل بعد تفاعلك فقط.</p>
          </div>

          <div className="panel">
            <h2>
              <Icon name="sparkle" /> الحركة
            </h2>
            <fieldset className="radio-list">
              <legend className="sr-only">تفضيل الحركة</legend>
              {(
                [
                  ['system', 'حسب إعدادات الجهاز'],
                  ['reduce', 'تقليل الحركة'],
                  ['full', 'حركة كاملة'],
                ] as [MotionPref, string][]
              ).map(([v, label]) => (
                <label key={v}>
                  <input type="radio" name="motion" checked={s.motion === v} onChange={() => dispatch({ type: 'setMotion', motion: v })} /> {label}
                </label>
              ))}
            </fieldset>
          </div>

          <div className="panel">
            <h2>
              <Icon name="layers" /> المستوى المفضّل
            </h2>
            <h3 className="h-small">حكايات ضاد</h3>
            <LevelSelector name="set-kids" value={s.kidsLevel} hints={KIDS_LEVEL_HINT} onChange={(level) => dispatch({ type: 'setLevel', audience: 'kids', level })} />
            <h3 className="h-small">التدريبات النحوية (للكبار)</h3>
            <LevelSelector name="set-adults" value={s.adultsLevel} hints={ADULTS_LEVEL_HINT} onChange={(level) => dispatch({ type: 'setLevel', audience: 'adults', level })} />
          </div>

          <div className="panel danger">
            <h2>
              <Icon name="trash" /> إعادة ضبط التقدّم
            </h2>
            <p>يمسح الحكايات والتدريبات المكتملة، والنقاط، والإنجازات، والمشهد المحفوظ. تبقى إعدادات الصوت والحركة كما هي.</p>
            <button type="button" className="btn btn-danger" onClick={() => setConfirm(true)}>
              إعادة ضبط التقدّم
            </button>
            <p role="status" className="muted">
              {done ? 'تمت إعادة ضبط التقدّم.' : ''}
            </p>
          </div>

          <nav className="panel settings-more" aria-label="روابط أخرى">
            <Link to="/how" className="more-link">
              <Icon name="help" /> كيف نلعب؟ <Icon name="next" size={16} />
            </Link>
            <Link to="/about" className="more-link">
              <Icon name="info" /> عن ضاد <Icon name="next" size={16} />
            </Link>
          </nav>
        </div>
      </section>
      <Modal
        open={confirm}
        title="هل تريد إعادة ضبط تقدّمك؟"
        onClose={() => setConfirm(false)}
        actions={
          <>
            <button type="button" className="btn btn-outline" onClick={() => setConfirm(false)}>
              إلغاء
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                dispatch({ type: 'reset' });
                setConfirm(false);
                setDone(true);
              }}
            >
              نعم، امسح التقدّم
            </button>
          </>
        }
      >
        <p>
          ستفقد {s.points} نقطة، وكل الحكايات والتدريبات المكتملة، و{Object.keys(s.achievements).length} إنجازات. لا يمكن التراجع عن هذه الخطوة.
        </p>
      </Modal>
    </>
  );
}
