export const INITIAL_ROOMS = [
  {
    id: 'room-1',
    name: 'Habitación Estándar',
    beds: 1,
    maxGuests: 2,
    pricePerNight: 150000,
    services: ['internet', 'tv'],
    images: ['room_luxury.webp'],
    active: true,
  },
  {
    id: 'room-2',
    name: 'Habitación Doble',
    beds: 2,
    maxGuests: 4,
    pricePerNight: 250000,
    services: ['internet', 'tv', 'minibar'],
    images: ['room_luxury.webp'],
    active: true,
  },
  {
    id: 'room-3',
    name: 'Suite Presidencial',
    beds: 1,
    maxGuests: 2,
    pricePerNight: 500000,
    services: ['internet', 'tv', 'minibar', 'jacuzzi', 'balcon'],
    images: ['room_luxury.webp'],
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
    }
    if (!localStorage.getItem('hotel_users')) {
      localStorage.setItem('hotel_users', JSON.stringify([INITIAL_ADMIN]));
    }
    if (!localStorage.getItem('hotel_reservations')) {
      localStorage.setItem('hotel_reservations', JSON.stringify([]));
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
