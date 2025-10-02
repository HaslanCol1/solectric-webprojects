function toggleUserMenu() {
    const menu = document.getElementById('userMenu');
    menu.classList.toggle('active');
}

document.addEventListener('click', function(event) {
    const menu = document.getElementById('userMenu');
    const userBtn = document.querySelector('.user-btn');
    const userName = document.querySelector('.user-name');
    
    if (!menu.contains(event.target) && !userBtn.contains(event.target) && !userName.contains(event.target)) {
        menu.classList.remove('active');
    }
});

function handleLogout() {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
        window.location.href = '/auth';
    }
}

function showView(view) {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
        if ((view === 'dashboard' && btn.textContent === 'Dashboard') ||
            (view === 'comunidad' && btn.textContent === 'Comunidad')) {
            btn.classList.add('active');
        }
    });

    const dashboardView = document.getElementById('dashboardView');
    const comunidadView = document.getElementById('comunidadView');

    if (view === 'dashboard') {
        dashboardView.style.display = 'block';
        comunidadView.classList.remove('active');
    } else if (view === 'comunidad') {
        dashboardView.style.display = 'none';
        comunidadView.classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    showView('dashboard');
});