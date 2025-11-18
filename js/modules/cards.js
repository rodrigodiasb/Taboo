import { Database } from './database.js';
import { render, updateTimerDisplay, playSound } from './ui.js';
import { Timer } from './timer.js';

export class CardController {
  constructor(opts){
    this.mode = opts.mode || 'sequential';
    this.cards = Database.getAll();
    this.index = 0;
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.timer = null;
  }

  nextCard(){
    if(this.mode === 'random'){
      this.index = Math.floor(Math.random() * this.cards.length);
    } else {
      this.index = (this.index + 1) % this.cards.length;
    }
    return this.cards[this.index];
  }

  currentCard(){
    return this.cards[this.index];
  }

  showFreeScreen(tempo){
    let card = this.cards[this.index];
    render(`<div class="max-w-md mx-auto text-center">
      <div class="mb-4 timer-large">Tempo: <span id="timer">${tempo}</span>s</div>
      <div class="card bg-gray-800 p-6 rounded-xl text-left">
        <h3 class="text-4xl font-bold mb-4">${card.palavra}</h3>
        <ul class="taboo-list text-lg">
          ${card.tabu.map(t => `<li>• ${t}</li>`).join('')}
        </ul>
      </div>

      <div class="mt-6 space-y-3">
        <button id="nextBtn" class="w-full py-3 bg-blue-600 rounded-xl text-xl">Próxima Palavra</button>
        <button id="homeBtn" class="w-full py-3 bg-gray-700 rounded-xl text-xl">Encerrar</button>
      </div>
    </div>`);

    document.getElementById('nextBtn').onclick = () => {
      playSound('next', this.audioCtx);
      this.nextCard();
      this.showFreeScreen(this.timer ? this.timer.time : tempo);
    };
    document.getElementById('homeBtn').onclick = () => {
      if(this.timer) this.timer.stop();
      window.router.home();
    };

    if(!this.timer){
      const t = new Timer(tempo, (time)=> {
        if(time >= 0) updateTimerDisplay(time);
        if(time <= 10 && time > 0){
          playSound('tick', this.audioCtx);
        }
        if(time === 0){
          playSound('final', this.audioCtx);
        }
      }, ()=> window.router.home());
      this.timer = t;
      t.start();
    }
  }
}
