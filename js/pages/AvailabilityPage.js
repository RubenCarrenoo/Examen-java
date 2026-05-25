import { storageService } from '../services/StorageService.js';

class AvailabilityPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.rooms = [];
    this.searchParams = null;
  }

  connectedCallback() {
    this.render();
    this.setupListeners();
  }

  setupListeners() {
    this.shadowRoot.addEventListener('submit', (e) => {
      if (e.target.id === 'search-form') {
        e.preventDefault();
        this.handleSearch(e.target);
      }
    });

    this.shadowRoot.addEventListener('click', (e) => {
      if (e.target.matches('.btn-book')) {
        this.handleBooking(e.target.dataset.id);
      }
    });
  }

  handleSearch(form) {
    const checkIn = form.checkin.value;
    const checkOut = form.checkout.value;
    const guests = parseInt(form.guests.value);

    if (new Date(checkIn) >= new Date(checkOut)) {
      window.showModal('Error', '<p class="alert alert-error">La fecha de salida debe ser mayor a la fecha de entrada.</p>');
      return;
    }

    this.searchParams = { checkIn, checkOut, guests };
    this.rooms = storageService.searchAvailableRooms(checkIn, checkOut, guests);
    this.renderResults();
  }

  handleBooking(roomId) {
    const isLoggedIn = sessionStorage.getItem('logged_user') !== null;
    if (!isLoggedIn) {
      window.showModal('Atención', '<p>Debes <strong>iniciar sesión</strong> o registrarte para realizar una reserva.</p><a href="#login" class="btn btn-primary mt-1">Ir a Iniciar Sesión</a>');
      return;
    }

    const room = this.rooms.find(r => r.id === roomId);
    const user = JSON.parse(sessionStorage.getItem('logged_user'));
    
    // Calcular noches
    const inDate = new Date(this.searchParams.checkIn);
    const outDate = new Date(this.searchParams.checkOut);
    const diffTime = Math.abs(outDate - inDate);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalValue = nights * room.pricePerNight;

    const confirmHtml = `
      <div style="font-family: 'Inter', sans-serif;">
        <p><strong>Habitación:</strong> ${room.name}</p>
        <p><strong>Fechas:</strong> ${this.searchParams.checkIn} al ${this.searchParams.checkOut} (${nights} noches)</p>
        <p><strong>Huéspedes:</strong> ${this.searchParams.guests}</p>
        <p><strong>Servicios incluidos:</strong> ${room.services.join(', ')}</p>
        <h3 style="color: #D4AF37; margin-top: 1rem;">Total a Pagar: $${totalValue.toLocaleString('es-CO')}</h3>
        <button id="confirm-btn" class="btn btn-primary mt-1" style="width: 100%;">Confirmar Reserva</button>
      </div>
    `;

    window.showModal('Confirmar Reserva', confirmHtml);

    // Event listener para el modal global (se busca en el DOM principal)
    setTimeout(() => {
      const modal = document.getElementById('global-modal');
      const confirmBtn = modal.shadowRoot.querySelector('#confirm-btn');
      if (confirmBtn) {
        confirmBtn.onclick = () => {
          try {
            storageService.addReservation({
              usuarioId: user.id,
              habitacionId: room.id,
              fechaEntrada: this.searchParams.checkIn,
              fechaSalida: this.searchParams.checkOut,
              cantidadPersonas: this.searchParams.guests,
              valorTotal: totalValue
            });
            window.showModal('Éxito', '<p class="alert alert-success">Reserva realizada con éxito. Puedes ver los detalles en tu perfil.</p>');
            // Limpiar búsqueda para actualizar vista
            this.handleSearch(this.shadowRoot.getElementById('search-form'));
          } catch (error) {
            window.showModal('Error', `<p class="alert alert-error">${error.message}</p>`);
          }
        };
      }
    }, 100);
  }

  renderResults() {
    const resultsContainer = this.shadowRoot.querySelector('#results');
    if (!resultsContainer) return;

    if (!this.searchParams) {
      resultsContainer.innerHTML = '<p class="text-center" style="color: #7f8c8d; margin-top: 2rem;">Ingresa tus fechas y cantidad de personas para buscar habitaciones disponibles.</p>';
      return;
    }

    if (this.rooms.length === 0) {
      resultsContainer.innerHTML = '<p class="alert alert-error text-center mt-2">No hay habitaciones disponibles para estas fechas y cantidad de personas.</p>';
      return;
    }

    // Calcular noches
    const inDate = new Date(this.searchParams.checkIn);
    const outDate = new Date(this.searchParams.checkOut);
    const nights = Math.ceil(Math.abs(outDate - inDate) / (1000 * 60 * 60 * 24));

    resultsContainer.innerHTML = `
      <div class="rooms-list">
        ${this.rooms.map(room => `
          <div class="room-item">
            <img src="${room.images[0]}" alt="${room.name}" class="room-img">
            <div class="room-details">
              <h3>${room.name}</h3>
              <p>Capacidad máxima: ${room.maxGuests} personas</p>
              <p>Camas: ${room.beds}</p>
              <div class="services">
                ${room.services.map(s => `<span class="badge">${s}</span>`).join('')}
              </div>
            </div>
            <div class="room-pricing">
              <div class="price-night">$${room.pricePerNight.toLocaleString('es-CO')} <small>/noche</small></div>
              <div class="price-total">Total (${nights} noches): $${(room.pricePerNight * nights).toLocaleString('es-CO')}</div>
              <button class="btn btn-primary btn-book" data-id="${room.id}">Reservar</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  render() {
    // Obtener fecha actual formato YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="css/pages.css">

      <div class="container">
        <div class="search-box">
          <h2>Consultar Disponibilidad</h2>
          <form class="search-form" id="search-form">
            <div class="form-group">
              <label>Fecha de Entrada</label>
              <input type="date" name="checkin" class="form-control" required min="${today}" value="${today}">
            </div>
            <div class="form-group">
              <label>Fecha de Salida</label>
              <input type="date" name="checkout" class="form-control" required min="${tomorrow}" value="${tomorrow}">
            </div>
            <div class="form-group">
              <label>Personas</label>
              <input type="number" name="guests" class="form-control" required min="1" max="10" value="2">
            </div>
            <div class="form-group">
              <button type="submit" class="btn btn-primary">Buscar Habitaciones</button>
            </div>
          </form>
        </div>

        <div id="results">
          <p class="text-center" style="color: #7f8c8d; margin-top: 2rem;">Ingresa tus fechas y cantidad de personas para buscar habitaciones disponibles.</p>
        </div>
      </div>
    `;

    // Renderizar resultados si ya había una búsqueda
    if (this.searchParams) {
      this.renderResults();
    }
  }
}

customElements.define('availability-page', AvailabilityPage);
