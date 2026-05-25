# HOTEL-EL-RINCON-DEL-CARMEN
Hotel el Rincón del Carmen 🏨✨
Una aplicación web moderna y elegante ("Mobile First") para la gestión de reservas del Hotel el Rincón del Carmen. Diseñada para atraer clientes, consultar disponibilidad y gestionar habitaciones.

 Características Principales
Diseño de Lujo : Interfaz estilizada usando una paleta clara y acentos verdes.
Web Components Nativos: Arquitectura escalable y modularizada usando JavaScript Vainilla (Custom Elements y Shadow DOM), sin depender de frameworks externos pesados.
Single Page Application (SPA): Enrutamiento fluido del lado del cliente.
Persistencia de Datos (Simulada): Uso exhaustivo de LocalStorage para simular operaciones de backend (CRUD).
Autenticación de Usuarios: Sistema de registro, inicio de sesión y perfiles.
Sistema de Reservas: Motor de búsqueda inteligente para consultar fechas, número de personas y evitar solapamiento de habitaciones.
Panel de Administración: Área restringida para gestión de habitaciones e inventario de reservas.
🛠 Tecnologías Utilizadas
HTML5 (Estructura semántica)
CSS3 (Flexbox, CSS Grid, Variables CSS, Glassmorphism)
JavaScript ES6+ (Módulos, Promesas, Web Components nativos)
Sin dependencias externas ni bases de datos (100% Frontend con LocalStorage).

 Cómo Ejecutar el Proyecto
Dado que la aplicación está construida utilizando módulos de JavaScript (<script type="module">), por políticas de seguridad de los navegadores (CORS), no puedes simplemente hacer doble clic en el archivo index.html.

Debes ejecutar la aplicación a través de un servidor local.

Opción 1: Usando VS Code (Recomendado)
Abre esta carpeta (proyecto) en Visual Studio Code.
Instala la extensión "Live Server" de Ritwick Dey.
Haz clic derecho sobre el archivo index.html y selecciona "Open with Live Server".
Opción 2: Usando Python (Si está instalado en macOS/Linux)
Abre tu terminal.
Navega hasta esta carpeta: cd ruta/a/tu/proyecto
Ejecuta el servidor: python3 -m http.server 8080
Abre tu navegador e ingresa a: http://localhost:8080
🔐 Credenciales de Prueba
Para probar el Panel de Administración, puedes iniciar sesión con las siguientes credenciales por defecto:

Email: admin@rincondelcarmen.com
Contraseña: admin
(Cualquier otra cuenta que registres desde la página web tendrá automáticamente el rol de "Usuario" para realizar reservas).

📂 Estructura del Proyecto
text

proyecto/
├── index.html            # Punto de entrada principal
├── README.md             # Documentación del proyecto
├── css/
│   ├── index.css         # Estilos globales y variables CSS (Tema)
│   └── components.css    # Estilos auxiliares
        pages.css
└── js/
    ├── app.js            # Enrutador (Router) y bootstrap principal
    ├── components/       # Componentes estructurales (Navbar, Footer, Modal)
    ├── pages/            # Componentes de Vistas completas (Home, Contact, Auth, Admin)
    └── services/         # Servicios de lógica de negocio
        └── StorageService.js # Manejo de LocalStorage
Desarrollado para el Hotel el Rincón del Carmen.
