export function makeAudioContext(){
  try{
    const c = new (window.AudioContext || window.webkitAudioContext)();
    return c;
  }catch(e){ return null; }
}
export function playTone(audioCtx, freq=440, duration=0.1, gain=0.03){
  if(!audioCtx) return;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.connect(g); g.connect(audioCtx.destination);
  o.frequency.value = freq;
  g.gain.value = gain;
  o.start();
  o.stop(audioCtx.currentTime + duration);
}
export function playNamed(audioCtx, type){
  if(!audioCtx) return;
  if(type==='next') playTone(audioCtx,880,0.08,0.03);
  if(type==='taboo') playTone(audioCtx,120,0.45,0.08);
  if(type==='correct') playTone(audioCtx,1320,0.18,0.04);
  if(type==='skip') playTone(audioCtx,660,0.08,0.02);
  if(type==='final') playTone(audioCtx,220,1.2,0.12);
  if(type==='tick') playTone(audioCtx,1000,0.06,0.02);
}
