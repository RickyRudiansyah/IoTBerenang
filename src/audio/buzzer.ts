const LEVEL = 0.06;
const HI_HZ = 880;
const LO_HZ = 620;

/**
 * Sirine dua-nada via Web Audio (tanpa file eksternal).
 * Singleton — AppState menyalakan/mematikan, SoundContext mengatur mute.
 */
class Buzzer {
  private ctx: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private gain: GainNode | null = null;
  private sweep: number | null = null;
  private running = false;
  private muted = false;
  private hi = true;

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.gain) this.gain.gain.value = muted ? 0 : LEVEL;
  }

  start() {
    if (this.running) return;
    this.running = true;

    this.ctx ??= new AudioContext();
    void this.ctx.resume();

    this.gain = this.ctx.createGain();
    this.gain.gain.value = this.muted ? 0 : LEVEL;

    this.osc = this.ctx.createOscillator();
    this.osc.type = "square";
    this.osc.frequency.value = HI_HZ;
    this.osc.connect(this.gain).connect(this.ctx.destination);
    this.osc.start();

    this.sweep = window.setInterval(() => {
      if (!this.osc || !this.ctx) return;
      this.hi = !this.hi;
      this.osc.frequency.setValueAtTime(this.hi ? HI_HZ : LO_HZ, this.ctx.currentTime);
    }, 300);
  }

  stop() {
    if (!this.running) return;
    this.running = false;

    if (this.sweep !== null) window.clearInterval(this.sweep);
    this.sweep = null;

    this.osc?.stop();
    this.osc?.disconnect();
    this.gain?.disconnect();
    this.osc = null;
    this.gain = null;
  }
}

export const buzzer = new Buzzer();
