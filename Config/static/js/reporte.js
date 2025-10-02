// Variables globales
let currentStep = 1;
let formData = {};

// Inicializar la página
document.addEventListener('DOMContentLoaded', function () {
    initializeForm();
    initializeEventListeners();
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
            formData.failureType = document.querySelector('.failure-option.selected')?.dataset.type;
            break;

        case 2:
            formData.descripcion = document.getElementById('descripcion').value;
            formData.fechaInicio = document.getElementById('fechaInicio').value;
            formData.personasAfectadas = document.getElementById('personasAfectadas').value;
            formData.urgency = document.querySelector('.urgency-option.selected')?.dataset.urgency;
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

// Actualizar resumen
function updateSummary() {
    console.log('Actualizando resumen con datos:', formData); // Para debugging
    
    // Ubicación (combinar municipio, barrio y dirección)
    let ubicacionParts = [];
    if (formData.municipio) ubicacionParts.push(formData.municipio);
    if (formData.barrio) ubicacionParts.push(formData.barrio);
    if (formData.direccion) ubicacionParts.push(formData.direccion);
    
    const ubicacion = ubicacionParts.length > 0 ? ubicacionParts.join(', ') : 'No especificado';
    const ubicacionElement = document.getElementById('summaryUbicacion');
    if (ubicacionElement) {
        ubicacionElement.textContent = ubicacion;
    }

    // Tipo de falla
    const failureTypes = {
        'corte-total': 'Corte Total de Energía',
        'fluctuaciones': 'Fluctuaciones de Voltaje',
        'transformador': 'Transformador Dañado',
        'cables': 'Cables Caídos',
        'alumbrado': 'Alumbrado Público',
        'medidor': 'Problema con Medidor'
    };
    const tipoFallaElement = document.getElementById('summaryTipoFalla');
    if (tipoFallaElement) {
        tipoFallaElement.textContent = failureTypes[formData.failureType] || 'No especificado';
    }

    // Urgencia
    const urgencyLevels = {
        'bajo': 'Bajo',
        'medio': 'Medio',
        'alto': 'Alto',
        'critico': 'Crítico'
    };
    const urgenciaElement = document.getElementById('summaryUrgencia');
    if (urgenciaElement) {
        urgenciaElement.textContent = urgencyLevels[formData.urgency] || 'No especificado';
    }

    // Descripción
    const descripcionElement = document.getElementById('summaryDescripcion');
    if (descripcionElement) {
        descripcionElement.textContent = formData.descripcion || 'No especificado';
    }

    // Evidencia (archivos subidos)
    const fileCount = document.querySelectorAll('#filesPreview .file-item').length;
    const evidenciaElement = document.getElementById('summaryEvidencia');
    if (evidenciaElement) {
        evidenciaElement.textContent = fileCount > 0 ? `${fileCount} archivo(s) adjunto(s)` : 'Sin evidencia fotográfica';
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

// Función para mostrar el modal de confirmación
function showConfirmationModal() {
    // Generar número de ticket aleatorio
    const ticketNumber = 'RPT' + Date.now().toString().slice(-6);
    
    // Mostrar número de ticket
    const ticketElement = document.getElementById('ticketNumber');
    if (ticketElement) {
        ticketElement.textContent = ticketNumber;
    }
    
    // Mostrar modal
    const modal = document.getElementById('confirmationModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}