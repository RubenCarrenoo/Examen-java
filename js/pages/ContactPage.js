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
          <!-- Mapa embebido funcional -->
          <iframe src="https://maps.google.com/maps?q=Calle+123+45-67,+Bogot%C3%A1,+Colombia&output=embed" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
    `;
  
  }

}

customElements.define('contact-page', ContactPage);