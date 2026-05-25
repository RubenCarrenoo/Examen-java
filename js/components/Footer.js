/* Componente de pie de página para el Hotel el Rincón del Carmen */
class HotelFooter extends HTMLElement {
  /* El constructor se llama cuando se crea una instancia del componente. Aquí se inicializa el shadow DOM para encapsular el estilo y la estructura del componente. */
  constructor() {
    /* Llama al constructor de la clase base HTMLElement para asegurarse de que el componente se inicialice correctamente */
    super();
    /* Crea un shadow DOM para encapsular el estilo y la estructura del componente, evitando conflictos con otros estilos en la página */
    this.attachShadow({ mode: 'open' });
  }
   /* El método connectedCallback se llama cuando el componente se agrega al DOM. Aquí se llama al método render para construir la estructura del pie de página. */
  connectedCallback() {
    /* Llama al método render para construir la estructura del pie de página cuando el componente se agrega al DOM */
    this.render();
  }
  /* El método render se encarga de construir la estructura HTML del pie de página y aplicar los estilos necesarios. Aquí se define el contenido del pie de página, incluyendo información sobre el hotel, enlaces rápidos y detalles de contacto. */
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
