const chatDiv = document.getElementById("chat");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

// Recupera JSON salvo
const dadosCompletos = JSON.parse(localStorage.getItem("avaliacaoCompleta") || "{}");

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatDiv.appendChild(msg);
  chatDiv.scrollTop = chatDiv.scrollHeight;
  return msg;
}

// Função para formatar os dados de forma legível para a IA
function formatarDadosParaIA(dados) {
  if (!dados || Object.keys(dados).length === 0) {
    return "Nenhum dado de avaliação física encontrado. Por favor, solicite ao usuário que complete uma avaliação primeiro.";
  }

  let textoFormatado = "DADOS COMPLETOS DA AVALIAÇÃO FÍSICA:\n\n";

  if (dados.dadosGerais) {
    textoFormatado += "DADOS GERAIS:\n";
    textoFormatado += `- Nome: ${dados.dadosGerais.nome || 'Não informado'}\n`;
    textoFormatado += `- Idade: ${dados.dadosGerais.idade || 'Não informado'}\n`;
    textoFormatado += `- Sexo: ${dados.dadosGerais.sexo || 'Não informado'}\n`;
    textoFormatado += `- Data da Avaliação: ${dados.dadosGerais.dataAvaliacao || 'Não informado'}\n\n`;
  }

  if (dados.anamnese && Object.keys(dados.anamnese).length > 0) {
    textoFormatado += "ANAMNESE (RESPOSTAS DO QUESTIONÁRIO):\n";
    for (const [pergunta, resposta] of Object.entries(dados.anamnese)) {
      textoFormatado += `- ${pergunta}: ${resposta || 'Não informado'}\n`;
    }
    textoFormatado += "\n";
  }

  if (dados.medidas && Object.keys(dados.medidas).length > 0) {
    textoFormatado += "MEDIDAS E VALORES:\n";
    for (const [medida, valor] of Object.entries(dados.medidas)) {
      if (valor && valor !== "N/A") textoFormatado += `- ${medida}: ${valor}\n`;
    }
    textoFormatado += "\n";
  }

  if (dados.calculos && Object.keys(dados.calculos).length > 0) {
    textoFormatado += "CÁLCULOS REALIZADOS:\n";
    for (const [calculo, valor] of Object.entries(dados.calculos)) {
      if (valor && valor !== "N/A") textoFormatado += `- ${calculo}: ${valor}\n`;
    }
    textoFormatado += "\n";
  }

  if (dados.metodos && Object.keys(dados.metodos).length > 0) {
    textoFormatado += "MÉTODOS UTILIZADOS:\n";
    for (const [metodo, descricao] of Object.entries(dados.metodos)) {
      if (descricao) textoFormatado += `- ${metodo}: ${descricao}\n`;
    }
  }

  return textoFormatado;
}

async function askAI(message) {
  addMessage(message, "user");

  const dadosFormatados = formatarDadosParaIA(dadosCompletos);
  const thinkingMsg = addMessage("Analisando sua avaliação...", "ai");

  try {
    // URL da API backend que esconde a chave
    const apiUrl = window.location.hostname === "localhost"
      ? "/api/chat"
      : "https://avaliase.vercel.app/api/chat";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, dadosAvaliacao: dadosCompletos }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || response.status);
    }

    const data = await response.json();
    thinkingMsg.textContent = data.response;

  } catch (err) {
    console.error(err);
    thinkingMsg.textContent = `Erro: ${err.message || "Não foi possível conectar com o serviço de IA."}`;
  }
}

sendBtn.addEventListener("click", () => {
  if (userInput.value.trim() !== "") {
    askAI(userInput.value.trim());
    userInput.value = "";
  }
});

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && userInput.value.trim() !== "") {
    askAI(userInput.value.trim());
    userInput.value = "";
  }
});

// Mensagem inicial
if (Object.keys(dadosCompletos).length === 0) {
  addMessage("Olá! Vejo que você ainda não tem dados de avaliação física. Por favor, complete o formulário de avaliação primeiro para que eu possa ajudá-lo.", "ai");
} else {
  addMessage(`Olá ${dadosCompletos.dadosGerais?.nome || "usuário"}! Estou analisando seus dados de avaliação física. Como posso ajudá-lo hoje?`, "ai");
}
