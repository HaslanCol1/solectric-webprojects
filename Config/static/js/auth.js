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

// ====== UI helpers para mensajes (reemplazo de alert) ======
function clearFormMessage(sectionEl) {
  if (!sectionEl) return;
  const existing = sectionEl.querySelector('[data-form-message="true"]');
  if (existing) existing.remove();
}

function showFormMessage(sectionEl, text, type = 'info', opts = {}) {
  if (!sectionEl) return;
  clearFormMessage(sectionEl);

  const palette = {
    info:    { bg: '#eff6ff', border: '#60a5fa', text: '#1e40af', icon: 'info' },
    success: { bg: '#ecfdf5', border: '#34d399', text: '#065f46', icon: 'check_circle' },
    warning: { bg: '#fef3c7', border: '#fbbf24', text: '#92400e', icon: 'warning' },
    error:   { bg: '#fee2e2', border: '#f87171', text: '#7f1d1d', icon: 'error' }
  }[type] || {
    bg: '#eff6ff', border: '#60a5fa', text: '#1e40af', icon: 'info'
  };

  const wrap = document.createElement('div');
  wrap.setAttribute('data-form-message', 'true');
  wrap.style.cssText = `
    background: ${palette.bg};
    border: 1px solid ${palette.border};
    color: ${palette.text};
    border-radius: 10px;
    padding: 10px 12px;
    margin-bottom: 16px;
    display: flex;
    align-items: start;
    gap: 8px;
    font-size: 13px;
  `;

  const icon = document.createElement('span');
  icon.className = 'material-icons';
  icon.textContent = palette.icon;
  icon.style.cssText = 'font-size:18px;line-height:18px;';

  const msg = document.createElement('div');
  msg.textContent = text;
  msg.style.cssText = 'flex:1;';

  const close = document.createElement('button');
  close.type = 'button';
  close.textContent = '×';
  close.style.cssText = `
    background: transparent;
    border: 0;
    color: ${palette.text};
    font-size: 18px;
    cursor: pointer;
    line-height: 18px;
  `;
  close.addEventListener('click', () => wrap.remove());

  wrap.appendChild(icon);
  wrap.appendChild(msg);
  wrap.appendChild(close);

  // Insertar al inicio de la sección
  sectionEl.insertBefore(wrap, sectionEl.firstChild);

  // Autocierre
  let autoHide = opts.autoHide;
  if (autoHide === undefined) autoHide = (type !== 'error');
  if (autoHide) setTimeout(() => wrap.remove(), opts.timeout || 6000);
}

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

    showFormMessage(registerSection, "✅ Cuenta creada. Iniciando sesión…", 'success');

    /*// Si quieres loguear automáticamente al usuario tras registrarse:
    // Asumo credenciales por correo + contraseña. Si tu /auth usa otro payload,
    // cambia las claves (ver comentario más abajo).
    await api.login({
      correo_electronico: email,
      contrasenia: password,
    }, { ttl: 3600_000 }); // token expira en 1h (opcional)*/

    // Redirige a donde prefieras tras registro+login
    // window.location.href = "/ciudadano";

    showFormMessage(registerSection, 'Fuiste registrado exitosamente, intenta iniciar sesión.', 'success');

  } catch (e) {
    // e.status y e.data vienen del ApiClient
    if (e.status === 409) {
      showFormMessage(registerSection, '⚠️ Número de identificación ya registrado.', 'warning');
    } else if (e.status === 422) {
      showFormMessage(registerSection, '⚠️ Datos inválidos. Revisa el formulario.', 'error', { autoHide: false });
    } else {
      console.error("Registro falló:", e);
      showFormMessage(registerSection, '❌ Error creando la cuenta. Intenta nuevamente.', 'error', { autoHide: false });
    }
  }
}

// =============== LOGIN =====================
export async function handleLogin(event) {
  event.preventDefault();

  const userType = document.getElementById('userType').value; // 'ciudadano' | 'funcionario'
  const email    = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  if (!userType || !email || !password) {
    showFormMessage(loginSection, 'Por favor, completa todos los campos', 'warning');
    return;
  }

  try {
    await api.login({
      correo_electronico: email,
      contrasenia: password,
      rol: userType,
    }, { ttl: 3600_000 });

    const res = await api.get("/catalogo-reportes", null)

    localStorage.setItem('catalogo_reportes', JSON.stringify(res));

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
      showFormMessage(loginSection, '❌ Credenciales inválidas.', 'error', { autoHide: false });
    } else {
      console.error("Login falló:", e);
      showFormMessage(loginSection, '❌ No se pudo iniciar sesión. Intenta de nuevo.', 'error', { autoHide: false });
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
