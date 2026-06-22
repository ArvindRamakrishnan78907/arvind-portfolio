/**
 * Arvind Ramakrishnan — Portfolio
 * Apple-style scroll animations & interactivity
 */

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initScrollAnimations();
    initModal();
    initNavScroll();
    initCopyEmail();
    initTheaterMode();
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
    gsap.to('#hero .reveal-up', {
        y: 0,
        opacity: 1,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power3.out'
    });

    gsap.to('#navbar', {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: 'power3.out'
    });
}

/* ── Scroll-triggered reveals ────────────── */
function initScrollAnimations() {
    // Set initial state for navbar (it starts hidden)
    gsap.set('#navbar', { y: -20, opacity: 0 });

    // Every .reveal-up outside the hero
    gsap.utils.toArray('.reveal-up').forEach(el => {
        if (el.closest('#hero')) return; // hero handled separately

        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 95%',
                toggleActions: 'play none none none'
            },
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: 'power3.out'
        });
    });

    // Parallax on project images
    gsap.utils.toArray('.project-media').forEach(box => {
        const img = box.querySelector('img');
        if (!img) return;
        gsap.fromTo(img,
            { yPercent: -5 },
            {
                yPercent: 5,
                ease: 'none',
                scrollTrigger: {
                    trigger: box,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            }
        );
    });

    // Skill cards stagger
    ScrollTrigger.batch('.skill-card', {
        onEnter: batch => {
            gsap.to(batch, {
                y: 0,
                opacity: 1,
                duration: 0.4,
                stagger: 0.05,
                ease: 'power3.out'
            });
        },
        start: 'top 95%'
    });
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
    const closeBtn = document.getElementById('close-modal');
    const modal = document.getElementById('resume-modal');
    if (!openBtn || !closeBtn || !modal) return;

    const open = () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    const close = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    openBtn.addEventListener('click', open);
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
