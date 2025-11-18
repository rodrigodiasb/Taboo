export const Sound = {
  beep() {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    osc.frequency.value = 900;
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  },

  end() {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    osc.frequency.value = 300;
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  }
};
