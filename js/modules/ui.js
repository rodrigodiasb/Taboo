export function render(html){
  document.getElementById('app').innerHTML = html;
}

export function updateTimerDisplay(v){
  const el = document.getElementById('timer');
  if(el) el.innerText = v;
}

export function playSound(type, audioCtx){
  if(!audioCtx) return;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.connect(g); g.connect(audioCtx.destination);
  if(type === 'next'){ o.frequency.value = 880; g.gain.value = 0.03; o.start(); o.stop(audioCtx.currentTime + 0.08); }
  if(type === 'taboo'){ o.frequency.value = 120; g.gain.value = 0.08; o.start(); o.stop(audioCtx.currentTime + 0.45); }
  if(type === 'correct'){ o.frequency.value = 1320; g.gain.value = 0.04; o.start(); o.stop(audioCtx.currentTime + 0.18); }
  if(type === 'skip'){ o.frequency.value = 660; g.gain.value = 0.02; o.start(); o.stop(audioCtx.currentTime + 0.08); }
  if(type === 'final'){ o.frequency.value = 220; g.gain.value = 0.12; o.start(); o.stop(audioCtx.currentTime + 1.2); }
  if(type === 'tick'){ o.frequency.value = 1000; g.gain.value = 0.02; o.start(); o.stop(audioCtx.currentTime + 0.06); }
}
