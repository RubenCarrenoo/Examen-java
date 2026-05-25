class HotelFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="css/components.css">
      <div class="footer-container">
        <div>
          <h3>Hotel el Rincón del Carmen</h3>
          <p>Experimente el lujo, la tranquilidad y el mejor servicio en el corazón de la ciudad. Su descanso es nuestra prioridad.</p>
        </div>
        <div>
          <h3>Enlaces Rápidos</h3>
          <p><a href="#home">Inicio</a></p>
          <p><a href="#availability">Reservar</a></p>
          <p><a href="#contact">Contacto</a></p>
        </div>
        <div>
          <h3>Contacto</h3>
          <p>📍 Calle 123 #45-67, Ciudad</p>
          <p>📞 +57 300 123 4567</p>
          <p>✉️ info@rincondelcarmen.com</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} Hotel el Rincón del Carmen. Todos los derechos reservados.</p>
      </div>
    `;
  }
}

customElements.define('hotel-footer', HotelFooter);
