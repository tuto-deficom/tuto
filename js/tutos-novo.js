document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("tuto-container");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const retourBtn = document.getElementById("retour");

  fetch('/tuto/data/liste-novo.json')
    .then(res => res.json())
    .then(tutos => {
      const currentUrl = window.location.pathname;
      const tuto = tutos.find(t => t.url === currentUrl);
      if (!tuto) {
        container.innerHTML = "<p>Tutoriel non trouvé.</p>";
        return;
      }

      const { type, pathEtapes, totalSteps } = tuto;
      let currentStep = 1;
      let hasStep0 = false;

      const urlParams = new URLSearchParams(window.location.search);
      const paramStep = parseInt(urlParams.get("etape"));
      if (!isNaN(paramStep)) currentStep = paramStep;

      function chargerEtape(n) {
        fetch(`${pathEtapes}/etape-${n}.html`)
          .then(response => {
            if (!response.ok) throw new Error("Étape non trouvée");
            return response.text();
          })
          .then(html => {
            container.innerHTML = html;
            if (type === "simple") {
              prevBtn.style.display = "none";
              nextBtn.style.display = "inline-block";
              nextBtn.textContent = "Terminer";
            } else {
              prevBtn.style.display = (n === 1) ? "none" : "inline-block";
              nextBtn.style.display = "inline-block";
              nextBtn.textContent = (n === totalSteps) ? "Terminer" : "Suivant →";
            }
          })
          .catch(() => {
            container.innerHTML = "<p>Erreur de chargement de l'étape.</p>";
            prevBtn.style.display = "none";
            nextBtn.style.display = "none";
          });
      }

      fetch(`${pathEtapes}/etape-0.html`)
        .then(resp => {
          if (resp.ok && !urlParams.has("etape")) {
            hasStep0 = true;
            return resp.text().then(html => {
              container.innerHTML = html;
              container.querySelectorAll("[data-step]").forEach(btn => {
                btn.addEventListener("click", () => {
                  currentStep = parseInt(btn.dataset.step);
                  chargerEtape(currentStep);
                  prevBtn.style.display = "inline-block";
                  nextBtn.style.display = "inline-block";
                });
              });
              prevBtn.style.display = "none";
              nextBtn.style.display = "none";
            });
          } else {
            chargerEtape(currentStep);
          }
        })
        .catch(() => {
          chargerEtape(currentStep);
        });

      prevBtn.addEventListener("click", () => {
        if (type === "complexe" && currentStep > 1) {
          currentStep--;
          chargerEtape(currentStep);
        } else if (hasStep0 && currentStep === 1) {
          currentStep = 0;
          fetch(`${pathEtapes}/etape-0.html`).then(r => {
            if (r.ok) {
              r.text().then(html => {
                container.innerHTML = html;
                prevBtn.style.display = "none";
                nextBtn.style.display = "none";
                container.querySelectorAll("[data-step]").forEach(btn => {
                  btn.addEventListener("click", () => {
                    currentStep = parseInt(btn.dataset.step);
                    chargerEtape(currentStep);
                    prevBtn.style.display = "inline-block";
                    nextBtn.style.display = "inline-block";
                  });
                });
              });
            } else {
              window.location.href = "/tuto/index.html";
            }
          });
        }
      });

      nextBtn.addEventListener("click", () => {
        if (currentStep < totalSteps) {
          currentStep++;
          chargerEtape(currentStep);
        } else {
          window.location.href = "/tuto/index.html";
        }
      });

      retourBtn.addEventListener("click", () => {
        if (hasStep0 && currentStep !== 0) {
          currentStep = 0;
          fetch(`${pathEtapes}/etape-0.html`).then(r => {
            if (r.ok) {
              r.text().then(html => {
                container.innerHTML = html;
                prevBtn.style.display = "none";
                nextBtn.style.display = "none";
                container.querySelectorAll("[data-step]").forEach(btn => {
                  btn.addEventListener("click", () => {
                    currentStep = parseInt(btn.dataset.step);
                    chargerEtape(currentStep);
                    prevBtn.style.display = "inline-block";
                    nextBtn.style.display = "inline-block";
                  });
                });
              });
            } else {
              window.location.href = "/tuto/index.html";
            }
          });
        } else if (currentStep === 0) {
          window.location.href = "/tuto/index.html";
        } else {
          window.location.href = "/tuto/index.html";
        }
      });

    });
});
