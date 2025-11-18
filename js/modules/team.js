import { Database } from './database.js';
import { render, playSound, updateTimerDisplay } from './ui.js';
import { Timer } from './timer.js';

export class TeamController {
  constructor(){
    this.teams = [];
    this.currentTeamIndex = 0;
    this.turnsPerTeam = 1;
    this.cards = Database.getAll();
    this.cardIndex = 0;
    this.timer = null;
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.skipLockedUntil = 0;
  }

  addTeam(name){
    this.teams.push({name: name, score: 0, played:0});
  }

  nextCard(){
    const card = this.cards[this.cardIndex];
    this.cardIndex = (this.cardIndex + 1) % this.cards.length;
    return card;
  }

  startGame(timePerTurn, turnsPerTeam){
    this.turnsPerTeam = turnsPerTeam;
    this.teams.forEach(t => { t.played = 0; });
    this.currentTeamIndex = 0;
    this.timePerTurn = timePerTurn;
    this.showReadyScreen();
  }

  showReadyScreen(){
    const team = this.teams[this.currentTeamIndex];
    render(`<div class="max-w-md mx-auto text-center">
      <h2 class="text-2xl font-bold">É a vez do time "${team.name}"</h2>
      <p class="mt-3">Clique em OK quando estiverem prontos</p>
      <button id="okBtn" class="mt-6 w-full py-3 bg-green-600 rounded-xl">OK, começar</button>
      <button id="cancelBtn" class="mt-2 w-full py-2 bg-gray-700 rounded-xl">Cancelar</button>
    </div>`);
    document.getElementById('okBtn').onclick = ()=> this.startTurn();
    document.getElementById('cancelBtn').onclick = ()=> window.router.teamConfig();
  }

  startTurn(){
    const team = this.teams[this.currentTeamIndex];
    render(`<div class="max-w-md mx-auto text-center">
      <div class="text-lg mb-3">Time jogando: <strong>${team.name}</strong></div>
      <div class="mb-4 timer-large">Tempo: <span id="timer">${this.timePerTurn}</span>s</div>
      <div id="cardArea" class="card bg-gray-800 p-6 rounded-xl text-left"></div>

      <div class="mt-4 grid grid-cols-3 gap-2">
        <button id="skipBtn" class="py-3 bg-yellow-500 rounded-xl">Pular</button>
        <button id="tabooBtn" class="py-3 bg-red-600 rounded-xl">Taboo</button>
        <button id="correctBtn" class="py-3 bg-green-600 rounded-xl">Certo!!!</button>
      </div>
    </div>`);

    this.currentCard = this.nextCard();
    this.renderCard();

    document.getElementById('skipBtn').onclick = ()=> this.handleSkip();
    document.getElementById('tabooBtn').onclick = ()=> this.handleTaboo();
    document.getElementById('correctBtn').onclick = ()=> this.handleCorrect();

    this.timer = new Timer(this.timePerTurn, (time)=> {
      updateTimerDisplay(time);
      if(time <= 10 && time > 0){
        playSound('tick', this.audioCtx);
      }
      if(time === 0){
        playSound('final', this.audioCtx);
      }
    }, ()=> {
      this.teams[this.currentTeamIndex].played++;
      if(this.allTeamsFinished()){
        this.showFinalScore();
      } else {
        this.currentTeamIndex = (this.currentTeamIndex + 1) % this.teams.length;
        this.showReadyScreen();
      }
    });
    this.timer.start();
  }

  renderCard(){
    const area = document.getElementById('cardArea');
    area.innerHTML = `<h3 class="text-3xl font-bold mb-4">${this.currentCard.palavra}</h3>
      <ul class="taboo-list text-lg">${this.currentCard.tabu.map(t=>`<li>• ${t}</li>`).join('')}</ul>`;
  }

  handleSkip(){
    const now = Date.now();
    if(now < this.skipLockedUntil) return;
    this.skipLockedUntil = now + 10000;
    this.teams.forEach((t, idx)=> { if(idx !== this.currentTeamIndex) t.score++; });
    playSound('skip', this.audioCtx);
    this.currentCard = this.nextCard();
    this.renderCard();
    const btn = document.getElementById('skipBtn');
    if(btn){
      btn.disabled = true;
      let remaining = 10;
      const iv = setInterval(()=> {
        btn.innerText = `Pular (${remaining}s)`;
        remaining--;
        if(remaining < 0){ clearInterval(iv); btn.disabled = false; btn.innerText = 'Pular'; }
      },1000);
    }
  }

  handleTaboo(){
    this.teams[this.currentTeamIndex].score--;
    playSound('taboo', this.audioCtx);
    this.currentCard = this.nextCard();
    this.renderCard();
  }

  handleCorrect(){
    this.teams[this.currentTeamIndex].score++;
    playSound('correct', this.audioCtx);
    this.currentCard = this.nextCard();
    this.renderCard();
  }

  allTeamsFinished(){
    return this.teams.every(t => t.played >= this.turnsPerTeam);
  }

  showFinalScore(){
    const rows = this.teams.map(t=> `<div class="p-2 flex justify-between"><div>${t.name}</div><div>${t.score}</div></div>`).join('');
    render(`<div class="max-w-md mx-auto text-center">
      <h2 class="text-2xl font-bold">Placar Final</h2>
      <div class="mt-4 bg-gray-800 rounded p-4">${rows}</div>
      <button id="homeBtn" class="mt-6 w-full py-3 bg-blue-600 rounded-xl">Voltar ao Início</button>
    </div>`);
    document.getElementById('homeBtn').onclick = ()=> window.router.home();
  }
}
