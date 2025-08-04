(function () {
  const CODE_ATTENDU = "moncode123"; // 💡 change ce code comme tu veux
  const COOKIE_NAME = "code_acces_tuto";

  function getCookie(name) {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith(name + '='))
      ?.split('=')[1];
  }

  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
  }

  // Vérifie si le code a déjà été validé
  const codeValide = getCookie(COOKIE_NAME);
  if (codeValide === CODE_ATTENDU) return; // ✅ accès autorisé

  // Sinon, boucle jusqu’à ce que le bon code soit entré
  let tentative = "";
  while (tentative !== CODE_ATTENDU) {
    tentative = prompt("Veuillez entrer le code d'accès pour consulter ce tutoriel :");
    if (tentative === null) {
      // L'utilisateur a annulé → on le redirige vers l'accueil
      window.location.href = "/tuto/index.html";
      return;
    }
  }

  // ✅ Code correct → on stocke le cookie
  setCookie(COOKIE_NAME, CODE_ATTENDU, 7); // valable 7 jours
})();

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("tuto-container");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const retourBtn = document.getElementById("retour");

  // Charger la liste des tutos (exemple avec liste-on-air.json)
  fetch('/tuto/data/liste-on-air.json')
    .then(res => res.json())
    .then(tutos => {
      const currentUrl = window.location.pathname;
      const tuto = tutos.find(t => t.url === currentUrl);

      if (!tuto) {
        container.innerHTML = "<p>Tutoriel non trouvé.</p>";
        return;
      }

      console.log("Tuto trouvé :", tuto);

      const { type, pathEtapes, totalSteps } = tuto;
      let currentStep = 1;
      let hasStep0 = false;

      // Récupérer paramètre d'étape dans l'URL (?etape=)
      const urlParams = new URLSearchParams(window.location.search);
      const paramStep = parseInt(urlParams.get("etape"));
      if (!isNaN(paramStep)) {
        currentStep = paramStep;
      }

      // Tester si l'étape 0 existe (uniquement si paramStep non défini)
      fetch(`${pathEtapes}/etape-0.html`)
        .then(response => {
          if (response.ok && !urlParams.has("etape")) {
            hasStep0 = true;
            return response.text();
          } else {
            hasStep0 = false;
            throw new Error("Pas d'étape 0");
          }
        })
        .then(html => {
          container.innerHTML = html;

          // Ajouter gestion des boutons data-step dans l'étape 0
          container.querySelectorAll("[data-step]").forEach(btn => {
            btn.addEventListener("click", () => {
              currentStep = parseInt(btn.dataset.step);
              chargerEtape(currentStep);
            });
          });

          // Masquer les boutons système sur étape 0
          prevBtn.style.display = "none";
          nextBtn.style.display = "none";
        })
        .catch(() => {
          // Pas d'étape 0 ou erreur, charger directement l'étape demandée
          chargerEtape(currentStep);
        });

      function chargerEtape(n) {
        fetch(`${pathEtapes}/etape-${n}.html`)
          .then(response => {
            if (!response.ok) throw new Error("Étape non trouvée");
            return response.text();
          })
          .then(html => {
            container.innerHTML = html;

            // Afficher les boutons par défaut
            prevBtn.style.display = "inline-block";
            nextBtn.style.display = "inline-block";

            prevBtn.disabled = (n === 1);

            if (type === "simple") {
              prevBtn.style.display = "none";
              nextBtn.textContent = "Terminer";
            } else {
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
          // Fin du tuto : redirection vers index si pas d'étape 0
          if (hasStep0) {
            // Retour à étape 0
            fetch(`${pathEtapes}/etape-0.html`).then(response => {
              if (response.ok) {
                hasStep0 = true;
                currentStep = 0;
                response.text().then(html => {
                  container.innerHTML = html;
                  prevBtn.style.display = "none";
                  nextBtn.style.display = "none";
                  container.querySelectorAll("[data-step]").forEach(btn => {
                    btn.addEventListener("click", () => {
                      currentStep = parseInt(btn.dataset.step);
                      chargerEtape(currentStep);
                    });
                  });
                });
              } else {
                window.location.href = "/tuto/index.html";
              }
            });
          } else {
            window.location.href = "/tuto/index.html";
          }
        }
      });

      retourBtn.addEventListener("click", () => {
        if (hasStep0 && currentStep !== 0) {
          // Retour à étape 0
          fetch(`${pathEtapes}/etape-0.html`).then(response => {
            if (response.ok) {
              currentStep = 0;
              response.text().then(html => {
                container.innerHTML = html;
                prevBtn.style.display = "none";
                nextBtn.style.display = "none";
                container.querySelectorAll("[data-step]").forEach(btn => {
                  btn.addEventListener("click", () => {
                    currentStep = parseInt(btn.dataset.step);
                    chargerEtape(currentStep);
                  });
                });
              });
            } else {
              window.location.href = "/tuto/index.html";
            }
          });
        } else {
          // Sinon retour à l'index
          window.location.href = "/tuto/index.html";
        }
      });
    });
});
