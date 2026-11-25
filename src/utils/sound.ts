/**
 * Original sound effects synthesised with the Web Audio API (no audio files, no licensing issues).
 * The AudioContext is created lazily on the first user gesture, respecting autoplay rules.
 */
export type SoundName = 'correct' | 'incorrect' | 'transition' | 'click' | 'complete' | 'achievement';

let ctx: AudioContext | null = null;
let enabled = true;
let volume = 0.6;

export function configureSound(opts: { enabled: boolean; volume: number }) {
  enabled = opts.enabled;
  volume = opts.volume;
}

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(ac: AudioContext, freq: number, start: number, dur: number, type: OscillatorType, gain: number, endFreq?: number) {
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, start + dur);
  const peak = gain * volume * 0.35;
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), start + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  osc.connect(g).connect(ac.destination);
  osc.start(start);
  osc.stop(start + dur + 0.02);
}

function whoosh(ac: AudioContext, start: number) {
  const len = Math.floor(ac.sampleRate * 0.35);
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ac.createBufferSource();
  src.buffer = buf;
  const filter = ac.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(400, start);
  filter.frequency.exponentialRampToValueAtTime(2200, start + 0.3);
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(0.12 * volume, start + 0.08);
  g.gain.exponentialRampToValueAtTime(0.0001, start + 0.34);
  src.connect(filter).connect(g).connect(ac.destination);
  src.start(start);
}

export function playSound(name: SoundName) {
  if (!enabled || volume <= 0) return;
  const ac = getCtx();
  if (!ac) return;
  const t = ac.currentTime + 0.01;
  switch (name) {
    case 'click':
      tone(ac, 660, t, 0.07, 'triangle', 0.5);
      break;
    case 'correct':
      [523.25, 659.25, 783.99].forEach((f, i) => tone(ac, f, t + i * 0.09, 0.22, 'triangle', 0.8));
      tone(ac, 1046.5, t + 0.27, 0.35, 'sine', 0.5);
      break;
    case 'incorrect':
      tone(ac, 330, t, 0.16, 'sine', 0.55, 300);
      tone(ac, 262, t + 0.15, 0.24, 'sine', 0.5, 250);
      break;
    case 'transition':
      whoosh(ac, t);
      break;
    case 'complete':
      [392, 523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(ac, f, t + i * 0.11, 0.3, 'triangle', 0.7));
      tone(ac, 783.99, t + 0.6, 0.6, 'sine', 0.45);
      tone(ac, 1046.5, t + 0.6, 0.7, 'sine', 0.45);
      break;
    case 'achievement':
      [1318.5, 1568, 2093].forEach((f, i) => tone(ac, f, t + i * 0.07, 0.25, 'sine', 0.45));
      break;
  }
}
