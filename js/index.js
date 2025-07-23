function ouvrirTuto(type) {
  let url = "#";
  switch (type) {
    case 'html':
      url = "https://developer.mozilla.org/fr/docs/Web/HTML";
      break;
    case 'css':
      url = "https://developer.mozilla.org/fr/docs/Web/CSS";
      break;
    case 'js':
      url = "https://developer.mozilla.org/fr/docs/Web/JavaScript";
      break;
    case 'react':
      url = "https://reactjs.org/";
      break;
  }
  window.open(url, '_blank');
}
