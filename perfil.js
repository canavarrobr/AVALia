// Se o usuário for PROFISSIONAL
document.getElementById("btn-profissional").addEventListener("click", () => {
  localStorage.setItem("perfil", "profissional");
  window.location.href = "anamnese.html";
});

// Se o usuário for COMUM
document.getElementById("btn-comum").addEventListener("click", () => {
  localStorage.setItem("perfil", "comum");
  window.location.href = "anamnese.html";
});

// Voltar para o início
function voltarInicio() {
  window.location.href = "index.html";
}
