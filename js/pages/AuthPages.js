import { storageService } from '../services/StorageService.js';

class LoginPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupListeners();
  }

  setupListeners() {
    this.shadowRoot.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = e.target.email.value;
      const password = e.target.password.value;

      try {
        const user = storageService.loginUser(email, password);
        sessionStorage.setItem('logged_user', JSON.stringify(user));
        
        // Disparar evento global para que el Navbar se actualice
        window.dispatchEvent(new CustomEvent('auth-change'));
        
        window.showModal('Éxito', '<p class="alert alert-success">Sesión iniciada correctamente.</p>');
        
        // Redirigir según rol
        setTimeout(() => {
          window.location.hash = user.rol === 'admin' ? '#admin' : '#profile';
        }, 1500);
      } catch (error) {
        window.showModal('Error', `<p class="alert alert-error">${error.message}</p>`);
      }
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="css/pages.css">
      <div class="auth-card">
        <h2>Iniciar Sesión</h2>
        <form>
          <div class="form-group">
            <label>Correo Electrónico</label>
            <input type="email" name="email" class="form-control" required>
          </div>
          <div class="form-group">
            <label>Contraseña</label>
            <input type="password" name="password" class="form-control" required>
          </div>
          <button type="submit" class="btn">Ingresar</button>
        </form>
        <p class="text-center">
          ¿No tienes una cuenta? <a href="#register">Regístrate aquí</a>
        </p>
      </div>
    `;
  }
}

class RegisterPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupListeners();
  }

  setupListeners() {
    this.shadowRoot.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      
      const user = {
        identificacion: form.identificacion.value,
        nombre: form.nombre.value,
        nacionalidad: form.nacionalidad.value,
        email: form.email.value,
        telefono: form.telefono.value,
        password: form.password.value
      };

      try {
        storageService.addUser(user);
        window.showModal('Registro Exitoso', '<p class="alert alert-success">Tu cuenta ha sido creada. Ahora puedes iniciar sesión.</p>');
        setTimeout(() => {
          window.location.hash = '#login';
        }, 2000);
      } catch (error) {
        window.showModal('Error', `<p class="alert alert-error">${error.message}</p>`);
      }
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="css/pages.css">
      <div class="auth-card">
        <h2>Registro de Usuario</h2>
        <form class="form-grid">
          <div class="form-group full-width">
            <label>Nombre Completo</label>
            <input type="text" name="nombre" class="form-control" required>
          </div>
          <div class="form-group">
            <label>Identificación</label>
            <input type="text" name="identificacion" class="form-control" required>
          </div>
          <div class="form-group">
            <label>Nacionalidad</label>
            <input type="text" name="nacionalidad" class="form-control" required>
          </div>
          <div class="form-group">
            <label>Teléfono</label>
            <input type="tel" name="telefono" class="form-control" required>
          </div>
          <div class="form-group">
            <label>Correo Electrónico</label>
            <input type="email" name="email" class="form-control" required>
          </div>
          <div class="form-group full-width">
            <label>Contraseña</label>
            <input type="password" name="password" class="form-control" required>
          </div>
          <button type="submit" class="btn">Registrarse</button>
          <p class="text-center">
            ¿Ya tienes una cuenta? <a href="#login">Inicia sesión aquí</a>
          </p>
        </form>
      </div>
    `;
  }
}

customElements.define('login-page', LoginPage);
customElements.define('register-page', RegisterPage);
