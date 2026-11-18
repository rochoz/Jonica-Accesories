document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.menu-toggle');
    const menu = document.getElementById('menu-principal');
    const navigation = document.getElementById('navbar');
    const categoryLinks = document.querySelectorAll('.categorias-nav a');

    if (!toggle || !menu || !navigation) return;

    const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

    const closeMenu = ({ restoreFocus = false } = {}) => {
        if (!isOpen()) return;
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menú');
        if (restoreFocus) toggle.focus();
    };

    const openMenu = () => {
        menu.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Cerrar menú');
    };

    toggle.addEventListener('click', () => {
        if (isOpen()) closeMenu();
        else openMenu();
    });

    menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => closeMenu());
    });

    // Category links also close the disclosure if it is open, then follow their existing anchor.
    categoryLinks.forEach((link) => {
        link.addEventListener('click', () => closeMenu());
    });

    document.addEventListener('pointerdown', (event) => {
        if (!isOpen() || navigation.contains(event.target)) return;
        const focusedMenuItem = menu.contains(document.activeElement);
        const categoryTarget = event.target instanceof Element && event.target.closest('.categorias-nav a');
        closeMenu({ restoreFocus: focusedMenuItem && !categoryTarget });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && isOpen()) {
            event.preventDefault();
            closeMenu({ restoreFocus: true });
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 767) closeMenu();
    });
});
