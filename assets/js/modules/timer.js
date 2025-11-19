import { Sound } from "./sound.js";

export const Timer = {
  interval: null,

  start(el, seconds, onFinish) {
    let time = seconds;
    el.textContent = time;

    clearInterval(this.interval);

    this.interval = setInterval(() => {
      time--;
      el.textContent = time;

      if (time <= 10 && time > 0) Sound.beep();

      if (time <= 0) {
        Sound.end();
        clearInterval(this.interval);
        onFinish();
      }
    }, 1000);
  }
};
