// Se a anamnese for simples
document.getElementById("btn-simples").addEventListener("click", () => {
  localStorage.setItem("tipoQuestionario", "simples");
  window.location.href = "anamnese.html";
});

// Se a anamnese for completa
document.getElementById("btn-completa").addEventListener("click", () => {
  localStorage.setItem("tipoQuestionario", "completa");
  window.location.href = "anamnese.html";
});

// Voltar para o início
function voltarInicio() {
  window.location.href = "index.html";
}
