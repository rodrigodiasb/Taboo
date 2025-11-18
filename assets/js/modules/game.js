import { Timer } from "./timer.js";
import { UI } from "./ui.js";

export const Game = {
  settings: {
    time: 60,
    turnos: 6
  },

  words: [],
  current: null,

  async loadWords() {
    const res = await fetch("assets/data/words.json");
    this.words = await res.json();
  },

  async startLivre() {
    await this.loadWords();
    this.nextCard();
  },

  async startTeams() {
    await this.loadWords();
    alert("Modo equipes em desenvolvimento (já posso montar o layout se quiser)");
  },

  nextCard() {
    this.current = this.words[Math.floor(Math.random() * this.words.length)];
    this.showCard();
  },

  showCard() {
    UI.app.innerHTML = `
      <div class="card">
        <h2 class="text-3xl font-bold text-center mb-4">${this.current.palavra}</h2>

        <div class="bg-slate-700 p-3 rounded mb-4">
          <h3 class="font-semibold mb-2">Palavras proibidas:</h3>
          <ul class="space-y-1">
            ${this.current.tabus.map(t => `<li>• ${t}</li>`).join("")}
          </ul>
        </div>

        <div id="timer" class="text-center text-2xl font-bold mb-4"></div>

        <div class="flex justify-between">
          <div class="btn bg-rose-600" id="btnErrar">Erro</div>
          <div class="btn bg-emerald-600" id="btnAcerto">Acerto</div>
        </div>
      </div>
    `;

    Timer.start(document.getElementById("timer"), this.settings.time, () => {
      UI.loadHomeScreen();
    });

    document.getElementById("btnErrar").onclick = () => this.nextCard();
    document.getElementById("btnAcerto").onclick = () => this.nextCard();
  }
};
