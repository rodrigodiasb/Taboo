import { render, updateTimerDisplay } from './ui.js';
import { Timer } from './timer.js';
import { makeAudioContext, playNamed } from './sound.js';

export class Game {
  constructor(cards, options={mode:'sequential'}){
    this.cards = cards;
    this.index = 0;
    this.mode = options.mode || 'sequential';
    this.audioCtx = makeAudioContext();
    this.timer = null;
  }

  current(){ return this.cards[this.index]; }

  nextIndex(){
    if(this.mode === 'random'){
      this.index = Math.floor(Math.random() * this.cards.length);
    } else {
      this.index = (this.index + 1) % this.cards.length;
    }
  }

  startFree(tempo){
    const card = this.current();
    render(`<div class="center-max mx-auto text-center">
      <div class="mb-4 timer-large">Tempo: <span id="timer">${tempo}</span>s</div>
      <div class="card bg-slate-800 p-6 rounded-xl text-left">
        <h3 class="text-4xl font-bold mb-4">${card.palavra}</h3>
        <ul class="taboo-list text-lg">${card.tabu.map(t=>`<li>• ${t}</li>`).join('')}</ul>
      </div>

      <div class="mt-6 space-y-3">
        <button id="nextBtn" class="w-full py-3 bg-blue-600 rounded-xl text-xl">Próxima Palavra</button>
        <button id="endBtn" class="w-full py-3 bg-gray-700 rounded-xl text-xl">Encerrar</button>
      </div>
    </div>`);

    document.getElementById('nextBtn').onclick = ()=> {
      playNamed(this.audioCtx,'next');
      this.nextIndex();
      this.startFree(this.timer ? this.timer.time : tempo);
    };
    document.getElementById('endBtn').onclick = ()=> {
      if(this.timer) this.timer.stop();
      window.router.home();
    };

    if(!this.timer){
      this.timer = new Timer(tempo, (time)=> {
        updateTimerDisplay(time);
        if(time <= 10 && time > 0){
          playNamed(this.audioCtx,'tick');
        }
        if(time === 0) playNamed(this.audioCtx,'final');
      }, ()=> window.router.home());
      this.timer.start();
    }
  }
}
