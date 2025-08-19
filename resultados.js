// =========================
// Carrega dados salvos
// =========================
const medidas = JSON.parse(localStorage.getItem("medidas")) || {};
const perfil = localStorage.getItem("perfil");
const cards = document.getElementById("cards");
const recomendacoesDiv = document.getElementById("recomendacoes");

const anamnese = JSON.parse(localStorage.getItem("anamnese")) || {};
const nome = anamnese["Qual seu nome?"] || "usuario";
const idade = parseInt(anamnese["Qual sua idade?"]) || 25;
const sexo = anamnese["Qual seu sexo?"] || "Não informado";
const copo = anamnese["Quantos copos de água você bebe por dia?(Copos de 250ml; 6 copos = 1.5L)"];

let questionario = localStorage.getItem('tipoQuestionario') || 'completa'; // padrão completa


// =========================
// Função para criar card
// =========================
function criarCard(titulo, valor, extra = "") {
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `<h3>${titulo}</h3><p>${valor}</p><small>${extra}</small>`;
  cards.appendChild(card);
}

// =========================
// Gráfico de composição corporal
// =========================
const pesoUsado = Number(medidas.peso) || 70;
const massaGorda = (Number(medidas.gordura) / 100) * pesoUsado;
const massaMagra = pesoUsado - massaGorda;

new Chart(document.getElementById("grafico-composicao"), {
  type: "doughnut",
  data: {
    labels: ["Massa Magra", "Massa Gorda"],
    datasets: [{
      data: [massaMagra.toFixed(1), massaGorda.toFixed(1)],
      backgroundColor: ["#00ff88", "#ff006a"]
    }]
  },
  options: {
    plugins: {
      legend: {
        labels: { color: "#fff" }
      }
    }
  }
});


// =========================
// Risco coronariano
// =========================
let pontos = 0;

// Sexo & idade
if (sexo.toLowerCase().startsWith("m") && idade >= 45) pontos += 2;
if (sexo.toLowerCase().startsWith("f") && idade >= 55) pontos += 2;

// Perguntas da anamnese
const doresEsforco = (anamnese["Já sentiu dores no peito, falta de ar ou tontura durante esforço físico?"] || "").toLowerCase();
if (doresEsforco.includes("s")) pontos += 3;

const sente_palpitacoes_ou_desmaio = (anamnese["Já sentiu palpitações ou desmaios?"] || "").toLowerCase();
if (sente_palpitacoes_ou_desmaio.includes("s")) pontos += 1.5;

const pratica_cardio = (anamnese["Você pratica atividades aeróbicas, cardio?"] || "").toLowerCase();
if (pratica_cardio.includes("s")) pontos -= 1.5;
else pontos += 0.5;


const frequencia_de_atividade_fisica = parseInt(anamnese["Com qual frequência semanal você pratica atividades físicas?"]) || 25;
if (frequencia_de_atividade_fisica < 2) pontos += 1.5;
else if (frequencia_de_atividade_fisica < 4) pontos += 0;
else pontos -= 1.5;


const claudificacao = (anamnese["Tem problemas de circulação, como varizes ou inchaço nas pernas?"] || "").toLowerCase();
if (claudificacao.includes("s")) pontos += 1.5;

const historicoCardiaco = (anamnese["Há pessoas com problemas de coração, cardiopatas, em sua família?"] || "").toLowerCase();
if (historicoCardiaco.includes("s")) pontos += 1.5;

const pressao = (anamnese["Já foi diagnosticado(a) com pressão alta, colesterol alto ou diabetes?"] || "").toLowerCase();
if (pressao.includes("s")) pontos += 3;
if (pressao.includes("n")) pontos -= 1.5;

const tabagismo = (anamnese["Você fuma ou ingere bebida alcoólica? Responda com F para frequentemente, M para moderadamente, N para Não"] || "").toLowerCase();
if (tabagismo.includes("f")) pontos += 3;
else if (tabagismo.includes("m")) pontos += 1;

const industrializados = (anamnese["Costuma consumir alimentos industrializados (enlatados, congelados, fast-food)?"] || "").toLowerCase();
if (industrializados.includes("s")) pontos += 0.5;
if (industrializados.includes("n")) pontos -= 1;

// Classificação final
let risco = "Baixo";
if (pontos >= 7) risco = "Alto";
else if (pontos >= 5) risco = "Moderado";
else if (pontos >= 3) risco = "Moderado-Baixo";

// =========================
// Recomendações
// =========================
let recomendacoes = "";

// IMC
if (medidas.imc < 18.5) {
  recomendacoes += "⚠️ IMC baixo: pode indicar desnutrição, aumente ingestão calórica e proteínas.<br>";
} else if (medidas.imc >= 25 && medidas.imc < 30) {
  recomendacoes += "⚠️ IMC elevado: ajuste dieta com déficit calórico leve e foque em exercícios aeróbicos.<br>";
} else if (medidas.imc >= 30) {
  recomendacoes += "⚠️ IMC muito elevado: risco maior de doenças metabólicas, acompanhamento profissional indicado.<br>";
} else {
  recomendacoes += "✅ IMC dentro da faixa considerada saudável.<br>";
}

// % Gordura
if (medidas.gordura > 25) {
  recomendacoes += "⚠️ Gordura corporal alta: foque em treino aeróbico + força, dieta hipocalórica equilibrada.<br>";
} else if (medidas.gordura < 8) {
  recomendacoes += "⚠️ Gordura muito baixa: atenção à saúde hormonal, talvez seja necessário aumentar ingestão calórica.<br>";
} else {
  recomendacoes += "✅ Percentual de gordura adequado para saúde.<br>";
}

// TMB
if (medidas.tmb !== "N/A") {
  recomendacoes += `ℹ️ Sua TMB é de ${medidas.tmb} kcal/dia. Ajuste dieta de acordo com objetivo (déficit para perda, superávit para ganho).<br>`;
}

// Risco coronariano
if (risco === "Alto") {
  recomendacoes += "⚠️ Alto risco coronariano: consulte um médico para avaliação detalhada e monitoramento.<br>";
} else if (risco === "Moderado" || risco === "Moderado-Baixo") {
  recomendacoes += "⚠️ Risco coronariano moderado: cuide da alimentação, reduza consumo de industrializados e mantenha exercícios.<br>";
} else {
  recomendacoes += "✅ Risco coronariano baixo: mantenha estilo de vida saudável.<br>";
}

// Hidratação
let hidroMsg = "";
if (medidas.hidr_status === "Insuficiente") {
  hidroMsg = `⚠️ Você está consumindo menos água do que o necessário!<br>
              Mínimo: ${medidas.hidr_min_ml} ml • Seu consumo: ${medidas.hidr_agua_ml} ml`;
  recomendacoes += "⚠️ Consumo de água abaixo do recomendado. Aumente ingestão diária.<br>";
} else {
  hidroMsg = `✅ Adequado • Consumo: ${medidas.hidr_agua_ml} ml (mínimo: ${medidas.hidr_min_ml} ml)`;
  recomendacoes += "✅ Boa hidratação mantida.<br>";
}

// Exibe recomendações
recomendacoesDiv.innerHTML = `<h3>Recomendações</h3><p>${recomendacoes}</p>`;


// =========================
// Cards principais
// =========================
criarCard("IMC", medidas.imc, classificarIMC(medidas.imc));
criarCard("% Gordura", medidas.gordura + "%", perfil === "comum" ? "Método Marinha EUA" : "Dobras Cutâneas");
criarCard("Taxa Metabólica Basal", (medidas.tmb ? medidas.tmb + " kcal/dia" : "N/A"), "Mifflin-St Jeor");
criarCard("Risco Coronariano", risco, "Baseado em anamnese e fatores de risco da Anamnese");

// Card hidratação (2 colunas)
const cardHidro = document.createElement("div");
cardHidro.classList.add("card", "hidr");
cardHidro.innerHTML = `<h3>Hidratação</h3><p>${hidroMsg}</p>`;
cards.appendChild(cardHidro);


// =========================
// Funções auxiliares
// =========================
function classificarIMC(imc) {
  if (imc < 18.5) return "Abaixo do peso";
  if (imc < 24.9) return "Peso normal";
  if (imc < 29.9) return "Sobrepeso";
  if (imc < 34.9) return "Obesidade grau I";
  if (imc < 39.9) return "Obesidade grau II";
  return "Obesidade grau III";
}


// =========================
// Botões
// =========================
document.getElementById("btn-voltar").addEventListener("click", () => {
  window.location.href = "index.html";
});

// Exportar JSON completo (Anamnese + Medidas + Cálculos + Métodos)
document.getElementById("btn-json").addEventListener("click", () => {
  // Recupera anamnese salva
  const anamnese = JSON.parse(localStorage.getItem("anamnese")) || {};

  // Recupera medidas e cálculos
  const medidas = JSON.parse(localStorage.getItem("medidas")) || {};
  const calculos = JSON.parse(localStorage.getItem("calculos")) || {};
  const metodos = JSON.parse(localStorage.getItem("metodos")) || {};

  // Estrutura final do JSON
  const avaliacaoCompleta = {
    dadosGerais: {
      dataAvaliacao: new Date().toLocaleString("pt-BR"),
      nome: anamnese["Qual seu nome?"] || "Não informado",
      idade: anamnese["Qual sua idade?"] || "Não informado",
      sexo: anamnese["Qual seu sexo?"] || "Não informado"
    },
    anamnese: anamnese,     // Todas as respostas
    medidas: medidas,       // Ex: peso, altura, circunferências
    calculos: calculos,     // Ex: IMC, RCQ, % gordura
    metodos: metodos        // Ex: protocolos usados (Pollock, Durnin, etc.)
  };

  // Salva no localStorage para a IA usar
  localStorage.setItem("avaliacaoCompleta", JSON.stringify(avaliacaoCompleta));

  // Redireciona para a IA
  window.location.href = "ia.html";
});



// Exportar PDF
document.getElementById("btn-exportar").addEventListener("click", () => {
  const relatorio = document.createElement("div");
  relatorio.style.background = "#111";
  relatorio.style.color = "#fff";
  relatorio.style.fontFamily = "Arial, sans-serif";
  relatorio.style.padding = "40px";
  relatorio.style.width = "100%";

  // CAPA
  relatorio.innerHTML = `
    <div style="text-align:center; margin-bottom:50px;">
      <h1 style="color:#00ff88; font-size:2.5em;">🏋️ Avaliação Física</h1>
      <h2 style="color:#ff006a;">${nome}</h2>
      <p>Idade: ${idade} anos | Sexo: ${sexo}</p>
      <p style="color:#aaa;">Data: ${new Date().toLocaleDateString("pt-BR")}</p>
      <hr style="border:1px solid #444; margin:30px 0;">
    </div>
  `;

  // RESULTADOS
  relatorio.innerHTML += `
    <h2 style="color:#00ff88;">Resultados</h2>
    <p><strong>IMC:</strong> ${medidas.imc} (${classificarIMC(medidas.imc)})</p>
    <p><strong>% Gordura:</strong> ${medidas.gordura}% 
      (${perfil === "comum" ? "Método Marinha EUA" : "Dobras Cutâneas"})
    </p>
    <hr style="border:1px solid #444; margin:30px 0;">
  `;

  // RECOMENDAÇÕES
  relatorio.innerHTML += `
    <h2 style="color:#00ff88;">Recomendações</h2>
    <p>${recomendacoes.replace(/<br>/g, "<br>")}</p>
    <hr style="border:1px solid #444; margin:30px 0;">
  `;

  // GRÁFICO
  const graficoCanvas = document.getElementById("grafico-composicao");
  const graficoImg = graficoCanvas.toDataURL("image/png");
  relatorio.innerHTML += `
    <h2 style="color:#00ff88; page-break-before: always;">Composição Corporal</h2>
    <img src="${graficoImg}" style="max-width:100%; border-radius:10px;">
    <hr style="border:1px solid #444; margin:30px 0;">
  `;

  // TMB
  relatorio.innerHTML += `
    <h2 style="color:#00ff88;">Taxa Metabólica Basal</h2>
    <p>${medidas.tmb} kcal/dia (Mifflin-St Jeor)</p>
    <hr style="border:1px solid #444; margin:30px 0;">
  `;

  // Risco coronariano
  relatorio.innerHTML += `
    <h2 style="color:#00ff88;">Risco Coronariano</h2>
    <p><strong>Nível:</strong> ${risco}</p>
    <p style="color:#aaa; font-size:0.9em;">
      Baseado em: percentual de gordura, idade, pressão arterial, tabagismo e dieta
    </p>
    <hr style="border:1px solid #444; margin:30px 0;">
  `;

  // Hidratação
  relatorio.innerHTML += `
    <h2 style="color:#00ff88;">Hidratação</h2>
    <p>${hidroMsg}</p>
    <hr style="border:1px solid #444; margin:30px 0;">
  `;

  // ANAMNESE
  relatorio.innerHTML += `<h2 style='color:#00ff88;'>Anamnese ${questionario} </h2>`;
  for (let pergunta in anamnese) {
    const resposta = anamnese[pergunta];
    relatorio.innerHTML += `
      <div style="page-break-inside: avoid;">
        <p>
          <strong style="color:#ff006a;">${pergunta}</strong><br>
          ${resposta || "Não informado"}
        </p>
      </div>
    `;
  }

  const opt = {
    margin: 0.5,
    filename: `avaliacao_${nome}.pdf`,
    image: { type: "jpeg", quality: 1 },
    html2canvas: { scale: 2, backgroundColor: "#111" },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
  };

  html2pdf().set(opt).from(relatorio).save();
});
