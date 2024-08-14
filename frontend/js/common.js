document.addEventListener('DOMContentLoaded', () => {
  const navContainer = document.getElementById('nav-container');
  if (navContainer) { // Verifica se o elemento existe
      fetch('nav.html')
        .then(response => response.text())
        .then(data => {
          navContainer.innerHTML = data;
        })
        .catch(error => console.error('Error fetching navigation:', error));
  } else {
      console.error('Elemento nav-container não encontrado na página.');
  }
});
