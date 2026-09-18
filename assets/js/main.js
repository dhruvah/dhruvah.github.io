// Site-wide JS: handles nav injection, scroll state, mobile menu

(function() {
    // Determine path depth (root pages = 0, /projects/* = 1)
    const isProject = window.location.pathname.includes('/projects/');
    const basePath = isProject ? '../' : './';

    // Shared header/footer are built here (not fetched) so the nav works
    // everywhere, including opening the pages directly via file://, where
    // fetch() is blocked by the browser.
    const headerHTML = `
<nav class="site-nav">
    <a href="${basePath}index.html" class="nav-logo">Harsh Dhruva</a>
    <button class="nav-mobile-toggle" aria-label="Menu" aria-controls="nav-links" aria-expanded="false">
        <span></span><span></span><span></span>
    </button>
    <ul class="nav-links" id="nav-links">
        <li><a href="${basePath}index.html">Work</a></li>
        <li><a href="${basePath}about.html">About</a></li>
        <li><a href="${basePath}assets/harsh-dhruva-resume.pdf" target="_blank">Resume</a></li>
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
            const setOpen = (open) => {
                links.classList.toggle('open', open);
                toggle.setAttribute('aria-expanded', String(open));
            };
            toggle.addEventListener('click', () => setOpen(!links.classList.contains('open')));
            links.querySelectorAll('a').forEach(a => {
                a.addEventListener('click', () => setOpen(false));
            });
        }

        // Highlight active nav link based on current path
        const path = window.location.pathname;
        let activeFile = null;
        if (path.endsWith('/about.html') || path.endsWith('/timeline.html')) {
            // Timeline is linked from About, not the nav
            activeFile = 'about.html';
        } else if (path.includes('/projects/') || path.endsWith('/') || path.endsWith('/index.html')) {
            activeFile = 'index.html';
        }
        if (activeFile) {
            navbar.querySelectorAll('.nav-links a').forEach(a => {
                const href = a.getAttribute('href');
                if (href && href.endsWith(activeFile)) {
                    a.classList.add('active');
                }
            });
        }
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

    // Home hero: the cartoon photo plays the toasting loop on hover (tap on touch)
    document.addEventListener('DOMContentLoaded', () => {
        const fig = document.querySelector('.home-hero-photo');
        const video = fig && fig.querySelector('video');
        if (!video) return;
        const play = () => { fig.classList.add('playing'); video.play().catch(() => {}); };
        const stop = () => { fig.classList.remove('playing'); video.pause(); };
        if (window.matchMedia('(hover: hover)').matches) {
            fig.addEventListener('mouseenter', play);
            fig.addEventListener('mouseleave', stop);
        } else {
            fig.addEventListener('click', () => fig.classList.contains('playing') ? stop() : play());
        }
    });
})();
