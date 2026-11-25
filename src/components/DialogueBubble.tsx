import type { CSSProperties, ReactNode } from 'react';

const BLANK = '____';

/** Renders a line of dialogue, replacing ____ with an empty slot or the chosen word. */
export function DialogueText({ text, filled, state }: { text: string; filled?: string | null; state?: 'idle' | 'correct' | 'wrong' }) {
  const [before, after] = text.split(BLANK);
  if (after === undefined) return <>{text}</>;
  return (
    <>
      {before}
      <span className={'blank blank-' + (state ?? 'idle')} aria-label={filled ? undefined : 'كلمة ناقصة'}>
        {filled ?? '      '}
      </span>
      {after}
    </>
  );
}

/**
 * Places the bubble over the scene so its tail points at the speaker.
 * speakerX is the speaker's position in the 800-wide scene. Bubbles move aside for tall (adult) speakers
 * so they never cover the speaker's face.
 */
export function bubblePlacement(speakerX: number, tall: boolean) {
  const W = 58;
  const sx = (speakerX / 800) * 100;
  let center = tall ? sx + (sx < 50 ? 31 : -31) : sx;
  center = Math.min(100 - W / 2 - 2, Math.max(W / 2 + 2, center));
  const tail = Math.min(90, Math.max(10, 50 + ((sx - center) / W) * 100));
  return { '--bx': center + '%', '--tail': tail + '%', '--sx': sx + '%' } as CSSProperties;
}

export function DialogueBubble({ speaker, placement, children, avatar, tone = 'kids' }: { speaker: string; placement?: CSSProperties; children: ReactNode; avatar?: ReactNode; tone?: 'kids' | 'adults' }) {
  return (
    <div className={`bubble bubble-${tone}`} style={placement}>
      <div className="bubble-head">
        {avatar}
        <span className="bubble-speaker">{speaker}</span>
      </div>
      <p className="bubble-text">{children}</p>
    </div>
  );
}
