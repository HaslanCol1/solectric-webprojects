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

modalTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remover active de todos los botones
        modalTabBtns.forEach(b => b.classList.remove('active'));
        // Agregar active al botón clickeado
        btn.classList.add('active');

        // Ocultar todos los contenidos
        perfilContent.classList.remove('active');
        ajustesContent.classList.remove('active');

        // Mostrar el contenido correspondiente
        const tabName = btn.getAttribute('data-modal-tab');
        if (tabName === 'perfil') {
            perfilContent.classList.add('active');
        } else if (tabName === 'ajustes') {
            ajustesContent.classList.add('active');
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

// ========== FUNCIONALIDAD DE BÚSQUEDA Y FILTROS ==========
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchReports');
    const priorityFilter = document.getElementById('priorityFilter');
    const statusFilter = document.getElementById('statusFilter');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const reportsContainer = document.getElementById('reportsContainer');
    const noResultsMessage = document.getElementById('noResultsMessage');
    const resultsCounter = document.getElementById('resultsCounter');
    
    // Función para filtrar reportes
    function filterReports() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedPriority = priorityFilter.value;
        const selectedStatus = statusFilter.value;
        
        const reportCards = reportsContainer.querySelectorAll('.report-card');
        const totalReports = reportCards.length;
        let visibleCount = 0;
        
        reportCards.forEach(card => {
            // Obtener datos del reporte
            const priority = card.getAttribute('data-priority');
            const status = card.getAttribute('data-status');
            const searchData = card.getAttribute('data-search');
            
            // Verificar criterios de filtrado
            const matchesSearch = !searchTerm || searchData.includes(searchTerm);
            const matchesPriority = !selectedPriority || priority === selectedPriority;
            const matchesStatus = !selectedStatus || status === selectedStatus;
            
            // Mostrar u ocultar el reporte
            if (matchesSearch && matchesPriority && matchesStatus) {
                card.style.display = 'block';
                visibleCount++;
                
                // Reiniciar la animación
                card.style.animation = 'none';
                card.offsetHeight; // Trigger reflow
                card.style.animation = null;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Actualizar contador de resultados
        if (resultsCounter) {
            if (searchTerm || selectedPriority || selectedStatus) {
                resultsCounter.textContent = `(${visibleCount} de ${totalReports})`;
                resultsCounter.style.display = 'inline-block';
            } else {
                resultsCounter.style.display = 'none';
            }
        }
        
        // Mostrar mensaje de "sin resultados" si no hay reportes visibles
        if (visibleCount === 0) {
            noResultsMessage.style.display = 'block';
        } else {
            noResultsMessage.style.display = 'none';
        }
    }
    
    // Función para limpiar filtros
    function clearFilters() {
        searchInput.value = '';
        priorityFilter.value = '';
        statusFilter.value = '';
        filterReports();
    }
    
    // Event listeners
    if (searchInput) {
        searchInput.addEventListener('input', filterReports);
    }
    
    if (priorityFilter) {
        priorityFilter.addEventListener('change', filterReports);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterReports);
    }
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }
    
    // Agregar funcionalidad para limpiar búsqueda con Escape
    if (searchInput) {
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                clearFilters();
                searchInput.blur();
            }
        });
    }
    
    // Inicializar filtros
    filterReports();
});

// ========== FUNCIONALIDAD DE NOTIFICACIONES ==========
document.addEventListener('DOMContentLoaded', function() {
    const searchNotifications = document.getElementById('searchNotifications');
    const notificationFilter = document.getElementById('notificationFilter');
    const markAllAsRead = document.getElementById('markAllAsRead');
    const clearAllNotifications = document.getElementById('clearAllNotifications');
    const notificationsList = document.getElementById('notificationsList');
    const noNotificationsMessage = document.getElementById('noNotificationsMessage');
    const notifCount = document.querySelector('.notif-count');
    
    // Función para filtrar notificaciones
    function filterNotifications() {
        const searchTerm = searchNotifications ? searchNotifications.value.toLowerCase().trim() : '';
        const selectedFilter = notificationFilter ? notificationFilter.value : 'todas';
        
        const notificationItems = notificationsList ? notificationsList.querySelectorAll('.notification-item') : [];
        let visibleCount = 0;
        
        notificationItems.forEach(item => {
            const searchData = item.getAttribute('data-search') || '';
            const status = item.getAttribute('data-status') || '';
            
            // Verificar criterios de filtrado
            const matchesSearch = !searchTerm || searchData.includes(searchTerm);
            const matchesFilter = selectedFilter === 'todas' || 
                                (selectedFilter === 'nuevas' && status === 'nueva') ||
                                (selectedFilter === 'leidas' && status === 'leida');
            
            // Mostrar u ocultar la notificación
            if (matchesSearch && matchesFilter) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Mostrar mensaje de "sin resultados" si no hay notificaciones visibles
        if (noNotificationsMessage) {
            if (visibleCount === 0) {
                noNotificationsMessage.style.display = 'block';
            } else {
                noNotificationsMessage.style.display = 'none';
            }
        }
    }
    
    // Event listeners para búsqueda y filtros
    if (searchNotifications) {
        searchNotifications.addEventListener('input', filterNotifications);
    }
    
    if (notificationFilter) {
        notificationFilter.addEventListener('change', filterNotifications);
    }
    
    // Marcar todas como leídas
    if (markAllAsRead) {
        markAllAsRead.addEventListener('click', function() {
            const notificationItems = notificationsList.querySelectorAll('.notification-item[data-status="nueva"]');
            notificationItems.forEach(item => {
                markAsRead(item.getAttribute('data-id'));
            });
        });
    }
    
    // Limpiar todas las notificaciones
    if (clearAllNotifications) {
        clearAllNotifications.addEventListener('click', function() {
            const notificationItems = notificationsList.querySelectorAll('.notification-item');
            notificationItems.forEach(item => {
                deleteNotification(item.getAttribute('data-id'));
            });
        });
    }
    
    // Inicializar filtros
    filterNotifications();
    
    // Actualizar contador inicial
    updateNotificationCounter();
});

// Función para toggle del menú de notificación
function toggleNotifMenu(id) {
    // Cerrar todos los dropdowns abiertos
    document.querySelectorAll('.notif-dropdown').forEach(dropdown => {
        if (dropdown.id !== `dropdown-${id}`) {
            dropdown.classList.remove('active');
        }
    });
    
    // Toggle del dropdown específico
    const dropdown = document.getElementById(`dropdown-${id}`);
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

// Función para toggle read/unread al hacer clic en la notificación
function toggleNotificationRead(id, event) {
    // Verificar que no se hizo clic en un botón de acción
    if (event.target.closest('.notif-action-btn') || event.target.closest('.notif-menu-btn') || event.target.closest('.notif-dropdown')) {
        return;
    }
    
    const notificationItem = document.querySelector(`[data-id="${id}"]`);
    if (notificationItem) {
        const currentStatus = notificationItem.getAttribute('data-status');
        
        if (currentStatus === 'nueva') {
            markAsRead(id);
        } else {
            markAsUnread(id);
        }
    }
}

// Función para marcar como leída
function markAsRead(id) {
    const notificationItem = document.querySelector(`[data-id="${id}"]`);
    if (notificationItem) {
        notificationItem.classList.add('marking-read');
        
        setTimeout(() => {
            notificationItem.setAttribute('data-status', 'leida');
            notificationItem.classList.remove('marking-read');
            
            // Actualizar los botones de acción
            updateActionButtons(id, 'leida');
            
            // Actualizar el dropdown para mostrar "marcar como no leída"
            const dropdown = document.getElementById(`dropdown-${id}`);
            if (dropdown) {
                const markReadBtn = dropdown.querySelector('button[onclick*="markAsRead"]');
                if (markReadBtn) {
                    markReadBtn.innerHTML = `
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                        Marcar como no leída
                    `;
                    markReadBtn.setAttribute('onclick', `markAsUnread(${id})`);
                }
            }
            
            updateNotificationCounter();
            closeAllDropdowns();
        }, 300);
    }
}

// Función para marcar como no leída
function markAsUnread(id) {
    const notificationItem = document.querySelector(`[data-id="${id}"]`);
    if (notificationItem) {
        notificationItem.setAttribute('data-status', 'nueva');
        
        // Agregar badge "Nueva" si no existe
        const badgeContainer = notificationItem.querySelector('.notif-top-actions');
        if (badgeContainer && !badgeContainer.querySelector('.notif-badge')) {
            const badge = document.createElement('span');
            badge.className = 'notif-badge nueva';
            badge.textContent = 'Nueva';
            badgeContainer.insertBefore(badge, badgeContainer.firstChild);
        } else {
            const existingBadge = badgeContainer.querySelector('.notif-badge');
            if (existingBadge) {
                existingBadge.style.display = 'inline-block';
                existingBadge.className = 'notif-badge nueva';
                existingBadge.textContent = 'Nueva';
            }
        }
        
        // Actualizar los botones de acción
        updateActionButtons(id, 'nueva');
        
        // Actualizar el dropdown para mostrar "marcar como leída"
        const dropdown = document.getElementById(`dropdown-${id}`);
        if (dropdown) {
            const markUnreadBtn = dropdown.querySelector('button[onclick*="markAsUnread"]');
            if (markUnreadBtn) {
                markUnreadBtn.innerHTML = `
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Marcar como leída
                `;
                markUnreadBtn.setAttribute('onclick', `markAsRead(${id})`);
            }
        }
        
        updateNotificationCounter();
        closeAllDropdowns();
    }
}

// Función para eliminar notificación
function deleteNotification(id) {
    const notificationItem = document.querySelector(`[data-id="${id}"]`);
    if (notificationItem) {
        notificationItem.classList.add('deleting');
        
        setTimeout(() => {
            notificationItem.remove();
            updateNotificationCounter();
            
            // Verificar si no quedan notificaciones y mostrar mensaje
            const searchNotifications = document.getElementById('searchNotifications');
            const notificationFilter = document.getElementById('notificationFilter');
            if (searchNotifications && notificationFilter) {
                // Trigger filter para actualizar vista
                searchNotifications.dispatchEvent(new Event('input'));
            }
        });
    }
    
    closeAllDropdowns();
}

// Función para actualizar contador de notificaciones
function updateNotificationCounter() {
    const notifCount = document.querySelector('.notif-count');
    const newNotifications = document.querySelectorAll('.notification-item[data-status="nueva"]');
    
    if (notifCount) {
        const count = newNotifications.length;
        notifCount.textContent = count;
        notifCount.classList.add('updating');
        
        setTimeout(() => {
            notifCount.classList.remove('updating');
        }, 500);
        
        // Ocultar el badge si no hay notificaciones nuevas
        if (count === 0) {
            notifCount.style.display = 'none';
        } else {
            notifCount.style.display = 'flex';
        }
    }
}

// Función para cerrar todos los dropdowns
function closeAllDropdowns() {
    document.querySelectorAll('.notif-dropdown').forEach(dropdown => {
        dropdown.classList.remove('active');
    });
}

// Cerrar dropdowns al hacer clic fuera
document.addEventListener('click', function(e) {
    if (!e.target.closest('.notif-actions')) {
        closeAllDropdowns();
    }
});

// Función para actualizar los botones de acción según el estado
function updateActionButtons(id, status) {
    const notificationItem = document.querySelector(`[data-id="${id}"]`);
    if (!notificationItem) return;
    
    const actionsContainer = notificationItem.querySelector('.notif-actions');
    const badgeContainer = notificationItem.querySelector('.notif-top-actions');
    if (!actionsContainer || !badgeContainer) return;
    
    // Remover botones existentes
    const existingReadBtn = actionsContainer.querySelector('.read-btn');
    const existingUnreadBtn = actionsContainer.querySelector('.unread-btn');
    
    if (existingReadBtn) existingReadBtn.remove();
    if (existingUnreadBtn) existingUnreadBtn.remove();
    
    // Actualizar o crear badge según el estado
    let badge = badgeContainer.querySelector('.notif-badge');
    
    if (status === 'nueva') {
        // Crear botón "marcar como leída"
        const readBtn = document.createElement('button');
        readBtn.className = 'notif-action-btn read-btn';
        readBtn.onclick = (e) => { e.stopPropagation(); markAsRead(id); };
        readBtn.title = 'Marcar como leída';
        readBtn.innerHTML = `
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
        `;
        
        // Agregar badge si no existe
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'notif-badge nueva';
            badge.textContent = 'Nueva';
            badgeContainer.insertBefore(badge, badgeContainer.firstChild);
        } else {
            badge.style.display = 'inline-block';
            badge.className = 'notif-badge nueva';
            badge.textContent = 'Nueva';
        }
        
        // Insertar el botón antes del botón de eliminar
        const deleteBtn = actionsContainer.querySelector('.delete-btn');
        actionsContainer.insertBefore(readBtn, deleteBtn);
    } else {
        // Crear botón "marcar como no leída"
        const unreadBtn = document.createElement('button');
        unreadBtn.className = 'notif-action-btn unread-btn';
        unreadBtn.onclick = (e) => { e.stopPropagation(); markAsUnread(id); };
        unreadBtn.title = 'Marcar como no leída';
        unreadBtn.innerHTML = `
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
        `;
        
        // Ocultar badge si existe
        if (badge) {
            badge.style.display = 'none';
        }
        
        // Insertar el botón antes del botón de eliminar
        const deleteBtn = actionsContainer.querySelector('.delete-btn');
        actionsContainer.insertBefore(unreadBtn, deleteBtn);
    }
}

// ========== FUNCIONALIDAD DE EDICIÓN DE PERFIL ==========
document.addEventListener('DOMContentLoaded', function() {
    const editBtn = document.querySelector('.btn-edit');
    const profileInfoGrid = document.querySelector('.profile-info-grid');
    let isEditing = false;
    
    // Datos originales del perfil
    const originalData = {
        nombre: 'Juan Pérez',
        email: 'juan.perez@email.com',
        telefono: '300 123 4567',
        municipio: 'Barranquilla',
        direccion: 'Calle 45 # 23-56, Barrio Centro'
    };
    
    // Función para activar modo de edición
    function enableEditMode() {
        isEditing = true;
        
        // Cambiar el botón a "Guardar" y "Cancelar"
        editBtn.innerHTML = `
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Guardar
        `;
        editBtn.classList.add('saving');
        
        // Agregar botón cancelar
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'btn-cancel';
        cancelBtn.innerHTML = `
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Cancelar
        `;
        editBtn.parentNode.insertBefore(cancelBtn, editBtn.nextSibling);
        
        // Convertir campos a inputs editables
        const infoFields = profileInfoGrid.querySelectorAll('.info-field');
        infoFields.forEach(field => {
            const infoValue = field.querySelector('.info-value');
            const currentValue = infoValue.textContent.trim();
            const label = field.querySelector('.info-label').textContent.trim();
            
            // No hacer editable el correo electrónico
            if (label.includes('Correo')) {
                return;
            }
            
            let inputElement;
            
            if (label === 'Dirección') {
                // Para dirección usar textarea
                inputElement = document.createElement('textarea');
                inputElement.rows = 2;
                inputElement.style.resize = 'vertical';
            } else if (label === 'Municipio') {
                // Para municipio usar select
                inputElement = document.createElement('select');
                const municipios = ['Barranquilla', 'Soledad', 'Malambo', 'Puerto Colombia', 'Galapa'];
                municipios.forEach(municipio => {
                    const option = document.createElement('option');
                    option.value = municipio;
                    option.textContent = municipio;
                    if (municipio === currentValue) {
                        option.selected = true;
                    }
                    inputElement.appendChild(option);
                });
            } else {
                // Para otros campos usar input
                inputElement = document.createElement('input');
                inputElement.type = label.includes('Teléfono') ? 'tel' : 'text';
            }
            
            inputElement.className = 'edit-input';
            inputElement.value = currentValue;
            inputElement.dataset.originalValue = currentValue;
            
            // Reemplazar el div con el input
            infoValue.style.display = 'none';
            field.appendChild(inputElement);
        });
        
        // Event listener para cancelar
        cancelBtn.addEventListener('click', cancelEdit);
    }
    
    // Función para cancelar edición
    function cancelEdit() {
        isEditing = false;
        
        // Restaurar botón original
        editBtn.innerHTML = `
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                </path>
            </svg>
            Editar
        `;
        editBtn.classList.remove('saving');
        
        // Remover botón cancelar
        const cancelBtn = document.querySelector('.btn-cancel');
        if (cancelBtn) {
            cancelBtn.remove();
        }
        
        // Restaurar campos originales
        const editInputs = profileInfoGrid.querySelectorAll('.edit-input');
        editInputs.forEach(input => {
            const field = input.parentNode;
            const infoValue = field.querySelector('.info-value');
            infoValue.style.display = 'block';
            input.remove();
        });
    }
    
    // Función para guardar cambios
    function saveChanges() {
        const editInputs = profileInfoGrid.querySelectorAll('.edit-input');
        const updatedData = {};
        
        // Validar campos
        let isValid = true;
        editInputs.forEach(input => {
            const value = input.value.trim();
            const field = input.parentNode;
            const label = field.querySelector('.info-label').textContent.trim();
            
            if (!value) {
                isValid = false;
                input.style.borderColor = '#dc2626';
                
                // Mostrar mensaje de error
                let errorMsg = field.querySelector('.error-msg');
                if (!errorMsg) {
                    errorMsg = document.createElement('div');
                    errorMsg.className = 'error-msg';
                    errorMsg.style.color = '#dc2626';
                    errorMsg.style.fontSize = '12px';
                    errorMsg.style.marginTop = '4px';
                    field.appendChild(errorMsg);
                }
                errorMsg.textContent = `${label} es requerido`;
            } else {
                input.style.borderColor = '';
                const errorMsg = field.querySelector('.error-msg');
                if (errorMsg) {
                    errorMsg.remove();
                }
                
                // Guardar dato actualizado
                if (label.includes('Nombre')) updatedData.nombre = value;
                else if (label.includes('Teléfono')) updatedData.telefono = value;
                else if (label.includes('Municipio')) updatedData.municipio = value;
                else if (label === 'Dirección') updatedData.direccion = value;
            }
        });
        
        if (!isValid) {
            return;
        }
        
        // Simular guardado (aquí podrías hacer una llamada AJAX al servidor)
        editBtn.innerHTML = `
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Guardando...
        `;
        editBtn.disabled = true;
        
        setTimeout(() => {
            // Actualizar valores en la interfaz
            editInputs.forEach(input => {
                const field = input.parentNode;
                const infoValue = field.querySelector('.info-value');
                infoValue.textContent = input.value;
            });
            
            // Actualizar también el header del modal si se cambió el nombre
            if (updatedData.nombre) {
                const profileHeaderText = document.querySelector('.profile-header-text h2');
                if (profileHeaderText) {
                    profileHeaderText.textContent = 'Mi Perfil';
                }
                
                // Actualizar iniciales del avatar
                const initials = updatedData.nombre.split(' ')
                    .map(word => word.charAt(0))
                    .join('')
                    .toUpperCase()
                    .substring(0, 2);
                
                const avatars = document.querySelectorAll('.profile-avatar-large');
                avatars.forEach(avatar => {
                    avatar.textContent = initials;
                });
            }
            
            // Mostrar mensaje de éxito
            showSuccessMessage('Perfil actualizado correctamente');
            
            // Volver al modo normal
            isEditing = false;
            editBtn.innerHTML = `
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                    </path>
                </svg>
                Editar
            `;
            editBtn.classList.remove('saving');
            editBtn.disabled = false;
            
            // Remover botón cancelar
            const cancelBtn = document.querySelector('.btn-cancel');
            if (cancelBtn) {
                cancelBtn.remove();
            }
            
            // Remover inputs y mostrar valores
            editInputs.forEach(input => {
                const field = input.parentNode;
                const infoValue = field.querySelector('.info-value');
                infoValue.style.display = 'block';
                input.remove();
            });
            
        }); // Simular tiempo de guardado
    }
    
    // Función para mostrar mensaje de éxito
    function showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            font-size: 14px;
            font-weight: 500;
            animation: slideInRight 0.3s ease;
        `;
        successDiv.textContent = message;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(successDiv);
            }, 300);
        }, 3000);
    }
    
    // Event listener para el botón editar
    if (editBtn) {
        editBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (isEditing) {
                saveChanges();
            } else {
                enableEditMode();
            }
        });
    }
});

// ========== FUNCIONALIDAD DE COMUNIDAD ==========
// Variables globales de comunidad
let currentGroupId = 1;
let userGroups = [1, 4]; // Grupos a los que está unido
let pendingRequests = [2]; // Solicitudes pendientes

// Datos de grupos simulados
const groupsData = {
    1: {
        name: "📍 Barranquilla Centro",
        members: 145,
        messages: [
            { id: 1, author: "María González", avatar: "MG", content: "Buenos días comunidad, ¿alguien más tiene corte de energía en la Calle 45?", time: "9:15 AM", own: false },
            { id: 2, author: "Carlos Ruiz", avatar: "CR", content: "Sí, aquí en el 45-23 tampoco hay luz desde las 8:30", time: "9:17 AM", own: false },
            { id: 3, author: "Juan Pérez", avatar: "JP", content: "Ya reporté la falla al sistema. Dice que el técnico llegará pronto", time: "9:20 AM", own: true },
            { id: 4, author: "Ana Torres", avatar: "AT", content: "Excelente Juan! Yo también voy a reportar desde mi dirección", time: "9:22 AM", own: false },
            { id: 5, author: "Luis Mendoza", avatar: "LM", content: "📷 Acá se ve el transformador que está chisporroteando", time: "9:25 AM", own: false }
        ]
    },
    4: {
        name: "📍 Boston",
        members: 34,
        messages: [
            { id: 1, author: "Pedro Martín", avatar: "PM", content: "Alguien más tiene fluctuaciones en el voltaje?", time: "7:15 AM", own: false },
            { id: 2, author: "Juan Pérez", avatar: "JP", content: "Sí, desde ayer en la noche. Ya reporté", time: "7:30 AM", own: true }
        ]
    }
};

// Funciones auxiliares globales
function updateChatInterface() {
    const status = getGroupStatus(currentGroupId);
    const chatMessages = document.getElementById('chatMessages');
    const chatInputContainer = document.getElementById('chatInputContainer');
    const groupNotJoined = document.getElementById('groupNotJoined');
    const groupPending = document.getElementById('groupPending');
    const currentGroupName = document.getElementById('currentGroupName');
    const currentGroupMembers = document.getElementById('currentGroupMembers');
    const currentLeaveBtn = document.getElementById('currentLeaveBtn');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    
    if (status === 'unido') {
        // Mostrar chat normal
        if (chatMessages) chatMessages.style.display = 'flex';
        if (chatInputContainer) chatInputContainer.style.display = 'flex';
        if (groupNotJoined) groupNotJoined.style.display = 'none';
        if (groupPending) groupPending.style.display = 'none';
        
        // Actualizar datos del grupo
        if (groupsData[currentGroupId]) {
            const group = groupsData[currentGroupId];
            if (currentGroupName) currentGroupName.textContent = group.name;
            if (currentGroupMembers) currentGroupMembers.textContent = `${group.members} miembros`;
            loadMessages(currentGroupId);
        }
        
        // Habilitar input
        if (chatInput) {
            chatInput.disabled = false;
            chatInput.placeholder = "Escribe un mensaje...";
        }
        if (sendBtn) sendBtn.disabled = false;
        
        // Mostrar botón salir
        if (currentLeaveBtn) {
            currentLeaveBtn.style.display = 'flex';
            currentLeaveBtn.onclick = () => leaveGroup(currentGroupId);
        }
        
    } else if (status === 'pendiente') {
        // Mostrar estado pendiente
        if (chatMessages) chatMessages.style.display = 'none';
        if (chatInputContainer) chatInputContainer.style.display = 'none';
        if (groupNotJoined) groupNotJoined.style.display = 'none';
        if (groupPending) groupPending.style.display = 'flex';
        if (currentLeaveBtn) currentLeaveBtn.style.display = 'none';
        
    } else {
        // Mostrar estado no unido
        if (chatMessages) chatMessages.style.display = 'none';
        if (chatInputContainer) chatInputContainer.style.display = 'none';
        if (groupNotJoined) groupNotJoined.style.display = 'flex';
        if (groupPending) groupPending.style.display = 'none';
        if (currentLeaveBtn) currentLeaveBtn.style.display = 'none';
    }
}

function getGroupStatus(groupId) {
    if (userGroups.includes(groupId)) return 'unido';
    if (pendingRequests.includes(groupId)) return 'pendiente';
    return 'no-unido';
}

function loadMessages(groupId) {
    const chatMessages = document.getElementById('chatMessages');
    if (!groupsData[groupId] || !chatMessages) return;
    
    const messages = groupsData[groupId].messages;
    chatMessages.innerHTML = '';
    
    messages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.own ? 'own' : ''}`;
        
        messageDiv.innerHTML = `
            <div class="message-header">
                <div class="message-avatar">${message.avatar}</div>
                <span class="message-author">${message.author}</span>
            </div>
            <div class="message-content">${message.content}</div>
            <div class="message-time">${message.time}</div>
        `;
        
        chatMessages.appendChild(messageDiv);
    });
    
    // Scroll al final
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function switchToGroup(groupId) {
    const groupsContainer = document.getElementById('groupsContainer');
    if (!groupsContainer) return;
    
    // Remover active de todos los grupos
    const groupItems = groupsContainer.querySelectorAll('.group-item');
    groupItems.forEach(item => item.classList.remove('active'));
    
    // Activar grupo seleccionado
    const selectedGroup = document.querySelector(`[data-group-id="${groupId}"]`);
    if (selectedGroup) {
        selectedGroup.classList.add('active');
        
        // Marcar como leído
        const unreadIndicator = selectedGroup.querySelector('.unread-indicator');
        if (unreadIndicator) {
            unreadIndicator.remove();
            selectedGroup.setAttribute('data-unread', 'false');
        }
    }
    
    currentGroupId = groupId;
    updateChatInterface();
}

// Funciones de gestión de grupos (movidas al ámbito global)
function requestJoinGroup(groupId) {
    if (!pendingRequests.includes(groupId)) {
        pendingRequests.push(groupId);
    }
    
    // Actualizar interfaz del grupo
    const groupItem = document.querySelector(`[data-group-id="${groupId}"]`);
    if (groupItem) {
        groupItem.setAttribute('data-status', 'pendiente');
        
        const badge = groupItem.querySelector('.group-badge');
        if (badge) {
            badge.remove();
        }
        
        // Agregar badge pendiente
        const groupInfo = groupItem.querySelector('.group-info');
        if (groupInfo) {
            const pendienteBadge = document.createElement('span');
            pendienteBadge.className = 'group-badge pending';
            pendienteBadge.textContent = 'Pendiente';
            groupInfo.appendChild(pendienteBadge);
        }
        
        const preview = groupItem.querySelector('.group-preview');
        if (preview) {
            preview.textContent = '⏳ Solicitud pendiente de aprobación';
        }
        
        const actions = groupItem.querySelector('.group-actions');
        if (actions) {
            actions.innerHTML = `
                <button class="cancel-request-btn" onclick="cancelRequest(${groupId})">
                    Cancelar solicitud
                </button>
            `;
        }
    }
    
    // Actualizar chat si es el grupo actual
    if (currentGroupId === groupId) {
        updateChatInterface();
    }
    
    showMessage('Solicitud enviada', 'Tu solicitud para unirte al grupo ha sido enviada', 'info');
}

function cancelRequest(groupId) {
    // Remover de solicitudes pendientes
    const index = pendingRequests.indexOf(groupId);
    if (index > -1) {
        pendingRequests.splice(index, 1);
    }
    
    // Actualizar interfaz del grupo
    const groupItem = document.querySelector(`[data-group-id="${groupId}"]`);
    if (groupItem) {
        groupItem.setAttribute('data-status', 'no-unido');
        
        const badge = groupItem.querySelector('.group-badge');
        if (badge) {
            badge.remove();
        }
        
        const preview = groupItem.querySelector('.group-preview');
        if (preview) {
            preview.textContent = '👥 Únete para ver los mensajes';
        }
        
        const actions = groupItem.querySelector('.group-actions');
        if (actions) {
            actions.innerHTML = `
                <button class="join-group-btn" onclick="requestJoinGroup(${groupId})">Unirse</button>
            `;
        }
    }
    
    // Actualizar chat si es el grupo actual
    if (currentGroupId === groupId) {
        updateChatInterface();
    }
    
    showMessage('Solicitud cancelada', 'Has cancelado tu solicitud para unirte al grupo', 'info');
}

function leaveGroup(groupId) {
    if (confirm('¿Estás seguro de que quieres salir de este grupo?')) {
        // Remover de grupos unidos
        const index = userGroups.indexOf(groupId);
        if (index > -1) {
            userGroups.splice(index, 1);
        }
        
        // Actualizar interfaz del grupo
        const groupItem = document.querySelector(`[data-group-id="${groupId}"]`);
        if (groupItem) {
            groupItem.setAttribute('data-status', 'no-unido');
            
            const badge = groupItem.querySelector('.group-badge');
            if (badge) {
                badge.remove();
            }
            
            const preview = groupItem.querySelector('.group-preview');
            if (preview) {
                preview.textContent = '👥 Únete para ver los mensajes';
            }
            
            const actions = groupItem.querySelector('.group-actions');
            if (actions) {
                actions.innerHTML = `
                    <button class="join-group-btn" onclick="requestJoinGroup(${groupId})">Unirse</button>
                `;
            }
        }
        
        // Si es el grupo actual, cambiar al primer grupo disponible
        if (currentGroupId === groupId) {
            if (userGroups.length > 0) {
                switchToGroup(userGroups[0]);
            } else {
                // Mostrar estado de no unido
                updateChatInterface();
            }
        }
        
        showMessage('Has salido del grupo', 'Ya no eres miembro de este grupo', 'info');
    }
}

function requestJoinFromChat() {
    requestJoinGroup(currentGroupId);
}

function cancelRequestFromChat() {
    cancelRequest(currentGroupId);
}

document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos del DOM
    const searchGroups = document.getElementById('searchGroups');
    const groupFilter = document.getElementById('groupFilter');
    const groupsContainer = document.getElementById('groupsContainer');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const currentGroupName = document.getElementById('currentGroupName');
    const currentGroupMembers = document.getElementById('currentGroupMembers');
    const currentLeaveBtn = document.getElementById('currentLeaveBtn');
    const groupNotJoined = document.getElementById('groupNotJoined');
    const groupPending = document.getElementById('groupPending');
    const chatInputContainer = document.getElementById('chatInputContainer');
    
    // Función para filtrar grupos
    function filterGroups() {
        const searchTerm = searchGroups ? searchGroups.value.toLowerCase().trim() : '';
        const selectedFilter = groupFilter ? groupFilter.value : 'todos';
        
        const groupItems = groupsContainer.querySelectorAll('.group-item');
        let visibleCount = 0;
        
        groupItems.forEach(item => {
            const searchData = item.getAttribute('data-search') || '';
            const status = item.getAttribute('data-status') || '';
            const unread = item.getAttribute('data-unread') === 'true';
            
            // Verificar criterios de filtrado
            const matchesSearch = !searchTerm || searchData.includes(searchTerm);
            let matchesFilter = true;
            
            switch (selectedFilter) {
                case 'recientes':
                    matchesFilter = status === 'unido';
                    break;
                case 'sin-leer':
                    matchesFilter = unread;
                    break;
                case 'unidos':
                    matchesFilter = status === 'unido';
                    break;
                default:
                    matchesFilter = true;
            }
            
            // Mostrar u ocultar el grupo
            if (matchesSearch && matchesFilter) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // Función para cambiar grupo activo
    function switchToGroup(groupId) {
        // Remover active de todos los grupos
        const groupItems = groupsContainer.querySelectorAll('.group-item');
        groupItems.forEach(item => item.classList.remove('active'));
        
        // Activar grupo seleccionado
        const selectedGroup = document.querySelector(`[data-group-id="${groupId}"]`);
        if (selectedGroup) {
            selectedGroup.classList.add('active');
            
            // Marcar como leído
            const unreadIndicator = selectedGroup.querySelector('.unread-indicator');
            if (unreadIndicator) {
                unreadIndicator.remove();
                selectedGroup.setAttribute('data-unread', 'false');
            }
        }
        
        currentGroupId = groupId;
        updateChatInterface();
    }
    
    // Función para actualizar interfaz de chat
    function updateChatInterface() {
        const status = getGroupStatus(currentGroupId);
        
        if (status === 'unido') {
            // Mostrar chat normal
            chatMessages.style.display = 'flex';
            chatInputContainer.style.display = 'flex';
            groupNotJoined.style.display = 'none';
            groupPending.style.display = 'none';
            
            // Actualizar datos del grupo
            if (groupsData[currentGroupId]) {
                const group = groupsData[currentGroupId];
                currentGroupName.textContent = group.name;
                currentGroupMembers.textContent = `${group.members} miembros`;
                loadMessages(currentGroupId);
            }
            
            // Habilitar input
            chatInput.disabled = false;
            sendBtn.disabled = false;
            chatInput.placeholder = "Escribe un mensaje...";
            
            // Mostrar botón salir
            currentLeaveBtn.style.display = 'flex';
            currentLeaveBtn.onclick = () => leaveGroup(currentGroupId);
            
        } else if (status === 'pendiente') {
            // Mostrar estado pendiente
            chatMessages.style.display = 'none';
            chatInputContainer.style.display = 'none';
            groupNotJoined.style.display = 'none';
            groupPending.style.display = 'flex';
            currentLeaveBtn.style.display = 'none';
            
        } else {
            // Mostrar estado no unido
            chatMessages.style.display = 'none';
            chatInputContainer.style.display = 'none';
            groupNotJoined.style.display = 'flex';
            groupPending.style.display = 'none';
            currentLeaveBtn.style.display = 'none';
        }
    }
    
    // Función para obtener estado del grupo
    function getGroupStatus(groupId) {
        if (userGroups.includes(groupId)) return 'unido';
        if (pendingRequests.includes(groupId)) return 'pendiente';
        return 'no-unido';
    }
    
    // Función para cargar mensajes
    function loadMessages(groupId) {
        if (!groupsData[groupId]) return;
        
        const messages = groupsData[groupId].messages;
        chatMessages.innerHTML = '';
        
        messages.forEach(message => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${message.own ? 'own' : ''}`;
            
            messageDiv.innerHTML = `
                <div class="message-header">
                    <div class="message-avatar">${message.avatar}</div>
                    <span class="message-author">${message.author}</span>
                </div>
                <div class="message-content">${message.content}</div>
                <div class="message-time">${message.time}</div>
            `;
            
            chatMessages.appendChild(messageDiv);
        });
        
        // Scroll al final
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Función para enviar mensaje
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message || !userGroups.includes(currentGroupId)) return;
        
        // Crear mensaje
        const now = new Date();
        const timeString = now.toLocaleTimeString('es-CO', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
        });
        
        const messageObj = {
            id: Date.now(),
            author: "Juan Pérez",
            avatar: "JP",
            content: message,
            time: timeString,
            own: true
        };
        
        // Agregar a datos simulados
        if (!groupsData[currentGroupId]) {
            groupsData[currentGroupId] = { messages: [] };
        }
        groupsData[currentGroupId].messages.push(messageObj);
        
        // Actualizar interfaz
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message own';
        messageDiv.innerHTML = `
            <div class="message-header">
                <div class="message-avatar">${messageObj.avatar}</div>
                <span class="message-author">${messageObj.author}</span>
            </div>
            <div class="message-content">${messageObj.content}</div>
            <div class="message-time">${messageObj.time}</div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Limpiar input
        chatInput.value = '';
        
        // Actualizar preview del grupo en sidebar
        updateGroupPreview(currentGroupId, message);
    }
    
    // Función para actualizar preview del grupo
    function updateGroupPreview(groupId, lastMessage) {
        const groupItem = document.querySelector(`[data-group-id="${groupId}"]`);
        if (groupItem) {
            const preview = groupItem.querySelector('.group-preview');
            if (preview) {
                preview.textContent = lastMessage.length > 50 
                    ? lastMessage.substring(0, 50) + '...' 
                    : lastMessage;
            }
            
            const time = groupItem.querySelector('.group-meta span:last-child');
            if (time) {
                time.textContent = 'Ahora';
            }
        }
    }
    
    // Event listeners
    if (searchGroups) {
        searchGroups.addEventListener('input', filterGroups);
    }
    
    if (groupFilter) {
        groupFilter.addEventListener('change', filterGroups);
    }
    
    // Event listeners para grupos
    if (groupsContainer) {
        groupsContainer.addEventListener('click', function(e) {
            const groupItem = e.target.closest('.group-item');
            if (groupItem && !e.target.closest('.group-actions')) {
                const groupId = parseInt(groupItem.getAttribute('data-group-id'));
                switchToGroup(groupId);
            }
        });
    }
    
    // Event listener para enviar mensaje
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
    
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    
    // Inicializar
    updateChatInterface();
    filterGroups();
});

// Función para mostrar mensajes de notificación
function showMessage(title, message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `community-message ${type}`;
    
    const color = type === 'success' ? '#10b981' : type === 'error' ? '#dc2626' : '#3b82f6';
    
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${color};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        font-size: 14px;
        max-width: 300px;
        animation: slideInRight 0.3s ease;
    `;
    
    messageDiv.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 4px;">${title}</div>
        <div style="font-size: 13px; opacity: 0.9;">${message}</div>
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(messageDiv)) {
                document.body.removeChild(messageDiv);
            }
        }, 300);
    }, 3000);
}

// Agregar estilos de animación al documento
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========== FUNCIONALIDAD DE AJUSTES ==========
document.addEventListener('DOMContentLoaded', function() {
    // Configurar toggle switches
    const toggleSwitches = document.querySelectorAll('.toggle-switch input');
    
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const settingName = this.id;
            const isEnabled = this.checked;
            
            // Guardar configuración (aquí podrías hacer una llamada al servidor)
            localStorage.setItem(settingName, isEnabled);
            
            // Mostrar mensaje de confirmación
            showSettingMessage(getSettingMessage(settingName, isEnabled));
        });
        
        // Cargar configuración guardada
        const savedSetting = localStorage.getItem(toggle.id);
        if (savedSetting !== null) {
            toggle.checked = savedSetting === 'true';
        }
    });
    
    // Configurar botones de seguridad
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const twoFactorBtn = document.getElementById('twoFactorBtn');
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', openPasswordChangeModal);
    }
    
    if (twoFactorBtn) {
        twoFactorBtn.addEventListener('click', openTwoFactorModal);
    }
    
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', confirmDeleteAccount);
    }
});

function getSettingMessage(settingName, isEnabled) {
    const messages = {
        pushNotifications: isEnabled ? 'Notificaciones push activadas' : 'Notificaciones push desactivadas',
        emailNotifications: isEnabled ? 'Notificaciones por email activadas' : 'Notificaciones por email desactivadas',
        soundNotifications: isEnabled ? 'Sonidos de notificación activados' : 'Sonidos de notificación desactivados',
        publicProfile: isEnabled ? 'Perfil público activado' : 'Perfil público desactivado',
        showLocation: isEnabled ? 'Ubicación visible activada' : 'Ubicación visible desactivada'
    };
    
    return messages[settingName] || 'Configuración actualizada';
}

function showSettingMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'setting-message';
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        font-size: 14px;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
    `;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(messageDiv)) {
                document.body.removeChild(messageDiv);
            }
        }, 300);
    }, 2000);
}

function openPasswordChangeModal() {
    if (confirm('¿Deseas cambiar tu contraseña? Se abrirá un formulario de cambio de contraseña.')) {
        // Aquí podrías abrir un modal específico para cambio de contraseña
        // Por ahora simulamos la acción
        showSettingMessage('Funcionalidad de cambio de contraseña próximamente disponible');
    }
}

function openTwoFactorModal() {
    if (confirm('¿Deseas configurar la autenticación de dos factores? Esto mejorará la seguridad de tu cuenta.')) {
        // Aquí podrías abrir un modal específico para 2FA
        // Por ahora simulamos la acción
        showSettingMessage('Configuración de 2FA próximamente disponible');
    }
}

function confirmDeleteAccount() {
    const confirmation = prompt('Para eliminar tu cuenta, escribe "ELIMINAR" en mayúsculas:');
    
    if (confirmation === 'ELIMINAR') {
        if (confirm('¿Estás completamente seguro? Esta acción no se puede deshacer y se eliminarán todos tus datos permanentemente.')) {
            // Aquí se haría la llamada al servidor para eliminar la cuenta
            showSettingMessage('Solicitud de eliminación de cuenta procesada. Recibirás un email de confirmación.');
        }
    } else if (confirmation !== null) {
        showSettingMessage('Texto incorrecto. Eliminación de cuenta cancelada.');
    }
}