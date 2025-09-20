// JS para Portal Ciudadano
// Puedes agregar interactividad aquí, por ejemplo, para la búsqueda de reportes

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.pc-search');
    const reportCards = document.querySelectorAll('.pc-report-card');

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const val = searchInput.value.toLowerCase();
            reportCards.forEach(card => {
                const text = card.textContent.toLowerCase();
                card.style.display = text.includes(val) ? '' : 'none';
            });
        });
    }
});
