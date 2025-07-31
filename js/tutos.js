document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("tuto-container");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const retourBtn = document.getElementById("retour");

  // On récupère le JSON complet des tutos (exemple avec liste-novo.json)
  fetch('/tuto/data/liste-novo.json')
    .then(res => res.json())
    .then(tutos => {
      // Trouver le tuto correspondant à la page actuelle
      const currentUrl = window.location.pathname;
      const tuto = tutos.find(t => t.url === currentUrl);
      if (!tuto) {
        container.innerHTML = "<p>Tutoriel non trouvé.</p>";
        return;
      }

      const { type, pathEtapes, totalSteps } = tuto;
      let currentStep = 1;

      function chargerEtape(n) {
        fetch(`${pathEtapes}/etape-${n}.html`)
          .then(response => {
            if (!response.ok) throw new Error("Étape non trouvée");
            return response.text();
          })
          .then(html => {
            container.innerHTML = html;
            prevBtn.disabled = (n === 1);

            if (type === "simple") {
              // Simple : bouton Terminer seul
              prevBtn.style.display = "none";
              nextBtn.textContent = "Terminer";
            } else {
              // Complexe : boutons Prev/Next classiques
              prevBtn.style.display = "inline-block";
              nextBtn.textContent = (n === totalSteps) ? "Terminer" : "Suivant →";
            }
          })
          .catch(() => {
            container.innerHTML = "<p>Erreur de chargement de l'étape.</p>";
          });
      }

      prevBtn.addEventListener("click", () => {
        if (type === "complexe" && currentStep > 1) {
          currentStep--;
          chargerEtape(currentStep);
        }
      });

      nextBtn.addEventListener("click", () => {
        if (currentStep < totalSteps) {
          currentStep++;
          chargerEtape(currentStep);
        } else {
          // Terminer ou fin du tuto
          window.location.href = "/tuto/index.html";
        }
      });

      retourBtn.addEventListener("click", () => {
        window.location.href = "/tuto/index.html";
      });

      // Chargement initial
      chargerEtape(currentStep);
    });
});
