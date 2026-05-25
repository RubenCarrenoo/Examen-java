import { storageService } from '../services/StorageService.js';

class HotelNavbar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    // Escuchar cambios de estado de autenticación (ej: cuando el usuario se loguea/desloguea)
    window.addEventListener('auth-change', () => this.render());
  }

  get isUserLoggedIn() {
    return sessionStorage.getItem('logged_user') !== null;
  }

  get loggedUser() {
    return JSON.parse(sessionStorage.getItem('logged_user'));
  }

  logout(e) {
    e.preventDefault();
    sessionStorage.removeItem('logged_user');
    window.dispatchEvent(new CustomEvent('auth-change'));
    window.location.hash = '#home';
  }

  setupEventListeners() {
    this.shadowRoot.addEventListener('click', (e) => {
      if (e.target.matches('#logout-btn')) {
        this.logout(e);
      }
      // Manejar el toggle del menú móvil
      if (e.target.matches('.menu-toggle') || e.target.closest('.menu-toggle')) {
        const navLinks = this.shadowRoot.querySelector('.nav-links');
        navLinks.classList.toggle('active');
      }
      
      // Cerrar menú al hacer clic en un enlace
      if (e.target.matches('a.nav-link')) {
        const navLinks = this.shadowRoot.querySelector('.nav-links');
        navLinks.classList.remove('active');
      }
    });
  }

  render() {
    const isAdmin = this.isUserLoggedIn && this.loggedUser.rol === 'admin';

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="css/components.css">
      <nav class="navbar">
        <a href="#home" class="logo">Rincón del Carmen</a>
        <button class="menu-toggle">☰</button>
        <ul class="nav-links">
          <li><a href="#home" class="nav-link">Inicio</a></li>
          <li><a href="#availability" class="nav-link">Disponibilidad</a></li>
          <li><a href="#contact" class="nav-link">Contacto</a></li>
          
          ${this.isUserLoggedIn ? `
            <li class="user-info">
              <span>Hola, ${this.loggedUser.nombre.split(' ')[0]}</span>
              ${isAdmin ? `<li><a href="#admin" class="nav-link" style="color: #D4AF37;">Panel Admin</a></li>` : `<li><a href="#profile" class="nav-link">Mi Perfil</a></li>`}
              <li><a href="#" id="logout-btn" class="nav-link">Cerrar Sesión</a></li>
            </li>
          ` : `
            <li><a href="#login" class="btn-login">Iniciar Sesión</a></li>
          `}
        </ul>
      </nav>
    `;
  }
}

customElements.define('hotel-navbar', HotelNavbar);
