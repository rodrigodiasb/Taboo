import { Game } from "./game.js";

export const UI = {
  app: document.getElementById("app"),

  loadHomeScreen() {
    this.app.innerHTML = `
      <div class="card text-center">
        <h1 class="text-2xl font-bold mb-4">Taboo Fest</h1>
        
        <div class="space-y-3">
          <div class="btn" id="btnLivre">Modo Livre</div>
          <div class="btn" id="btnEquipes">Modo em Equipes</div>
          <div class="btn bg-emerald-600 hover:bg-emerald-700" id="btnConfig">
            Configuração
          </div>
        </div>
      </div>
    `;

    document.getElementById("btnLivre").onclick = () => Game.startLivre();
    document.getElementById("btnEquipes").onclick = () => this.loadTeamSetup();
    document.getElementById("btnConfig").onclick = () => this.loadConfig();
  },

  loadConfig() {
    this.app.innerHTML = `
      <div class="card">
        <h2 class="text-xl font-bold mb-4">Configurações</h2>

        <label class="block mb-2">Tempo por turno (segundos)</label>
        <input id="cfgTempo" class="w-full p-2 rounded bg-slate-700" type="number" value="${Game.settings.time}">

        <label class="block mt-4 mb-2">Quantidade de turnos</label>
        <input id="cfgTurnos" class="w-full p-2 rounded bg-slate-700" type="number" value="${Game.settings.turnos}">

        <div class="btn mt-6 bg-emerald-600" id="btnSalvar">Salvar</div>
        <div class="btn mt-3 bg-slate-600" id="btnVoltar">Voltar</div>
      </div>
    `;

    document.getElementById("btnSalvar").onclick = () => {
      Game.settings.time = parseInt(document.getElementById("cfgTempo").value);
      Game.settings.turnos = parseInt(document.getElementById("cfgTurnos").value);
      this.loadHomeScreen();
    };

    document.getElementById("btnVoltar").onclick = () => this.loadHomeScreen();
  },

  loadTeamSetup() {
    this.app.innerHTML = `
      <div class="card">
        <h2 class="text-xl font-bold mb-4">Equipes</h2>

        <input id="teamName" placeholder="Nome da equipe" 
               class="w-full p-2 rounded bg-slate-700">

        <div class="btn mt-3 bg-blue-600" id="btnAddTeam">Adicionar equipe</div>

        <ul id="teamList" class="mt-4 space-y-2"></ul>

        <div class="btn mt-6 bg-emerald-600" id="btnIniciar">Iniciar Jogo</div>
        <div class="btn mt-3 bg-slate-600" id="btnVoltar">Voltar</div>
      </div>
    `;

    document.getElementById("btnAddTeam").onclick = () => {
      const name = document.getElementById("teamName").value.trim();
      if (!name) return;

      Game.teams.push({
        name,
        score: 0,
        turnsLeft: Game.settings.turnos
      });

      document.getElementById("teamName").value = "";
      this.updateTeamList();
    };

    document.getElementById("btnIniciar").onclick = () => {
      if (Game.teams.length < 2) {
        alert("Adicione pelo menos 2 equipes!");
        return;
      }
      Game.startTeams();
    };

    document.getElementById("btnVoltar").onclick = () => this.loadHomeScreen();
  },

  updateTeamList() {
    const ul = document.getElementById("teamList");
    ul.innerHTML = Game.teams.map(t => `
      <li class="bg-slate-700 p-2 rounded">${t.name}</li>
    `).join("");
  }
};
