import { storageService } from '../services/StorageService.js';

class HomePage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const rooms = storageService.getActiveRooms();
    
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="css/pages.css">
      
      <div class="hero">
        <div class="hero-content">
          <h1>Bienvenido al Descanso Perfecto</h1>
          <p>Experimente el lujo, la tranquilidad y el mejor servicio en el corazón de la ciudad.</p>
          <a href="#availability" class="btn-cta">Consultar Disponibilidad</a>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Nuestras Habitaciones</h2>
        <div class="rooms-grid">
          ${rooms.slice(0, 3).map(room => `
            <div class="room-card">
              <img src="${room.images[0]}" alt="${room.name}" class="room-image">
              <div class="room-info">
                <h3>${room.name}</h3>
                <p>Hasta ${room.maxGuests} personas • ${room.beds} cama(s)</p>
                <div class="room-price">$${room.pricePerNight.toLocaleString('es-CO')} / noche</div>
                <a href="#availability" class="btn-cta" style="display:block; text-align:center; padding: 0.5rem;">Reservar</a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="section" style="background-color: #0f0f11; border-top: 1px solid #222;">
        <h2 class="section-title">Instalaciones y Servicios</h2>
        <div class="areas-grid">
          <div class="area-card">
            <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=600" alt="Spa">
            <div class="area-overlay">
              <h3>Spa y Zonas Húmedas</h3>
            </div>
          </div>
          <div class="area-card">
            <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600" alt="Restaurante">
            <div class="area-overlay">
              <h3>Restaurante Gourmet</h3>
            </div>
          </div>
          <div class="area-card">
            <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=600" alt="Piscina">
            <div class="area-overlay">
              <h3>Piscina Climatizada</h3>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('home-page', HomePage);
