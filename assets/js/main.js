// Site-wide JS — handles nav injection, scroll state, mobile menu

(function() {
    // Determine path depth (root pages = 0, /projects/* = 1)
    const isProject = window.location.pathname.includes('/projects/');
    const basePath = isProject ? '../' : './';

    // Shared header/footer are built here (not fetched) so the nav works
    // everywhere — including opening the pages directly via file://, where
    // fetch() is blocked by the browser.
    const headerHTML = `
<nav class="site-nav">
    <a href="${basePath}index.html" class="nav-logo">Harsh Dhruva</a>
    <button class="nav-mobile-toggle" aria-label="Menu">
        <span></span><span></span><span></span>
    </button>
    <ul class="nav-links">
        <li><a href="${basePath}index.html">Work</a></li>
        <li><a href="${basePath}about.html">About</a></li>
        <li><a href="https://linkedin.com/in/harshdhruva" target="_blank">LinkedIn</a></li>
        <li><a href="https://github.com/dhruvah" target="_blank">GitHub</a></li>
    </ul>
</nav>`;

    const footerHTML = `
<footer class="site-footer">
    © 2026 Harsh Dhruva · <a href="mailto:hdhruva@alumni.cmu.edu">hdhruva@alumni.cmu.edu</a>
</footer>`;

    const headerMount = document.getElementById('site-header');
    if (headerMount) {
        headerMount.innerHTML = headerHTML;
        initNav();
    }
    const footerMount = document.getElementById('site-footer');
    if (footerMount) {
        footerMount.innerHTML = footerHTML;
    }

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
