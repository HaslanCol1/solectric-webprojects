// Elements
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const loginSection = document.getElementById('loginSection');
const registerSection = document.getElementById('registerSection');
const forgotSection = document.getElementById('forgotSection');
const cardTitle = document.getElementById('cardTitle');
const tabsContainer = document.getElementById('tabsContainer');
const successMessage = document.getElementById('successMessage');

// Switch to Login
loginTab.addEventListener('click', () => {
  loginTab.classList.add('active');
  registerTab.classList.remove('active');
  loginSection.classList.add('active');
  registerSection.classList.remove('active');
  forgotSection.classList.remove('active');
  cardTitle.textContent = 'Iniciar Sesión';
  tabsContainer.style.display = 'flex';
});

// Switch to Register
registerTab.addEventListener('click', () => {
  registerTab.classList.add('active');
  loginTab.classList.remove('active');
  registerSection.classList.add('active');
  loginSection.classList.remove('active');
  forgotSection.classList.remove('active');
  cardTitle.textContent = 'Crear Cuenta';
  tabsContainer.style.display = 'flex';
});

// Show Forgot Password
function showForgotPassword() {
  loginSection.classList.remove('active');
  registerSection.classList.remove('active');
  forgotSection.classList.add('active');
  cardTitle.textContent = 'Recuperar Contraseña';
  tabsContainer.style.display = 'none';
  successMessage.classList.remove('show');

  // Clear forgot password form
  document.getElementById('forgotEmail').value = '';
}

// Back to Login
function backToLogin() {
  forgotSection.classList.remove('active');
  loginSection.classList.add('active');
  cardTitle.textContent = 'Iniciar Sesión';
  tabsContainer.style.display = 'flex';
  loginTab.classList.add('active');
  registerTab.classList.remove('active');
  successMessage.classList.remove('show');
}

// Handle Login
function handleLogin(event) {
  event.preventDefault();

  const userType = document.getElementById('userType').value;
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  // Validación básica
  if (!userType || !email || !password) {
    alert('Por favor, completa todos los campos');
    return;
  }

  const loginData = {
    userType,
    email,
    password
  };

  console.log('Login Data:', loginData);
  
  // Verificar si hay un parámetro 'next' en la URL
  const urlParams = new URLSearchParams(window.location.search);
  const nextPage = urlParams.get('next');
  
  // Redirigir según el contexto inmediatamente
  if (nextPage === 'reporte' && userType === 'ciudadano') {
    // Si viene del botón "Reportar Falla" y es ciudadano, ir directo al reporte
    window.location.href = '/reporte';
  } else if (userType === 'ciudadano') {
    window.location.href = '/ciudadano';
  } else if (userType === 'funcionario') {
    window.location.href = '/funcionario';
  } else {
    window.location.href = '/ciudadano'; // default
  }
}

// Handle Register
function handleRegister(event) {
  event.preventDefault();

  const name = document.getElementById('registerName').value;
  const phone = document.getElementById('registerPhone').value;
  const email = document.getElementById('registerEmail').value;
  const municipio = document.getElementById('registerMunicipio').value;
  const address = document.getElementById('registerAddress').value;
  const password = document.getElementById('registerPassword').value;

  const registerData = {
    name,
    phone,
    email,
    municipio,
    address,
    password
  };

  console.log('Register Data:', registerData);

  // Aquí enviarás los datos al backend
  // fetch('/api/auth/register', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(registerData)
  // })

  alert('✅ Creando cuenta...\n\nDatos capturados (ver consola)');
}

// Handle Forgot Password
function handleForgotPassword(event) {
  event.preventDefault();

  const email = document.getElementById('forgotEmail').value;

  const forgotData = {
    email
  };

  console.log('Forgot Password Data:', forgotData);

  // Aquí enviarás los datos al backend
  // fetch('/api/auth/forgot-password', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(forgotData)
  // })

  // Mostrar mensaje de éxito
  successMessage.classList.add('show');

  // Opcional: Volver al login después de 5 segundos
  setTimeout(() => {
    backToLogin();
  }, 5000);
}

// Función para inicializar la página de autenticación
function initializeAuthPage() {
  // Verificar si hay un parámetro 'next' en la URL
  const urlParams = new URLSearchParams(window.location.search);
  const nextPage = urlParams.get('next');
  const tipo = urlParams.get('tipo');
  
  if (nextPage === 'reporte') {
    // Mostrar mensaje específico para reportar falla
    showReportMessage();
    // Pre-seleccionar ciudadano como tipo de usuario
    const userTypeSelect = document.getElementById('userType');
    if (userTypeSelect) {
      userTypeSelect.value = 'ciudadano';
    }
  }
  
  // Pre-seleccionar tipo de usuario si viene en la URL
  if (tipo) {
    const userTypeSelect = document.getElementById('userType');
    if (userTypeSelect) {
      userTypeSelect.value = tipo;
    }
  }
}

// Función para mostrar mensaje cuando viene del reporte
function showReportMessage() {
  const cardTitle = document.getElementById('cardTitle');
  if (cardTitle) {
    cardTitle.innerHTML = 'Iniciar Sesión';
  }
  
  // Agregar mensaje informativo
  const loginSection = document.getElementById('loginSection');
  if (loginSection && !document.getElementById('reportMessage')) {
    const messageDiv = document.createElement('div');
    messageDiv.id = 'reportMessage';
    messageDiv.style.cssText = `
      background: #fef3c7;
      border: 1px solid #fbbf24;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 20px;
      color: #92400e;
      font-size: 13px;
      text-align: center;
    `;
    messageDiv.innerHTML = '⚠️ Necesitas iniciar sesión para reportar una falla eléctrica';
    loginSection.insertBefore(messageDiv, loginSection.firstChild);
  }
}

// Inicializar cuando se cargue la página
document.addEventListener('DOMContentLoaded', function() {
  initializeAuthPage();
});