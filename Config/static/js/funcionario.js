// ==================== VARIABLES GLOBALES ====================
let currentView = 'dashboard';
let currentReportsFilter = 'all';
let notificationsData = {
    alerts: [
        {
            id: 1,
            type: 'critical',
            title: 'Falla Eléctrica Crítica',
            message: 'Se reportó una falla en el transformador TR-345 que está afectando a 1,200 usuarios.',
            location: 'Zona Industrial Norte',
            time: 'Hace 15 min',
            priority: 'alta'
        },
        {
            id: 2,
            type: 'high',
            title: 'Mantenimiento Programado',
            message: 'Recordatorio: Mantenimiento preventivo programado para mañana 06:00 AM en Sector 7.',
            location: 'Barrio Los Olivos',
            time: 'Hace 2 horas',
            priority: 'media'
        },
        {
            id: 3,
            type: 'medium',
            title: 'Reporte de Calidad',
            message: 'Nueva evaluación de calidad de servicio disponible para revisión.',
            location: 'Todo el distrito',
            time: 'Hace 4 horas',
            priority: 'baja'
        }
    ],
    reports: [
        {
            id: 4,
            type: 'success',
            title: 'Reporte Resuelto',
            message: 'El reporte #REP-2024-0156 ha sido marcado como resuelto exitosamente.',
            location: 'Av. Principal 1234',
            time: 'Hace 1 hora',
            priority: 'media'
        },
        {
            id: 5,
            type: 'medium',
            title: 'Nuevo Reporte',
            message: 'Se ha recibido un nuevo reporte de falla de alumbrado público.',
            location: 'Calle Las Flores 567',
            time: 'Hace 3 horas',
            priority: 'baja'
        }
    ]
};

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateDateTime();
    setInterval(updateDateTime, 60000); // Actualizar cada minuto
    initializeCharts();
    updateNotificationCount();
    
    // Cargar vista inicial
    showView('dashboard');
});

// ==================== EVENT LISTENERS ====================
function initializeEventListeners() {
    // Navegación principal
    document.getElementById('btnDashboard')?.addEventListener('click', () => showView('dashboard'));
    document.getElementById('btnEquipos')?.addEventListener('click', () => showView('equipos'));
    document.getElementById('btnMetricas')?.addEventListener('click', () => showView('metricas'));

    // Menú de usuario
    const userButton = document.querySelector('.user-button');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    userButton?.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        dropdownMenu?.classList.toggle('active');
    });

    // Cerrar dropdown al hacer clic fuera
    document.addEventListener('click', function() {
        userButton?.classList.remove('active');
        dropdownMenu?.classList.remove('active');
    });

    // Notificaciones
    const notificationBtn = document.querySelector('.notification-btn');
    const notificationsPanel = document.querySelector('.notifications-panel');
    const closePanel = document.querySelector('.btn-close-panel');

    notificationBtn?.addEventListener('click', function(e) {
        e.stopPropagation();
        notificationsPanel?.classList.toggle('active');
        loadNotifications();
    });

    closePanel?.addEventListener('click', function() {
        notificationsPanel?.classList.remove('active');
    });

    // Tabs de notificaciones
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchNotificationTab(tabId);
        });
    });

    // Filtros de reportes
    const searchInput = document.getElementById('searchReports');
    const filterStatus = document.getElementById('filterStatus');
    const filterPriority = document.getElementById('filterPriority');

    searchInput?.addEventListener('input', filterReports);
    filterStatus?.addEventListener('change', filterReports);
    filterPriority?.addEventListener('change', filterReports);

    // Acciones de reportes
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-contact')) {
            const reportId = e.target.closest('.report-card').getAttribute('data-report-id');
            contactCitizen(reportId);
        }
        
        if (e.target.closest('.btn-details')) {
            const reportId = e.target.closest('.report-card').getAttribute('data-report-id');
            showReportDetails(reportId);
        }
        
        if (e.target.closest('.btn-update')) {
            const reportId = e.target.closest('.report-card').getAttribute('data-report-id');
            updateReportStatus(reportId);
        }
    });

    // Cerrar panel de notificaciones al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.notifications-panel') && !e.target.closest('.notification-btn')) {
            notificationsPanel?.classList.remove('active');
        }
    });
}

// ==================== NAVEGACIÓN ====================
function showView(viewName) {
    // Actualizar botones activos
    document.querySelectorAll('.btn-dashboard, .btn-equipos, .btn-metricas').forEach(btn => {
        btn.classList.remove('active');
    });

    // Ocultar todas las vistas
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });

    // Mostrar vista seleccionada
    const targetView = document.getElementById(`${viewName}View`);
    const targetButton = document.getElementById(`btn${viewName.charAt(0).toUpperCase() + viewName.slice(1)}`);

    if (targetView) {
        targetView.classList.add('active');
    }

    if (targetButton) {
        targetButton.classList.add('active');
    }

    currentView = viewName;

    // Cargar contenido específico de la vista
    switch(viewName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'equipos':
            loadTeamsData();
            break;
        case 'metricas':
            loadAnalyticsData();
            break;
    }
}

// ==================== DASHBOARD ====================
function loadDashboardData() {
    // Simular carga de datos del dashboard
    updateMetrics();
    loadRecentReports();
}

function updateMetrics() {
    // Métricas simuladas
    const metrics = {
        activeReports: Math.floor(Math.random() * 15) + 8,
        resolvedToday: Math.floor(Math.random() * 25) + 12,
        avgResponseTime: (Math.random() * 2 + 1.5).toFixed(1),
        teamEfficiency: Math.floor(Math.random() * 15) + 85,
        criticalAlerts: Math.floor(Math.random() * 5) + 2,
        usersAffected: Math.floor(Math.random() * 500) + 1200
    };

    // Actualizar valores en el DOM
    updateMetricValue('activeReports', metrics.activeReports, 'warning');
    updateMetricValue('resolvedToday', metrics.resolvedToday, 'success');
    updateMetricValue('avgResponseTime', metrics.avgResponseTime + 'h', 'info');
    updateMetricValue('teamEfficiency', metrics.teamEfficiency + '%', 'purple');
    updateMetricValue('criticalAlerts', metrics.criticalAlerts, 'critical');
    updateMetricValue('usersAffected', metrics.usersAffected.toLocaleString(), 'info');
}

function updateMetricValue(metricId, value, type) {
    const element = document.getElementById(metricId);
    if (element) {
        element.textContent = value;
        element.className = `metric-value ${type}`;
    }
}

function loadRecentReports() {
    const reportsContainer = document.getElementById('reportsList');
    if (!reportsContainer) return;

    // Datos de ejemplo
    const reports = [
        {
            id: 'REP-2024-0189',
            type: 'Corte de Energía',
            status: 'progress',
            priority: 'high',
            location: 'Av. Central 1234, Barrio Norte',
            description: 'Corte total de energía eléctrica que afecta a 15 viviendas en la manzana.',
            citizen: 'María González',
            phone: '+57 300 123 4567',
            date: '2024-01-15 14:30',
            progress: 65,
            lastUpdate: 'Equipo técnico en camino al lugar',
            estimatedTime: '2 horas'
        },
        {
            id: 'REP-2024-0188',
            type: 'Falla en Poste',
            status: 'review',
            priority: 'medium',
            location: 'Calle 45 #23-67, Centro',
            description: 'Poste de alumbrado público presenta daños visibles en la estructura.',
            citizen: 'Carlos Ramírez',
            phone: '+57 301 987 6543',
            date: '2024-01-15 11:15',
            progress: 30,
            lastUpdate: 'Evaluación técnica programada',
            estimatedTime: '4 horas'
        },
        {
            id: 'REP-2024-0187',
            type: 'Medidor Dañado',
            status: 'resolved',
            priority: 'low',
            location: 'Carrera 12 #8-90, Zona Sur',
            description: 'Medidor eléctrico presenta lecturas erróneas y necesita reemplazo.',
            citizen: 'Ana Martínez',
            phone: '+57 302 456 7890',
            date: '2024-01-14 16:45',
            progress: 100,
            lastUpdate: 'Medidor reemplazado exitosamente',
            estimatedTime: 'Completado'
        },
        {
            id: 'REP-2024-0186',
            type: 'Alumbrado Público',
            status: 'pending',
            priority: 'low',
            location: 'Parque Principal, Zona Centro',
            description: 'Varias luminarias del parque no están funcionando correctamente.',
            citizen: 'Luis Fernández',
            phone: '+57 304 321 0987',
            date: '2024-01-14 09:20',
            progress: 0,
            lastUpdate: 'Reporte recibido, pendiente asignación',
            estimatedTime: 'Por definir'
        }
    ];

    reportsContainer.innerHTML = reports.map(report => createReportCard(report)).join('');
}

function createReportCard(report) {
    const statusClass = {
        'progress': 'status-progress',
        'review': 'status-review',
        'resolved': 'status-resolved',
        'pending': 'status-pending'
    };

    const statusText = {
        'progress': 'En Progreso',
        'review': 'En Revisión',
        'resolved': 'Resuelto',
        'pending': 'Pendiente'
    };

    const priorityClass = {
        'high': 'priority-high',
        'medium': 'priority-medium',
        'low': 'priority-low'
    };

    const priorityText = {
        'high': 'Alta',
        'medium': 'Media',
        'low': 'Baja'
    };

    return `
        <div class="report-card" data-report-id="${report.id}">
            <div class="report-header">
                <div class="report-id-section">
                    <span class="report-id">${report.id}</span>
                    <span class="status-badge ${statusClass[report.status]}">${statusText[report.status]}</span>
                </div>
                <span class="priority-badge ${priorityClass[report.priority]}">${priorityText[report.priority]}</span>
            </div>
            
            <div class="report-type">${report.type}</div>
            
            <div class="report-location">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                ${report.location}
            </div>
            
            <p class="report-description">${report.description}</p>
            
            <div class="report-meta">
                <div class="report-info">
                    <strong>Ciudadano:</strong> ${report.citizen}<br>
                    <strong>Teléfono:</strong> ${report.phone}<br>
                    <strong>Fecha:</strong> ${new Date(report.date).toLocaleDateString('es-CO', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </div>
                <div class="report-info">
                    <strong>Tiempo estimado:</strong> ${report.estimatedTime}<br>
                    <strong>Estado:</strong> ${statusText[report.status]}
                </div>
            </div>
            
            ${report.status !== 'resolved' ? `
                <div class="progress-section">
                    <div class="progress-label">
                        <span>Progreso</span>
                        <span>${report.progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${report.progress}%"></div>
                    </div>
                </div>
            ` : ''}
            
            <div class="report-update">
                <span class="update-label">Última actualización:</span>
                ${report.lastUpdate}
            </div>
            
            <div class="report-actions">
                <button class="btn-action btn-contact">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    Contactar
                </button>
                <button class="btn-action btn-details">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    Ver Detalles
                </button>
                ${report.status !== 'resolved' ? `
                    <button class="btn-action btn-update">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                        </svg>
                        Actualizar Estado
                    </button>
                ` : ''}
            </div>
        </div>
    `;
}

// ==================== EQUIPOS ====================
function loadTeamsData() {
    const teamsContainer = document.getElementById('teamsGrid');
    if (!teamsContainer) return;

    const teams = [
        {
            id: 'TEAM-001',
            name: 'Equipo Alpha',
            location: 'Zona Norte',
            status: 'active',
            leader: 'Ing. Roberto Silva',
            members: 4,
            activeReports: 3,
            specialty: 'Mantenimiento Preventivo'
        },
        {
            id: 'TEAM-002',
            name: 'Equipo Beta',
            location: 'Zona Centro',
            status: 'field',
            leader: 'Tec. Carmen López',
            members: 3,
            activeReports: 2,
            specialty: 'Reparaciones Urgentes'
        },
        {
            id: 'TEAM-003',
            name: 'Equipo Gamma',
            location: 'Zona Sur',
            status: 'available',
            leader: 'Ing. Diego Morales',
            members: 5,
            activeReports: 0,
            specialty: 'Instalaciones Nuevas'
        },
        {
            id: 'TEAM-004',
            name: 'Equipo Delta',
            location: 'Zona Industrial',
            status: 'returning',
            leader: 'Tec. Patricia Ruiz',
            members: 4,
            activeReports: 1,
            specialty: 'Transformadores'
        }
    ];

    teamsContainer.innerHTML = teams.map(team => createTeamCard(team)).join('');
}

function createTeamCard(team) {
    const statusClass = {
        'active': 'status-active',
        'field': 'status-field',
        'available': 'status-available',
        'returning': 'status-returning'
    };

    const statusText = {
        'active': 'Activo',
        'field': 'En Campo',
        'available': 'Disponible',
        'returning': 'Regresando'
    };

    return `
        <div class="team-card" data-team-id="${team.id}">
            <div class="team-header">
                <div>
                    <div class="team-name">${team.name}</div>
                    <div class="team-location">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        ${team.location}
                    </div>
                </div>
                <span class="team-status ${statusClass[team.status]}">${statusText[team.status]}</span>
            </div>
            
            <div class="team-info">
                <div style="margin-bottom: 12px;">
                    <strong>Líder:</strong> ${team.leader}
                </div>
                <div style="margin-bottom: 12px;">
                    <strong>Especialidad:</strong> ${team.specialty}
                </div>
                <div style="margin-bottom: 12px;">
                    <strong>Miembros:</strong> ${team.members}
                </div>
                <div class="team-reports">
                    <strong>Reportes activos:</strong> ${team.activeReports}
                </div>
            </div>
        </div>
    `;
}

// ==================== MÉTRICAS ====================
function loadAnalyticsData() {
    // Cargar datos analíticos
    updateCharts();
}

function initializeCharts() {
    // Simular datos para gráficos
    setTimeout(() => {
        updateChart('reportsByType', [
            { label: 'Cortes de Energía', value: 45, color: '#ef4444' },
            { label: 'Alumbrado Público', value: 30, color: '#f59e0b' },
            { label: 'Medidores', value: 15, color: '#10b981' },
            { label: 'Postes/Cables', value: 10, color: '#3b82f6' }
        ]);

        updateChart('responseTime', [
            { label: 'Crítico (< 1h)', value: 85, color: '#ef4444' },
            { label: 'Alto (< 4h)', value: 92, color: '#f59e0b' },
            { label: 'Medio (< 24h)', value: 96, color: '#10b981' },
            { label: 'Bajo (< 72h)', value: 98, color: '#3b82f6' }
        ]);

        updateChart('teamPerformance', [
            { label: 'Equipo Alpha', value: 95, color: '#7c3aed' },
            { label: 'Equipo Beta', value: 88, color: '#3b82f6' },
            { label: 'Equipo Gamma', value: 92, color: '#10b981' },
            { label: 'Equipo Delta', value: 85, color: '#f59e0b' }
        ]);
    }, 500);
}

function updateChart(chartId, data) {
    const container = document.getElementById(chartId);
    if (!container) return;

    const maxValue = Math.max(...data.map(item => item.value));
    
    container.innerHTML = data.map(item => `
        <div class="chart-item">
            <div class="chart-bar-container">
                <div class="chart-label">${item.label}</div>
                <div class="chart-bar">
                    <div class="chart-fill" style="width: ${(item.value / maxValue) * 100}%; background: ${item.color};"></div>
                </div>
            </div>
            <div class="chart-value">${item.value}${chartId === 'responseTime' ? '%' : ''}</div>
        </div>
    `).join('');

    // Animar las barras
    setTimeout(() => {
        container.querySelectorAll('.chart-fill').forEach((fill, index) => {
            fill.style.width = `${(data[index].value / maxValue) * 100}%`;
        });
    }, 100);
}

function updateCharts() {
    // Actualizar gráficos con nuevos datos
    initializeCharts();
}

// ==================== NOTIFICACIONES ====================
function updateNotificationCount() {
    const totalNotifications = notificationsData.alerts.length + notificationsData.reports.length;
    const badge = document.querySelector('.notification-badge');
    const notifCount = document.querySelector('.notif-count');
    
    if (badge) {
        badge.textContent = totalNotifications;
        badge.style.display = totalNotifications > 0 ? 'block' : 'none';
    }
    
    if (notifCount) {
        notifCount.textContent = totalNotifications;
    }
}

function loadNotifications() {
    // Cargar tab activo
    const activeTab = document.querySelector('.tab-btn.active')?.getAttribute('data-tab') || 'alerts';
    switchNotificationTab(activeTab);
}

function switchNotificationTab(tabId) {
    // Actualizar botones de tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
        }
    });

    // Actualizar contenido
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    const targetContent = document.getElementById(`${tabId}Content`);
    if (targetContent) {
        targetContent.classList.add('active');
        loadNotificationsList(tabId);
    }
}

function loadNotificationsList(type) {
    const container = document.getElementById(`${type}Content`).querySelector('.notifications-list');
    if (!container) return;

    const data = notificationsData[type] || [];
    
    container.innerHTML = data.map(notification => `
        <div class="notification-item ${notification.type}" data-notification-id="${notification.id}">
            <div class="notif-icon ${notification.type}">
                ${getNotificationIcon(notification.type)}
            </div>
            <div class="notif-content">
                <div class="notif-title">${notification.title}</div>
                <p class="notif-text">${notification.message}</p>
                <div class="notif-location">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 12px; height: 12px;">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    </svg>
                    ${notification.location}
                </div>
            </div>
            <div class="notif-time">${notification.time}</div>
        </div>
    `).join('');
}

function getNotificationIcon(type) {
    const icons = {
        critical: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.866-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>',
        high: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>',
        medium: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
        success: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
    };
    return icons[type] || icons.medium;
}

// ==================== ACCIONES DE REPORTES ====================
function contactCitizen(reportId) {
    // Simular contacto con ciudadano
    alert(`Contactando al ciudadano del reporte ${reportId}...`);
    
    // Aquí se podría abrir un modal de contacto o iniciar una llamada
    console.log(`Iniciando contacto para reporte: ${reportId}`);
}

function showReportDetails(reportId) {
    // Mostrar detalles completos del reporte
    alert(`Mostrando detalles del reporte ${reportId}...`);
    
    // Aquí se podría abrir un modal con información detallada
    console.log(`Mostrando detalles para reporte: ${reportId}`);
}

function updateReportStatus(reportId) {
    // Actualizar estado del reporte
    const newStatus = prompt('Ingrese el nuevo estado del reporte:', 'En progreso');
    if (newStatus) {
        alert(`Estado del reporte ${reportId} actualizado a: ${newStatus}`);
        
        // Aquí se podría hacer una petición al servidor
        console.log(`Actualizando estado del reporte ${reportId} a: ${newStatus}`);
        
        // Recargar la lista de reportes
        loadRecentReports();
    }
}

// ==================== FILTROS ====================
function filterReports() {
    const searchTerm = document.getElementById('searchReports')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('filterStatus')?.value || 'all';
    const priorityFilter = document.getElementById('filterPriority')?.value || 'all';

    const reportCards = document.querySelectorAll('.report-card');
    
    reportCards.forEach(card => {
        const reportText = card.textContent.toLowerCase();
        const reportStatus = card.querySelector('.status-badge')?.textContent.toLowerCase() || '';
        const reportPriority = card.querySelector('.priority-badge')?.textContent.toLowerCase() || '';
        
        const matchesSearch = reportText.includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || reportStatus.includes(statusFilter.toLowerCase());
        const matchesPriority = priorityFilter === 'all' || reportPriority.includes(priorityFilter.toLowerCase());
        
        if (matchesSearch && matchesStatus && matchesPriority) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// ==================== UTILIDADES ====================
function updateDateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('es-CO', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    const dateString = now.toLocaleDateString('es-CO', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    // Actualizar elementos de fecha/hora si existen
    const timeElements = document.querySelectorAll('.current-time');
    const dateElements = document.querySelectorAll('.current-date');
    
    timeElements.forEach(el => el.textContent = timeString);
    dateElements.forEach(el => el.textContent = dateString);
}

// ==================== ACCIONES DEL USUARIO ====================
function logout() {
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
        // Limpiar datos de sesión
        localStorage.removeItem('funcionario_session');
        
        // Redirigir a página de login
        window.location.href = '/auth';
    }
}

function openProfile() {
    // Abrir modal de perfil (reutilizar el modal global)
    const event = new CustomEvent('openProfile');
    document.dispatchEvent(event);
}

// ==================== EVENTOS PERSONALIZADOS ====================
document.addEventListener('openProfile', function() {
    // Manejar apertura de perfil
    console.log('Abriendo perfil del funcionario...');
});

// ==================== FUNCIONES DE EXPORTACIÓN ====================
function exportReports() {
    // Simular exportación de reportes
    alert('Exportando reportes... Esta funcionalidad estará disponible próximamente.');
}

function generateReport() {
    // Simular generación de reporte
    alert('Generando reporte analítico... Esta funcionalidad estará disponible próximamente.');
}

// ==================== KEYBOARD SHORTCUTS ====================
document.addEventListener('keydown', function(e) {
    // Atajos de teclado
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                showView('dashboard');
                break;
            case '2':
                e.preventDefault();
                showView('equipos');
                break;
            case '3':
                e.preventDefault();
                showView('metricas');
                break;
            case 'n':
                e.preventDefault();
                document.querySelector('.notification-btn')?.click();
                break;
        }
    }
    
    // Escape para cerrar paneles
    if (e.key === 'Escape') {
        document.querySelector('.notifications-panel')?.classList.remove('active');
        document.querySelector('.dropdown-menu')?.classList.remove('active');
    }
});

// ==================== AUTO-REFRESH ====================
// Actualizar datos cada 5 minutos
setInterval(() => {
    if (currentView === 'dashboard') {
        updateMetrics();
    }
    updateNotificationCount();
}, 300000);

// ==================== ANIMACIONES ====================
// Animaciones de entrada para las tarjetas
function animateCards() {
    const cards = document.querySelectorAll('.report-card, .team-card, .metric-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Ejecutar animaciones cuando cambie la vista
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const target = mutation.target;
            if (target.classList.contains('view') && target.classList.contains('active')) {
                setTimeout(animateCards, 100);
            }
        }
    });
});

// Observar cambios en las vistas
document.querySelectorAll('.view').forEach(view => {
    observer.observe(view, { attributes: true });
});
