import { Game } from "./game.js";

export const UI = {
  loadHomeScreen() {
    document.getElementById("app").innerHTML = `
      <div class="card text-center space-y-4">
        <h1 class="text-2xl font-bold">Taboo Fest</h1>

        <div class="btn bg-emerald-600" id="btnLivre">Modo Livre</div>
        <div class="btn bg-blue-600" id="btnTeams">Modo Equipes</div>
      </div>
    `;

    document.getElementById("btnLivre").onclick = () => Game.startLivre();
    document.getElementById("btnTeams").onclick = () => this.loadTeamsConfig();
  },

  loadTeamsConfig() {
    document.getElementById("app").innerHTML = `
      <div class="card space-y-4">
        <h2 class="text-xl font-bold">Times</h2>

        <input id="teamName" class="input" placeholder="Nome do time">

        <div class="btn bg-blue-600" id="btnAddTeam">Adicionar time</div>

        <div id="teamList" class="space-y-1"></div>

        <hr class="opacity-30">

        <label class="font-semibold">Tempo (segundos)</label>
        <input id="timeSet" class="input" value="60">

        <label class="font-semibold">Turnos por time</label>
        <input id="turnSet" class="input" value="3">

        <div class="btn bg-emerald-600" id="btnStart">Iniciar jogo</div>
      </div>
    `;

    const list = document.getElementById("teamList");

    document.getElementById("btnAddTeam").onclick = () => {
      const name = document.getElementById("teamName").value.trim();
      if (!name) return;

      Game.teams.push({ name, score: 0 });

      list.innerHTML = Game.teams
        .map(t => `<div>${t.name}</div>`)
        .join("");

      document.getElementById("teamName").value = "";
    };

    document.getElementById("btnStart").onclick = () => {
      Game.settings.time = Number(document.getElementById("timeSet").value);
      Game.settings.turnos = Number(document.getElementById("turnSet").value);

      Game.startTeams();
    };
  }
};
