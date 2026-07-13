let audioCtx: AudioContext | null = null;

function getCtx() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new Ctx();
  }
  return audioCtx;
}

export function resumeAudio() {
  try {
    const ctx = getCtx();
    if (ctx.state === 'suspended') void ctx.resume();
  } catch { /* sound must never block the game */ }
}

function tone(freq: number, duration: number, options: {
  type?: OscillatorType; gain?: number; end?: number; delay?: number;
} = {}) {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime + (options.delay ?? 0);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = options.type ?? 'sine';
    osc.frequency.setValueAtTime(freq, now);
    if (options.end) osc.frequency.exponentialRampToValueAtTime(options.end, now + duration);
    gain.gain.setValueAtTime(options.gain ?? 0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  } catch { /* ignore */ }
}

export function playStart() {
  tone(440, 0.09, { gain: 0.07 });
  tone(660, 0.09, { gain: 0.06, delay: 0.13 });
}

export function playClick() {
  tone(620, 0.055, { type: 'triangle', gain: 0.035, end: 420 });
}

export function playPositive() {
  tone(520, 0.07, { gain: 0.045 });
  tone(660, 0.07, { gain: 0.04, delay: 0.105 });
  tone(820, 0.07, { gain: 0.035, delay: 0.21 });
}

export function playNegative() {
  tone(180, 0.18, { type: 'sawtooth', gain: 0.045, end: 95 });
}

export function playMidpoint() {
  tone(120, 0.7, { gain: 0.05, end: 360 });
  tone(1600, 0.08, { type: 'triangle', gain: 0.012, delay: 0.42 });
}

export function playCrisisPulse() {
  tone(72, 0.16, { gain: 0.025 });
}

export function playWin() {
  [392, 523, 659, 784].forEach((freq, index) => tone(freq, 0.13, { gain: 0.06, delay: index * 0.185 }));
}

export function playLose() {
  [220, 174, 110].forEach((freq, index) => tone(freq, 0.18, { type: 'triangle', gain: 0.055, delay: index * 0.25 }));
}
