document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.menu-toggle');
    const menu = document.getElementById('menu-principal');

    if (!toggle || !menu) return;

    const closeMenu = () => {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menú');
    };

    const openMenu = () => {
        menu.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Cerrar menú');
    };

    toggle.addEventListener('click', () => {
        const isOpen = menu.classList.contains('is-open');
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Cierra el menú al tocar un link (comportamiento esperado en mobile)
    menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    // Cierra con Escape (accesibilidad de teclado)
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMenu();
    });

    // Si el usuario rota el dispositivo o agranda la ventana hasta desktop,
    // aseguramos que el menú no quede "abierto" colgando en el layout de escritorio
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) closeMenu();
    });
});
