import { render, updateTimerDisplay, showToast } from './ui.js';
import { Timer } from './timer.js';
import { makeAudioContext, playNamed } from './sound.js';

export class TeamGame {
  constructor(cards){
    this.cards = cards;
    this.cardIndex = 0;
    this.teams = [];
    this.currentTeam = 0;
    this.turnsPerTeam = 1;
    this.audioCtx = makeAudioContext();
    this.timer = null;
    this.skipLockedUntil = 0;
  }

  addTeam(name){ this.teams.push({name,score:0,played:0}); }

  nextCard(){ const c = this.cards[this.cardIndex]; this.cardIndex = (this.cardIndex+1)%this.cards.length; return c; }

  start(timePerTurn, turnsPerTeam){
    this.timePerTurn = timePerTurn;
    this.turnsPerTeam = turnsPerTeam;
    this.teams.forEach(t=>t.played=0);
    this.currentTeam = 0;
    this.showReady();
  }

  showReady(){
    const t = this.teams[this.currentTeam];
    render(`<div class="center-max mx-auto text-center">
      <h2 class="text-2xl font-bold">Vez: <span class="text-indigo-300">${t.name}</span></h2>
      <p class="mt-3">Clique OK quando prontos</p>
      <button id="ok" class="mt-6 w-full py-3 bg-green-600 rounded-xl">OK</button>
    </div>`);
    document.getElementById('ok').onclick = ()=> this.startTurn();
  }

  startTurn(){
    const team = this.teams[this.currentTeam];
    this.currentCard = this.nextCard();
    render(`<div class="center-max mx-auto text-center">
      <div class="text-lg mb-3">Time jogando: <strong>${team.name}</strong></div>
      <div class="mb-4 timer-large">Tempo: <span id="timer">${this.timePerTurn}</span>s</div>
      <div id="cardArea" class="card bg-slate-800 p-6 rounded-xl text-left"></div>
      <div class="mt-4 grid grid-cols-3 gap-2">
        <button id="skipBtn" class="py-3 bg-amber-400 rounded-xl">Pular</button>
        <button id="tabooBtn" class="py-3 bg-red-600 rounded-xl">Taboo</button>
        <button id="correctBtn" class="py-3 bg-emerald-600 rounded-xl">Certo!!!</button>
      </div>
    </div>`);
    this.renderCard();

    document.getElementById('skipBtn').onclick = ()=> this.handleSkip();
    document.getElementById('tabooBtn').onclick = ()=> this.handleTaboo();
    document.getElementById('correctBtn').onclick = ()=> this.handleCorrect();

    this.timer = new Timer(this.timePerTurn, (time)=>{
      updateTimerDisplay(time);
      if(time<=10 && time>0) playNamed(this.audioCtx,'tick');
      if(time===0) playNamed(this.audioCtx,'final');
    }, ()=> this.onTurnEnd());
    this.timer.start();
  }

  renderCard(){ const area = document.getElementById('cardArea'); area.innerHTML = `<h3 class="text-3xl font-bold mb-4">${this.currentCard.palavra}</h3><ul class="taboo-list text-lg">${this.currentCard.tabu.map(t=>`<li>• ${t}</li>`).join('')}</ul>`; }

  handleSkip(){
    const now = Date.now();
    if(now < this.skipLockedUntil){
      showToast('Pulo travado por 10s','error');
      return;
    }
    this.skipLockedUntil = now + 10000;
    this.teams.forEach((t,idx)=> { if(idx!==this.currentTeam) t.score++; });
    playNamed(this.audioCtx,'skip');
    this.currentCard = this.nextCard();
    this.renderCard();
    const btn = document.getElementById('skipBtn');
    if(btn){ btn.disabled=true; let rem=10; const iv=setInterval(()=>{ btn.innerText=`Pular (${rem}s)`; rem--; if(rem<0){ clearInterval(iv); btn.disabled=false; btn.innerText='Pular'; } },1000); }
  }

  handleTaboo(){ this.teams[this.currentTeam].score--; playNamed(this.audioCtx,'taboo'); this.currentCard=this.nextCard(); this.renderCard(); }

  handleCorrect(){ this.teams[this.currentTeam].score++; playNamed(this.audioCtx,'correct'); this.currentCard=this.nextCard(); this.renderCard(); }

  onTurnEnd(){
    this.teams[this.currentTeam].played++;
    if(this.teams.every(t=>t.played>=this.turnsPerTeam)){
      this.showScore();
    } else {
      this.currentTeam = (this.currentTeam+1)%this.teams.length;
      this.showReady();
    }
  }

  showScore(){
    const rows = this.teams.map(t=>`<div class="p-2 flex justify-between"><div>${t.name}</div><div>${t.score}</div></div>`).join('');
    render(`<div class="center-max mx-auto text-center">
      <h2 class="text-2xl font-bold">Placar Final</h2>
      <div class="mt-4 bg-slate-800 rounded p-4">${rows}</div>
      <button id="home" class="mt-6 w-full py-3 bg-blue-600 rounded-xl">Voltar</button>
    </div>`);
    document.getElementById('home').onclick = ()=> window.router.home();
  }
}
