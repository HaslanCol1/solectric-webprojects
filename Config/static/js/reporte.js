import { Storage } from "./utils/storage.js";
import { api } from "./utils/http.js";

// Variables globales
let currentStep = 1;
let formData = {};

// Inicializar la página
// ================== CONFIG DINÁMICA DESDE BACKEND ==================
// Al cargar, obtener token y pedir configuración (tipos, niveles, estados)
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await cargarConfiguracionReportes();
    } catch (e) {
        console.error('Error cargando configuración reportes:', e);
        mostrarMensajeGlobal('No se pudo cargar configuración de reportes. Intenta más tarde.', 'error');
    }
    initializeForm();
    initializeEventListeners();
});

// Contenedores dinámicos (se inyectará contenido)
let configReportes = {
    tipos_reporte: [],
    niveles_urgencia: [],
    estados_reporte: []
};
let idsSeleccion = {
    id_tipo_reporte: null,
    id_nivel_urgencia: null,
    id_estado_reporte: null
};

function obtenerTokenUsuarioActual() {
    // 1) Intentar con 'usuarioActual' (estructura: { v: { access_token, user_data } })
    try {
        const raw = localStorage.getItem('usuarioActual');
        if (raw) {
            const obj = JSON.parse(raw);
            const t = obj?.v?.access_token || obj?.access_token;
            if (t) return t;
        }
    } catch {}

    // 2) Fallback al esquema de Storage (solectric:auth:access_token)
    try {
        const rawTok = localStorage.getItem('solectric:auth:access_token');
        if (rawTok) {
            const rec = JSON.parse(rawTok); // { v: token, e: expiry? }
            const { v, e } = rec || {};
            if (!e || Date.now() <= e) return v;
        }
    } catch {}

    return null;
}

async function cargarConfiguracionReportes() {
    const token = obtenerTokenUsuarioActual();
    if (!token) {
        window.location.href = '/auth?next=reporte';
        return;
    }
    const res = await fetch('http://localhost:8000/api-solectric/v1/catalogo-reportes', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'accept': 'application/json'
        }
    });
    if (!res.ok) {
        if (res.status === 401) {
            window.location.href = '/auth?next=reporte';
            return;
        }
        throw new Error('HTTP ' + res.status);
    }
    const data = await res.json();
    configReportes = data;
    // Guardar catálogo completo para futuros reportes
    try {
        localStorage.setItem('catalogo_reportes', JSON.stringify(data));
        // Además, guarda con el wrapper con TTL (24h) y listas independientes
        const ONE_DAY = 24 * 60 * 60 * 1000;
        try { Storage.set('reportes:catalogo', data, { ttl: ONE_DAY }); } catch {}
        try { Storage.set('reportes:tipos', data.tipos_reporte || [], { ttl: ONE_DAY }); } catch {}
        try { Storage.set('reportes:niveles', data.niveles_urgencia || [], { ttl: ONE_DAY }); } catch {}
        try { Storage.set('reportes:estados', data.estados_reporte || [], { ttl: ONE_DAY }); } catch {}
    } catch (err) {
        console.warn('No se pudo guardar catalogo_reportes en localStorage:', err);
    }
    // Estado pendiente
    const pendiente = (data.estados_reporte || []).find(e => e.nombre?.toLowerCase() === 'pendiente');
    if (pendiente) {
        idsSeleccion.id_estado_reporte = pendiente.id;
        mostrarEstadoPendienteUI(pendiente);
    }
    renderizarTiposReporte();
    renderizarNivelesUrgencia();
}

function mostrarMensajeGlobal(texto, tipo='info') {
    let box = document.getElementById('mensajeGlobalReportes');
    if (!box) {
        box = document.createElement('div');
        box.id = 'mensajeGlobalReportes';
        box.style.cssText = 'max-width:1000px;margin:0 auto 24px;padding:12px 16px;border-radius:8px;font-size:14px;font-weight:500;display:flex;align-items:center;gap:8px;';
        document.querySelector('.main-container')?.insertBefore(box, document.querySelector('.main-container').firstChild.nextSibling);
    }
    const palette = {
        info:{bg:'#eff6ff',border:'#60a5fa',color:'#1e40af',icon:'ℹ️'},
        success:{bg:'#ecfdf5',border:'#34d399',color:'#065f46',icon:'✅'},
        warning:{bg:'#fef3c7',border:'#fbbf24',color:'#92400e',icon:'⚠️'},
        error:{bg:'#fee2e2',border:'#f87171',color:'#7f1d1d',icon:'⛔'}
    }[tipo] || palette.info;
    box.style.background = palette.bg;
    box.style.border = '1px solid ' + palette.border;
    box.style.color = palette.color;
    box.innerHTML = `<span style="font-size:18px;">${palette.icon}</span><span>${texto}</span>`;
}

function mostrarEstadoPendienteUI(estado) {
    // Mostrar en resumen (paso 3) si existe un contenedor
    const resumen = document.getElementById('summaryEstado');
    if (resumen) resumen.textContent = estado.nombre + ' (#' + estado.id + ')';
}

function renderizarTiposReporte() {
    const grid = document.querySelector('.failure-grid');
    if (!grid) return;
    grid.innerHTML = '';
    (configReportes.tipos_reporte || []).forEach(tr => {
        const div = document.createElement('div');
        div.className = 'failure-option';
        div.dataset.idTipo = tr.id;
        div.dataset.nombreTipo = tr.nombre;
        div.dataset.descripcion = tr.descripcion;
        div.innerHTML = `
            <div class="failure-header">
                <span class="failure-emoji">${emojiTipo(tr)}</span>
                <div class="failure-title">${escapeHtml(tr.nombre || 'Tipo')}</div>
            </div>
            <div class="failure-desc">${escapeHtml(tr.descripcion || 'Sin descripción')}</div>
        `;
        div.addEventListener('click', () => {
            document.querySelectorAll('.failure-option').forEach(o => o.classList.remove('selected'));
            div.classList.add('selected');
            idsSeleccion.id_tipo_reporte = tr.id;
        });
        grid.appendChild(div);
    });
}

function renderizarNivelesUrgencia() {
    const grid = document.querySelector('.urgency-grid');
    if (!grid) return;
    grid.innerHTML = '';
    (configReportes.niveles_urgencia || []).forEach(nu => {
        const div = document.createElement('div');
        div.className = 'urgency-option';
        div.dataset.nivelId = nu.id;
        div.dataset.urgency = slugify(nu.nombre || 'urgencia');
        div.dataset.nivelNombre = nu.nombre || '';
        div.innerHTML = `
            <span class="urgency-badge ${claseBadgeUrgencia(nu)}">${escapeHtml(nu.nombre || 'Urgencia')}</span>
            <div class="urgency-content">
                <div class="urgency-label">${escapeHtml(nu.nombre || '')}</div>
                <div class="urgency-desc">${escapeHtml(nu.descripcion || 'Sin descripción')}</div>
            </div>
        `;
        div.addEventListener('click', () => {
            document.querySelectorAll('.urgency-option').forEach(o => o.classList.remove('selected'));
            div.classList.add('selected');
            idsSeleccion.id_nivel_urgencia = nu.id;
        });
        grid.appendChild(div);
    });
}

function emojiTipo(tr) {
    const nombre = (tr.nombre || '').toLowerCase();
    if (nombre.includes('corte')) return '⚡';
    if (nombre.includes('volt')) return '📊';
    if (nombre.includes('transform')) return '🔧';
    if (nombre.includes('cable')) return '⚠️';
    if (nombre.includes('alumbr')) return '💡';
    if (nombre.includes('medidor')) return '📟';
    return '🔌';
}

function claseBadgeUrgencia(nu) {
    const nombre = (nu.nombre || '').toLowerCase();
    if (nombre.includes('bajo')) return 'low';
    if (nombre.includes('medio')) return 'medium';
    if (nombre.includes('alto')) return 'high';
    if (nombre.includes('critic')) return 'critical';
    return 'medium';
}

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[s]));
}

function slugify(text) {
    return String(text)
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

// ================== AJUSTE EN SUBMIT PARA INCLUIR IDS ==================
// Interceptar confirmación final (paso 3) para enviar
// Reutilizamos submitReportBtn ya existente
/*document.addEventListener('click', (e) => {
    const btn = e.target.closest('#submitReportBtn');
    if (!btn) return;
    // Validar que tengamos IDs seleccionados
    if (!idsSeleccion.id_tipo_reporte || !idsSeleccion.id_nivel_urgencia || !idsSeleccion.id_estado_reporte) {
        mostrarMensajeGlobal('Faltan seleccionar tipo de reporte o urgencia.', 'warning');
        e.preventDefault();
        return;
    }
    // Extender formData con IDs requeridos para envío
    formData.id_tipo_reporte = idsSeleccion.id_tipo_reporte;
    formData.id_nivel_urgencia = idsSeleccion.id_nivel_urgencia;
    formData.id_estado_reporte = idsSeleccion.id_estado_reporte;
    // Guardar para ver en resumen antes de confirmación final
    localStorage.setItem('reporteFormData', JSON.stringify(formData));
});*/

// ============== LOGOUT (limpia datos de usuario y catálogos) ==============
function clearAllUserData() {
    try { localStorage.removeItem('usuarioActual'); } catch {}
    try { localStorage.removeItem('catalogo_reportes'); } catch {}
    try { localStorage.removeItem('reporteFormData'); } catch {}
    // Limpiar posibles claves del wrapper Storage con prefijo solectric:
    try {
        Object.keys(localStorage).forEach((k) => {
            if (k.startsWith('solectric:')) localStorage.removeItem(k);
        });
    } catch {}
}

document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (ev) => {
            ev.preventDefault();
            clearAllUserData();
            window.location.href = '/';
        });
    }
});

function initializeForm() {
    showStep(1);
    updateProgress(1);
    
    // Si estamos en el paso 3, cargar datos guardados y actualizar el resumen
    if (window.location.pathname.includes('paso3')) {
        // Cargar datos desde localStorage
        const savedData = localStorage.getItem('reporteFormData');
        if (savedData) {
            formData = JSON.parse(savedData);
            console.log('Datos cargados:', formData); // Para debugging
        }
        
        // Actualizar el resumen con un pequeño delay
        setTimeout(updateSummary, 100);
    }
}

function initializeEventListeners() {
    // Limpiar errores cuando el usuario interactúe con los campos
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', clearFieldErrorsOnInput);
        input.addEventListener('change', clearFieldErrorsOnInput);
    });

    // Botón de enviar reporte
    const submitBtn = document.getElementById('submitReportBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showConfirmationModal();
        });
    }

    // Botón de confirmar en modal
    const confirmOkBtn = document.getElementById('confirmOkBtn');
    if (confirmOkBtn) {
        confirmOkBtn.addEventListener('click', function() {
            const submitBtn = document.getElementById('submitReportBtn');
            const redirectUrl = submitBtn ? submitBtn.getAttribute('data-redirect') : '/';
            
            // Limpiar datos guardados
            localStorage.removeItem('reporteFormData');
            
            // Redirigir
            window.location.href = redirectUrl;
        });
    }

    // Obtener ubicación
    const locationBtn = document.getElementById('getLocationBtn');
    if (locationBtn) {
        locationBtn.addEventListener('click', getCurrentLocation);
    }

    // Opciones de falla
    const failureOptions = document.querySelectorAll('.failure-option');
    failureOptions.forEach(option => {
        option.addEventListener('click', function () {
            selectFailureType(this);
            // Limpiar errores de tipo de falla al seleccionar
            document.querySelectorAll('.failure-option').forEach(opt => {
                opt.classList.remove('field-error');
            });
            clearFieldErrorsOnInput();
        });
    });

    // Opciones de urgencia
    const urgencyOptions = document.querySelectorAll('.urgency-option');
    urgencyOptions.forEach(option => {
        option.addEventListener('click', function () {
            selectUrgency(this);
            // Limpiar errores de urgencia al seleccionar
            document.querySelectorAll('.urgency-option').forEach(opt => {
                opt.classList.remove('field-error');
            });
            clearFieldErrorsOnInput();
        });
    });

    // Upload area
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');

    if (uploadArea && fileInput) {
        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('drop', handleFileDrop);
        fileInput.addEventListener('change', handleFileSelect);
    }

    // Botones de navegación con validación
    const continueButtons = document.querySelectorAll('.continue-btn');
    continueButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault(); // Prevenir navegación por defecto
            
            // Determinar qué validación hacer según el destino del enlace
            const href = this.getAttribute('href');
            let validationPassed = false;
            
            if (href.includes('paso2')) {
                // Estamos en paso 1, validar paso 1
                validationPassed = validateStep1();
                if (validationPassed) {
                    // Guardar datos del paso 1
                    formData.municipio = document.getElementById('municipio').value;
                    formData.barrio = document.getElementById('barrio').value;
                    formData.direccion = document.getElementById('direccion').value;
                    formData.referencia = document.getElementById('referencia').value;
                    formData.failureType = document.querySelector('.failure-option.selected')?.dataset.type;
                    
                    // Guardar en localStorage
                    localStorage.setItem('reporteFormData', JSON.stringify(formData));
                }
            } else if (href.includes('paso3')) {
                // Estamos en paso 2, validar paso 2
                validationPassed = validateStep2();
                if (validationPassed) {
                    // Cargar datos previos
                    const savedData = localStorage.getItem('reporteFormData');
                    if (savedData) {
                        formData = JSON.parse(savedData);
                    }
                    
                    // Guardar datos del paso 2
                    formData.descripcion = document.getElementById('descripcion').value;
                    formData.fechaInicio = document.getElementById('fechaInicio').value;
                    formData.personasAfectadas = document.getElementById('personasAfectadas').value;
                    formData.urgency = document.querySelector('.urgency-option.selected')?.dataset.urgency;
                    
                    // Guardar en localStorage
                    localStorage.setItem('reporteFormData', JSON.stringify(formData));
                }
            } else {
                // Cualquier otro caso, permitir navegación
                validationPassed = true;
            }
            
            // Si la validación pasó, navegar
            if (validationPassed) {
                // Navegar usando el href del enlace
                window.location.href = href;
            }
        });
    });
}

// Funciones de navegación
function showStep(step) {
    // Ocultar todos los pasos
    document.querySelectorAll('.step').forEach(s => {
        s.classList.remove('active');
    });

    // Mostrar el paso actual
    const currentStepEl = document.getElementById(`step${step}`);
    if (currentStepEl) {
        currentStepEl.classList.add('active');
    }

    currentStep = step;
    updateProgress(step);
}

function updateProgress(step) {
    // Actualizar círculos de progreso
    for (let i = 1; i <= 3; i++) {
        const circle = document.getElementById(`step${i}Circle`);
        const line = document.getElementById(`line${i}`);

        if (circle) {
            circle.classList.remove('completed', 'active', 'inactive');

            if (i < step) {
                circle.classList.add('completed');
                circle.innerHTML = '<i class="fas fa-check"></i>';
            } else if (i === step) {
                circle.classList.add('active');
                circle.textContent = i;
            } else {
                circle.classList.add('inactive');
                circle.textContent = i;
            }
        }

        if (line && i < 3) {
            line.classList.toggle('completed', i < step);
        }
    }
}

function nextStep() {
    if (validateCurrentStep()) {
        saveCurrentStepData();
        if (currentStep < 3) {
            showStep(currentStep + 1);
        }
    }
}

function previousStep() {
    if (currentStep > 1) {
        showStep(currentStep - 1);
    }
}

// Validación de pasos
function validateCurrentStep() {
    switch (currentStep) {
        case 1:
            return validateStep1();
        case 2:
            return validateStep2();
        case 3:
            return true; // Paso de confirmación
        default:
            return false;
    }
}

function validateStep1() {
    // Limpiar errores previos
    clearFieldErrors();

    // Validar municipio (top down)
    const municipio = document.getElementById('municipio');
    if (!municipio.value.trim()) {
        showFieldError(municipio, 'Por favor, selecciona un municipio');
        return false;
    }

    // Validar barrio/sector
    const barrio = document.getElementById('barrio');
    if (!barrio.value.trim()) {
        showFieldError(barrio, 'Por favor, ingresa el barrio o sector');
        return false;
    }

    // Validar dirección exacta
    const direccion = document.getElementById('direccion');
    if (!direccion.value.trim()) {
        showFieldError(direccion, 'Por favor, ingresa la dirección exacta');
        return false;
    }

    // Validar tipo de falla
    const failureType = document.querySelector('.failure-option.selected');
    if (!failureType) {
        const failureContainer = document.querySelector('.failure-grid');
        showFieldError(failureContainer, 'Por favor, selecciona el tipo de falla');
        // Resaltar todas las opciones de falla
        document.querySelectorAll('.failure-option').forEach(option => {
            option.classList.add('field-error');
        });
        return false;
    }

    return true;
}

function validateStep2() {
    // Limpiar errores previos
    clearFieldErrors();

    // Validar descripción detallada (top down)
    const descripcion = document.getElementById('descripcion');
    if (!descripcion.value.trim()) {
        showFieldError(descripcion, 'Por favor, describe la falla detalladamente');
        return false;
    }

    // Validar cuándo comenzó
    const fechaInicio = document.getElementById('fechaInicio');
    if (!fechaInicio.value) {
        showFieldError(fechaInicio, 'Por favor, indica cuándo comenzó la falla');
        return false;
    }

    // Validar personas afectadas
    const personasAfectadas = document.getElementById('personasAfectadas');
    if (!personasAfectadas.value) {
        showFieldError(personasAfectadas, 'Por favor, indica las personas afectadas aproximadamente');
        return false;
    }

    // Validar nivel de urgencia
    const urgency = document.querySelector('.urgency-option.selected');
    if (!urgency) {
        const urgencyContainer = document.querySelector('.urgency-grid');
        showFieldError(urgencyContainer, 'Por favor, selecciona el nivel de urgencia');
        // Resaltar todas las opciones de urgencia
        document.querySelectorAll('.urgency-option').forEach(option => {
            option.classList.add('field-error');
        });
        return false;
    }

    return true;
}

// Guardar datos del paso actual
function saveCurrentStepData() {
    switch (currentStep) {
        case 1:
            formData.municipio = document.getElementById('municipio').value;
            formData.barrio = document.getElementById('barrio').value;
            formData.direccion = document.getElementById('direccion').value;
            formData.referencia = document.getElementById('referencia').value;
            {
                const selTipo = document.querySelector('.failure-option.selected');
                formData.failureType = selTipo ? (selTipo.querySelector('.failure-title')?.textContent || selTipo.dataset.type) : undefined;
            }
            break;

        case 2:
            formData.descripcion = document.getElementById('descripcion').value;
            formData.fechaInicio = document.getElementById('fechaInicio').value;
            formData.personasAfectadas = document.getElementById('personasAfectadas').value;
            {
                const selUrg = document.querySelector('.urgency-option.selected');
                formData.urgency = selUrg ? (selUrg.dataset.nivelNombre || selUrg.querySelector('.urgency-label')?.textContent || selUrg.dataset.urgency) : undefined;
            }
            break;
    }

    // Actualizar resumen en paso 3
    if (currentStep === 2) {
        updateSummary();
    }
}

// Funciones de ubicación
function getCurrentLocation() {
    const btn = document.getElementById('getLocationBtn');
    const originalText = btn.innerHTML;

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Obteniendo ubicación...';
    btn.disabled = true;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                document.getElementById('latitude').value = lat;
                document.getElementById('longitude').value = lng;

                // Obtener dirección usando geocoding reverso
                reverseGeocode(lat, lng);

                btn.innerHTML = originalText;
                btn.disabled = false;

                alert('Ubicación obtenida correctamente');
            },
            error => {
                console.error('Error obteniendo ubicación:', error);
                btn.innerHTML = originalText;
                btn.disabled = false;

                let message = 'Error obteniendo ubicación';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        message = 'Permiso de ubicación denegado';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        message = 'Ubicación no disponible';
                        break;
                    case error.TIMEOUT:
                        message = 'Tiempo de espera agotado';
                        break;
                }
                alert(message);
            }
        );
    } else {
        btn.innerHTML = originalText;
        btn.disabled = false;
        alert('Geolocalización no soportada');
    }
}

function reverseGeocode(lat, lng) {
    // Aquí podrías usar un servicio de geocoding como Google Maps, OpenStreetMap, etc.
    // Por ahora, solo establecemos las coordenadas
    console.log(`Ubicación: ${lat}, ${lng}`);
}

// Funciones de selección
function selectFailureType(option) {
    document.querySelectorAll('.failure-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    option.classList.add('selected');
}

function selectUrgency(option) {
    document.querySelectorAll('.urgency-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    option.classList.add('selected');
}

// Funciones de archivo
function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.style.borderColor = '#8b5cf6';
    e.currentTarget.style.background = '#faf5ff';
}

function handleFileDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.style.borderColor = '#d9d9d9';
    e.currentTarget.style.background = '#fafafa';

    const files = e.dataTransfer.files;
    handleFiles(files);
}

function handleFileSelect(e) {
    const files = e.target.files;
    handleFiles(files);
}

function handleFiles(files) {
    const fileList = document.getElementById('fileList');

    for (let file of files) {
        if (file.type.startsWith('image/') || file.type === 'application/pdf') {
            const fileItem = createFileItem(file);
            fileList.appendChild(fileItem);
        } else {
            alert('Solo se permiten imágenes y archivos PDF');
        }
    }
}

function createFileItem(file) {
    const div = document.createElement('div');
    div.className = 'file-item';
    div.innerHTML = `
                <i class="fas fa-file"></i>
                <span>${file.name}</span>
                <button type="button" onclick="removeFile(this)">
                    <i class="fas fa-times"></i>
                </button>
            `;
    return div;
}

function removeFile(button) {
    button.parentElement.remove();
}

function updateSummary() {
    const saved = JSON.parse(localStorage.getItem('reporteFormData') || "{}");
    const selTipo  = JSON.parse(localStorage.getItem('solectric:reporte.tipo')  || "null");
    const selNivel = JSON.parse(localStorage.getItem('solectric:reporte.nivel') || "null");

    const ubicacionParts = [];
    if (saved.municipio) ubicacionParts.push(saved.municipio);
    if (saved.barrio)    ubicacionParts.push(saved.barrio);
    if (saved.direccion) ubicacionParts.push(saved.direccion);
    const ubicacion = ubicacionParts.length ? ubicacionParts.join(", ") : "No especificado";
    const ubicacionElement = document.getElementById('summaryUbicacion');
    if (ubicacionElement) ubicacionElement.textContent = ubicacion;

    const tipoFallaElement = document.getElementById('summaryTipoFalla');
    if (tipoFallaElement) {
        const fromDOM = document.querySelector('.failure-option.selected .failure-title')?.textContent;
        tipoFallaElement.textContent = fromDOM || selTipo?.nombre || saved.failureType || 'No especificado';
    }

    const urgenciaElement = document.getElementById('summaryUrgencia');
    if (urgenciaElement) {
        const fromDOM = document.querySelector('.urgency-option.selected .urgency-badge')?.textContent
            || document.querySelector('.urgency-option.selected .urgency-label')?.textContent;
        urgenciaElement.textContent = fromDOM || selNivel?.nombre || saved.urgency || 'No especificado';
    }

    const descripcionElement = document.getElementById('summaryDescripcion');
    if (descripcionElement) {
        descripcionElement.textContent = saved.descripcion || 'No especificado';
    }

    const evidenciaElement = document.getElementById('summaryEvidencia');
    if (evidenciaElement) {
        const fileCount = document.querySelectorAll('#filesPreview .file-item').length;
        evidenciaElement.textContent = fileCount > 0
            ? `${fileCount} archivo(s) adjunto(s)`
            : 'Sin evidencia fotográfica';
    }
}


// Funciones para manejo de errores de campo
function showFieldError(element, message) {
    // Agregar clase de error al elemento
    element.classList.add('field-error');
    
    // Crear mensaje de error
    const errorMessage = document.createElement('div');
    errorMessage.className = 'field-error-message';
    errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    // Insertar el mensaje después del elemento
    if (element.parentNode) {
        element.parentNode.insertBefore(errorMessage, element.nextSibling);
    }
    
    // Scroll suave hacia el campo con error
    element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest'
    });
    
    // Enfocar el campo si es posible
    if (element.focus && (element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'TEXTAREA')) {
        setTimeout(() => element.focus(), 300);
    }
}

function clearFieldErrors() {
    // Remover clases de error
    document.querySelectorAll('.field-error').forEach(element => {
        element.classList.remove('field-error');
    });
    
    // Remover mensajes de error
    document.querySelectorAll('.field-error-message').forEach(message => {
        message.remove();
    });
}

function clearFieldErrorsOnInput() {
    // Función para limpiar errores cuando el usuario comience a escribir/seleccionar
    document.querySelectorAll('.field-error-message').forEach(message => {
        message.remove();
    });
}

function buildReportBody(saved) {
    const tipo  = JSON.parse(localStorage.getItem("solectric:reporte.tipo")  || "null");
    const nivel = JSON.parse(localStorage.getItem("solectric:reporte.nivel") || "null");
    console.log(tipo)
    console.log(nivel)
    return {
        municipio: (saved?.municipio || "").trim(),
        barrio: (saved?.barrio || "").trim(),
        direccion: (saved?.direccion || "").trim(),
        punto_referencia: (saved?.referencia || "").trim(),
        tipo_id: tipo?.id ?? null,
        descripcion: (saved?.descripcion || "").trim(),
        ocurrido_en: saved?.fechaInicio ? new Date(saved.fechaInicio).toISOString() : null,
        personas_afectadas: saved?.personasAfectadas ? Number(saved.personasAfectadas) : 0,
        nivel_id: nivel?.id ?? null,
    };
}

// === Validaciones del body ===
function validateReportBody(body) {
    const errors = [];
    console.log(body);
    if (!body.municipio) errors.push("Selecciona el municipio.");
    if (!body.barrio) errors.push("Ingresa el barrio/sector.");
    if (!body.direccion) errors.push("Ingresa la dirección exacta.");
    if (!body.tipo_id) errors.push("Selecciona el tipo de falla.");
    if (!body.descripcion) errors.push("Agrega una descripción.");
    if (!body.ocurrido_en) errors.push("Indica cuándo comenzó la falla.");
    if (!Number.isFinite(body.personas_afectadas) || body.personas_afectadas < 0) {
        errors.push("Personas afectadas debe ser un número válido (>= 0).");
    }
    if (!body.nivel_id) errors.push("Selecciona el nivel de urgencia.");
    return { ok: errors.length === 0, errors };
}

async function updateLocalStorageReportes() {
    try {
        const responseReportes = await api.get("/reportes", null);
        localStorage.setItem('lista_reportes', JSON.stringify(responseReportes));
    } catch (e) {
        console.error("Error actualizando lista de reportes en localStorage:", e);
    }
}

async function showConfirmationModal() {
    const savedData = JSON.parse(localStorage.getItem('reporteFormData') || "{}");
    const body = buildReportBody(savedData);
    const { ok, errors } = validateReportBody(body);

    if (!ok) {
        mostrarMensajeGlobal("Por favor corrige: " + errors.join(" "), "warning");
        return;
    }

    try {
        const modal = document.getElementById('confirmationModal');
        if (modal) modal.style.display = 'none';
        mostrarMensajeGlobal("Enviando reporte...", "info");

        const response = await api.post("/reportes", body);
        updateLocalStorageReportes().then(() => console.log("Reportes actualizados correctamente ✅"))

        mostrarMensajeGlobal("Reporte enviado correctamente ✅", "success");

        const ticketNumber = 'RPT' + (response.id || Date.now().toString().slice(-6));
        const ticketElement = document.getElementById('ticketNumber');
        if (ticketElement) ticketElement.textContent = ticketNumber;

        if (modal) modal.style.display = 'flex';

    } catch (err) {
        console.error("❌ Error al enviar reporte:", err);
        const msg = err.data?.detail || err.message || "Error desconocido al enviar el reporte.";
        mostrarMensajeGlobal("Error al enviar el reporte: " + msg, "error");
    }
}
