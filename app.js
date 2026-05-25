// Import Componentes
import './components/Navbar.js'; // Importa el componente personalizado para la barra de navegación
import './components/Footer.js'; // Importa el componente personalizado para el pie de página
import './components/Modal.js'; // Importa el componente personalizado para el modal reutilizable

// Import Vistas (se crearán en la Fase 3 y 4)
// Estas líneas están comentadas porque las vistas aún no se han creado
// import './pages/HomePage.js'; // Importa la vista de la página de inicio
// import './pages/AvailabilityPage.js'; // Importa la vista de la página de disponibilidad
// ... etc

// Clase principal para manejar el enrutamiento de la aplicación
class AppRouter {
  constructor() {
    // Obtiene el contenedor principal donde se inyectarán las vistas dinámicas
    this.appContainer = document.getElementById('app-container');

    // Escucha el evento de cambio en el hash de la URL
    window.addEventListener('hashchange', () => this.handleRoute());
    
    // Inicia la ruta inicial al cargar la aplicación
    this.handleRoute();
  }

  // Método para manejar las rutas según el hash de la URL
  handleRoute() {
    const hash = window.location.hash || '#home'; // Obtiene el hash actual o usa '#home' por defecto
    const path = hash.substring(1); // Remueve el '#' del hash para obtener el nombre de la ruta
    
    this.appContainer.innerHTML = ''; // Limpia el contenido del contenedor principal

    // Maneja las rutas según el valor de 'path'
    switch (path) {
      case 'home':
        this.appContainer.innerHTML = '<h2>Página de Inicio (En construcción)</h2>';
        // this.appContainer.appendChild(document.createElement('home-page')); // Ejemplo de cómo se inyectará un componente
        break;
      case 'availability':
        this.appContainer.innerHTML = '<h2>Disponibilidad (En construcción)</h2>';
        break;
      case 'contact':
        this.appContainer.innerHTML = '<h2>Contacto (En construcción)</h2>';
        break;
      case 'login':
        this.appContainer.innerHTML = '<h2>Login (En construcción)</h2>';
        break;
      case 'register':
        this.appContainer.innerHTML = '<h2>Registro (En construcción)</h2>';
        break;
      case 'profile':
        this.appContainer.innerHTML = '<h2>Perfil (En construcción)</h2>';
        break;
      case 'admin':
        this.appContainer.innerHTML = '<h2>Panel Admin (En construcción)</h2>';
        break;
      default:
        this.appContainer.innerHTML = '<h2>Página no encontrada</h2>'; // Maneja rutas no definidas
    }
    
    // Desplaza la ventana al inicio después de la navegación
    window.scrollTo(0, 0);
  }
}

// Inicializa la aplicación una vez que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
  new AppRouter(); // Crea una nueva instancia de AppRouter para manejar las rutas
});