// Define la clase `ContactPage` como un componente personalizado
class ContactPage extends HTMLElement {
  constructor() {
    super(); // Llama al constructor de HTMLElement
    this.attachShadow({ mode: 'open' }); // Crea un Shadow DOM para encapsular el estilo y la estructura del componente
  }

  // Método que se ejecuta cuando el componente se agrega al DOM
  connectedCallback() {
    this.render(); // Renderiza el contenido inicial del componente
  }

  // Renderiza el contenido del componente
  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="css/pages.css"> <!-- Enlace al archivo CSS para los estilos de la página -->

      <div class="container">
        <h2>Contáctenos</h2> <!-- Título principal de la página -->
        
        <div class="contact-grid">
          <!-- Sección de información de contacto -->
          <div class="contact-info">
            <h3>Información de Contacto</h3> <!-- Subtítulo -->
            <div class="info-item">
              <span>📍</span> <!-- Icono de ubicación -->
              <p>Calle 123 #45-67<br>El Rincón del Carmen<br>Ciudad de Ensueño</p> <!-- Dirección -->
            </div>
            <div class="info-item">
              <span>📞</span> <!-- Icono de teléfono -->
              <p>+57 300 123 4567<br>+57 601 234 5678</p> <!-- Teléfonos -->
            </div>
            <div class="info-item">
              <span>✉️</span> <!-- Icono de correo -->
              <p>reservas@rincondelcarmen.com<br>info@rincondelcarmen.com</p> <!-- Correos electrónicos -->
            </div>
          </div>

          <!-- Sección del formulario de contacto -->
          <div class="contact-form-container">
            <form onsubmit="event.preventDefault(); window.showModal('Mensaje Enviado', '<p class=\\'alert alert-success\\'>Gracias por contactarnos. Te responderemos a la brevedad posible.</p>'); this.reset();">
              <!-- Formulario para enviar un mensaje -->
              <div class="form-group">
                <label>Nombre Completo</label> <!-- Etiqueta para el campo de nombre -->
                <input type="text" class="form-control" required> <!-- Campo de entrada para el nombre -->
              </div>
              <div class="form-group">
                <label>Correo Electrónico</label> <!-- Etiqueta para el campo de correo -->
                <input type="email" class="form-control" required> <!-- Campo de entrada para el correo -->
              </div>
              <div class="form-group">
                <label>Mensaje</label> <!-- Etiqueta para el campo de mensaje -->
                <textarea class="form-control" required></textarea> <!-- Campo de texto para el mensaje -->
              </div>
              <button type="submit" class="btn">Enviar Mensaje</button> <!-- Botón para enviar el formulario -->
            </form>
          </div>
        </div>

        <!-- Sección del mapa -->
        <div class="map-container">
          <!-- Mapa simulado embebido con iframe -->
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m3!1d127242.78457018318!2d-74.1524301!3d4.6482837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9bfd2da6cb29%3A0x239d635520a33914!2sBogot%C3%A1%2C%20Colombia!5e0!3m2!1sen!2sus!4v1699999999999!5m2!1sen!2sus" 
            allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">
          </iframe> <!-- Muestra un mapa de Google Maps -->
        </div>
      </div>
    `;
  }
}

// Define el componente personalizado `contact-page`
customElements.define('contact-page', ContactPage);