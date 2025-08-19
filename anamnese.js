// Perguntas de anamnese
// Variável global para o questionário selecionado
let questionario = localStorage.getItem('tipoQuestionario') || 'completa'; // padrão completa

// Array de perguntas (será preenchido conforme seleção)
let perguntas = [];

// Função para carregar as perguntas baseadas na seleção
function carregarPerguntas() {
  if (questionario === "simples") {
    perguntas = [
      { texto: "Qual seu nome?", tipo: "texto" },
      { texto: "Qual sua idade?", tipo: "numero" },
      { texto: "Qual seu sexo?", tipo: "opcoes", opcoes: ["M", "F", "Outro"] },
      { texto: "Qual é o seu objetivo com a atividade física? (Hipertrofia, emagrecimento, saúde, etc.)", tipo: "texto" },
      { texto: "Com qual frequência semanal você pratica atividades físicas?", tipo: "numero" },
      { texto: "Você pratica atividades aeróbicas, cardio?", tipo: "opcoes", opcoes: ["S", "N"] },
      { texto: "Já sentiu dores no peito, falta de ar ou tontura durante esforço físico?", tipo: "opcoes", opcoes: ["S", "N"] },
      { texto: "Já sentiu palpitações ou desmaios?", tipo: "opcoes", opcoes: ["S", "N"] },
      { texto: "Há pessoas com problemas de coração, cardiopatas, em sua família?", tipo: "opcoes", opcoes: ["S", "N"] },
      { texto: "Já foi diagnosticado(a) com pressão alta, colesterol alto ou diabetes?", tipo: "opcoes", opcoes: ["S", "N"] },
      { texto: "Tem problemas de circulação, como varizes ou inchaço nas pernas?", tipo: "opcoes", opcoes: ["S", "N"] },
      { texto: "Você fuma ou ingere bebida alcoólica? Responda com F para frequentemente, M para moderadamente, N para Não", tipo: "opcoes", opcoes: ["F", "M", "N"] },
      { texto: "Quantos copos de água você bebe por dia?(Copos de 250ml; 6 copos = 1.5L)", tipo: "numero" },
      { texto: "Costuma consumir alimentos industrializados (enlatados, congelados, fast-food)?", tipo: "opcoes", opcoes: ["S", "N"] }
    ];
  } else {
    perguntas = [
      { texto: "Qual seu nome?", tipo: "texto" },
      { texto: "Qual sua idade?", tipo: "numero" },
      { texto: "Qual seu sexo?", tipo: "opcoes", opcoes: ["M", "F", "Outro"] },
      { texto: "Qual é o seu objetivo com a atividade física? (Hipertrofia, emagrecimento, saúde, etc.)", tipo: "texto" },
      { texto: "Com qual frequência semanal você pratica atividades físicas?", tipo: "numero" },
      { texto: "Você faz atividades aeróbicas, cardio?", tipo: "opcoes", opcoes: ["S", "N"] },
      { texto: "Quanto tempo por dia você passa sentado(a)?", tipo: "texto" },
      { texto: "Como você avalia seu nível de estresse no dia a dia? (Baixo, médio, alto)", tipo: "texto" },
      { texto: "Quantas horas de sono você tem por noite? Você acorda descansado(a)?", tipo: "texto" },
      { texto: "Já realizou alguma cirurgia? Se sim, qual e quando?", tipo: "texto" },
      { texto: "Sofreu alguma fratura ou lesão muscular? Especifique.", tipo: "texto" },
      { texto: "Tem ou já teve problemas nas articulações (joelhos, ombros, coluna, etc.)?", tipo: "texto" },
      { texto: "Já sentiu dores no peito, falta de ar ou tontura durante esforço físico?", tipo: "opcoes", opcoes: ["S", "N"] },
      { texto: "Já sentiu palpitações ou desmaios?", tipo: "opcoes", opcoes: ["S", "N"] },
      { texto: "Possui histórico familiar de doenças (diabetes, hipertensão, cardiopatia)? Aponte a distância parental(Avó)", tipo: "texto" },
      { texto: "Há pessoas com problemas de coração, cardiopatas, em sua família?", tipo: "opcoes", opcoes: ["S", "N"] },
      { texto: "Faz uso de algum medicamento controlado? Se sim, qual e para quê?", tipo: "texto" },
      { texto: "Tem alguma alergia? (Alimentar, medicamentosa, etc.)", tipo: "texto" },
      { texto: "Já foi diagnosticado(a) com pressão alta, colesterol alto ou diabetes?", tipo: "opcoes", opcoes: ["S", "N"] },
      { texto: "Tem problemas de circulação, como varizes ou inchaço nas pernas?", tipo: "opcoes", opcoes: ["S", "N"] },
      { texto: "Você fuma ou ingere bebida alcoólica? Responda com F para frequentemente, M para moderadamente, N para Não", tipo: "opcoes", opcoes: ["F", "M", "N"] },
      { texto: "Quantos copos de água você bebe por dia?(Copos de 250ml; 6 copos = 1.5L)", tipo: "numero" },
      { texto: "Segue alguma dieta ou usa suplemento alimentar? Qual?", tipo: "texto" },
      { texto: "Costuma consumir alimentos industrializados (enlatados, congelados, fast-food)?", tipo: "opcoes", opcoes: ["S", "N"] },
      { texto: "Como você descreveria sua alimentação no dia a dia? (Balanceada, irregular, etc.)", tipo: "texto" },
      { texto: "Com que frequência você sente dores musculares após atividades do dia a dia?", tipo: "texto" },
      { texto: "Tem dificuldade para subir escadas ou caminhar longas distâncias?", tipo: "texto" },
      { texto: "Sente dores nas costas ao ficar muito tempo em pé ou sentado(a)?", tipo: "texto" },
      { texto: "Tem alguma restrição ou preferência em relação aos tipos de exercício?", tipo: "texto" },
      { texto: "O que te motivou a começar a treinar agora?", tipo: "texto" },
      { texto: "Tem algum prazo ou evento específico para alcançar seu objetivo?", tipo: "texto" },
      { texto: "Já tentou alcançar esse objetivo antes? O que dificultou?", tipo: "texto" },
      { texto: "Prefere treinar sozinho(a), em grupo ou com acompanhamento personalizado?", tipo: "texto" },
      { texto: "Tem disponibilidade para treinar quantas vezes por semana?", tipo: "texto" }
    ];
  }
}

let indice = 0;
let respostas = {};
const chat = document.getElementById("chat");
const input = document.getElementById("resposta");
const btnEnviar = document.getElementById("enviar");

carregarPerguntas();

// Função para exibir mensagens no chat
function mostrarMensagem(texto, tipo = "bot") {
  const msg = document.createElement("div");
  msg.classList.add("mensagem", tipo);
  msg.innerText = texto;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

// Função para criar input apenas se necessário (número/opções)
function criarInput(pergunta) {
  const container = document.createElement("div");
  container.id = "input-container";

  const antigo = document.getElementById("input-container");
  if (antigo) antigo.remove();

  if (pergunta.tipo === "numero") {
    const inputNum = document.createElement("input");
    inputNum.type = "number";
    inputNum.id = "resposta-numero";
    inputNum.min = "0";
    container.appendChild(inputNum);

    inputNum.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        enviarResposta();
      }
    });

    setTimeout(() => inputNum.focus(), 100);
  } 
  else if (pergunta.tipo === "opcoes") {
    // Limpa seleções anteriores de rádio
    document.querySelectorAll('input[name="resposta"]').forEach(radio => {
    radio.checked = false;
    });
    pergunta.opcoes.forEach(op => {
      const label = document.createElement("label");
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "resposta";
      radio.value = op;
      
      radio.addEventListener("change", () => {
        if (radio.checked) {
          setTimeout(enviarResposta, 300);
        }
      });

      label.appendChild(radio);
      label.appendChild(document.createTextNode(" " + op));
      container.appendChild(label);
      container.appendChild(document.createElement("br"));
    });
  }

  return container;
}



// Evento do input de texto padrão
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    enviarResposta();
  }
});

function atualizarEstadoBotao(tipoPergunta) {
  if (tipoPergunta === "opcoes") {
    btnEnviar.disabled = true;  // Desabilita o botão para perguntas de rádio
    btnEnviar.style.opacity = "0.5";  // Opcional: deixa o botão visualmente inativo
  } else {
    btnEnviar.disabled = false;  // Habilita para outros tipos
    btnEnviar.style.opacity = "1";
  }
}

// Mostra pergunta atual
function mostrarPergunta() {

   // Limpa o chat antes de mostrar nova pergunta
  chat.innerHTML = '';

  const pergunta = perguntas[indice];
  mostrarMensagem(pergunta.texto);
  atualizarEstadoBotao(pergunta.tipo);
  input.value = ""; // Limpa o input ao mudar de pergunta

  if (pergunta.tipo === "texto") {
    // Usar o input fixo
    input.style.display = "inline-block";
    setTimeout(() => input.focus(), 100);
  } else {
    // Esconde o input fixo e cria um novo se necessário
    input.style.display = "none";
    const novoInput = criarInput(pergunta);
    chat.appendChild(novoInput);
    chat.scrollTop = chat.scrollHeight;
  }
}

// Enviar resposta
function enviarResposta() {
  const perguntaAtual = perguntas[indice];
  let resposta = "";

  // Lógica para cada tipo de pergunta
  if (perguntaAtual.tipo === "texto") {
    resposta = input.value.trim();
    if (resposta === "") return;
    input.value = ""; // Limpa o campo
  } 
  else if (perguntaAtual.tipo === "numero") {
    const inputNum = document.getElementById("resposta-numero");
    resposta = inputNum?.value.trim() || "";
    if (resposta === "") return;
  }
  else if (perguntaAtual.tipo === "opcoes") {
    const selecionado = document.querySelector('input[name="resposta"]:checked');
    if (!selecionado) return;
    resposta = selecionado.value;
  }

  // Processamento da resposta
  mostrarMensagem(resposta, "user");
  respostas[perguntaAtual.texto] = resposta;

  // Transição para próxima pergunta
  indice++;
  if (indice < perguntas.length) {
    setTimeout(mostrarPergunta, 600);
  } else {
    mostrarMensagem("✅ Anamnese concluída!");
    localStorage.setItem("anamnese", JSON.stringify(respostas));
    setTimeout(() => window.location.href = "medidas.html", 1000);
  }
}

// Evento botão enviar
btnEnviar.addEventListener("click", enviarResposta);

// Enter envia também
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    enviarResposta();
  }
});

// Inicia
mostrarPergunta();

// Listener:
/*
btnEnviar.addEventListener("click", () => {
  const perguntaAtual = perguntas[indice];
  
  // Bloqueia envio se for pergunta de rádio (já que elas enviam automaticamente)
  if (perguntaAtual.tipo === "opcoes") return;
  
  // Para perguntas de texto/número:
  if (perguntaAtual.tipo === "texto" || perguntaAtual.tipo === "numero") {
    const resposta = input.value.trim();
    if (resposta === "") return; // Não envia vazio
    
    mostrarMensagem(resposta, "user");
    respostas[perguntaAtual.texto] = resposta;
    input.value = ""; // Limpa o campo
  }
  
  // Avança para próxima pergunta
  indice++;
  if (indice < perguntas.length) {
    setTimeout(mostrarPergunta, 600);
  } else {
    mostrarMensagem("✅ Anamnese concluída!");
    localStorage.setItem("anamnese", JSON.stringify(respostas));
    setTimeout(() => window.location.href = "medidas.html", 1000);
  }
});

*/