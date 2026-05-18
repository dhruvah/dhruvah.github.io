// Site-wide JS — handles nav injection, scroll state, mobile menu

(function() {
    // Determine path depth (root pages = 0, /projects/* = 1)
    const isProject = window.location.pathname.includes('/projects/');
    const basePath = isProject ? '../' : './';

    // Inject shared header
    fetch(basePath + 'assets/components/header.html')
        .then(r => r.text())
        .then(html => {
            // Rewrite paths in header based on depth
            const adjusted = html.replace(/href="\.\//g, `href="${basePath}`);
            document.getElementById('site-header').innerHTML = adjusted;
            initNav();
        })
        .catch(() => {
            // If fetch fails (e.g. file://), nav won't load — that's expected locally without a server
            console.warn('Header fetch failed — run with a local server for full experience');
        });

    // Inject shared footer
    fetch(basePath + 'assets/components/footer.html')
        .then(r => r.text())
        .then(html => {
            document.getElementById('site-footer').innerHTML = html;
        })
        .catch(() => {});

    function initNav() {
        const navbar = document.querySelector('nav.site-nav');
        if (!navbar) return;

        // Scroll state
        const handleScroll = () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll);

        // Mobile toggle
        const toggle = navbar.querySelector('.nav-mobile-toggle');
        const links = navbar.querySelector('.nav-links');
        if (toggle && links) {
            toggle.addEventListener('click', () => links.classList.toggle('open'));
            links.querySelectorAll('a').forEach(a => {
                a.addEventListener('click', () => links.classList.remove('open'));
            });
        }

        // Highlight active nav link based on current path
        const path = window.location.pathname;
        navbar.querySelectorAll('.nav-links a').forEach(a => {
            const href = a.getAttribute('href');
            if (!href) return;
            if (
                (path.endsWith('/') || path.endsWith('/index.html')) && href.endsWith('index.html')
            ) {
                a.classList.add('active');
            } else if (path.includes('/projects/') && href.includes('index.html#projects')) {
                a.classList.add('active');
            } else if (href.includes('about.html') && path.endsWith('about.html')) {
                a.classList.add('active');
            }
        });
    }

    // Reveal-on-scroll animation for any .reveal elements
    document.addEventListener('DOMContentLoaded', () => {
        const revealEls = document.querySelectorAll('.reveal');
        if (!revealEls.length) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => entry.target.classList.add('visible'), i * 60);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(el => observer.observe(el));
    });
})();
