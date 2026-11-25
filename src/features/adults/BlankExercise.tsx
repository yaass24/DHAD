import { useEffect, useRef, useState } from 'react';
import type { Blank } from '../../types';
import { blankMatches, normalizeArabic } from '../../data';
import { Icon } from '../../components/Icon';
import { playSound } from '../../utils/sound';

export type BlankResult = 'correct' | 'assisted' | 'revealed';

/**
 * A typed blank: the learner writes the word in its correct form.
 * Wrong forms that are predictable get their own note; the rule is shown once solved.
 */
export function BlankExercise({ blank, solved, onSolve }: { blank: Blank; solved: BlankResult | null; onSolve: (r: BlankResult) => void }) {
  const [value, setValue] = useState('');
  const [tries, setTries] = useState(0);
  const [miss, setMiss] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue('');
    setTries(0);
    setMiss(null);
    setShowHint(false);
    if (!solved) inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blank.sentence]);

  const [before, after] = blank.sentence.split('____');
  const answer = blank.accept[0];

  function submit(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (solved || !value.trim()) return;
    if (blankMatches(blank.accept, value)) {
      playSound('correct');
      onSolve(showHint || tries > 0 ? 'assisted' : 'correct');
      return;
    }
    playSound('incorrect');
    const typed = normalizeArabic(value);
    const known = blank.misses?.find((m) => normalizeArabic(m.answer) === typed);
    setMiss(known ? known.note : 'ليست هذه الصيغة. انظر في موقع الكلمة من الجملة: أهي مرفوعة أم منصوبة أم مجرورة؟');
    setTries((t) => t + 1);
    inputRef.current?.select();
  }

  return (
    <div className="blank-box">
      <p className="blank-sentence" aria-label={`الجملة: ${before} فراغ ${after}`}>
        <span>{before}</span>
        <span className={'blank-slot' + (solved ? ' is-solved' : '')}>{solved ? (solved === 'revealed' ? answer : normalizeArabic(value) ? value : answer) : '____'}</span>
        <span>{after}</span>
      </p>

      {!solved && (
        <form onSubmit={submit} className="blank-form">
          <label className="sr-only" htmlFor="blank-input">
            اكتب الكلمة الناقصة
          </label>
          <input
            id="blank-input"
            ref={inputRef}
            className="blank-input"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setMiss(null);
            }}
            placeholder="اكتب الكلمة هنا"
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="done"
          />
          <button type="submit" className="btn btn-primary" disabled={!value.trim()}>
            تحقّق <Icon name="check" size={18} strokeWidth={3} />
          </button>
        </form>
      )}

      {!solved && miss && (
        <p className="blank-miss" role="status">
          <Icon name="x" size={16} strokeWidth={3} /> {miss}
        </p>
      )}

      {!solved && (
        <div className="blank-help">
          {showHint ? (
            <p className="blank-hint">
              <Icon name="bulb" size={16} /> {blank.hint}
            </p>
          ) : (
            <button type="button" className="btn btn-text" onClick={() => setShowHint(true)}>
              <Icon name="bulb" size={16} /> تلميح
            </button>
          )}
          {tries >= 2 && (
            <button
              type="button"
              className="btn btn-text"
              onClick={() => {
                playSound('click');
                onSolve('revealed');
              }}
            >
              اعرض الإجابة
            </button>
          )}
        </div>
      )}
    </div>
  );
}
