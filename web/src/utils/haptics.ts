class HapticService {
  private audioCtx: AudioContext | null = null;

  trigger(type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error') {
    // 1. Physical vibration for supporting platforms (Android/PWA)
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      const patterns = {
        light: 8,
        medium: 15,
        heavy: 30,
        success: [10, 30, 10],
        warning: [20, 40, 20],
        error: [50, 70, 50]
      };
      try {
        navigator.vibrate(patterns[type]);
      } catch (e) {
        // Ignored
      }
    }

    // 2. iPhone / iOS Acoustic Haptics (synthesize low frequency transient)
    try {
      if (typeof window !== 'undefined') {
        if (!this.audioCtx) {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            this.audioCtx = new AudioContextClass();
          }
        }

        const ctx = this.audioCtx;
        if (ctx && ctx.state !== 'closed') {
          if (ctx.state === 'suspended') {
            ctx.resume();
          }

          const now = ctx.currentTime;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.connect(gain);
          gain.connect(ctx.destination);

          if (type === 'light') {
            osc.frequency.setValueAtTime(60, now); // Low frequency thud
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.9, now + 0.002);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);
            osc.start(now);
            osc.stop(now + 0.015);
          } else if (type === 'medium') {
            osc.frequency.setValueAtTime(70, now);
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(1.0, now + 0.002);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);
            osc.start(now);
            osc.stop(now + 0.02);
          } else if (type === 'heavy') {
            osc.frequency.setValueAtTime(80, now);
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(1.0, now + 0.003);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
            osc.start(now);
            osc.stop(now + 0.035);
          } else if (type === 'success') {
            // Two rapid light taps
            osc.frequency.setValueAtTime(65, now);
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.8, now + 0.002);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);
            osc.start(now);
            osc.stop(now + 0.015);

            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.frequency.setValueAtTime(75, now + 0.08);
            gain2.gain.setValueAtTime(0, now + 0.08);
            gain2.gain.linearRampToValueAtTime(0.8, now + 0.082);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.092);
            osc2.start(now + 0.08);
            osc2.stop(now + 0.1);
          } else if (type === 'warning') {
            // Sliding frequencies
            osc.frequency.setValueAtTime(100, now);
            osc.frequency.linearRampToValueAtTime(50, now + 0.1);
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.6, now + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
          } else if (type === 'error') {
            // Three rapid descending buzzes
            [0, 0.06, 0.12].forEach((offset, idx) => {
              const o = ctx.createOscillator();
              const g = ctx.createGain();
              o.connect(g);
              g.connect(ctx.destination);
              o.frequency.setValueAtTime(55 - idx * 5, now + offset);
              g.gain.setValueAtTime(0, now + offset);
              g.gain.linearRampToValueAtTime(0.8, now + offset + 0.002);
              g.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.04);
              o.start(now + offset);
              o.stop(now + offset + 0.045);
            });
          }
        }
      }
    } catch (e) {
      // Ignored
    }
  }
}

export const haptic = new HapticService();
