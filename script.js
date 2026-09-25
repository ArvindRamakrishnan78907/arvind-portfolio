/**
 * Arvind Ramakrishnan — Portfolio (Redesigned)
 * Scroll animations & interactivity
 */

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initModal();
    initNavScroll();
    initCopyEmail();
    initTheaterMode();
    initHeroAnimation();
});

/* ── Loader ──────────────────────────────── */
function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    window.addEventListener('load', () => {
        gsap.to(loader, {
            opacity: 0,
            duration: 0.4,
            delay: 0.1,
            ease: 'power2.inOut',
            onComplete: () => {
                loader.style.display = 'none';
                revealHero();
            }
        });
    });
}

/* ── Hero entrance ───────────────────────── */
function revealHero() {
    gsap.set('#navbar', { y: 0, opacity: 1 });
}

/* ── Hero Animation (Workbench) ──────────── */
function initHeroAnimation() {
    // Animate hero elements in sequence after page load
    const tl = gsap.timeline({ delay: 0.6 });
    
    tl.from('.status-pill', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out'
    })
    .from('.workbench-title', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power2.out'
    }, '-=0.3')
    .from('.workbench-description', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out'
    }, '-=0.3')
    .from('.workbench-cta-group', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out'
    }, '-=0.2')
    .from('.terminal-card', {
        opacity: 0,
        x: 40,
        duration: 0.7,
        ease: 'power2.out'
    }, '-=0.4');
}

/* ── Scroll-triggered reveals ────────────── */
function initScrollAnimations() {
    // Disabled normal animations to keep it simple and fast.
}

/* ── Nav background on scroll ────────────── */
function initNavScroll() {
    const nav = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            nav.style.background = 'rgba(0,0,0,.82)';
        } else {
            nav.style.background = 'rgba(0,0,0,.72)';
        }
    });
}

/* ── Resume Modal ────────────────────────── */
function initModal() {
    const openBtn = document.getElementById('open-resume-modal');
    const openBtnHero = document.getElementById('open-resume-modal-hero');
    const closeBtn = document.getElementById('close-modal');
    const modal = document.getElementById('resume-modal');
    if (!closeBtn || !modal) return;

    const open = () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    const close = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (openBtn) openBtn.addEventListener('click', open);
    if (openBtnHero) openBtnHero.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });

    // Escape key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.classList.contains('active')) close();
    });
}

/* ── Copy Email ──────────────────────────── */
function initCopyEmail() {
    const btn = document.getElementById('copy-email');
    if (!btn) return;

    // Create tooltip
    const tooltip = document.createElement('span');
    tooltip.className = 'copy-tooltip';
    tooltip.textContent = 'Copied!';
    btn.appendChild(tooltip);

    btn.addEventListener('click', async () => {
        const email = btn.getAttribute('data-email');
        try {
            await navigator.clipboard.writeText(email);
            tooltip.classList.add('show');
            // Swap icon to check
            const icon = btn.querySelector('svg');
            if (icon) {
                icon.outerHTML = '<i data-lucide="check"></i>';
                lucide.createIcons();
            }
            setTimeout(() => {
                tooltip.classList.remove('show');
                const checkIcon = btn.querySelector('svg');
                if (checkIcon) {
                    checkIcon.outerHTML = '<i data-lucide="copy"></i>';
                    lucide.createIcons();
                }
            }, 2000);
        } catch (err) {
            // Fallback
            const ta = document.createElement('textarea');
            ta.value = email;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            tooltip.classList.add('show');
            setTimeout(() => tooltip.classList.remove('show'), 2000);
        }
    });
}

/* ── Theater Mode ────────────────────────── */
function initTheaterMode() {
    const mediaContainer = document.getElementById('roolts-media-container');
    const video = document.getElementById('roolts-video');
    const theaterModal = document.getElementById('theater-modal');
    const theaterContainer = document.getElementById('theater-container');
    const closeBtn = document.getElementById('close-theater');

    if (!mediaContainer || !video || !theaterModal || !theaterContainer || !closeBtn) return;

    const openTheater = () => {
        // Move video to theater
        theaterContainer.appendChild(video);
        theaterModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        video.controls = true;
        video.currentTime = 0;
        video.play().catch(e => console.log('Autoplay blocked', e));
    };

    const closeTheater = () => {
        // Pause and move back
        video.pause();
        video.controls = false;
        
        theaterModal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Wait for fade out to finish before moving DOM node
        setTimeout(() => {
            // Re-insert before the play button overlay
            const playBtn = document.getElementById('play-roolts');
            if (playBtn) {
                mediaContainer.insertBefore(video, playBtn);
            } else {
                mediaContainer.appendChild(video);
            }
        }, 400); // matches CSS transition time
    };

    mediaContainer.addEventListener('click', openTheater);
    closeBtn.addEventListener('click', closeTheater);

    theaterModal.addEventListener('click', (e) => {
        if (e.target === theaterModal || e.target === theaterContainer) {
            closeTheater();
        }
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && theaterModal.classList.contains('active')) {
            closeTheater();
        }
    });
}
