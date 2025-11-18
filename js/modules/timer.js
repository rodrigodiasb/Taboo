export class Timer {
  constructor(duration, onTick, onFinish){
    this.duration = duration;
    this.time = duration;
    this.onTick = onTick;
    this.onFinish = onFinish;
    this.interval = null;
  }
  start(){
    if(this.interval) clearInterval(this.interval);
    this.interval = setInterval(()=> {
      this.time--;
      this.onTick(this.time);
      if(this.time <= 0){
        clearInterval(this.interval);
        this.onFinish();
      }
    },1000);
  }
  stop(){ if(this.interval) clearInterval(this.interval); this.interval=null; }
}
