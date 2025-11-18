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
    document.getElementById("btnEquipes").onclick = () => Game.startTeams();
    document.getElementById("btnConfig").onclick = () => this.loadConfig();
  },

  loadConfig() {
    this.app.innerHTML = `
      <div class="card">
        <h2 class="text-xl font-bold mb-4">Configurações</h2>

        <label class="block mb-2">Tempo por turno (segundos)</label>
        <input id="cfgTempo" class="w-full p-2 rounded bg-slate-700" type="number" value="60">

        <label class="block mt-4 mb-2">Quantidade de turnos</label>
        <input id="cfgTurnos" class="w-full p-2 rounded bg-slate-700" type="number" value="6">

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
  }
};
