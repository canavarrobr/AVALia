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
  
  // Dados Gerais
  if (dados.dadosGerais) {
    textoFormatado += "DADOS GERAIS:\n";
    textoFormatado += `- Nome: ${dados.dadosGerais.nome || 'Não informado'}\n`;
    textoFormatado += `- Idade: ${dados.dadosGerais.idade || 'Não informado'}\n`;
    textoFormatado += `- Sexo: ${dados.dadosGerais.sexo || 'Não informado'}\n`;
    textoFormatado += `- Data da Avaliação: ${dados.dadosGerais.dataAvaliacao || 'Não informado'}\n\n`;
  }
  
  // Anamnese
  if (dados.anamnese && Object.keys(dados.anamnese).length > 0) {
    textoFormatado += "ANAMNESE (RESPOSTAS DO QUESTIONÁRIO):\n";
    for (const [pergunta, resposta] of Object.entries(dados.anamnese)) {
      textoFormatado += `- ${pergunta}: ${resposta || 'Não informado'}\n`;
    }
    textoFormatado += "\n";
  }
  
  // Medidas
  if (dados.medidas && Object.keys(dados.medidas).length > 0) {
    textoFormatado += "MEDIDAS E VALORES:\n";
    for (const [medida, valor] of Object.entries(dados.medidas)) {
      if (valor && valor !== "N/A") textoFormatado += `- ${medida}: ${valor}\n`;
    }
    textoFormatado += "\n";
  }
  
  // Cálculos
  if (dados.calculos && Object.keys(dados.calculos).length > 0) {
    textoFormatado += "CÁLCULOS REALIZADOS:\n";
    for (const [calculo, valor] of Object.entries(dados.calculos)) {
      if (valor && valor !== "N/A") textoFormatado += `- ${calculo}: ${valor}\n`;
    }
    textoFormatado += "\n";
  }
  
  // Métodos
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

  // Formata os dados para serem compreensíveis pela IA
  const dadosFormatados = formatarDadosParaIA(dadosCompletos);

  // Contexto estruturado para a OpenAI
  const messages = [
    {
      role: "system",
      content: `Você é um avaliador físico virtual especializado em interpretar avaliações físicas e dar orientações personalizadas. 
      ANALISE ATENTAMENTE OS DADOS DO USUÁRIO ANTES DE RESPONDER.

      DADOS DO USUÁRIO:
      ${dadosFormatados}

      SUAS DIRECTRIZES:
      1. Use APENAS os dados fornecidos - nunca invente informações
      2. Se faltarem dados importantes, peça esclarecimentos
      3. Explique os resultados de forma clara e acessível
      4. Dê orientações personalizadas com base nos dados
      5. Faça recomendações seguras e realistas
      6. Seja específico e evite generalidades
      7. Considere o risco coronariano calculado em suas recomendações
      8. Dê ênfase às recomendações de hidratação quando necessário

      IMPORTANTE: Se não houver dados suficientes, peça para o usuário completar a avaliação.`
    },
    {
      role: "user",
      content: message
    }
  ];

  const thinkingMsg = addMessage("Analisando sua avaliação...", "ai");

  try {
   await fetch("/api/chat", {...})


    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: message,
        dadosAvaliacao: dadosCompletos
      })
    });

    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erro na API: ${errorData.error || response.status}`);
    }

    const data = await response.json();
    
    // Verifica se a resposta contém o conteúdo esperado
    if (data.response) {
      // Substitui a mensagem "Analisando..." pela resposta real
      const aiMessages = document.querySelectorAll(".ai");
      aiMessages[aiMessages.length - 1].textContent = data.response;
    } else {
      throw new Error("Resposta inesperada da API");
    }
    
  } catch (err) {
    console.error("Erro detalhado:", err);
    
    // Atualiza a mensagem de erro
    const aiMessages = document.querySelectorAll(".ai");
    aiMessages[aiMessages.length - 1].textContent = 
      `Erro: ${err.message || "Não foi possível conectar com o serviço de IA."}`;
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

// Mensagem inicial baseada nos dados disponíveis
if (Object.keys(dadosCompletos).length === 0) {
  addMessage("Olá! Vejo que você ainda não tem dados de avaliação física. Por favor, complete o formulário de avaliação primeiro para que eu possa ajudá-lo.", "ai");
} else {
  addMessage(`Olá ${dadosCompletos.dadosGerais?.nome || "usuário"}! Estou analisando seus dados de avaliação física. Como posso ajudá-lo hoje?`, "ai");
}