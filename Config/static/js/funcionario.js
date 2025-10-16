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

// Inicializar acciones de reportes cuando sea necesario
// initReportCardActions();
