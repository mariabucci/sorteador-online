const formulario = document.querySelector("#sorteadorForm");
const listaEntrada = document.getElementById("listaEntrada");
const resultadoBox = document.querySelector("#resultadoBox");
const resultado = document.getElementById("resultado");
const btnSortear = document.getElementById("btnSortear");
const btnLimpar = document.getElementById("btnLimpar");
const btnLimparHistorico = document.getElementById("btnLimparHistorico");
const status = document.getElementById("status");
const historicoBox = document.getElementById("historicoBox");
const historico = document.getElementById("historico");

let itensDisponiveis = [];
let listaOriginal = [];
let vencedores = [];
let temporizador = null;
let sorteioEmAndamento = false;

function obterItens() {
  return listaEntrada.value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter((item) => item !== "");
}

function sortear(itens) {
  return Math.floor(Math.random() * itens.length);
}

function exibirResultado(vencedor) {
  resultado.textContent = vencedor;
  resultadoBox.classList.remove("hidden");

  resultado.classList.remove("revelar");
  void resultado.offsetWidth;
  resultado.classList.add("revelar");

  // Desafio D: comemorar o resultado com confetes.
  if (typeof confetti === "function") {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.65 },
    });
  }
}
function atualizarHistorico(vencedor) {
  const itemHistorico = document.createElement("li");
  const numero = document.createElement("span");

  numero.textContent = `${vencedores.length}. `;
  itemHistorico.appendChild(numero);
  itemHistorico.appendChild(document.createTextNode(vencedor));

  historico.appendChild(itemHistorico);
  historicoBox.classList.remove("hidden");
}

function iniciarContagem(vencedor) {
  let contador = 3;

  sorteioEmAndamento = true;
  btnSortear.disabled = true;
  btnLimpar.disabled = true;
  btnLimparHistorico.disabled = true;

  resultadoBox.classList.add("hidden");
  status.textContent = contador;

  temporizador = setInterval(() => {
    contador -= 1;

    if (contador > 0) {
      status.textContent = contador;
      return;
    }

    clearInterval(temporizador);
    temporizador = null;

    exibirResultado(vencedor);

    vencedores.push(vencedor);
    atualizarHistorico(vencedor);

    status.textContent =
      itensDisponiveis.length === 0
        ? "Todos os itens foram sorteados! Limpe a lista para recomeçar."
        : "Sorteio concluído!";

    sorteioEmAndamento = false;
    btnSortear.disabled = false;
    btnLimpar.disabled = false;
    btnLimparHistorico.disabled = false;
  }, 700);
}

formulario.addEventListener("submit", (event) => {
  event.preventDefault();

  if (sorteioEmAndamento) return;

  status.textContent = "";

  const itens = obterItens();

  if (itens.length === 0) {
    resultadoBox.classList.add("hidden");
    status.textContent = "Digite pelo menos um nome ou item para sortear.";
    listaEntrada.focus();
    return;
  }

  if (JSON.stringify(itens) !== JSON.stringify(listaOriginal)) {
    listaOriginal = [...itens];
    itensDisponiveis = [...itens];
  }

  if (itensDisponiveis.length === 0) {
    status.textContent =
      "Todos os itens já foram sorteados. Limpe e digite a lista novamente.";
    return;
  }

  const indice = sortear(itensDisponiveis);
  const vencedor = itensDisponiveis[indice];

  itensDisponiveis.splice(indice, 1);

  iniciarContagem(vencedor);
});

btnLimpar.addEventListener("click", () => {
  if (temporizador !== null) {
    clearInterval(temporizador);
    temporizador = null;
  }

  sorteioEmAndamento = false;
  btnSortear.disabled = false;
  btnLimpar.disabled = false;
  btnLimparHistorico.disabled = false;

  listaEntrada.value = "";
  resultado.textContent = "---";
  resultado.classList.remove("revelar");
  resultadoBox.classList.add("hidden");
  status.textContent = "";

  itensDisponiveis = [];
  listaOriginal = [];

  listaEntrada.focus();
});

btnLimparHistorico.addEventListener("click", () => {
  vencedores = [];
  historico.replaceChildren();
  historicoBox.classList.add("hidden");
  status.textContent = "Histórico limpo.";
});
