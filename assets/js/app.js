// --------- Estado da aplicação ---------
let cards = [];              // Armazena as cartas criadas
let currentScreen = "home";  // Controla a navegação simples

// Referência ao container principal
const app = document.getElementById("app");

// --------- Navegação entre telas ---------
function render() {
  if (currentScreen === "home") {
    renderHome();
  } else if (currentScreen === "create") {
    renderCreateCard();
  } else if (currentScreen === "list") {
    renderList();
  }
}

// --------- TELA INICIAL ---------
function renderHome() {
  app.innerHTML = `
    <div class="space-y-6 text-center">
      <h1 class="text-3xl font-bold text-sky-400">Taboo Fest</h1>
      <p class="text-slate-300">Escolha uma opção</p>

      <div class="flex flex-col space-y-3 max-w-xs mx-auto">
        <button id="btnCreate"
          class="px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded-lg transition">
          Criar Cartas
        </button>

        <button id="btnList"
          class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition">
          Ver Cartas
        </button>
      </div>
    </div>
  `;

  document.getElementById("btnCreate").onclick = () => {
    currentScreen = "create";
    render();
  };

  document.getElementById("btnList").onclick = () => {
    currentScreen = "list";
    render();
  };
}

// --------- TELA DE CRIAÇÃO ---------
function renderCreateCard() {
  app.innerHTML = `
    <div class="space-y-4 max-w-md mx-auto">
      <h2 class="text-2xl font-semibold text-sky-400 text-center">Criar Carta</h2>

      <input id="inputMain" 
        class="w-full p-2 rounded bg-slate-800 border border-slate-700"
        placeholder="Palavra principal">

      <input id="inputForbidden"
        class="w-full p-2 rounded bg-slate-800 border border-slate-700"
        placeholder="Palavras proibidas (separe por vírgula)">

      <button id="btnSave"
        class="w-full px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded-lg transition">
        Salvar Carta
      </button>

      <button id="btnBack"
        class="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition">
        Voltar
      </button>
    </div>
  `;

  document.getElementById("btnSave").onclick = () => {
    const main = document.getElementById("inputMain").value.trim();
    const forbidden = document.getElementById("inputForbidden").value
      .split(",")
      .map(w => w.trim())
      .filter(w => w.length > 0);

    if (!main || forbidden.length === 0) {
      alert("Preencha todos os campos!");
      return;
    }

    cards.push({ main, forbidden });
    alert("Carta salva com sucesso!");

    currentScreen = "home";
    render();
  };

  document.getElementById("btnBack").onclick = () => {
    currentScreen = "home";
    render();
  };
}

// --------- TELA LISTA DE CARTAS ---------
function renderList() {
  if (cards.length === 0) {
    app.innerHTML = `
      <div class="text-center space-y-4">
        <h2 class="text-2xl text-sky-400 font-semibold">Lista de Cartas</h2>
        <p class="text-slate-400">Nenhuma carta criada ainda.</p>

        <button id="btnBack"
          class="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition">
          Voltar
        </button>
      </div>
    `;

    document.getElementById("btnBack").onclick = () => {
      currentScreen = "home";
      render();
    };

    return;
  }

  // Renderizar lista
  app.innerHTML = `
    <div class="space-y-4 max-w-lg mx-auto">
      <h2 class="text-2xl text-sky-400 font-semibold text-center">Cartas Criadas</h2>

      <div class="space-y-3">
        ${cards.map((carta, i) => `
          <div class="p-4 bg-slate-800 rounded-lg border border-slate-700">
            <h3 class="text-xl font-bold text-emerald-400">${carta.main}</h3>
            <p class="text-slate-300 text-sm">Proibidas: 
              <span class="text-slate-400">${carta.forbidden.join(", ")}</span>
            </p>
          </div>
        `).join("")}
      </div>

      <button id="btnBack"
        class="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition">
        Voltar
      </button>
    </div>
  `;

  document.getElementById("btnBack").onclick = () => {
    currentScreen = "home";
    render();
  };
}

// --------- Inicialização ---------
render();
