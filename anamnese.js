// Perguntas de anamnese
const perguntas = [
     "Qual seu nome?",
     "Qual sua idade?",
     "RESPONDA COM: M OU F OU OUTRO Qual seu sexo? (masculino, feminino, outro = imprecisão)",
     "Qual é o seu objetivo com a atividade física? (Hipertrofia, emagrecimento, saúde, etc.)",
    "Você pratica atividade física atualmente? Se sim, qual tipo e com que frequência?",
    "Quanto tempo por dia você passa sentado(a)?",
    "Como você avalia seu nível de estresse no dia a dia? (Baixo, médio, alto)",
    "Quantas horas de sono você tem por noite? Você acorda descansado(a)?",

    "Já realizou alguma cirurgia? Se sim, qual e quando?",
    "Sofreu alguma fratura ou lesão muscular? Especifique.",
    "Tem ou já teve problemas nas articulações (joelhos, ombros, coluna, etc.)?",
    "Já sentiu dores no peito, falta de ar ou tontura durante esforço físico? Responda com S ou N",
    "Já sentiu palpitações ou desmaios?",
    "Possui histórico familiar de doenças (diabetes, hipertensão, cardiopatia)? Aponte a distância parental(Avó)",
    "Há pessoas com problemas de coração, cardiopatas, em sua família? Responda com S ou N",
    "Faz uso de algum medicamento controlado? Se sim, qual e para quê?",
    "Tem alguma alergia? (Alimentar, medicamentosa, etc.)",
    "Já foi diagnosticado(a) com pressão alta, colesterol alto ou diabetes? Responda com S ou N",
    "Tem problemas de circulação, como varizes ou inchaço nas pernas?",

    "Você fuma ou ingere bebida alcoólica? Responda com F para frequentemente, M para moderadamente, N para Não",
    "Quantos copos de água você bebe por dia?(Copos de 250ml; Responda apenas com o numeral Ex: 6)",
    "Segue alguma dieta ou usa suplemento alimentar? Qual?",
    "Costuma consumir alimentos industrializados (enlatados, congelados, fast-food)? Responda com S ou N",
    "Como você descreveria sua alimentação no dia a dia? (Balanceada, irregular, etc.)",

    "Com que frequência você sente dores musculares após atividades do dia a dia?",
    "Tem dificuldade para subir escadas ou caminhar longas distâncias?",
    "Sente dores nas costas ao ficar muito tempo em pé ou sentado(a)?",
    "Tem alguma restrição ou preferência em relação aos tipos de exercício?",

    "O que te motivou a começar a treinar agora?",
    "Tem algum prazo ou evento específico para alcançar seu objetivo?",
    "Já tentou alcançar esse objetivo antes? O que dificultou?",
    "Prefere treinar sozinho(a), em grupo ou com acompanhamento personalizado?",
    "Tem disponibilidade para treinar quantas vezes por semana?"

    
    

 






];

let indice = 0;
let respostas = {};
const chat = document.getElementById("chat");
const input = document.getElementById("resposta");
const btnEnviar = document.getElementById("enviar");

// Função para mostrar mensagens no chat
function mostrarMensagem(texto, tipo = "bot") {
  const msg = document.createElement("div");
  msg.classList.add("mensagem", tipo);
  msg.innerText = texto;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight; // rolar para o fim
}

// Mostra a primeira pergunta
mostrarMensagem(perguntas[indice]);

// Evento ao clicar em enviar
btnEnviar.addEventListener("click", () => {
  const resposta = input.value.trim();
  if (resposta === "") return;

  // Mostra resposta do usuário
  mostrarMensagem(resposta, "user");

  // Salva resposta
  respostas[perguntas[indice]] = resposta;
  input.value = "";

  // Próxima pergunta
  indice++;
  if (indice < perguntas.length) {
    setTimeout(() => mostrarMensagem(perguntas[indice]), 600);
  } else {
    setTimeout(() => {
      mostrarMensagem("✅ Anamnese concluída!");
      localStorage.setItem("anamnese", JSON.stringify(respostas));
      setTimeout(() => window.location.href = "medidas.html", 1000);
    }, 800);
  }
});
