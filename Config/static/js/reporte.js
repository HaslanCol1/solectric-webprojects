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
}

function initializeEventListeners() {
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
        });
    });

    // Opciones de urgencia
    const urgencyOptions = document.querySelectorAll('.urgency-option');
    urgencyOptions.forEach(option => {
        option.addEventListener('click', function () {
            selectUrgency(this);
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

    // Botones de navegación
    const backButtons = document.querySelectorAll('.btn-back');
    backButtons.forEach(btn => {
        btn.addEventListener('click', () => previousStep());
    });

    const continueButtons = document.querySelectorAll('.continue-btn');
    continueButtons.forEach(btn => {
        btn.addEventListener('click', () => nextStep());
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
    const address = document.getElementById('address').value.trim();
    const failureType = document.querySelector('.failure-option.selected');

    if (!address) {
        alert('Por favor, ingresa la dirección');
        return false;
    }

    if (!failureType) {
        alert('Por favor, selecciona el tipo de falla');
        return false;
    }

    return true;
}

function validateStep2() {
    const description = document.getElementById('description').value.trim();
    const urgency = document.querySelector('.urgency-option.selected');

    if (!description) {
        alert('Por favor, describe la falla');
        return false;
    }

    if (!urgency) {
        alert('Por favor, selecciona el nivel de urgencia');
        return false;
    }

    return true;
}

// Guardar datos del paso actual
function saveCurrentStepData() {
    switch (currentStep) {
        case 1:
            formData.address = document.getElementById('address').value;
            formData.reference = document.getElementById('reference').value;
            formData.latitude = document.getElementById('latitude').value;
            formData.longitude = document.getElementById('longitude').value;
            formData.failureType = document.querySelector('.failure-option.selected')?.dataset.type;
            break;

        case 2:
            formData.description = document.getElementById('description').value;
            formData.details = document.getElementById('details').value;
            formData.urgency = document.querySelector('.urgency-option.selected')?.dataset.urgency;
            formData.contactName = document.getElementById('contactName').value;
            formData.contactPhone = document.getElementById('contactPhone').value;
            formData.contactEmail = document.getElementById('contactEmail').value;
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
    // Dirección
    document.getElementById('summaryAddress').textContent =
        formData.address || 'No especificado';

    // Tipo de falla
    const failureTypes = {
        'outage': 'Corte de energía',
        'voltage': 'Problemas de voltaje',
        'equipment': 'Falla en equipos',
        'wiring': 'Problemas de cableado',
        'meter': 'Problema con medidor',
        'other': 'Otro'
    };
    document.getElementById('summaryFailureType').textContent =
        failureTypes[formData.failureType] || 'No especificado';

    // Urgencia
    const urgencyLevels = {
        'low': 'Baja',
        'medium': 'Media',
        'high': 'Alta',
        'critical': 'Crítica'
    };
    document.getElementById('summaryUrgency').textContent =
        urgencyLevels[formData.urgency] || 'No especificado';

    // Descripción
    document.getElementById('summaryDescription').textContent =
        formData.description || 'No especificado';

    // Contacto
    document.getElementById('summaryContact').textContent =
        formData.contactName || 'No especificado';

    // Archivos
    const fileCount = document.querySelectorAll('#fileList .file-item').length;
    document.getElementById('summaryFiles').textContent =
        fileCount > 0 ? `${fileCount} archivo(s) adjunto(s)` : 'Sin archivos';
}