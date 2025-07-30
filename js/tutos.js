document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("tuto-container");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const retourBtn = document.getElementById("retour");

  const totalEtapes = 4; // change en fonction du nombre d'étapes
  let index = 1;

  function chargerEtape(n) {
    fetch(`/tuto/etapes/etape${n}.html`)
      .then(response => {
        if (!response.ok) throw new Error("Étape non trouvée");
        return response.text();
      })
      .then(html => {
        container.innerHTML = html;
        prevBtn.disabled = index === 1;
        nextBtn.textContent = index === totalEtapes ? "Terminer" : "Suivant →";
      })
      .catch(error => {
        container.innerHTML = "<p>Erreur de chargement de l'étape.</p>";
        console.error(error);
      });
  }

  prevBtn.addEventListener("click", () => {
    if (index > 1) {
      index--;
      chargerEtape(index);
    }
  });

  nextBtn.addEventListener("click", () => {
    if (index < totalEtapes) {
      index++;
      chargerEtape(index);
    } else {
      window.location.href = "/tuto/index.html";
    }
  });

  retourBtn.addEventListener("click", () => {
    window.location.href = "/tuto/index.html";
  });

  // Chargement initial
  chargerEtape(index);
});
