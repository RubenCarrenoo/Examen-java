// Import Componentes
import './components/Navbar.js';
import './components/Footer.js';
import './components/Modal.js';

// Import Vistas
import './pages/HomePage.js';
import './pages/AvailabilityPage.js';
import './pages/ContactPage.js';
import './pages/AuthPages.js';
import './pages/UserProfilePage.js';
import './pages/AdminDashboard.js';

class AppRouter {
  constructor() {
    this.appContainer = document.getElementById('app-container');
    window.addEventListener('hashchange', () => this.handleRoute());
    
    // Iniciar ruta
    this.handleRoute();
  }

  handleRoute() {
    const hash = window.location.hash || '#home';
    const path = hash.substring(1);
    
    this.appContainer.innerHTML = ''; // Limpiar contenedor

    switch (path) {
      case 'home':
        this.appContainer.appendChild(document.createElement('home-page'));
        break;
      case 'availability':
        this.appContainer.appendChild(document.createElement('availability-page'));
        break;
      case 'contact':
        this.appContainer.appendChild(document.createElement('contact-page'));
        break;
      case 'login':
        this.appContainer.appendChild(document.createElement('login-page'));
        break;
      case 'register':
        this.appContainer.appendChild(document.createElement('register-page'));
        break;
      case 'profile':
        this.appContainer.appendChild(document.createElement('user-profile'));
        break;
      case 'admin':
        this.appContainer.appendChild(document.createElement('admin-dashboard'));
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
