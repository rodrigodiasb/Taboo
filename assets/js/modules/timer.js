export const Timer = {
  timeLeft: 0,
  interval: null,
  callbackEnd: null,

  start(seconds, onEnd) {
    this.stop();

    this.timeLeft = seconds;
    this.callbackEnd = onEnd;

    const el = document.getElementById("global-timer");
    el.classList.remove("hidden");
    el.textContent = this.timeLeft;

    this.interval = setInterval(() => {
      this.timeLeft--;
      el.textContent = this.timeLeft;

      // Contagem regressiva tensa nos últimos 5 segundos
      if (this.timeLeft <= 5) {
        el.classList.add("animate-pulse");
      }

      if (this.timeLeft <= 0) {
        this.stop();
        el.classList.add("hidden");
        if (this.callbackEnd) this.callbackEnd();
      }

    }, 1000);
  },

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
};
