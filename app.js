// Import Componentes
import './components/Navbar.js';
import './components/Footer.js';
import './components/Modal.js';

// Import Vistas (se crearán en la Fase 3 y 4)
// import './pages/HomePage.js';
// import './pages/AvailabilityPage.js';
// ... etc

class AppRouter {
  constructor() {
    this.appContainer = document.getElementById('app-container');
    window.addEventListener('hashchange', () => this.handleRoute());
    
    // Iniciar ruta
    this.handleRoute();
  }

  handleRoute() {
    const hash = window.location.hash || '#home';
    const path = hash.substring(1); // remueve el '#'
    
    this.appContainer.innerHTML = ''; // Limpiar contenedor

    switch (path) {
      case 'home':
        this.appContainer.innerHTML = '<h2>Página de Inicio (En construcción)</h2>';
        // this.appContainer.appendChild(document.createElement('home-page'));
        break;
      case 'availability':
        this.appContainer.innerHTML = '<h2>Disponibilidad (En construcción)</h2>';
        break;
      case 'contact':
        this.appContainer.innerHTML = '<h2>Contacto (En construcción)</h2>';
        break;
      case 'login':
        this.appContainer.innerHTML = '<h2>Login (En construcción)</h2>';
        break;
      case 'register':
        this.appContainer.innerHTML = '<h2>Registro (En construcción)</h2>';
        break;
      case 'profile':
        this.appContainer.innerHTML = '<h2>Perfil (En construcción)</h2>';
        break;
      case 'admin':
        this.appContainer.innerHTML = '<h2>Panel Admin (En construcción)</h2>';
        break;
      default:
        this.appContainer.innerHTML = '<h2>Página no encontrada</h2>';
    }
    
    // Scroll to top upon navigation
    window.scrollTo(0, 0);
  }
}

// Inicializar aplicación una vez que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new AppRouter();
});
