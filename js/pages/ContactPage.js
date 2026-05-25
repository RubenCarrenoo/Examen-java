class ContactPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="css/pages.css">

      <div class="container">
        <h2>Contáctenos</h2>
        
        <div class="contact-grid">
          <div class="contact-info">
            <h3>Información de Contacto</h3>
            <div class="info-item">
              <span>📍</span>
              <p>Calle 123 #45-67<br>El Rincón del Carmen<br>Ciudad de Ensueño</p>
            </div>
            <div class="info-item">
              <span>📞</span>
              <p>+57 300 123 4567<br>+57 601 234 5678</p>
            </div>
            <div class="info-item">
              <span>✉️</span>
              <p>reservas@rincondelcarmen.com<br>info@rincondelcarmen.com</p>
            </div>
          </div>

          <div class="contact-form-container">
            <form onsubmit="event.preventDefault(); window.showModal('Mensaje Enviado', '<p class=\\'alert alert-success\\'>Gracias por contactarnos. Te responderemos a la brevedad posible.</p>'); this.reset();">
              <div class="form-group">
                <label>Nombre Completo</label>
                <input type="text" class="form-control" required>
              </div>
              <div class="form-group">
                <label>Correo Electrónico</label>
                <input type="email" class="form-control" required>
              </div>
              <div class="form-group">
                <label>Mensaje</label>
                <textarea class="form-control" required></textarea>
              </div>
              <button type="submit" class="btn">Enviar Mensaje</button>
            </form>
          </div>
        </div>

        <div class="map-container">
          <!-- Mapa simulado embebido con iframe -->
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m3!1d127242.78457018318!2d-74.1524301!3d4.6482837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9bfd2da6cb29%3A0x239d635520a33914!2sBogot%C3%A1%2C%20Colombia!5e0!3m2!1sen!2sus!4v1699999999999!5m2!1sen!2sus" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
    `;
  }
}

customElements.define('contact-page', ContactPage);
