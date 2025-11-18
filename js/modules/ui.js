export function render(html){
  document.getElementById('app').innerHTML = html;
}
export function updateTimerDisplay(v){
  const el = document.getElementById('timer');
  if(el) el.innerText = v;
}
export function showToast(msg, type='info'){
  let el = document.getElementById('tf-toast');
  if(!el){
    el = document.createElement('div');
    el.id = 'tf-toast';
    el.style.position = 'fixed';
    el.style.bottom = '18px';
    el.style.left = '50%';
    el.style.transform = 'translateX(-50%)';
    el.style.padding = '10px 14px';
    el.style.borderRadius = '10px';
    el.style.zIndex = 60;
    document.body.appendChild(el);
  }
  el.innerText = msg;
  el.style.background = type==='error'?'#b91c1c':'#064e3b';
  el.style.opacity = '1';
  setTimeout(()=> el.style.opacity='0', 1800);
}
