document.addEventListener("DOMContentLoaded", () => {
  const etapes = document.querySelectorAll(".etape");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const retourBtn = document.getElementById("retour");

  let index = 0;

  function updateEtapes() {
    etapes.forEach((etape, i) => {
      etape.style.display = i === index ? "block" : "none";
    });

    prevBtn.disabled = index === 0;
    nextBtn.textContent = index === etapes.length - 1 ? "Terminer" : "Suivant →";
  }

  prevBtn.addEventListener("click", () => {
    if (index > 0) {
      index--;
      updateEtapes();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (index < etapes.length - 1) {
      index++;
      updateEtapes();
    } else {
      window.location.href = "/tuto/index.html"; // Redirige à la fin
    }
  });

  retourBtn.addEventListener("click", () => {
    window.location.href = "/tuto/index.html";
  });

  updateEtapes(); // Initialise l'affichage
});
