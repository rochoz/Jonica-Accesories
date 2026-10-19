/*
 * animaciones.js — Animaciones sutiles de entrada y header compacto.
 *
 * Objetivos:
 *  - Aparición progresiva de tarjetas de producto al entrar en pantalla.
 *  - Aparición suave de los títulos de sección.
 *  - Header que se compacta al hacer scroll (sin mover el layout).
 *  - Respetar prefers-reduced-motion: si el sistema pide menos movimiento,
 *    no se anima nada y el contenido se muestra directo.
 *
 * Sin dependencias. Sin build. No toca datos, precios, stock ni enlaces.
 */

(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function sinMovimiento() {
        return reduceMotion.matches;
    }

    // La marca .js-anim habilita los estados "ocultos" del CSS.
    // Solo se pone si vamos a animar de verdad: sin JS, o con "menos
    // movimiento", el sitio se muestra completo y sin clases que oculten.
    if (!sinMovimiento()) {
        document.documentElement.classList.add('js-anim');
    }

    /* ------------------------------------------------------------------ *
     * 1. Aparición al hacer scroll (IntersectionObserver)
     * ------------------------------------------------------------------ */

    function iniciarApariciones() {
        // Si el navegador no soporta IntersectionObserver, mostramos todo.
        if (!('IntersectionObserver' in window)) {
            document.documentElement.classList.remove('js-anim');
            return;
        }

        var tarjetas = Array.prototype.slice.call(
            document.querySelectorAll('.productos-card')
        );
        var titulos = Array.prototype.slice.call(
            document.querySelectorAll('.categoria h2, .categoria h3, #categorias-title')
        );
        var bloques = Array.prototype.slice.call(
            document.querySelectorAll('#contacto')
        );

        var observados = tarjetas.concat(titulos, bloques);

        if (!observados.length) return;

        observados.forEach(function (el) {
            el.classList.add('anim-prep');
        });

        var observer = new IntersectionObserver(
            function (entradas) {
                entradas.forEach(function (entrada) {
                    if (!entrada.isIntersecting) return;

                    var el = entrada.target;

                    // Escalonado suave: las tarjetas de una misma fila entran
                    // con un pequeño retardo entre sí para dar ritmo.
                    var retardo = 0;
                    if (el.classList.contains('productos-card')) {
                        retardo = (el.dataset.animIndice % 3) * 90;
                    }

                    el.style.transitionDelay = retardo + 'ms';
                    el.classList.add('anim-visible');

                    // Dejamos de observar: la animación se hace una sola vez.
                    observer.unobserve(el);

                    window.setTimeout(function () {
                        el.style.transitionDelay = '';
                    }, retardo + 700);
                });
            },
            {
                // Se dispara un poco antes de que el elemento entre del todo,
                // para que la animación ya esté corriendo al llegar a la vista.
                rootMargin: '0px 0px -60px 0px',
                threshold: 0.08
            }
        );

        // Índice dentro de la fila, para el escalonado.
        var contador = {};
        tarjetas.forEach(function (card) {
            var grid = card.parentElement;
            var clave = grid ? (grid.dataset.animClave || '') : '';
            if (grid && !clave) {
                clave = 'grid-' + (Object.keys(contador).length);
                grid.dataset.animClave = clave;
                contador[clave] = 0;
            }
            card.dataset.animIndice = contador[clave] || 0;
            contador[clave] = (contador[clave] || 0) + 1;
        });

        observados.forEach(function (el) {
            observer.observe(el);
        });

        /* Red de seguridad.
         *
         * Si el usuario salta directo a un ancla (ej. catalogo.html#aritos)
         * o carga la página ya con un #hash, las secciones intermedias nunca
         * pasan por el viewport y sus tarjetas quedarían ocultas para siempre.
         * Aquí revelamos todo lo que el navegador ya "pasó de largo".
         */
        function revelarLoSalteado() {
            var alto = window.innerHeight || 0;
            observados.forEach(function (el) {
                if (el.classList.contains('anim-visible')) return;
                // Elemento ya scrolleado por encima del borde superior de la vista.
                if (el.getBoundingClientRect().bottom < alto * 0.5) {
                    el.classList.add('anim-visible');
                    observer.unobserve(el);
                }
            });
        }

        // Tras un salto por ancla, el navegador mueve el scroll sin disparar
        // intersecciones fiables en todos los motores.
        window.addEventListener('hashchange', function () {
            window.setTimeout(revelarLoSalteado, 120);
        });

        // Al cargar con un #hash ya presente.
        if (window.location.hash) {
            window.setTimeout(revelarLoSalteado, 250);
        }

        // Último recurso: si tras 6s NADA se reveló, asumimos que el observer
        // no funciona en este navegador y mostramos todo. Si algo ya se reveló,
        // el mecanismo anda y no tocamos nada (dejamos las animaciones vivas).
        window.setTimeout(function () {
            var algunaVisible = observados.some(function (el) {
                return el.classList.contains('anim-visible');
            });
            if (algunaVisible) return;
            observados.forEach(function (el) {
                el.classList.add('anim-visible');
            });
        }, 6000);
    }

    /* ------------------------------------------------------------------ *
     * 2. Header compacto al hacer scroll
     * ------------------------------------------------------------------ */

    function iniciarHeaderCompacto() {
        var header = document.querySelector('header');
        if (!header) return;

        var umbral = 40;
        var ticking = false;

        function actualizar() {
            var compacto = window.scrollY > umbral;
            header.classList.toggle('header-compacto', compacto);
            ticking = false;
        }

        function alScrollear() {
            // rAF: evita recalcular en cada evento de scroll.
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(actualizar);
        }

        window.addEventListener('scroll', alScrollear, { passive: true });
        actualizar();
    }

    /* ------------------------------------------------------------------ *
     * Arranque
     * ------------------------------------------------------------------ */

    function iniciar() {
        // Con "menos movimiento" activado: nada se anima. El contenido se ve
        // por defecto porque nunca se aplicó js-anim ni las clases que ocultan.
        if (sinMovimiento()) {
            document.documentElement.classList.remove('js-anim');
            return;
        }

        iniciarApariciones();

        // Si el usuario cambia la preferencia en caliente, pasamos todo a
        // visible de inmediato y sacamos los estados de animación.
        if (reduceMotion.addEventListener) {
            reduceMotion.addEventListener('change', function (e) {
                if (!e.matches) return;
                document.documentElement.classList.remove('js-anim');
                document.querySelectorAll('.anim-prep').forEach(function (el) {
                    el.classList.remove('anim-prep');
                    el.classList.add('anim-visible');
                });
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciar);
    } else {
        iniciar();
    }

    // El header compacto es independiente del resto y no molesta con
    // "menos movimiento" (es un cambio de sombra/altura, no un desplazamiento).
    iniciarHeaderCompacto();
})();
