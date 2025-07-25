fetch('/tuto/data/liste-on-air.json')
  .then(response => response.json())
  .then(tutos => {
    const container = document.getElementById('liste-on-air');
    tutos.forEach(tuto => {
      const button = document.createElement('button');
      button.className = 'tuto-button';
      button.textContent = tuto.label;
      button.onclick = () => {
        window.location.href = tuto.url;
      };
      container.appendChild(button);
      const retourBtn = document.createElement('button');
      retourBtn.className = 'tuto-button retour-button';
      retourBtn.textContent = '← Retour à l’accueil';
      retourBtn.onclick = () => {
        window.location.href = '/tuto/index.html';
      };
      container.appendChild(retourBtn);
    });
  })
  .catch(error => {
    console.error('Erreur lors du chargement des tutoriels :', error);
  });
