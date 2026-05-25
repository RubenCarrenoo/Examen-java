class HotelModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupListeners();
  }

  setupListeners() {
    this.shadowRoot.addEventListener('click', (e) => {
      if (e.target.matches('.modal-overlay') || e.target.matches('.close-btn')) {
        this.close();
      }
    });
  }

  open(title, contentHtml) {
    const titleEl = this.shadowRoot.querySelector('.modal-title');
    const contentEl = this.shadowRoot.querySelector('.modal-body');
    const overlayEl = this.shadowRoot.querySelector('.modal-overlay');
    
    titleEl.textContent = title;
    contentEl.innerHTML = contentHtml;
    overlayEl.classList.add('active');
  }

  close() {
    const overlayEl = this.shadowRoot.querySelector('.modal-overlay');
    overlayEl.classList.remove('active');
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="css/components.css">
      <div class="modal-overlay">
        <div class="modal-content">
          <button class="close-btn">&times;</button>
          <h2 class="modal-title"></h2>
          <div class="modal-body"></div>
        </div>
      </div>
    `;
  }
}

customElements.define('hotel-modal', HotelModal);

// Global helper para facilitar su uso
window.showModal = (title, contentHtml) => {
  const modal = document.getElementById('global-modal');
  if (modal) {
    modal.open(title, contentHtml);
  }
};
