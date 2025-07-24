function ouvrirTuto(type) {
  let url = "#";
  switch (type) {
    case 'index':
      url = "/tuto";
      break;
    case 'zund':
      url = "/tuto/zund";
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
  window.location.href = url;
}
