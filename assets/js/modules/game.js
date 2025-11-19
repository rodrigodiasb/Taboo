import { Timer } from "./timer.js";
import { UI } from "./ui.js";
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

  //
  // ─────────────────────────── MODE: LIVRE ────────────────────────────
  //
  async startLivre() {
    await this.loadWords();
    this.nextCardLivre();
  },

  nextCardLivre() {
    this.current = this.words[Math.floor(Math.random() * this.words.length)];
    this.showCardLivre();
  },

  showCardLivre() {
    document.getElementById("app").innerHTML = `
      <div class="card">
        <h2 class="text-3xl font-bold text-center mb-4">${this.current.palavra}</h2>

        <div class="bg-slate-700 p-3 rounded mb-4">
          <h3 class="font-semibold mb-2">Palavras proibidas:</h3>
          <ul class="space-y-1">
            ${this.current.tabus.map(t => `<li>• ${t}</li>`).join("")}
          </ul>
        </div>

        <div class="btn bg-blue-600" id="btnNext">Próxima Carta</div>
      </div>
    `;

    document.getElementById("btnNext").onclick = () => this.nextCardLivre();
  },

  //
  // ─────────────────────────── MODE: EQUIPES ────────────────────────────
  //
  async startTeams() {
    await this.loadWords();

    this.currentTeamIndex = 0;
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

  //
  // INÍCIO DO TURNO (timer inicia aqui, e continua até acabar)
  //
  startTurn() {
    // mostrar a carta primeiro
    this.nextCardTeam();

    // esperar DOM renderizar, depois iniciar timer
    setTimeout(() => {
      const timerEl = document.getElementById("timer");
      if (timerEl) {
        Timer.start(timerEl, this.settings.time, () => this.finishTurn());
      }
    }, 50);
  },

  //
  nextCardTeam() {
    this.current = this.words[Math.floor(Math.random() * this.words.length)];
    this.showCardTeam();
  },

  //
  // TELA DA CARTA NO MODO EQUIPES
  //
  showCardTeam() {
    const team = this.teams[this.currentTeamIndex];

    document.getElementById("app").innerHTML = `
      <h1 class="text-center text-xl font-bold mb-3">
        Jogando: ${team.name}
      </h1>

      <div class="card">
        <h2 class="text-3xl font-bold text-center mb-4">${this.current.palavra}</h2>

        <div class="bg-slate-700 p-3 rounded mb-4">
          <h3 class="font-semibold mb-2">Palavras proibidas:</h3>
          <ul class="space-y-1">
            ${this.current.tabus.map(t => `<li>• ${t}</li>`).join("")}
          </ul>
        </div>

        <div id="timer" class="text-center text-2xl font-bold mb-4"></div>

        <div class="grid grid-cols-3 gap-3">
          <div class="btn bg-blue-600" id="btnPular">Pular (- para outros)</div>
          <div class="btn bg-rose-600" id="btnTaboo">TABOO (-1)</div>
          <div class="btn bg-emerald-600" id="btnAcerto">CERTO (+1)</div>
        </div>
      </div>
    `;

    let pularLocked = false;

    document.getElementById("btnPular").onclick = () => {
      if (pularLocked) return;
      pularLocked = true;

      Sound.pular();
      setTimeout(() => pularLocked = false, 10000);

      // todos os outros times ganham ponto
      this.teams.forEach((t, i) => {
        if (i !== this.currentTeamIndex) t.score++;
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

  //
  // ─────────────────────────── FIM DO TURNO ────────────────────────────
  //
  finishTurn() {
    this.teams[this.currentTeamIndex].turnsLeft--;

    // terminou todos turnos?
    const aindaTem = this.teams.some(t => t.turnsLeft > 0);
    if (!aindaTem) {
      this.showFinalScore();
      return;
    }

    // avança circularmente: A → B → C → A → B → C
    do {
      this.currentTeamIndex = (this.currentTeamIndex + 1) % this.teams.length;
    } while (this.teams[this.currentTeamIndex].turnsLeft <= 0);

    this.turnStartScreen();
  },

  //
  // ─────────────────────────── PLACAR FINAL ────────────────────────────
  //
  showFinalScore() {
    document.getElementById("app").innerHTML = `
      <div class="card">
        <h2 class="text-2xl font-bold text-center mb-4">Resultado Final</h2>

        <ul class="space-y-3">
          ${this.teams
            .sort((a, b) => b.score - a.score)
            .map(t => `<li>${t.name}: <b>${t.score}</b></li>`).join("")}
        </ul>

        <div class="btn bg-emerald-600 mt-6" id="btnVoltar">Voltar ao início</div>
      </div>
    `;

    document.getElementById("btnVoltar").onclick = () => {
      this.teams = [];
      UI.loadHomeScreen();
    };
  }
};
