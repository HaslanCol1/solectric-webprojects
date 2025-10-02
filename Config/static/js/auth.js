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

  const loginData = {
    userType,
    email,
    password
  };

  console.log('Login Data:', loginData);

  // Aquí enviarás los datos al backend
  // fetch('/api/auth/login', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(loginData)
  // })

  alert('✅ Iniciando sesión...\n\nDatos capturados (ver consola)');
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