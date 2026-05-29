export const INITIAL_ROOMS = [
  {
    id: 'room-1',
    name: 'Habitación Estándar',
    beds: 1,
    maxGuests: 2,
    pricePerNight: 150000,
    services: ['internet', 'tv'],
    images: ['assets/rooms/single.png'],
    active: true,
  },
  {
    id: 'room-2',
    name: 'Habitación Doble',
    beds: 2,
    maxGuests: 4,
    pricePerNight: 250000,
    services: ['internet', 'tv', 'minibar'],
    images: ['assets/rooms/double.png'],
    active: true,
  },
  {
    id: 'room-3',
    name: 'Suite Presidencial',
    beds: 1,
    maxGuests: 2,
    pricePerNight: 500000,
    services: ['internet', 'tv', 'minibar', 'jacuzzi', 'balcon'],
    images: ['assets/rooms/suite.png'],
    active: true,
  },
  {
    id: 'room-4',
    name: 'Habitación Individual',
    beds: 1,
    maxGuests: 1,
    pricePerNight: 100000,
    services: ['internet', 'tv'],
    images: ['assets/rooms/single.png'],
    active: true,
  },
  {
    id: 'room-5',
    name: 'Habitación Individual Superior',
    beds: 1,
    maxGuests: 1,
    pricePerNight: 120000,
    services: ['internet', 'tv', 'minibar'],
    images: ['assets/rooms/single.png'],
    active: true,
  },
  {
    id: 'room-6',
    name: 'Habitación Doble Económica',
    beds: 1,
    maxGuests: 2,
    pricePerNight: 180000,
    services: ['internet', 'tv'],
    images: ['assets/rooms/double.png'],
    active: true,
  },
  {
    id: 'room-7',
    name: 'Habitación Doble Superior',
    beds: 2,
    maxGuests: 2,
    pricePerNight: 220000,
    services: ['internet', 'tv', 'minibar'],
    images: ['assets/rooms/double.png'],
    active: true,
  },
  {
    id: 'room-8',
    name: 'Habitación Triple',
    beds: 3,
    maxGuests: 3,
    pricePerNight: 280000,
    services: ['internet', 'tv', 'minibar'],
    images: ['assets/rooms/double.png'],
    active: true,
  },
  {
    id: 'room-9',
    name: 'Habitación Cuádruple',
    beds: 4,
    maxGuests: 4,
    pricePerNight: 350000,
    services: ['internet', 'tv', 'minibar', 'balcon'],
    images: ['assets/rooms/suite.png'],
    active: true,
  },
  {
    id: 'room-10',
    name: 'Suite Junior',
    beds: 1,
    maxGuests: 2,
    pricePerNight: 300000,
    services: ['internet', 'tv', 'minibar', 'sofa'],
    images: ['assets/rooms/suite.png'],
    active: true,
  },
  {
    id: 'room-11',
    name: 'Suite Familiar',
    beds: 3,
    maxGuests: 5,
    pricePerNight: 450000,
    services: ['internet', 'tv', 'minibar', 'cocina', 'balcon'],
    images: ['assets/rooms/suite.png'],
    active: true,
  },
  {
    id: 'room-12',
    name: 'Suite Nupcial',
    beds: 1,
    maxGuests: 2,
    pricePerNight: 550000,
    services: ['internet', 'tv', 'minibar', 'jacuzzi', 'champagne'],
    images: ['assets/rooms/suite.png'],
    active: true,
  },
  {
    id: 'room-13',
    name: 'Ático de Lujo',
    beds: 2,
    maxGuests: 4,
    pricePerNight: 700000,
    services: ['internet', 'tv', 'minibar', 'jacuzzi', 'terraza privada'],
    images: ['assets/rooms/suite.png'],
    active: true,
  },
  {
    id: 'room-14',
    name: 'Habitación Deluxe con Balcón',
    beds: 1,
    maxGuests: 2,
    pricePerNight: 260000,
    services: ['internet', 'tv', 'minibar', 'balcon'],
    images: ['assets/rooms/suite.png'],
    active: true,
  },
  {
    id: 'room-15',
    name: 'Cabaña Rústica',
    beds: 2,
    maxGuests: 4,
    pricePerNight: 320000,
    services: ['internet', 'tv', 'chimenea', 'cocina'],
    images: ['assets/rooms/suite.png'],
    active: true,
  }
];

export const INITIAL_ADMIN = {
  id: 'admin-1',
  identificacion: '123456789',
  nombre: 'Administrador Hotel',
  nacionalidad: 'Colombia',
  email: 'admin@rincondelcarmen.com',
  telefono: '3000000000',
  password: 'admin', // En un entorno real esto estaría hasheado
  rol: 'admin'
};

class StorageService {
  constructor() {
    this.initData();
  }

  initData() {
    if (!localStorage.getItem('hotel_rooms')) {
      localStorage.setItem('hotel_rooms', JSON.stringify(INITIAL_ROOMS));
    } else {
      let rooms = JSON.parse(localStorage.getItem('hotel_rooms'));
      let updated = false;

      // Parche para la imagen rota de la Suite Presidencial
      rooms = rooms.map(room => {
        if (room.id === 'room-3' && room.images && room.images[0] && room.images[0].includes('photo-1582719478250-c89404bb8a0e')) {
          room.images[0] = 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800';
          updated = true;
        }
        return room;
      });

      
      // Actualizar todas las imágenes para que coincidan con INITIAL_ROOMS (diseño luxury)
      let needsSave = false;
      rooms = rooms.map(room => {
        const initial = INITIAL_ROOMS.find(r => r.id === room.id);
        if (initial && initial.images[0] !== room.images[0]) {
          room.images = initial.images;
          needsSave = true;
        }
        return room;
      });
      if (needsSave) updated = true;

      // Añadir habitaciones nuevas que no estén en el localStorage
      for (const initialRoom of INITIAL_ROOMS) {
        if (!rooms.find(r => r.id === initialRoom.id)) {
          rooms.push(initialRoom);
          updated = true;
        }
      }

      if (updated) {
        localStorage.setItem('hotel_rooms', JSON.stringify(rooms));
      }
    }
    if (!localStorage.getItem('hotel_users')) {
      localStorage.setItem('hotel_users', JSON.stringify([INITIAL_ADMIN]));
    }
    if (!localStorage.getItem('hotel_reservations')) {
      const dummyReservations = [
        {
          id: 'res-dummy-1',
          usuarioId: 'admin-1',
          habitacionId: 'room-1',
          fechaEntrada: '2026-01-10',
          fechaSalida: '2026-01-15',
          cantidadPersonas: 2,
          valorTotal: 750000,
          estado: 'activa'
        },
        {
          id: 'res-dummy-2',
          usuarioId: 'admin-1',
          habitacionId: 'room-2',
          fechaEntrada: '2026-01-12',
          fechaSalida: '2026-01-18',
          cantidadPersonas: 4,
          valorTotal: 1500000,
          estado: 'activa'
        },
        {
          id: 'res-dummy-3',
          usuarioId: 'admin-1',
          habitacionId: 'room-3',
          fechaEntrada: '2026-02-05',
          fechaSalida: '2026-02-10',
          cantidadPersonas: 2,
          valorTotal: 2500000,
          estado: 'cancelada'
        },
        {
          id: 'res-dummy-4',
          usuarioId: 'admin-1',
          habitacionId: 'room-1',
          fechaEntrada: '2026-02-14',
          fechaSalida: '2026-02-16',
          cantidadPersonas: 2,
          valorTotal: 300000,
          estado: 'activa'
        },
        {
          id: 'res-dummy-5',
          usuarioId: 'admin-1',
          habitacionId: 'room-4',
          fechaEntrada: '2026-03-01',
          fechaSalida: '2026-03-05',
          cantidadPersonas: 1,
          valorTotal: 400000,
          estado: 'activa'
        },
        {
          id: 'res-dummy-6',
          usuarioId: 'admin-1',
          habitacionId: 'room-5',
          fechaEntrada: '2026-03-10',
          fechaSalida: '2026-03-15',
          cantidadPersonas: 1,
          valorTotal: 600000,
          estado: 'cancelada'
        },
        {
          id: 'res-dummy-7',
          usuarioId: 'admin-1',
          habitacionId: 'room-6',
          fechaEntrada: '2026-04-12',
          fechaSalida: '2026-04-18',
          cantidadPersonas: 2,
          valorTotal: 1080000,
          estado: 'activa'
        },
        {
          id: 'res-dummy-8',
          usuarioId: 'admin-1',
          habitacionId: 'room-2',
          fechaEntrada: '2026-05-01',
          fechaSalida: '2026-05-07',
          cantidadPersonas: 3,
          valorTotal: 1500000,
          estado: 'activa'
        },
        {
          id: 'res-dummy-9',
          usuarioId: 'admin-1',
          habitacionId: 'room-3',
          fechaEntrada: '2026-05-15',
          fechaSalida: '2026-05-20',
          cantidadPersonas: 2,
          valorTotal: 2500000,
          estado: 'activa'
        },
        {
          id: 'res-dummy-10',
          usuarioId: 'admin-1',
          habitacionId: 'room-1',
          fechaEntrada: '2026-05-25',
          fechaSalida: '2026-05-28',
          cantidadPersonas: 2,
          valorTotal: 450000,
          estado: 'cancelada'
        },
        {
          id: 'res-dummy-11',
          usuarioId: 'admin-1',
          habitacionId: 'room-7',
          fechaEntrada: '2026-06-10',
          fechaSalida: '2026-06-15',
          cantidadPersonas: 2,
          valorTotal: 1100000,
          estado: 'activa'
        },
        {
          id: 'res-dummy-12',
          usuarioId: 'admin-1',
          habitacionId: 'room-8',
          fechaEntrada: '2026-07-20',
          fechaSalida: '2026-07-25',
          cantidadPersonas: 2,
          valorTotal: 1400000,
          estado: 'activa'
        },
        {
          id: 'res-dummy-13',
          usuarioId: 'admin-1',
          habitacionId: 'room-9',
          fechaEntrada: '2026-08-05',
          fechaSalida: '2026-08-12',
          cantidadPersonas: 4,
          valorTotal: 2450000,
          estado: 'activa'
        },
        {
          id: 'res-dummy-14',
          usuarioId: 'admin-1',
          habitacionId: 'room-10',
          fechaEntrada: '2026-09-15',
          fechaSalida: '2026-09-20',
          cantidadPersonas: 2,
          valorTotal: 1500000,
          estado: 'activa'
        },
        {
          id: 'res-dummy-15',
          usuarioId: 'admin-1',
          habitacionId: 'room-11',
          fechaEntrada: '2026-10-10',
          fechaSalida: '2026-10-15',
          cantidadPersonas: 4,
          valorTotal: 2250000,
          estado: 'cancelada'
        },
        {
          id: 'res-dummy-16',
          usuarioId: 'admin-1',
          habitacionId: 'room-12',
          fechaEntrada: '2026-11-01',
          fechaSalida: '2026-11-05',
          cantidadPersonas: 2,
          valorTotal: 2200000,
          estado: 'activa'
        },
        {
          id: 'res-dummy-17',
          usuarioId: 'admin-1',
          habitacionId: 'room-13',
          fechaEntrada: '2026-12-20',
          fechaSalida: '2026-12-28',
          cantidadPersonas: 4,
          valorTotal: 5600000,
          estado: 'activa'
        },
        // 2025 dummy data
        {
          id: 'res-dummy-2025-1',
          usuarioId: 'admin-1',
          habitacionId: 'room-2',
          fechaEntrada: '2025-06-15',
          fechaSalida: '2025-06-20',
          cantidadPersonas: 2,
          valorTotal: 1250000,
          estado: 'activa'
        },
        {
          id: 'res-dummy-2025-2',
          usuarioId: 'admin-1',
          habitacionId: 'room-3',
          fechaEntrada: '2025-06-18',
          fechaSalida: '2025-06-25',
          cantidadPersonas: 2,
          valorTotal: 3500000,
          estado: 'cancelada'
        }
      ];
      localStorage.setItem('hotel_reservations', JSON.stringify(dummyReservations));
    }
  }

  // --- Users ---
  getUsers() {
    return JSON.parse(localStorage.getItem('hotel_users')) || [];
  }

  saveUsers(users) {
    localStorage.setItem('hotel_users', JSON.stringify(users));
  }

  addUser(user) {
    const users = this.getUsers();
    // Validate if identification or email already exists
    const exists = users.find(u => u.identificacion === user.identificacion || u.email === user.email);
    if (exists) {
      throw new Error('El usuario o email ya está registrado');
    }
    user.id = 'user-' + Date.now();
    user.rol = 'user'; // Por defecto los que se registran son clientes
    users.push(user);
    this.saveUsers(users);
    return user;
  }

  loginUser(email, password) {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Credenciales incorrectas');
    }
    return user;
  }

  // --- Rooms ---
  getRooms() {
    return JSON.parse(localStorage.getItem('hotel_rooms')) || [];
  }

  getActiveRooms() {
    return this.getRooms().filter(room => room.active);
  }

  saveRooms(rooms) {
    localStorage.setItem('hotel_rooms', JSON.stringify(rooms));
  }

  addRoom(room) {
    const rooms = this.getRooms();
    room.id = 'room-' + Date.now();
    rooms.push(room);
    this.saveRooms(rooms);
    return room;
  }

  updateRoom(updatedRoom) {
    let rooms = this.getRooms();
    rooms = rooms.map(room => room.id === updatedRoom.id ? updatedRoom : room);
    this.saveRooms(rooms);
  }

  deleteRoom(roomId) {
    let rooms = this.getRooms();
    rooms = rooms.map(room => {
      if (room.id === roomId) {
        return { ...room, active: false }; // Soft delete
      }
      return room;
    });
    this.saveRooms(rooms);
  }

  // --- Reservations ---
  getReservations() {
    return JSON.parse(localStorage.getItem('hotel_reservations')) || [];
  }

  saveReservations(reservations) {
    localStorage.setItem('hotel_reservations', JSON.stringify(reservations));
  }

  getUserReservations(userId) {
    return this.getReservations().filter(res => res.usuarioId === userId);
  }

  addReservation(reservation) {
    // Verificación de solapamiento
    const isAvailable = this.checkAvailability(reservation.habitacionId, reservation.fechaEntrada, reservation.fechaSalida);
    if (!isAvailable) {
      throw new Error('La habitación ya no está disponible en las fechas seleccionadas.');
    }
    const reservations = this.getReservations();
    reservation.id = 'res-' + Date.now();
    reservation.estado = 'activa';
    reservations.push(reservation);
    this.saveReservations(reservations);
    return reservation;
  }

  cancelReservation(reservationId) {
    let reservations = this.getReservations();
    reservations = reservations.map(res => {
      if (res.id === reservationId) {
        return { ...res, estado: 'cancelada' };
      }
      return res;
    });
    this.saveReservations(reservations);
  }

  checkAvailability(roomId, checkIn, checkOut) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const reservations = this.getReservations().filter(res => res.habitacionId === roomId && res.estado === 'activa');

    for (const res of reservations) {
      const resCheckIn = new Date(res.fechaEntrada);
      const resCheckOut = new Date(res.fechaSalida);

      // Solapamiento: (CheckIn < resCheckOut) y (CheckOut > resCheckIn)
      if (checkInDate < resCheckOut && checkOutDate > resCheckIn) {
        return false; // Hay solapamiento
      }
    }
    return true; // Disponible
  }

  searchAvailableRooms(checkIn, checkOut, guests) {
    const activeRooms = this.getActiveRooms();
    const availableRooms = activeRooms.filter(room => {
      // Filtrar por capacidad
      if (room.maxGuests < guests) {
        return false;
      }
      // Filtrar por disponibilidad
      return this.checkAvailability(room.id, checkIn, checkOut);
    });
    return availableRooms;
  }
}

// Singleton pattern export
export const storageService = new StorageService();
