import { Database } from './modules/database.js';
import { CardController } from './modules/cards.js';
import { TeamController } from './modules/team.js';
import { render } from './modules/ui.js';

window.router = {
  home: () => renderHome(),
  teamConfig: () => renderTeamConfig()
};

function renderHome(){
  render(`<div class="flex flex-col gap-6 items-center mt-6">
    <h1 class="text-3xl font-bold">Taboo Fest</h1>
    <div class="w-full max-w-md mt-4 space-y-3">
      <button id="btnFree" class="w-full py-3 bg-blue-600 rounded-xl">🎉 Jogo Livre</button>
      <button id="btnTeam" class="w-full py-3 bg-green-600 rounded-xl">👥 Modo Equipe</button>
    </div>
  </div>`);
  document.getElementById('btnFree').onclick = ()=> renderFreeConfig();
  document.getElementById('btnTeam').onclick = ()=> renderTeamConfig();
}

function renderFreeConfig(){
  render(`<div class="max-w-md mx-auto">
    <h2 class="text-2xl font-bold">Jogo Livre</h2>
    <label class="block mt-3">Tempo (segundos)</label>
    <input id="tempoLivre" class="text-black p-2 rounded w-full" type="number" value="60" />
    <label class="block mt-3">Modo de sorteio</label>
    <select id="sortMode" class="text-black p-2 rounded w-full">
      <option value="sequential">Sequencial</option>
      <option value="random">Aleatório</option>
    </select>
    <button id="startFree" class="mt-4 w-full py-3 bg-blue-600 rounded-xl">Iniciar</button>
    <button id="back" class="mt-2 w-full py-2 bg-gray-700 rounded-xl">Voltar</button>
  </div>`);
  document.getElementById('startFree').onclick = ()=> {
    const t = parseInt(document.getElementById('tempoLivre').value) || 60;
    const mode = document.getElementById('sortMode').value;
    const cc = new CardController({mode});
    window.currentCardController = cc;
    cc.showFreeScreen(t);
  };
  document.getElementById('back').onclick = ()=> renderHome();
}

function renderTeamConfig(){
  render(`<div class="max-w-md mx-auto">
    <h2 class="text-2xl font-bold">Modo Equipe</h2>
    <label class="block mt-3">Nome do time</label>
    <input id="teamName" class="text-black p-2 rounded w-full" type="text" />
    <button id="addTeam" class="mt-3 w-full py-2 bg-yellow-500 rounded-xl">Adicionar Time</button>

    <div id="teamsList" class="mt-4 bg-gray-800 rounded p-3"></div>

    <label class="block mt-3">Tempo por turno (s)</label>
    <input id="turnTime" class="text-black p-2 rounded w-full" type="number" value="60" />

    <label class="block mt-3">Turnos por equipe</label>
    <input id="turns" class="text-black p-2 rounded w-full" type="number" value="1" />

    <button id="startTeams" class="mt-4 w-full py-3 bg-green-600 rounded-xl">Iniciar Jogo</button>
    <button id="back2" class="mt-2 w-full py-2 bg-gray-700 rounded-xl">Voltar</button>
  </div>`);

  const teamCtrl = new TeamController();
  window.teamControllerInstance = teamCtrl;

  document.getElementById('addTeam').onclick = ()=> {
    const name = document.getElementById('teamName').value.trim();
    if(!name) return alert('Insira um nome');
    teamCtrl.addTeam(name);
    document.getElementById('teamName').value = '';
    renderTeamsList();
  };

  function renderTeamsList(){
    const html = teamCtrl.teams.map(t=> `<div class="p-2 flex justify-between border-b border-gray-700"><div>${t.name}</div><div>${t.score}</div></div>`).join('');
    document.getElementById('teamsList').innerHTML = html || '<div class="text-gray-400">Nenhum time adicionado</div>';
  }

  document.getElementById('startTeams').onclick = ()=> {
    const time = parseInt(document.getElementById('turnTime').value) || 60;
    const turns = parseInt(document.getElementById('turns').value) || 1;
    if(teamCtrl.teams.length < 1) {
      if(!confirm('Nenhum time adicionado. Deseja continuar?')) return;
    }
    teamCtrl.startGame(time, turns);
  };

  document.getElementById('back2').onclick = ()=> renderHome();
}

renderHome();
