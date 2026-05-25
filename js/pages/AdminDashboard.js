// Importa el servicio de almacenamiento para gestionar datos relacionados con habitaciones, reservas y usuarios
import { storageService } from '../services/StorageService.js';

// Define la clase `AdminDashboard` como un componente personalizado
class AdminDashboard extends HTMLElement {
  constructor() {
    super(); // Llama al constructor de HTMLElement
    this.attachShadow({ mode: 'open' }); // Crea un Shadow DOM para encapsular el estilo y la estructura del componente
    this.currentTab = 'rooms'; // Define la pestaña activa por defecto ('rooms' o 'reservations')
    this.editingRoomId = null; // Variable para almacenar el ID de la habitación que se está editando
  }

  // Método que se ejecuta cuando el componente se agrega al DOM
  connectedCallback() {
    const user = JSON.parse(sessionStorage.getItem('logged_user')); // Obtiene el usuario logueado desde el sessionStorage
    if (!user || user.rol !== 'admin') {
      // Si no hay usuario o no es administrador, redirige a la página de inicio
      window.location.hash = '#home';
      return;
    }
    this.render(); // Renderiza el contenido inicial del componente
    this.setupListeners(); // Configura los eventos del componente
  }

  // Configura los eventos para manejar interacciones dentro del componente
  setupListeners() {
    this.shadowRoot.addEventListener('click', (e) => {
      // Cambia entre pestañas (rooms y reservations)
      if (e.target.matches('.tab-btn')) {
        this.currentTab = e.target.dataset.tab; // Cambia la pestaña activa
        this.render(); // Vuelve a renderizar el contenido
      }

      // Gestión de habitaciones
      if (e.target.matches('.btn-delete-room')) {
        // Elimina una habitación después de confirmar
        if (confirm('¿Seguro de eliminar esta habitación?')) {
          storageService.deleteRoom(e.target.dataset.id); // Llama al servicio para eliminar la habitación
          this.render(); // Vuelve a renderizar el contenido
        }
      }
      if (e.target.matches('.btn-edit-room')) {
        // Activa el modo de edición para una habitación
        this.editingRoomId = e.target.dataset.id; // Almacena el ID de la habitación que se está editando
        this.render(); // Vuelve a renderizar el contenido
      }
      if (e.target.matches('#cancel-edit-room')) {
        // Cancela el modo de edición
        this.editingRoomId = null; // Resetea el ID de la habitación en edición
        this.render(); // Vuelve a renderizar el contenido
      }

      // Gestión de reservas
      if (e.target.matches('.btn-cancel-res')) {
        // Cancela una reserva después de confirmar
        if (confirm('¿Seguro de cancelar esta reserva?')) {
          storageService.cancelReservation(e.target.dataset.id); // Llama al servicio para cancelar la reserva
          this.render(); // Vuelve a renderizar el contenido
        }
      }
    });

    this.shadowRoot.addEventListener('submit', (e) => {
      if (e.target.id === 'room-form') {
        // Maneja el envío del formulario de habitaciones
        e.preventDefault(); // Previene el comportamiento por defecto del formulario
        this.handleRoomSubmit(e.target); // Llama al método para procesar los datos del formulario
      }
    });
  }

  // Maneja el envío del formulario de habitaciones (crear o actualizar)
  handleRoomSubmit(form) {
    const roomData = {
      name: form.nombre.value, // Nombre de la habitación
      beds: parseInt(form.camas.value), // Número de camas
      maxGuests: parseInt(form.maxPersonas.value), // Capacidad máxima
      pricePerNight: parseFloat(form.precio.value), // Precio por noche
      services: form.servicios.value.split(',').map(s => s.trim()), // Servicios separados por comas
      images: [form.imagen.value || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'], // URL de la imagen
      active: true // Estado activo de la habitación
    };

    if (this.editingRoomId) {
      // Si se está editando una habitación existente
      roomData.id = this.editingRoomId; // Agrega el ID de la habitación
      storageService.updateRoom(roomData); // Actualiza la habitación en el servicio
      window.showModal('Éxito', '<p class="alert alert-success">Habitación actualizada.</p>'); // Muestra un mensaje de éxito
    } else {
      // Si se está creando una nueva habitación
      storageService.addRoom(roomData); // Agrega la nueva habitación al servicio
      window.showModal('Éxito', '<p class="alert alert-success">Habitación creada.</p>'); // Muestra un mensaje de éxito
    }
    
    this.editingRoomId = null; // Resetea el ID de la habitación en edición
    this.render(); // Vuelve a renderizar el contenido
  }

  // Renderiza la pestaña de gestión de habitaciones
  renderRoomsTab() {
    const rooms = storageService.getActiveRooms(); // Obtiene las habitaciones activas
    let editRoom = null;
    if (this.editingRoomId) {
      editRoom = rooms.find(r => r.id === this.editingRoomId); // Encuentra la habitación en edición
    }

    return `
      <div class="admin-section">
        <h3>${editRoom ? 'Editar Habitación' : 'Nueva Habitación'}</h3>
        <form id="room-form" class="form-grid">
          <!-- Formulario para crear o editar habitaciones -->
          <div class="form-group full-width">
            <label>Nombre de Habitación</label>
            <input type="text" name="nombre" class="form-control" value="${editRoom ? editRoom.name : ''}" required>
          </div>
          <div class="form-group">
            <label>Camas</label>
            <input type="number" name="camas" class="form-control" value="${editRoom ? editRoom.beds : ''}" required min="1">
          </div>
          <div class="form-group">
            <label>Máx Personas</label>
            <input type="number" name="maxPersonas" class="form-control" value="${editRoom ? editRoom.maxGuests : ''}" required min="1">
          </div>
          <div class="form-group">
            <label>Precio por Noche</label>
            <input type="number" name="precio" class="form-control" value="${editRoom ? editRoom.pricePerNight : ''}" required min="1">
          </div>
          <div class="form-group">
            <label>Servicios (separados por coma)</label>
            <input type="text" name="servicios" class="form-control" value="${editRoom ? editRoom.services.join(', ') : ''}" placeholder="Ej: internet, tv, minibar" required>
          </div>
          <div class="form-group full-width">
            <label>URL de Imagen (Opcional)</label>
            <input type="url" name="imagen" class="form-control" value="${editRoom ? editRoom.images[0] : ''}">
          </div>
          <div class="form-actions full-width">
            <button type="submit" class="btn btn-primary">${editRoom ? 'Actualizar' : 'Crear Habitación'}</button>
            ${editRoom ? '<button type="button" class="btn btn-outline" id="cancel-edit-room">Cancelar</button>' : ''}
          </div>
        </form>

        <h3 style="margin-top: 3rem;">Lista de Habitaciones</h3>
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Camas</th>
                <th>Capacidad</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${rooms.map(room => `
                <tr>
                  <td>${room.name}</td>
                  <td>${room.beds}</td>
                  <td>${room.maxGuests}</td>
                  <td>$${room.pricePerNight.toLocaleString('es-CO')}</td>
                  <td>
                    <button class="btn-small btn-edit-room" data-id="${room.id}">Editar</button>
                    <button class="btn-small btn-delete btn-delete-room" data-id="${room.id}">Eliminar</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // Renderiza la pestaña de gestión de reservas
  renderReservationsTab() {
    const reservations = storageService.getReservations(); // Obtiene las reservas
    const rooms = storageService.getRooms(); // Obtiene las habitaciones
    const users = storageService.getUsers(); // Obtiene los usuarios

    return `
      <div class="admin-section">
        <h3>Todas las Reservas</h3>
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Habitación</th>
                <th>Fechas</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${reservations.map(res => {
                const room = rooms.find(r => r.id === res.habitacionId); // Encuentra la habitación asociada
                const user = users.find(u => u.id === res.usuarioId); // Encuentra el usuario asociado
                return `
                  <tr>
                    <td><small>${res.id}</small></td>
                    <td>${user ? user.nombre : 'N/A'}</td>
                    <td>${room ? room.name : 'N/A'}</td>
                    <td>${res.fechaEntrada} / ${res.fechaSalida}</td>
                    <td><span class="badge ${res.estado === 'activa' ? 'badge-success' : 'badge-error'}">${res.estado}</span></td>
                    <td>
                      ${res.estado === 'activa' ? `<button class="btn-small btn-delete btn-cancel-res" data-id="${res.id}">Cancelar</button>` : ''}
                    </td>
                  </tr>
                `;
              }).join('')}
              ${reservations.length === 0 ? '<tr><td colspan="6" class="text-center">No hay reservas registradas.</td></tr>' : ''}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // Renderiza el contenido del componente según la pestaña activa
  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="css/pages.css">

      <div class="container">
        <div class="header">
          <h2>Panel de Administración</h2>
        </div>
        
        <div class="tabs">
          <button class="tab-btn ${this.currentTab === 'rooms' ? 'active' : ''}" data-tab="rooms">Gestión de Habitaciones</button>
          <button class="tab-btn ${this.currentTab === 'reservations' ? 'active' : ''}" data-tab="reservations">Gestión de Reservas</button>
        </div>

        ${this.currentTab === 'rooms' ? this.renderRoomsTab() : this.renderReservationsTab()}
      </div>
    `;
  }
}

// Define el componente personalizado `admin-dashboard`
customElements.define('admin-dashboard', AdminDashboard);