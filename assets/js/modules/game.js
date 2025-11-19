import { Timer } from "./timer.js";
import { UI, UIEffects } from "./ui.js";
import { Sound } from "./sound.js";

export const Game = {
  settings: {
    time: 60,
    turnos: 3
  },

  words: [],
  current: null,

  teams: [],
  currentTeamIndex: 0,

  async loadWords() {
    const res = await fetch("assets/data/words.json");
    this.words = await res.json();
  },

  async startLivre() {
    await this.loadWords();
    this.nextCardLivre();
  },

  async startTeams() {
    await this.loadWords();

    this.currentTeamIndex = 0;

    // Define turnos de cada time
    this.teams.forEach(t => t.turnsLeft = this.settings.turnos);

    this.turnStartScreen();
  },

  turnStartScreen() {
    const team = this.teams[this.currentTeamIndex];

    document.getElementById("app").innerHTML = `
      <div class="card text-center">
        <h2 class="text-xl mb-4">Próxima equipe:</h2>
        <h1 class="text-3xl font-bold mb-6">${team.name}</h1>

        <p class="mb-4">Clique quando estiverem prontos!</p>

        <div class="btn bg-emerald-600" id="btnOK">OK, começar</div>
      </div>
    `;

    document.getElementById("btnOK").onclick = () => this.startTurn();
  },

  startTurn() {
    Timer.start(this.settings.time, () => this.finishTurn());
    this.nextCardTeam();
  },

  getRandomCard() {
    return this.words[Math.floor(Math.random() * this.words.length)];
  },

  /* ======================
     MODO LIVRE
  =======================*/

  nextCardLivre() {
    this.current = this.getRandomCard();

    const app = document.getElementById("app");
    UIEffects.animateCardReplace(app, this.getCardLivreHTML());

    setTimeout(() => {
      document.getElementById("btnNext").onclick = () => this.nextCardLivre();
    }, 250);
  },

  getCardLivreHTML() {
    return `
      <div class="card">
        <h2 class="text-3xl font-bold text-center mb-4">${this.current.palavra}</h2>

        <div class="bg-slate-700 p-3 rounded mb-4">
          <h3 class="font-semibold mb-2">Palavras proibidas:</h3>
          <ul class="space-y-1">
            ${this.current.tabus.map(t => `<li>• ${t}</li>`).join("")}
          </ul>
        </div>

        <div class="btn bg-emerald-600" id="btnNext">Próxima</div>
      </div>
    `;
  },

  /* ======================
     MODO EQUIPES
  =======================*/

  nextCardTeam() {
    this.current = this.getRandomCard();

    const app = document.getElementById("app");
    UIEffects.animateCardReplace(app, this.getCardTeamHTML());

    setTimeout(() => this.bindTeamButtons(), 250);
  },

  getCardTeamHTML() {
    const team = this.teams[this.currentTeamIndex];

    return `
      <h1 class="text-center text-xl font-bold mb-3">Jogando: ${team.name}</h1>

      <div class="card">
        <h2 class="text-3xl font-bold text-center mb-4">${this.current.palavra}</h2>

        <div class="bg-slate-700 p-3 rounded mb-4">
          <h3 class="font-semibold mb-2">Palavras proibidas:</h3>
          <ul class="space-y-1">
            ${this.current.tabus.map(t => `<li>• ${t}</li>`).join("")}
          </ul>
        </div>

        <div class="grid grid-cols-3 gap-3">
          <div class="btn bg-blue-600" id="btnPular">Pular (- para outros)</div>
          <div class="btn bg-rose-600" id="btnTaboo">TABOO (-1)</div>
          <div class="btn bg-emerald-600" id="btnAcerto">CERTO (+1)</div>
        </div>
      </div>
    `;
  },

  bindTeamButtons() {
    const team = this.teams[this.currentTeamIndex];
    let pularLocked = false;

    document.getElementById("btnPular").onclick = () => {
      if (pularLocked) return;

      Sound.pular();
      pularLocked = true;
      setTimeout(() => pularLocked = false, 10000);

      this.teams.forEach((t, idx) => {
        if (idx !== this.currentTeamIndex) t.score++;
      });

      this.nextCardTeam();
    };

    document.getElementById("btnTaboo").onclick = () => {
      Sound.taboo();
      team.score--;
      this.nextCardTeam();
    };

    document.getElementById("btnAcerto").onclick = () => {
      Sound.acerto();
      team.score++;
      this.nextCardTeam();
    };
  },

  /* ======================
     FIM DE TURNO
  =======================*/

  finishTurn() {
    this.teams[this.currentTeamIndex].turnsLeft--;

    let nextIndex = null;

    for (let i = 1; i <= this.teams.length; i++) {
      const idx = (this.currentTeamIndex + i) % this.teams.length;
      if (this.teams[idx].turnsLeft > 0) {
        nextIndex = idx;
        break;
      }
    }

    if (nextIndex === null) {
      this.showFinalScore();
      return;
    }

    this.currentTeamIndex = nextIndex;
    this.turnStartScreen();
  },

  /* ======================
     PLACAR FINAL
  =======================*/

  showFinalScore() {
    document.getElementById("app").innerHTML = `
      <div class="card">
        <h2 class="text-2xl font-bold text-center mb-4">Resultado Final</h2>

        <ul class="space-y-3">
          ${this.teams
            .sort((a, b) => b.score - a.score)
            .map(t => `<li>${t.name}: <b>${t.score}</b></li>`)
            .join("")}
        </ul>

        <div class="btn bg-emerald-600 mt-6" id="btnVoltar">
          Voltar ao início
        </div>
      </div>
    `;

    document.getElementById("btnVoltar").onclick = () => {
      this.teams = [];
      UI.loadHomeScreen();
    };
  }
};
