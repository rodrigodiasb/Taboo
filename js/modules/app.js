import { render } from './modules/ui.js';
import { Game } from './modules/game.js';
import { TeamGame } from './modules/team.js';

let allCards = [];

async function loadCards(){
  const r = await fetch('assets/data/words.json');
  const j = await r.json();
  allCards = j.cartas || [];
}

function home(){
  render(`<div class="center-max mx-auto text-center mt-8">
    <h1 class="text-3xl font-bold">Taboo Fest</h1>
    <div class="mt-6 space-y-3">
      <button id="free" class="w-full py-3 bg-blue-600 rounded-xl">🎉 Jogo Livre</button>
      <button id="team" class="w-full py-3 bg-green-600 rounded-xl">👥 Modo Equipe</button>
    </div>
  </div>`);
  document.getElementById('free').onclick = ()=> freeConfig();
  document.getElementById('team').onclick = ()=> teamConfig();
  window.router.home = home;
}

function freeConfig(){
  render(`<div class="center-max mx-auto">
    <h2 class="text-2xl font-bold">Jogo Livre</h2>
    <label class="block mt-3">Tempo (s)</label>
    <input id="tempo" class="text-black p-2 rounded w-full" type="number" value="60" />
    <label class="block mt-3">Sorteio</label>
    <select id="sort" class="text-black p-2 rounded w-full"><option value="sequential">Sequencial</option><option value="random">Aleatório</option></select>
    <button id="start" class="mt-4 w-full py-3 bg-blue-600 rounded-xl">Iniciar</button>
    <button id="back" class="mt-2 w-full py-2 bg-gray-700 rounded-xl">Voltar</button>
  </div>`);
  document.getElementById('start').onclick = ()=> {
    const t = parseInt(document.getElementById('tempo').value) || 60;
    const mode = document.getElementById('sort').value;
    const g = new Game(allCards,{mode});
    window.currentGame = g;
    g.startFree(t);
  };
  document.getElementById('back').onclick = ()=> home();
}

function teamConfig(){
  render(`<div class="center-max mx-auto">
    <h2 class="text-2xl font-bold">Modo Equipe</h2>
    <label class="block mt-3">Nome do time</label>
    <input id="teamName" class="text-black p-2 rounded w-full" type="text" />
    <button id="add" class="mt-3 w-full py-2 bg-amber-400 rounded-xl">Adicionar Time</button>
    <div id="teamsList" class="mt-4 bg-slate-800 rounded p-3"></div>
    <label class="block mt-3">Tempo por turno (s)</label>
    <input id="turnTime" class="text-black p-2 rounded w-full" type="number" value="60" />
    <label class="block mt-3">Turnos por equipe</label>
    <input id="turns" class="text-black p-2 rounded w-full" type="number" value="1" />
    <button id="startTeams" class="mt-4 w-full py-3 bg-green-600 rounded-xl">Iniciar</button>
    <button id="back2" class="mt-2 w-full py-2 bg-gray-700 rounded-xl">Voltar</button>
  </div>`);

  const tg = new TeamGame(allCards);
  window.teamGame = tg;

  document.getElementById('add').onclick = ()=> {
    const n = document.getElementById('teamName').value.trim();
    if(!n) return alert('Insira um nome');
    tg.addTeam(n);
    document.getElementById('teamName').value = '';
    renderTeams();
  };

  function renderTeams(){
    const html = tg.teams.map(t=>`<div class="p-2 flex justify-between border-b border-slate-700"><div>${t.name}</div><div>${t.score}</div></div>`).join('');
    document.getElementById('teamsList').innerHTML = html || '<div class="text-slate-400">Nenhum time</div>';
  }

  document.getElementById('startTeams').onclick = ()=> {
    const time = parseInt(document.getElementById('turnTime').value) || 60;
    const turns = parseInt(document.getElementById('turns').value) || 1;
    if(tg.teams.length < 1 && !confirm('Nenhum time adicionado. Continuar?')) return;
    tg.start(time, turns);
  };

  document.getElementById('back2').onclick = ()=> home();
}

(async ()=>{
  await loadCards();
  home();
})();
