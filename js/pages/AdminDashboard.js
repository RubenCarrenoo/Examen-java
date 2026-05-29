import { storageService } from '../services/StorageService.js';

class AdminDashboard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.currentTab = 'rooms'; // 'rooms' o 'reservations'
    this.editingRoomId = null;
    this.selectedYear = new Date().getFullYear();
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
      if (e.target.matches('.btn-invoice')) {
        this.handleGenerateInvoice(e.target.dataset.id);
      }
    });

    this.shadowRoot.addEventListener('submit', (e) => {
      if (e.target.id === 'room-form') {
        e.preventDefault();
        this.handleRoomSubmit(e.target);
      }
    });

    this.shadowRoot.addEventListener('change', (e) => {
      if (e.target.id === 'year-select') {
        this.selectedYear = parseInt(e.target.value);
        this.render();
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
                      <div style="display: flex; gap: 0.5rem; align-items: center;">
                        <button class="btn-small btn-invoice" style="background-color: #6fb073;" data-id="${res.id}">Factura</button>
                        ${res.estado === 'activa' ? `<button class="btn-small btn-delete btn-cancel-res" data-id="${res.id}">Cancelar</button>` : ''}
                      </div>
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

  handleGenerateInvoice(reservationId) {
    const reservations = storageService.getReservations();
    const res = reservations.find(r => r.id === reservationId);
    if (!res) {
      window.showModal('Error', '<p class="alert alert-error">Reserva no encontrada.</p>');
      return;
    }

    const rooms = storageService.getRooms();
    const room = rooms.find(r => r.id === res.habitacionId);
    
    const users = storageService.getUsers();
    const user = users.find(u => u.id === res.usuarioId);

    // Calcular noches
    const inDate = new Date(res.fechaEntrada);
    const outDate = new Date(res.fechaSalida);
    const diffTime = Math.abs(outDate - inDate);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    const todayStr = new Date().toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const invoiceContentHtml = `
      <div style="font-family: 'Inter', sans-serif; color: #1f3822; padding: 0.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #8abf8a; padding-bottom: 1rem; margin-bottom: 1.5rem;">
          <div>
            <h2 style="font-family: 'Playfair Display', serif; color: #6fb073; margin: 0; font-size: 1.6rem;">Rincón del Carmen</h2>
            <p style="margin: 0.25rem 0 0 0; font-size: 0.85rem; color: #45694a;">Hotel & Spa de Lujo</p>
          </div>
          <div style="text-align: right;">
            <h3 style="margin: 0; font-family: 'Playfair Display', serif; color: #1f3822; font-size: 1.4rem;">FACTURA</h3>
            <p style="margin: 0.25rem 0 0 0; font-size: 0.85rem; color: #45694a;"><b>Nº:</b> ${res.id}</p>
            <p style="margin: 0.15rem 0 0 0; font-size: 0.85rem; color: #45694a;"><b>Fecha:</b> ${todayStr}</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem;">
          <div>
            <h4 style="font-family: 'Playfair Display', serif; color: #6fb073; border-bottom: 1px solid #8abf8a; padding-bottom: 0.25rem; margin-top: 0; margin-bottom: 0.75rem; font-size: 1.05rem;">Datos del Cliente</h4>
            <p style="margin: 0.35rem 0; font-size: 0.9rem; color: #2e5033;"><b>Nombre:</b> ${user ? user.nombre : 'Invitado'}</p>
            <p style="margin: 0.35rem 0; font-size: 0.9rem; color: #2e5033;"><b>Identificación:</b> ${user ? user.identificacion : 'N/A'}</p>
            <p style="margin: 0.35rem 0; font-size: 0.9rem; color: #2e5033;"><b>Email:</b> ${user ? user.email : 'N/A'}</p>
            <p style="margin: 0.35rem 0; font-size: 0.9rem; color: #2e5033;"><b>Teléfono:</b> ${user ? user.telefono : 'N/A'}</p>
          </div>
          <div>
            <h4 style="font-family: 'Playfair Display', serif; color: #6fb073; border-bottom: 1px solid #8abf8a; padding-bottom: 0.25rem; margin-top: 0; margin-bottom: 0.75rem; font-size: 1.05rem;">Detalle del Hospedaje</h4>
            <p style="margin: 0.35rem 0; font-size: 0.9rem; color: #2e5033;"><b>Habitación:</b> ${room ? room.name : 'Habitación Eliminada'}</p>
            <p style="margin: 0.35rem 0; font-size: 0.9rem; color: #2e5033;"><b>Precio por Noche:</b> $${room ? room.pricePerNight.toLocaleString('es-CO') : '0'}</p>
            <p style="margin: 0.35rem 0; font-size: 0.9rem; color: #2e5033;"><b>Camas:</b> ${room ? room.beds : 'N/A'} | <b>Máx Huéspedes:</b> ${room ? room.maxGuests : 'N/A'}</p>
            <p style="margin: 0.35rem 0; font-size: 0.9rem; color: #2e5033;"><b>Servicios:</b> ${room ? room.services.join(', ') : 'N/A'}</p>
          </div>
        </div>

        <div style="border-top: 1px solid #8abf8a; padding-top: 1rem; margin-bottom: 1.5rem;">
          <h4 style="font-family: 'Playfair Display', serif; color: #6fb073; margin-top: 0; margin-bottom: 0.75rem; font-size: 1.05rem;">Resumen de la Reserva</h4>
          <div class="table-responsive" style="border: 1px solid #8abf8a; border-radius: 6px; overflow: hidden;">
            <table style="width: 100%; border-collapse: collapse; margin-top: 0; background: #cde4d1;">
              <thead>
                <tr style="background-color: #b8d8be; border-bottom: 2px solid #8abf8a;">
                  <th style="padding: 0.5rem; text-align: left; font-size: 0.85rem; color: #1f3822;">Concepto</th>
                  <th style="padding: 0.5rem; text-align: center; font-size: 0.85rem; color: #1f3822;">Fechas</th>
                  <th style="padding: 0.5rem; text-align: center; font-size: 0.85rem; color: #1f3822;">Cantidad</th>
                  <th style="padding: 0.5rem; text-align: right; font-size: 0.85rem; color: #1f3822;">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid #8abf8a;">
                  <td style="padding: 0.75rem 0.5rem; font-size: 0.9rem; color: #2e5033;">Hospedaje - ${room ? room.name : 'Habitación'}</td>
                  <td style="padding: 0.75rem 0.5rem; text-align: center; font-size: 0.9rem; color: #2e5033;">${res.fechaEntrada} a ${res.fechaSalida}</td>
                  <td style="padding: 0.75rem 0.5rem; text-align: center; font-size: 0.9rem; color: #2e5033;">${nights} noche${nights > 1 ? 's' : ''}</td>
                  <td style="padding: 0.75rem 0.5rem; text-align: right; font-weight: bold; font-size: 0.9rem; color: #1f3822;">$${res.valorTotal.toLocaleString('es-CO')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style="background-color: #e2ebd5; border: 1px solid #8abf8a; border-radius: 8px; padding: 1rem; display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <span style="font-size: 1.1rem; font-weight: bold; color: #1f3822;">Total a Pagar</span>
          <span style="font-size: 1.4rem; font-weight: bold; color: #6fb073;">$${res.valorTotal.toLocaleString('es-CO')}</span>
        </div>

        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
          <button id="btn-print-invoice" class="btn btn-primary" style="background-color: #6fb073; color: white; display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.2rem; border-radius: 4px; font-weight: 600; cursor: pointer; border: none;">
            🖨️ Imprimir Factura
          </button>
        </div>
      </div>
    `;

    window.showModal('Factura de Reserva', invoiceContentHtml);

    setTimeout(() => {
      const modal = document.getElementById('global-modal');
      if (modal && modal.shadowRoot) {
        const printBtn = modal.shadowRoot.querySelector('#btn-print-invoice');
        if (printBtn) {
          printBtn.onclick = () => {
            this.printInvoice(user, room, res, nights, todayStr);
          };
        }
      }
    }, 100);
  }

  printInvoice(user, room, res, nights, todayStr) {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>Factura de Reserva - Rincón del Carmen</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: 'Inter', sans-serif;
              color: #1f3822;
              background-color: #fff;
              padding: 2rem;
              margin: 0;
            }
            .invoice-box {
              max-width: 800px;
              margin: auto;
              border: 1px solid #8abf8a;
              padding: 2.5rem;
              border-radius: 8px;
              background: #fff;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 2px solid #8abf8a;
              padding-bottom: 1.5rem;
              margin-bottom: 2rem;
            }
            .header h1 {
              font-family: 'Playfair Display', serif;
              color: #6fb073;
              margin: 0;
              font-size: 2.2rem;
            }
            .grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 2rem;
              margin-bottom: 2rem;
            }
            .section-title {
              font-family: 'Playfair Display', serif;
              color: #6fb073;
              border-bottom: 1px solid #8abf8a;
              padding-bottom: 0.5rem;
              margin-top: 0;
              margin-bottom: 1rem;
              font-size: 1.25rem;
            }
            .details p {
              margin: 0.5rem 0;
              line-height: 1.5;
              font-size: 0.95rem;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 2rem 0;
            }
            th, td {
              padding: 1rem;
              text-align: left;
              border-bottom: 1px solid #8abf8a;
            }
            th {
              background-color: #b8d8be;
              color: #1f3822;
              font-weight: 600;
            }
            .total-row {
              background-color: #e2ebd5;
              border: 1px solid #8abf8a;
              border-radius: 4px;
              padding: 1.5rem;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 1.3rem;
              font-weight: bold;
              margin-top: 2rem;
            }
            .footer-note {
              text-align: center;
              margin-top: 3rem;
              font-size: 0.85rem;
              color: #45694a;
              border-top: 1px solid #c3d9c3;
              padding-top: 1rem;
            }
            @media print {
              body {
                padding: 0;
              }
              .invoice-box {
                border: none;
                padding: 0;
              }
            }
          </style>
        </head>
        <body onload="setTimeout(() => { window.print(); window.close(); }, 500);">
          <div class="invoice-box">
            <div class="header">
              <div>
                <h1>Rincón del Carmen</h1>
                <p style="margin: 0.25rem 0 0 0; font-size: 0.95rem; color: #45694a;">Hotel & Spa de Lujo</p>
              </div>
              <div style="text-align: right;">
                <h2 style="margin: 0; font-family: 'Playfair Display', serif; color: #1f3822;">FACTURA</h2>
                <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem; color: #45694a;"><b>Nº Reserva:</b> ${res.id}</p>
                <p style="margin: 0.15rem 0 0 0; font-size: 0.9rem; color: #45694a;"><b>Fecha de Emisión:</b> ${todayStr}</p>
              </div>
            </div>

            <div class="grid">
              <div class="details">
                <h3 class="section-title">Datos del Cliente</h3>
                <p><b>Nombre:</b> ${user ? user.nombre : 'Invitado'}</p>
                <p><b>Identificación:</b> ${user ? user.identificacion : 'N/A'}</p>
                <p><b>Email:</b> ${user ? user.email : 'N/A'}</p>
                <p><b>Teléfono:</b> ${user ? user.telefono : 'N/A'}</p>
              </div>
              <div class="details">
                <h3 class="section-title">Detalle del Hospedaje</h3>
                <p><b>Habitación:</b> ${room ? room.name : 'Habitación Eliminada'}</p>
                <p><b>Precio por Noche:</b> $${room ? room.pricePerNight.toLocaleString('es-CO') : '0'}</p>
                <p><b>Camas:</b> ${room ? room.beds : 'N/A'} | <b>Máx Huéspedes:</b> ${room ? room.maxGuests : 'N/A'}</p>
                <p><b>Servicios:</b> ${room ? room.services.join(', ') : 'N/A'}</p>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Concepto</th>
                  <th style="text-align: center;">Fechas</th>
                  <th style="text-align: center;">Cantidad</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Hospedaje - ${room ? room.name : 'Habitación'}</td>
                  <td style="text-align: center;">${res.fechaEntrada} a ${res.fechaSalida}</td>
                  <td style="text-align: center;">${nights} noche${nights > 1 ? 's' : ''}</td>
                  <td style="text-align: right; font-weight: bold;">$${res.valorTotal.toLocaleString('es-CO')}</td>
                </tr>
              </tbody>
            </table>

            <div class="total-row">
              <span style="color: #1f3822;">Total a Pagar</span>
              <span style="color: #6fb073;">$${res.valorTotal.toLocaleString('es-CO')}</span>
            </div>

            <div class="footer-note">
              Gracias por elegir el Hotel el Rincón del Carmen. ¡Esperamos que disfrute de su estancia!
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  getAvailableYears() {
    const reservations = storageService.getReservations();
    const yearsSet = new Set();
    
    // Always include current year and surrounding years
    const currentYear = new Date().getFullYear();
    yearsSet.add(currentYear);
    yearsSet.add(currentYear - 1);
    yearsSet.add(currentYear + 1);
    
    reservations.forEach(res => {
      if (res.fechaEntrada) {
        const parts = res.fechaEntrada.split('-');
        if (parts.length === 3) {
          const year = parseInt(parts[0]);
          if (!isNaN(year)) {
            yearsSet.add(year);
          }
        }
      }
    });
    
    return Array.from(yearsSet).sort((a, b) => b - a);
  }

  calculateMonthlyData(year) {
    const reservations = storageService.getReservations();
    const rooms = storageService.getRooms();
    const totalRooms = rooms.length || 15; // Fallback to 15 if empty
    
    const monthsData = [];
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    let totalYearOccupiedNights = 0;
    let totalYearCapacityNights = 0;
    let totalYearActiveBookings = 0;
    let totalYearCancellations = 0;

    for (let m = 0; m < 12; m++) {
      const startOfMonth = new Date(year, m, 1);
      const endOfMonth = new Date(year, m + 1, 0);
      const daysInMonth = endOfMonth.getDate();
      const capacityNights = totalRooms * daysInMonth;
      totalYearCapacityNights += capacityNights;

      let occupiedNights = 0;
      let activeBookings = 0;
      let cancellations = 0;

      reservations.forEach(res => {
        const parseDate = (str) => {
          if (!str) return null;
          const parts = str.split('-');
          if (parts.length !== 3) return null;
          return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        };

        const resIn = parseDate(res.fechaEntrada);
        const resOut = parseDate(res.fechaSalida);
        
        if (resIn && resOut) {
          if (resIn.getFullYear() === year && resIn.getMonth() === m) {
            if (res.estado === 'activa') {
              activeBookings++;
              totalYearActiveBookings++;
            } else if (res.estado === 'cancelada') {
              cancellations++;
              totalYearCancellations++;
            }
          }

          if (res.estado === 'activa') {
            const overlapStart = resIn > startOfMonth ? resIn : startOfMonth;
            const overlapEnd = resOut < new Date(year, m, daysInMonth + 1) ? resOut : new Date(year, m, daysInMonth + 1);
            
            if (overlapStart < overlapEnd) {
              const diffTime = overlapEnd - overlapStart;
              const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
              if (diffDays > 0) {
                occupiedNights += diffDays;
                totalYearOccupiedNights += diffDays;
              }
            }
          }
        }
      });

      const occupancyRate = capacityNights > 0 ? (occupiedNights / capacityNights) * 100 : 0;
      const totalBookings = activeBookings + cancellations;
      const cancellationRate = totalBookings > 0 ? (cancellations / totalBookings) * 100 : 0;

      monthsData.push({
        monthName: monthNames[m],
        occupancyRate: occupancyRate,
        activeBookings: activeBookings,
        cancellations: cancellations,
        cancellationRate: cancellationRate
      });
    }

    const avgYearOccupancyRate = totalYearCapacityNights > 0 ? (totalYearOccupiedNights / totalYearCapacityNights) * 100 : 0;

    return {
      months: monthsData,
      summary: {
        avgOccupancyRate: avgYearOccupancyRate,
        totalActiveBookings: totalYearActiveBookings,
        totalCancellations: totalYearCancellations
      }
    };
  }

  renderReportsTab() {
    const years = this.getAvailableYears();
    const data = this.calculateMonthlyData(this.selectedYear);

    return `
      <div class="admin-section" style="font-family: 'Inter', sans-serif;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; margin-bottom: 2rem; gap: 1rem;">
          <div>
            <h3 style="margin: 0; color: #1f3822;">Reporte Mensual de Ocupación y Cancelaciones</h3>
            <p style="margin: 0.25rem 0 0 0; color: #45694a; font-size: 0.95rem;">
              Análisis detallado del año seleccionado para el Hotel el Rincón del Carmen
            </p>
          </div>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <label for="year-select" style="font-weight: 600; color: #2e5033;">Seleccionar Año:</label>
            <select id="year-select" class="form-control" style="max-width: 150px; font-weight: bold; background-color: #c3d9c3; border: 1px solid #8abf8a;">
              ${years.map(y => `
                <option value="${y}" ${y === this.selectedYear ? 'selected' : ''}>${y}</option>
              `).join('')}
            </select>
          </div>
        </div>

        <!-- KPI Grid -->
        <div class="kpi-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
          <div class="kpi-card" style="background: #e2ebd5; border: 1px solid #8abf8a; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 10px rgba(31, 56, 34, 0.04); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <span style="color: #45694a; font-size: 0.85rem; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">Ocupación Promedio Anual</span>
              <h2 style="font-size: 2.2rem; color: #1f3822; margin: 0.5rem 0 0.25rem 0; font-family: 'Playfair Display', serif;">${data.summary.avgOccupancyRate.toFixed(1)}%</h2>
            </div>
            <div style="margin-top: 1rem;">
              <div style="background: #c3d9c3; border-radius: 4px; overflow: hidden; height: 6px; width: 100%;">
                <div style="background: #6fb073; width: ${data.summary.avgOccupancyRate}%; height: 100%;"></div>
              </div>
            </div>
          </div>

          <div class="kpi-card" style="background: #e2ebd5; border: 1px solid #8abf8a; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 10px rgba(31, 56, 34, 0.04); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <span style="color: #45694a; font-size: 0.85rem; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">Reservas Activas (${this.selectedYear})</span>
              <h2 style="font-size: 2.2rem; color: #1f3822; margin: 0.5rem 0 0.25rem 0; font-family: 'Playfair Display', serif;">${data.summary.totalActiveBookings}</h2>
            </div>
            <div style="margin-top: 1rem;">
              <span class="badge badge-success" style="font-size: 0.8rem; padding: 0.25rem 0.5rem; border-radius: 4px; color: #155724; background-color: #d4edda;">Reservas Completadas/En Curso</span>
            </div>
          </div>

          <div class="kpi-card" style="background: #e2ebd5; border: 1px solid #8abf8a; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 10px rgba(31, 56, 34, 0.04); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <span style="color: #45694a; font-size: 0.85rem; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">Cancelaciones (${this.selectedYear})</span>
              <h2 style="font-size: 2.2rem; color: #e74c3c; margin: 0.5rem 0 0.25rem 0; font-family: 'Playfair Display', serif;">${data.summary.totalCancellations}</h2>
            </div>
            <div style="margin-top: 1rem;">
              <span class="badge badge-error" style="font-size: 0.8rem; padding: 0.25rem 0.5rem; border-radius: 4px; color: #721c24; background-color: #f8d7da;">Reservas Canceladas</span>
            </div>
          </div>
        </div>

        <h4 style="margin: 2rem 0 1rem 0; color: #1f3822; font-family: 'Playfair Display', serif; font-size: 1.25rem;">Desglose Mensual para el Año ${this.selectedYear}</h4>
        
        <div class="table-responsive" style="border: 1px solid #8abf8a; border-radius: 8px; overflow: hidden;">
          <table style="margin-top: 0; background: #cde4d1;">
            <thead>
              <tr style="background-color: #b8d8be;">
                <th style="color: #1f3822; font-weight: 600;">Mes</th>
                <th style="color: #1f3822; font-weight: 600;">Progreso Ocupación</th>
                <th style="color: #1f3822; font-weight: 600; text-align: right;">% Ocupación</th>
                <th style="color: #1f3822; font-weight: 600; text-align: right;">Reservas Activas</th>
                <th style="color: #1f3822; font-weight: 600; text-align: right;">Cancelaciones</th>
                <th style="color: #1f3822; font-weight: 600; text-align: right;">% Cancelación</th>
              </tr>
            </thead>
            <tbody>
              ${data.months.map(month => `
                <tr style="border-bottom: 1px solid #8abf8a;">
                  <td style="font-weight: 600; color: #1f3822;">${month.monthName}</td>
                  <td style="min-width: 150px; vertical-align: middle;">
                    <div style="background: #c3d9c3; border-radius: 4px; overflow: hidden; height: 10px; width: 100%; border: 1px solid #8abf8a; display: flex; align-items: center;">
                      <div style="background: #6fb073; width: ${month.occupancyRate}%; height: 100%;"></div>
                    </div>
                  </td>
                  <td style="text-align: right; font-weight: bold; color: #1f3822;">${month.occupancyRate.toFixed(1)}%</td>
                  <td style="text-align: right; color: #1f3822;">${month.activeBookings}</td>
                  <td style="text-align: right; color: #e74c3c; font-weight: 500;">${month.cancellations}</td>
                  <td style="text-align: right;">
                    <span class="badge ${month.cancellationRate > 30 ? 'badge-error' : month.cancellationRate > 0 ? 'badge-success' : ''}" style="display: inline-block; padding: 0.15rem 0.4rem; border-radius: 4px; font-size: 0.8rem; font-weight: bold; ${month.cancellationRate === 0 ? 'background-color: transparent; color: #45694a;' : ''}">
                      ${month.cancellationRate.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr style="background-color: #b8d8be; border-top: 2px solid #8abf8a; font-weight: bold;">
                <td style="color: #1f3822; font-weight: 700;">Promedio / Total</td>
                <td>
                  <div style="background: #c3d9c3; border-radius: 4px; overflow: hidden; height: 10px; width: 100%; border: 1px solid #8abf8a; display: flex; align-items: center;">
                    <div style="background: #6fb073; width: ${data.summary.avgOccupancyRate}%; height: 100%;"></div>
                  </div>
                </td>
                <td style="text-align: right; color: #1f3822; font-weight: 700;">${data.summary.avgOccupancyRate.toFixed(1)}%</td>
                <td style="text-align: right; color: #1f3822; font-weight: 700;">${data.summary.totalActiveBookings}</td>
                <td style="text-align: right; color: #e74c3c; font-weight: 700;">${data.summary.totalCancellations}</td>
                <td style="text-align: right; color: #1f3822; font-weight: 700;">
                  ${((data.summary.totalCancellations / (data.summary.totalActiveBookings + data.summary.totalCancellations || 1)) * 100).toFixed(1)}%
                </td>
              </tr>
            </tfoot>
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
          <button class="tab-btn ${this.currentTab === 'reports' ? 'active' : ''}" data-tab="reports">Reporte de Ocupación y Cancelaciones</button>
        </div>

        ${this.currentTab === 'rooms' ? this.renderRoomsTab() : this.currentTab === 'reservations' ? this.renderReservationsTab() : this.renderReportsTab()}
      </div>
    `;
  }
}

customElements.define('admin-dashboard', AdminDashboard);
