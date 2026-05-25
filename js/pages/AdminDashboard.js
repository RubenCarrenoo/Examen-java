import { storageService } from '../services/StorageService.js';

class AdminDashboard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.currentTab = 'rooms'; // 'rooms' o 'reservations'
    this.editingRoomId = null;
  }

  connectedCallback() {
    const user = JSON.parse(sessionStorage.getItem('logged_user'));
    if (!user || user.rol !== 'admin') {
      window.location.hash = '#home';
      return;
    }
    this.render();
    this.setupListeners();
  }

  setupListeners() {
    this.shadowRoot.addEventListener('click', (e) => {
      // Tab switching
      if (e.target.matches('.tab-btn')) {
        this.currentTab = e.target.dataset.tab;
        this.render();
      }

      // Rooms management
      if (e.target.matches('.btn-delete-room')) {
        if(confirm('¿Seguro de eliminar esta habitación?')) {
          storageService.deleteRoom(e.target.dataset.id);
          this.render();
        }
      }
      if (e.target.matches('.btn-edit-room')) {
        this.editingRoomId = e.target.dataset.id;
        this.render(); // Re-render para mostrar el formulario con los datos cargados
      }
      if (e.target.matches('#cancel-edit-room')) {
        this.editingRoomId = null;
        this.render();
      }

      // Reservations management
      if (e.target.matches('.btn-cancel-res')) {
        if(confirm('¿Seguro de cancelar esta reserva?')) {
          storageService.cancelReservation(e.target.dataset.id);
          this.render();
        }
      }
    });

    this.shadowRoot.addEventListener('submit', (e) => {
      if (e.target.id === 'room-form') {
        e.preventDefault();
        this.handleRoomSubmit(e.target);
      }
    });
  }

  handleRoomSubmit(form) {
    const roomData = {
      name: form.nombre.value,
      beds: parseInt(form.camas.value),
      maxGuests: parseInt(form.maxPersonas.value),
      pricePerNight: parseFloat(form.precio.value),
      services: form.servicios.value.split(',').map(s => s.trim()),
      images: [form.imagen.value || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'],
      active: true
    };

    if (this.editingRoomId) {
      roomData.id = this.editingRoomId;
      storageService.updateRoom(roomData);
      window.showModal('Éxito', '<p class="alert alert-success">Habitación actualizada.</p>');
    } else {
      storageService.addRoom(roomData);
      window.showModal('Éxito', '<p class="alert alert-success">Habitación creada.</p>');
    }
    
    this.editingRoomId = null;
    this.render();
  }

  renderRoomsTab() {
    const rooms = storageService.getActiveRooms();
    let editRoom = null;
    if (this.editingRoomId) {
      editRoom = rooms.find(r => r.id === this.editingRoomId);
    }

    return `
      <div class="admin-section">
        <h3>${editRoom ? 'Editar Habitación' : 'Nueva Habitación'}</h3>
        <form id="room-form" class="form-grid">
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

  renderReservationsTab() {
    const reservations = storageService.getReservations();
    const rooms = storageService.getRooms();
    const users = storageService.getUsers();

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
                const room = rooms.find(r => r.id === res.habitacionId);
                const user = users.find(u => u.id === res.usuarioId);
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

customElements.define('admin-dashboard', AdminDashboard);
