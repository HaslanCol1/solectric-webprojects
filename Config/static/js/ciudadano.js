// ========== ELEMENTOS DEL DOM ==========
const userMenuBtn = document.getElementById('userMenuBtn');
const dropdownMenu = document.getElementById('dropdownMenu');
const notificationBtn = document.getElementById('notificationBtn');
const notificationsPanel = document.getElementById('notificationsPanel');
const closeNotifBtn = document.getElementById('closeNotifBtn');
const openProfileBtn = document.getElementById('openProfileBtn');
const profileModal = document.getElementById('profileModal');
const closeProfileBtn = document.getElementById('closeProfileBtn');

// ========== DROPDOWN MENU USUARIO ==========
userMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    userMenuBtn.classList.toggle('active');
    dropdownMenu.classList.toggle('active');

    // Cerrar notificaciones si está abierto
    notificationsPanel.classList.remove('active');
});

// Cerrar dropdown al hacer clic fuera
document.addEventListener('click', (e) => {
    if (!userMenuBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
        userMenuBtn.classList.remove('active');
        dropdownMenu.classList.remove('active');
    }
});

// ========== PANEL DE NOTIFICACIONES ==========
notificationBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    notificationsPanel.classList.toggle('active');

    // Cerrar dropdown si está abierto
    userMenuBtn.classList.remove('active');
    dropdownMenu.classList.remove('active');
});

closeNotifBtn.addEventListener('click', () => {
    notificationsPanel.classList.remove('active');
});

// Cerrar panel de notificaciones al hacer clic fuera
document.addEventListener('click', (e) => {
    if (!notificationsPanel.contains(e.target) && !notificationBtn.contains(e.target)) {
        notificationsPanel.classList.remove('active');
    }
});

// ========== TABS DE NOTIFICACIONES ==========
const notifTabBtns = document.querySelectorAll('.notifications-tabs .tab-btn');
const historialTab = document.getElementById('historialTab');
const envivoTab = document.getElementById('envivoTab');

notifTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remover active de todos los botones
        notifTabBtns.forEach(b => b.classList.remove('active'));
        // Agregar active al botón clickeado
        btn.classList.add('active');

        // Mostrar el contenido correspondiente
        const tabName = btn.getAttribute('data-tab');
        if (tabName === 'historial') {
            historialTab.classList.add('active');
            envivoTab.classList.remove('active');
        } else {
            envivoTab.classList.add('active');
            historialTab.classList.remove('active');
        }
    });
});

// ========== MODAL DE PERFIL ==========
openProfileBtn.addEventListener('click', () => {
    profileModal.classList.add('active');
    // Cerrar dropdown
    userMenuBtn.classList.remove('active');
    dropdownMenu.classList.remove('active');
});

closeProfileBtn.addEventListener('click', () => {
    profileModal.classList.remove('active');
});

// Cerrar modal al hacer clic en el overlay
profileModal.addEventListener('click', (e) => {
    if (e.target === profileModal) {
        profileModal.classList.remove('active');
    }
});

// ========== TABS DEL MODAL DE PERFIL ==========
const modalTabBtns = document.querySelectorAll('.modal-tab');
const perfilContent = document.getElementById('perfilContent');
const ajustesContent = document.getElementById('ajustesContent');
const reportesContent = document.getElementById('reportesContent');

modalTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remover active de todos los botones
        modalTabBtns.forEach(b => b.classList.remove('active'));
        // Agregar active al botón clickeado
        btn.classList.add('active');

        // Ocultar todos los contenidos
        perfilContent.classList.remove('active');
        ajustesContent.classList.remove('active');
        reportesContent.classList.remove('active');

        // Mostrar el contenido correspondiente
        const tabName = btn.getAttribute('data-modal-tab');
        if (tabName === 'perfil') {
            perfilContent.classList.add('active');
        } else if (tabName === 'ajustes') {
            ajustesContent.classList.add('active');
        } else if (tabName === 'reportes') {
            reportesContent.classList.add('active');
        }
    });
});

// ========== CERRAR DROPDOWN AL HACER CLIC EN ITEMS ==========
const dropdownItems = document.querySelectorAll('.dropdown-item');
dropdownItems.forEach(item => {
    if (item.id !== 'openProfileBtn') {
        item.addEventListener('click', () => {
            userMenuBtn.classList.remove('active');
            dropdownMenu.classList.remove('active');
        });
    }
});

// ========== PREVENIR CIERRE AL HACER CLIC DENTRO DEL PANEL ==========
notificationsPanel.addEventListener('click', (e) => {
    e.stopPropagation();
});

// ========== NAVEGACIÓN ==========
const dashboardBtn = document.getElementById('dashboardBtn');
const comunidadBtn = document.getElementById('comunidadBtn');
const logoBtn = document.getElementById('logoBtn');
const cerrarSesionBtn = document.getElementById('cerrarSesionBtn');
const dashboardView = document.getElementById('dashboardView');
const comunidadView = document.getElementById('comunidadView');

// Función para mostrar vista
function showView(viewName) {
    // Remover clase active de todas las vistas
    if (dashboardView) dashboardView.classList.remove('active');
    if (comunidadView) comunidadView.classList.remove('active');
    
    // Remover estado activo de todos los botones
    dashboardBtn.classList.remove('active');
    comunidadBtn.classList.remove('active');
    
    // Mostrar la vista y activar el botón correspondiente
    if (viewName === 'dashboard') {
        if (dashboardView) dashboardView.classList.add('active');
        dashboardBtn.classList.add('active');
    } else if (viewName === 'comunidad') {
        if (comunidadView) comunidadView.classList.add('active');
        comunidadBtn.classList.add('active');
    }
}

// Inicializar con dashboard activo
document.addEventListener('DOMContentLoaded', function() {
    showView('dashboard');
});

// Event listeners para navegación
if (dashboardBtn) {
    dashboardBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showView('dashboard');
    });
}

if (comunidadBtn) {
    comunidadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showView('comunidad');
    });
}

if (logoBtn) {
    logoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showView('dashboard');
    });
}