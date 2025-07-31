document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("tuto-container");
  const steps = [];
  let currentStep = 0;
  const totalSteps = 2; // ajuste si tu ajoutes d'autres étapes

  // Charger toutes les étapes
  function loadSteps() {
    for (let i = 1; i <= totalSteps; i++) {
      fetch(`/tuto/novo/perforatrice/etape-${i}.html`)
        .then(response => response.text())
        .then(html => {
          const div = document.createElement("div");
          div.className = "etape";
          div.style.display = "none";
          div.innerHTML = html;
          steps.push(div);
          container.appendChild(div);

          if (steps.length === totalSteps) {
            showStep(0);
          }
        });
    }
  }

  function showStep(index) {
    steps.forEach((step, i) => {
      step.style.display = i === index ? "block" : "none";
    });
    currentStep = index;
  }

  document.getElementById("next").addEventListener("click", () => {
    if (currentStep < steps.length - 1) showStep(currentStep + 1);
  });

  document.getElementById("prev").addEventListener("click", () => {
    if (currentStep > 0) showStep(currentStep - 1);
  });

  document.getElementById("retour").addEventListener("click", () => {
    window.location.href = "/tuto/novo-index.html";
  });

  loadSteps();
});