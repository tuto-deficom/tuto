fetch('/tuto/data/liste-novo.json')
  .then(response => response.json())
  .then(tutos => {
    const container = document.getElementById('liste-novo');
    tutos.forEach(tuto => {
      const button = document.createElement('button');
      button.className = 'tuto-button';
      button.textContent = tuto.label;
      button.onclick = () => {
        window.location.href = tuto.url;
      };
      container.appendChild(button);
    });
  })
  .catch(error => {
    console.error('Erreur lors du chargement des tutoriels :', error);
  });
