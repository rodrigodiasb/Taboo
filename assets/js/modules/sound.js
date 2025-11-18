export const Sound = {
  beep() { /* igual antes */ },
  end() { /* igual antes */ },

  pular() {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    osc.frequency.value = 600;
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  },

  taboo() {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    osc.frequency.value = 200;
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  },

  acerto() {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    osc.frequency.value = 1000;
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  }
};
