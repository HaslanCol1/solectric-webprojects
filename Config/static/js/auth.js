import { api } from "./utils/http.js";
import { AuthStore } from "./utils/storage.js";

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

export async function handleRegister(event) {
  event.preventDefault();

  const name       = document.getElementById('registerName').value;
  const phone      = document.getElementById('registerPhone').value;
  const email      = document.getElementById('registerEmail').value;
  const municipio  = document.getElementById('registerMunicipio').value; // si backend lo pide, agrégalo al body
  const address    = document.getElementById('registerAddress').value;
  const password   = document.getElementById('registerPassword').value;
  const numberCard = document.getElementById('registerNumberCard').value; // número identificación
  const nic        = document.getElementById('registerNIC').value;

  const body = {
    "nombre_completo":       name,
    "numero_identificacion": numberCard,
    "telefono":              phone,
    "nic":                   nic,
    "correo_electronico":    email,
    "direccion":             address,
    "contrasenia":           password
    // "municipio": municipio, // <-- si el backend lo necesita, descomenta
  };

  console.log(body)

  try {
    const created = await api.post("/ciudadanos", body, { auth: false });

    alert("✅ Cuenta creada. Iniciando sesión…");

    /*// Si quieres loguear automáticamente al usuario tras registrarse:
    // Asumo credenciales por correo + contraseña. Si tu /auth usa otro payload,
    // cambia las claves (ver comentario más abajo).
    await api.login({
      correo_electronico: email,
      contrasenia: password,
    }, { ttl: 3600_000 }); // token expira en 1h (opcional)*/

    // Redirige a donde prefieras tras registro+login
    // window.location.href = "/ciudadano";

    alert('Fuiste registrado exitosamente, intenta iniciar sesión.');

  } catch (e) {
    // e.status y e.data vienen del ApiClient
    if (e.status === 409) {
      alert("⚠️ Número de identificación ya registrado.");
    } else if (e.status === 422) {
      alert("⚠️ Datos inválidos. Revisa el formulario.");
    } else {
      console.error("Registro falló:", e);
      alert("❌ Error creando la cuenta. Intenta nuevamente.");
    }
  }
}

// =============== LOGIN =====================
export async function handleLogin(event) {
  event.preventDefault();

  const userType = document.getElementById('userType').value; // 'ciudadano' | 'funcionario'
  const email    = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  console.log(userType)

  if (!userType || !email || !password) {
    alert('Por favor, completa todos los campos');
    return;
  }

  try {
    // IMPORTANTE: ajusta el payload a lo que espera TU /auth.
    // Suposición 1 (frecuente): { correo_electronico, contrasenia }
    // Si tu backend usa otro formato (p.ej. { numero_identificacion, codigo_acceso }),
    // cambia estas claves manteniendo la llamada a api.login(...).
    await api.login({
      correo_electronico: email,
      contrasenia: password,
      rol: userType,
      // tipo_usuario: userType,   // si tu backend lo requiere, descomenta
    }, { ttl: 3600_000 });

    // Si llegaste aquí, ya hay token en LocalStorage:
    // AuthStore.token() => 'Bearer ...'
    const urlParams = new URLSearchParams(window.location.search);
    const nextPage = urlParams.get('next');

    if (nextPage === 'reporte' && userType === 'ciudadano') {
      window.location.href = '/reporte';
    } else if (userType === 'ciudadano') {
      window.location.href = '/ciudadano';
    } else if (userType === 'funcionario') {
      window.location.href = '/funcionario';
    } else {
      window.location.href = '/ciudadano'; // default
    }
  } catch (e) {
    if (e.status === 401) {
      alert("❌ Credenciales inválidas.");
    } else {
      console.error("Login falló:", e);
      alert("❌ No se pudo iniciar sesión. Intenta de nuevo.");
    }
  }
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

// Exponer funciones para que los handlers inline las vean
window.handleRegister = (e) => handleRegister(e);
window.handleLogin = (e) => handleLogin(e);
window.showForgotPassword = () => showForgotPassword();
window.backToLogin = () => backToLogin();
