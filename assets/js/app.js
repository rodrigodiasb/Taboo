
// Seleciona o elemento principal da aplicação
const app = document.getElementById("app");

// Renderização inicial
app.innerHTML = `
  <div class="text-center space-y-4">
    <h1 class="text-2xl font-bold text-sky-400">Taboo Fest</h1>
    <p class="text-slate-300">Aplicação carregada com sucesso! 🎉</p>

    <button id="btnTest"
      class="px-4 py-2 bg-sky-600 hover:bg-sky-700 transition rounded-lg">
      Testar App.js
    </button>
  </div>
`;

// Exemplo de interação
document.getElementById("btnTest").addEventListener("click", () => {
  alert("Seu app.js está funcionando!");
});
