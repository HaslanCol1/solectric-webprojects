/**
 * Funcionalidad para Panel de Funcionario
 * - Gestión de pestañas en panel operativo
 * - Navegación entre vistas
 * - Filtros y búsqueda de reportes
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar la navegación de pestañas del panel operativo
    initManagementTabs();

    // Botones de navegación entre Dashboard y Comunidad
    initDashboardCommunityToggle();

    // Inicializar funcionalidad de filtros y búsqueda
    initReportFilters();

    // Inicializar botón de exportar
    initExportButton();
});

/**
 * Inicializa la navegación entre las pestañas de gestión
 */
function initManagementTabs() {
    const managementTabs = document.querySelectorAll('.management-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const tabContentContainer = document.getElementById('tab-content-container');
    
    // Por defecto, mostrar la primera pestaña (Gestión de Reportes)
    showTabContent('gestion-reportes');
    
    // Añadir manejadores de evento para cada pestaña
    managementTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Quitar la clase active de todas las pestañas
            managementTabs.forEach(t => t.classList.remove('active'));
            
            // Añadir la clase active a la pestaña seleccionada
            this.classList.add('active');
            
            // Mostrar el contenido correspondiente
            const tabId = this.dataset.tab;
            showTabContent(tabId);
        });
    });
    
    /**
     * Muestra el contenido de la pestaña seleccionada
     * @param {string} tabId - ID de la pestaña a mostrar
     */
    function showTabContent(tabId) {
        // Ocultar todos los contenidos de pestañas
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // Mostrar el contenido de la pestaña seleccionada
        const selectedContent = document.getElementById(tabId);
        if (selectedContent) {
            selectedContent.classList.add('active');
        }
    }
}

/**
 * Inicializa la navegación entre Dashboard y Comunidad
 */
function initDashboardCommunityToggle() {
    const btnDashboard = document.querySelector('.btn-dashboard');
    const btnComunidad = document.querySelector('.btn-comunidad');
    const dashboardView = document.getElementById('dashboardView');
    const comunidadView = document.getElementById('comunidadView');
    
    if (!btnDashboard || !btnComunidad) return;
    
    // Por defecto mostrar dashboard
    if (dashboardView) dashboardView.classList.add('active');
    if (comunidadView) comunidadView.classList.remove('active');
    btnDashboard.classList.add('active');
    
    btnDashboard.addEventListener('click', function() {
        btnDashboard.classList.add('active');
        btnComunidad.classList.remove('active');
        
        if (dashboardView) dashboardView.classList.add('active');
        if (comunidadView) comunidadView.classList.remove('active');
    });
    
    btnComunidad.addEventListener('click', function() {
        btnComunidad.classList.add('active');
        btnDashboard.classList.remove('active');
        
        if (comunidadView) comunidadView.classList.add('active');
        if (dashboardView) dashboardView.classList.remove('active');
    });
}

/**
 * Inicializa la funcionalidad de filtros y búsqueda de reportes
 */
function initReportFilters() {
    const searchInput = document.getElementById('searchReportsInput');
    const filterEstado = document.getElementById('filterEstado');
    const filterPrioridad = document.getElementById('filterPrioridad');
    const reportsContainer = document.getElementById('reportsContainer');
    const reportsHeader = document.getElementById('reportsHeader');
    const noResultsMessage = document.getElementById('noResultsMessage');

    // Si los elementos no existen, salir
    if (!searchInput || !filterEstado || !filterPrioridad || !reportsContainer) {
        return;
    }

    /**
     * Función principal de filtrado
     */
    function filterReports() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedEstado = filterEstado.value.toLowerCase();
        const selectedPrioridad = filterPrioridad.value.toLowerCase();

        const reportCards = reportsContainer.querySelectorAll('.report-card');
        let visibleCount = 0;

        reportCards.forEach(card => {
            const ticket = card.getAttribute('data-ticket').toLowerCase();
            const status = card.getAttribute('data-status').toLowerCase();
            const priority = card.getAttribute('data-priority').toLowerCase();
            const address = card.getAttribute('data-address').toLowerCase();
            const reporter = card.getAttribute('data-reporter').toLowerCase();
            const type = card.getAttribute('data-type').toLowerCase();

            // Combinar todos los campos buscables
            const searchableText = `${ticket} ${address} ${reporter} ${type}`;

            // Verificar coincidencias
            const matchesSearch = searchTerm === '' || searchableText.includes(searchTerm);
            const matchesEstado = selectedEstado === '' || status === selectedEstado;
            const matchesPrioridad = selectedPrioridad === '' || priority === selectedPrioridad;

            // Mostrar u ocultar la tarjeta
            if (matchesSearch && matchesEstado && matchesPrioridad) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Actualizar contador en el header
        if (reportsHeader) {
            reportsHeader.textContent = `Reportes (${visibleCount})`;
        }

        // Mostrar/ocultar mensaje de "sin resultados"
        if (noResultsMessage) {
            if (visibleCount === 0) {
                noResultsMessage.style.display = 'block';
            } else {
                noResultsMessage.style.display = 'none';
            }
        }
    }

    // Event listeners para filtros
    searchInput.addEventListener('input', filterReports);
    filterEstado.addEventListener('change', filterReports);
    filterPrioridad.addEventListener('change', filterReports);

    // Limpiar búsqueda con tecla Escape
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            searchInput.value = '';
            filterReports();
        }
    });
}

/**
 * Inicializa la funcionalidad del botón de exportar
 */
function initExportButton() {
    const exportButton = document.getElementById('exportButton');
    
    if (!exportButton) return;

    exportButton.addEventListener('click', function() {
        const reportsContainer = document.getElementById('reportsContainer');
        const visibleReports = reportsContainer.querySelectorAll('.report-card[style="display: block;"], .report-card:not([style*="display: none"])');
        
        if (visibleReports.length === 0) {
            alert('No hay reportes para exportar con los filtros actuales.');
            return;
        }

        // Crear datos CSV
        let csvContent = 'Ticket,Estado,Prioridad,Tipo,Dirección,Reportado por,Fecha\n';
        
        visibleReports.forEach(report => {
            const ticket = report.getAttribute('data-ticket');
            const status = report.getAttribute('data-status');
            const priority = report.getAttribute('data-priority');
            const type = report.getAttribute('data-type');
            const address = report.getAttribute('data-address');
            const reporter = report.getAttribute('data-reporter');
            const dateElement = report.querySelector('.report-date');
            const date = dateElement ? dateElement.textContent : 'N/A';

            // Escapar comillas y comas en los datos
            const escapeCsv = (text) => {
                if (text.includes(',') || text.includes('"') || text.includes('\n')) {
                    return `"${text.replace(/"/g, '""')}"`;
                }
                return text;
            };

            csvContent += `${escapeCsv(ticket)},${escapeCsv(status)},${escapeCsv(priority)},${escapeCsv(type)},${escapeCsv(address)},${escapeCsv(reporter)},${escapeCsv(date)}\n`;
        });

        // Crear y descargar archivo
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        const now = new Date();
        const fileName = `reportes_solectric_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}_${now.getHours()}${now.getMinutes()}.csv`;
        
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Mostrar confirmación
        showExportConfirmation(visibleReports.length);
    });
}

/**
 * Muestra una confirmación temporal de exportación
 */
function showExportConfirmation(count) {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #34c759;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        animation: slideIn 0.3s ease;
    `;
    message.textContent = `✓ ${count} reporte${count !== 1 ? 's' : ''} exportado${count !== 1 ? 's' : ''} exitosamente`;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(message);
        }, 300);
    }, 3000);
}

/**
 * ========== FUNCIONES PARA MODALES ==========
 */

/**
 * Abre un modal específico con los datos del reporte
 */
function openModal(modalId, reportCard) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    // Extraer datos del reporte
    const ticket = reportCard.getAttribute('data-ticket');
    const status = reportCard.getAttribute('data-status');
    const priority = reportCard.getAttribute('data-priority');
    const address = reportCard.getAttribute('data-address');
    const reporter = reportCard.getAttribute('data-reporter');
    const type = reportCard.getAttribute('data-type');
    
    // Obtener más datos del DOM
    const statusBadge = reportCard.querySelector('.status-badge');
    const priorityBadge = reportCard.querySelector('.priority-badge');
    const fecha = reportCard.querySelector('.report-date')?.textContent || 'N/A';
    const afectados = reportCard.querySelector('.report-affected')?.textContent || 'N/A';
    const equipo = reportCard.querySelectorAll('.detail-value')[1]?.textContent || 'N/A';
    const resolucion = reportCard.querySelectorAll('.detail-value')[2]?.textContent || 'N/A';
    const descripcion = reportCard.querySelector('.description-text')?.textContent || 'N/A';
    const progreso = reportCard.querySelector('.progress-percentage')?.textContent || '0%';
    const progresoNumero = parseInt(progreso);
    const ultimaActualizacion = reportCard.querySelector('.update-text strong')?.nextSibling?.textContent.trim() || 'N/A';
    
    // Obtener teléfono del reportante (si existe)
    const telefono = reportCard.querySelectorAll('.report-affected')[1]?.textContent || '300 000 0000';

    if (modalId === 'modalVerDetalles') {
        // Llenar modal de detalles
        document.getElementById('modalDetallesTicket').textContent = ticket;
        document.getElementById('modalDetallesStatus').textContent = statusBadge?.textContent || status;
        document.getElementById('modalDetallesStatus').className = statusBadge?.className || 'status-badge';
        document.getElementById('modalDetallesPriority').textContent = priorityBadge?.textContent || priority;
        document.getElementById('modalDetallesPriority').className = priorityBadge?.className || 'priority-badge';
        document.getElementById('modalDetallesFecha').textContent = fecha;
        document.getElementById('modalDetallesAfectados').textContent = afectados;
        document.getElementById('modalDetallesUbicacion').textContent = address;
        document.getElementById('modalDetallesTipo').textContent = type;
        document.getElementById('modalDetallesReportante').textContent = reporter;
        document.getElementById('modalDetallesEquipo').textContent = equipo;
        document.getElementById('modalDetallesResolucion').textContent = resolucion;
        document.getElementById('modalDetallesDescripcion').textContent = descripcion;
        document.getElementById('modalDetallesProgresoPorcentaje').textContent = progreso;
        document.getElementById('modalDetallesProgresoBar').style.width = progreso;
        document.getElementById('modalDetallesProgresoStatus').textContent = ultimaActualizacion;
        
        // Aplicar clase según el progreso
        const progressBar = document.getElementById('modalDetallesProgresoBar');
        progressBar.className = 'modal-progress-fill';
        if (progresoNumero < 50) {
            progressBar.classList.add('warning');
        } else if (progresoNumero === 100) {
            progressBar.classList.add('success');
        }
    }
    else if (modalId === 'modalContactar') {
        // Llenar modal de contacto
        document.getElementById('modalContactarTicket').textContent = ticket;
        document.getElementById('modalContactarNombre').textContent = reporter;
        document.getElementById('modalContactarTelefono').textContent = telefono;
        document.getElementById('modalContactarEmail').textContent = `${reporter.toLowerCase().replace(' ', '.')}@email.com`;
        document.getElementById('modalContactarDireccion').textContent = address;
        
        // Limpiar formulario
        document.getElementById('formContactar').reset();
    }
    else if (modalId === 'modalActualizar') {
        // Llenar modal de actualización
        document.getElementById('modalActualizarTicket').textContent = ticket;
        
        // Establecer estado actual
        const estadoSelect = document.getElementById('nuevoEstado');
        const estadoMap = {
            'pendiente': 'pendiente',
            'en progreso': 'en-progreso',
            'en revisión': 'en-revision',
            'resuelto': 'completado',
            'crítico': 'critico'
        };
        estadoSelect.value = estadoMap[status.toLowerCase()] || '';
        
        // Establecer progreso actual
        document.getElementById('porcentajeProgreso').value = progresoNumero;
        updateProgressDisplay(progresoNumero);
        
        // Limpiar notas
        document.getElementById('notasActualizacion').value = '';
        
        // Actualizar preview
        updateStatusPreview();
    }

    // Mostrar modal con animación
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Cierra un modal específico
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * Actualiza la visualización del progreso en el modal de actualización
 */
function updateProgressDisplay(value) {
    document.getElementById('displayProgreso').textContent = value + '%';
    document.getElementById('previewProgresoPorcentaje').textContent = value + '%';
    
    // Actualizar el gradiente del input range
    const progressInput = document.getElementById('porcentajeProgreso');
    progressInput.style.background = `linear-gradient(90deg, #667eea ${value}%, #e5e5e7 ${value}%)`;
}

/**
 * Actualiza la vista previa del estado en el modal de actualización
 */
function updateStatusPreview() {
    const estadoSelect = document.getElementById('nuevoEstado');
    const previewBadge = document.getElementById('previewEstadoBadge');
    
    const estadoTexts = {
        'pendiente': 'Pendiente',
        'en-progreso': 'En Progreso',
        'en-revision': 'En Revisión',
        'completado': 'Completado',
        'critico': 'Crítico'
    };
    
    const estadoClasses = {
        'pendiente': 'status-badge status-available',
        'en-progreso': 'status-badge status-field',
        'en-revision': 'status-badge status-returning',
        'completado': 'status-badge status-resuelto',
        'critico': 'status-badge status-critico'
    };
    
    const selectedEstado = estadoSelect.value;
    
    if (selectedEstado && estadoTexts[selectedEstado]) {
        previewBadge.textContent = estadoTexts[selectedEstado];
        previewBadge.className = estadoClasses[selectedEstado] + ' status-preview-badge';
    } else {
        previewBadge.textContent = 'Seleccione un estado';
        previewBadge.className = 'status-preview-badge status-badge';
    }
}

/**
 * Envía el mensaje de contacto
 */
function enviarMensaje() {
    const form = document.getElementById('formContactar');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const tipoMensaje = document.getElementById('tipoMensaje').value;
    const mensaje = document.getElementById('mensajeContacto').value;
    const nombreCiudadano = document.getElementById('modalContactarNombre').textContent;
    const ticket = document.getElementById('modalContactarTicket').textContent;
    
    // Simular envío (aquí se haría la petición al backend)
    console.log('Enviando mensaje:', {
        ticket: ticket,
        ciudadano: nombreCiudadano,
        tipo: tipoMensaje,
        mensaje: mensaje
    });
    
    // Mostrar confirmación
    showNotification('Mensaje enviado exitosamente', 'success');
    
    // Cerrar modal
    closeModal('modalContactar');
}

/**
 * Guarda la actualización del reporte
 */
function guardarActualizacion() {
    const form = document.getElementById('formActualizar');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const nuevoEstado = document.getElementById('nuevoEstado').value;
    const progreso = document.getElementById('porcentajeProgreso').value;
    const notas = document.getElementById('notasActualizacion').value;
    const ticket = document.getElementById('modalActualizarTicket').textContent;
    
    // Simular guardado (aquí se haría la petición al backend)
    console.log('Actualizando reporte:', {
        ticket: ticket,
        estado: nuevoEstado,
        progreso: progreso + '%',
        notas: notas
    });
    
    // Mostrar confirmación
    showNotification('Reporte actualizado exitosamente', 'success');
    
    // Cerrar modal
    closeModal('modalActualizar');
    
    // Aquí se podría actualizar la tarjeta del reporte en la interfaz
}

/**
 * Muestra una notificación temporal
 */
function showNotification(message, type = 'info') {
    const colors = {
        success: '#34c759',
        error: '#ff3b30',
        warning: '#ff9500',
        info: '#667eea'
    };
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        z-index: 10001;
        font-size: 14px;
        font-weight: 600;
        animation: slideIn 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
    notification.innerHTML = `<span style="font-size: 18px;">${icon}</span> ${message}`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

/**
 * Inicializa los event listeners para los botones de las tarjetas de reporte
 */
function initReportCardActions() {
    // Delegación de eventos para mejor rendimiento
    const reportsContainer = document.getElementById('reportsContainer');
    
    if (!reportsContainer) return;
    
    reportsContainer.addEventListener('click', function(e) {
        const target = e.target;
        const button = target.closest('button.btn');
        
        if (!button) return;
        
        const reportCard = button.closest('.report-card');
        if (!reportCard) return;
        
        const buttonText = button.textContent.trim();
        
        if (buttonText.includes('Ver Detalles')) {
            openModal('modalVerDetalles', reportCard);
        }
        else if (buttonText.includes('Contactar')) {
            openModal('modalContactar', reportCard);
        }
        else if (buttonText.includes('Actualizar')) {
            openModal('modalActualizar', reportCard);
        }
    });
}

// Cerrar modales al hacer clic fuera de ellos
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
        const modalId = e.target.id;
        closeModal(modalId);
    }
});

// Cerrar modales con la tecla Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal-overlay.active');
        if (activeModal) {
            closeModal(activeModal.id);
        }
    }
});

// Inicializar acciones de reportes cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initReportCardActions();
});
