import { storageService } from '../services/StorageService.js';

class UserProfilePage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    if (!sessionStorage.getItem('logged_user')) {
      window.location.hash = '#login';
      return;
    }
    this.render();
    this.setupListeners();
  }

  setupListeners() {
    this.shadowRoot.addEventListener('click', (e) => {
      if (e.target.matches('.btn-cancel')) {
        this.cancelReservation(e.target.dataset.id);
      }
    });
  }

  cancelReservation(id) {
    if(confirm('¿Está seguro de que desea cancelar esta reserva?')) {
      storageService.cancelReservation(id);
      window.showModal('Reserva Cancelada', '<p class="alert alert-success">Tu reserva ha sido cancelada exitosamente. La habitación vuelve a estar disponible.</p>');
      this.render(); // Re-render to show updated list
    }
  }

  render() {
    const user = JSON.parse(sessionStorage.getItem('logged_user'));
    const reservations = storageService.getUserReservations(user.id);
    const rooms = storageService.getRooms();

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="css/pages.css">

      <div class="container">
        <div class="header">
          <h2>Mi Perfil</h2>
        </div>

        <div class="card user-info">
          <h3>Mis Datos</h3>
          <p><strong>Nombre:</strong> ${user.nombre}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Identificación:</strong> ${user.identificacion}</p>
          <p><strong>Teléfono:</strong> ${user.telefono}</p>
        </div>

        <div class="card">
          <h3>Mis Reservas</h3>
          ${reservations.length === 0 ? '<p>No tienes reservas registradas.</p>' : ''}
          
          ${reservations.map(res => {
            const room = rooms.find(r => r.id === res.habitacionId);
            return `
              <div class="reservation-item">
                <div class="res-details">
                  <h4>${room ? room.name : 'Habitación eliminada'}</h4>
                  <p><strong>Llegada:</strong> ${res.fechaEntrada}</p>
                  <p><strong>Salida:</strong> ${res.fechaSalida}</p>
                  <p><strong>Personas:</strong> ${res.cantidadPersonas}</p>
                  <p><span class="status ${res.estado}">${res.estado.toUpperCase()}</span></p>
                </div>
                <div class="res-actions">
                  <div class="total-value">$${res.valorTotal.toLocaleString('es-CO')}</div>
                  ${res.estado === 'activa' ? `<button class="btn-cancel" data-id="${res.id}">Cancelar Reserva</button>` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }
}

customElements.define('user-profile', UserProfilePage);
