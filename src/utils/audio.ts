// Simple synthesizer for UI sounds using Web Audio API
// No external assets required.

let audioCtx: AudioContext | null = null;

const getContext = () => {
  if (!audioCtx && typeof window !== 'undefined') {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

const createOscillator = (ctx: AudioContext, type: OscillatorType, freq: number) => {
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  return osc;
};

const createGain = (ctx: AudioContext, startVol: number = 1) => {
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(startVol, ctx.currentTime);
  return gain;
};

export const playHoverSound = () => {
  const ctx = getContext();
  if (!ctx) return;

  // High pitched digital blip
  const osc = createOscillator(ctx, 'sine', 800);
  const gain = createGain(ctx, 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
  osc.stop(ctx.currentTime + 0.1);
};

export const playClickSound = () => {
  const ctx = getContext();
  if (!ctx) return;

  // Deeper "select" thud with a bit of noise/sawtooth
  const osc = createOscillator(ctx, 'triangle', 150);
  const gain = createGain(ctx, 0.1);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
  osc.stop(ctx.currentTime + 0.15);
};

export const playSwitchSound = () => {
  const ctx = getContext();
  if (!ctx) return;

  // Mechanical switch sound
  const osc = createOscillator(ctx, 'square', 2000);
  const gain = createGain(ctx, 0.02);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
  osc.stop(ctx.currentTime + 0.05);
};

export const playGlitchSound = () => {
  const ctx = getContext();
  if (!ctx) return;

  // Random noise burst
  const bufferSize = ctx.sampleRate * 0.1; // 0.1 seconds
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const gain = createGain(ctx, 0.05);

  noise.connect(gain);
  gain.connect(ctx.destination);
  noise.start();
};

export const playGunshotSound = () => {
  const ctx = getContext();
  if (!ctx) return;

  // 1. Noise Burst (The "Crack")
  const bufferSize = ctx.sampleRate * 0.2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2); // Decay
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  
  const noiseGain = createGain(ctx, 0.3);
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'lowpass';
  noiseFilter.frequency.value = 1000;

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start();

  // 2. Low Frequency Impact (The "Thump")
  const osc = createOscillator(ctx, 'triangle', 100);
  const oscGain = createGain(ctx, 0.3);
  
  osc.connect(oscGain);
  oscGain.connect(ctx.destination);

  osc.start();
  osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.3);
  oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  osc.stop(ctx.currentTime + 0.3);
};
