// ===================== medidas.js =====================

// Verifica perfil
const perfil = localStorage.getItem("perfil");

// Pega Dados (Anamnese)
const anamnese = JSON.parse(localStorage.getItem("anamnese")) || {};
const nome = anamnese["Qual seu nome?"] || "usuario";
const idade = parseInt(anamnese["Qual sua idade?"]) || 25;
const sexoStr = anamnese["RESPONDA COM: M OU F OU OUTRO Qual seu sexo? (masculino, feminino, outro = imprecisão)"] || "Não informado";

// Normaliza sexo: m | f | n (não informado/outro)
let sexo = (sexoStr || "").trim().toLowerCase();
if (sexo.startsWith("m")) sexo = "m";
else if (sexo.startsWith("f")) sexo = "f";
else sexo = "n";

// Mostra formulário certo
if (perfil === "profissional") {
  document.getElementById("form-comum").style.display = "block";
  document.getElementById("form-profissional").style.display = "block";
} else {
  document.getElementById("form-comum").style.display = "block";
  document.getElementById("form-profissional").style.display = "none";
}

// Botão calcular
document.getElementById("btn-calcular").addEventListener("click", () => {
  const peso = parseFloat(document.getElementById("peso").value);              // kg
  const altura_cm = parseFloat(document.getElementById("altura").value);       // cm
  const altura_m = altura_cm / 100;                                           // m
  const cintura_cm = parseFloat(document.getElementById("cintura").value);     // cm (homem = abdômen umbigo)
  const quadril_cm = parseFloat(document.getElementById("quadril").value);     // cm (mulher)
  const pescoco_cm = parseFloat(document.getElementById("pescoco").value);     // cm

  // validações básicas
  if (!peso || !altura_m || peso <= 0 || altura_m <= 0) {
    alert("Preencha peso e altura corretamente.");
    return;
  }

  let resultados = {};

  // Salva básicos
  resultados.peso = Number(peso.toFixed(1));
  resultados.altura_cm = Math.round(altura_cm);

  // ===== IMC =====
  resultados.imc = (peso / (altura_m * altura_m)).toFixed(2);

  // ===== TMB (Mifflin-St Jeor) =====
  if (sexo === "m") {
    resultados.tmb = Math.round(10 * peso + 6.25 * altura_cm - 5 * idade + 5);
  } else if (sexo === "f") {
    resultados.tmb = Math.round(10 * peso + 6.25 * altura_cm - 5 * idade - 161);
  } else {
    resultados.tmb = Math.round(10 * peso + 6.25 * altura_cm - 5 * idade); // neutro
  }

  // ===== % Gordura - Método Marinha EUA (perfil comum) =====
  if (perfil === "comum") {
    const toIn = v => v / 2.54; // conversão para inches
    const altura_in = toIn(altura_cm);
    const cintura_in = toIn(cintura_cm);
    const quadril_in = toIn(quadril_cm);
    const pescoco_in = toIn(pescoco_cm);

    let bf = "N/A";

    if (sexo === "m") {
      const A = cintura_in - pescoco_in;
      if (A > 0 && altura_in > 0) {
        bf = (86.010 * Math.log10(A) - 70.041 * Math.log10(altura_in) + 36.76).toFixed(2);
      }
    } else if (sexo === "f") {
      const A = cintura_in + quadril_in - pescoco_in;
      if (A > 0 && altura_in > 0) {
        bf = (163.205 * Math.log10(A) - 97.684 * Math.log10(altura_in) - 78.387).toFixed(2);
      }
    } else {
      const A = cintura_in - pescoco_in; // fallback
      if (A > 0 && altura_in > 0) {
        bf = (86.010 * Math.log10(A) - 70.041 * Math.log10(altura_in) + 36.76).toFixed(2);
      }
    }

    resultados.gordura = bf;
    resultados.metodoGordura = "Marinha EUA";
  }

  // ===== PROFISSIONAL: Dobras Cutâneas (Pollock 7) =====
  if (perfil === "profissional") {
    const triceps = parseFloat(document.getElementById("triceps").value);
    const peito = parseFloat(document.getElementById("peito").value);
    const abdomen = parseFloat(document.getElementById("abdomen").value);
    const coxa = parseFloat(document.getElementById("coxa").value);
    const subescapular = parseFloat(document.getElementById("subescapular").value);
    const suprailiaca = parseFloat(document.getElementById("suprailiaca").value);
    const axilar = parseFloat(document.getElementById("axilar").value);

    const somaDobras = triceps + peito + abdomen + coxa + subescapular + suprailiaca + axilar;

    if (isFinite(somaDobras) && somaDobras > 0) {
      let densidadeCorporal;
      if (sexo === "m") {
        densidadeCorporal = 1.112 - 0.00043499 * somaDobras
                          + 0.00000055 * (somaDobras ** 2)
                          - 0.00028826 * idade;
      } else if (sexo === "f") {
        densidadeCorporal = 1.097 - 0.00046971 * somaDobras
                          + 0.00000056 * (somaDobras ** 2)
                          - 0.00012828 * idade;
      } else {
        const densM = 1.112 - 0.00043499 * somaDobras
                    + 0.00000055 * (somaDobras ** 2)
                    - 0.00028826 * idade;
        const densF = 1.097 - 0.00046971 * somaDobras
                    + 0.00000056 * (somaDobras ** 2)
                    - 0.00012828 * idade;
        densidadeCorporal = (densM + densF) / 2;
      }

      if (densidadeCorporal && isFinite(densidadeCorporal)) {
        resultados.gordura = ((495 / densidadeCorporal) - 450).toFixed(2);
        resultados.metodoGordura = "Pollock 7 Dobras";
      }
    }
  }

  // ===== Hidratação =====
  const coposStr = anamnese["Quantos copos de água você bebe por dia?(Copos de 250ml; Responda apenas com o numeral Ex: 6)"] || "0";
  const copos = parseInt(String(coposStr).replace(/\D/g, "")) || 0;
  const agua_ml = copos * 250;
  const agua_min_ml = Math.round(peso * 35);

  resultados.hidr_agua_ml = agua_ml;
  resultados.hidr_min_ml = agua_min_ml;
  resultados.hidr_status = (agua_ml >= agua_min_ml) ? "Adequado" : "Insuficiente";

  // Salva e redireciona
  localStorage.setItem("medidas", JSON.stringify(resultados));
  window.location.href = "resultados.html";
});
