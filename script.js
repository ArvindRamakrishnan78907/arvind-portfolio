/**
 * Arvind Ramakrishnan Portfolio Logic
 * Premium Interactivity & Animations
 */

// Initialize GSAP
gsap.registerPlugin(ScrollTrigger, TextPlugin);

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCustomCursor();
    initHeroParticles();
    initGSAPAnimations();
    initNavBehavior();
    initFormHandling();
});

/* --- Loader Logic --- */
function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    window.addEventListener('load', () => {
        setTimeout(() => {
            gsap.to(loader, {
                opacity: 0,
                duration: 1,
                ease: 'power2.inOut',
                onComplete: () => {
                    loader.style.display = 'none';
                    startEntranceAnimations();
                }
            });
        }, 1500); // Give users a moment to see the "Initializing" text
    });
}

/* --- Custom Cursor --- */
function initCustomCursor() {
    const follower = document.getElementById('cursor-follower');
    const dot = document.getElementById('cursor-dot');
    
    if (!follower || !dot) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant dot movement
        gsap.to(dot, { x: mouseX, y: mouseY, duration: 0 });
    });

    // Smooth follower movement
    function render() {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        
        follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
        requestAnimationFrame(render);
    }
    render();

    // Hover effects
    const interactiveElements = document.querySelectorAll('a, button, .glass, .project-showcase');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(follower, { scale: 1.5, background: 'rgba(99, 102, 241, 0.6)', duration: 0.3 });
            gsap.to(dot, { scale: 0, duration: 0.2 });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(follower, { scale: 1, background: 'rgba(99, 102, 241, 0.4)', duration: 0.3 });
            gsap.to(dot, { scale: 1, duration: 0.2 });
        });
    });
}

/* --- Hero Particles Background --- */
function initHeroParticles() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 60;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - distance / 150)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

/* --- GSAP Entrance & Scroll Animations --- */
function startEntranceAnimations() {
    const tl = gsap.timeline();

    tl.from('.nav-content', { 
        y: -50, 
        opacity: 0, 
        duration: 1, 
        ease: 'power3.out' 
    })
    .from('.animate-init', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
    }, '-=0.5')
    .from('.floating-pip', {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        stagger: 0.2,
        ease: 'back.out(1.7)'
    }, '-=0.3');
}

function initGSAPAnimations() {
    // Reveal Titles on Scroll
    gsap.utils.toArray('.title-reveal').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 90%',
            },
            y: 30,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // About Cards Reveal
    gsap.from('.about-card', {
        scrollTrigger: {
            trigger: '.about-grid',
            start: 'top 85%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
    });

    // Project Reveal
    gsap.utils.toArray('.reveal-scroll').forEach(project => {
        gsap.from(project, {
            scrollTrigger: {
                trigger: project,
                start: 'top 80%',
            },
            y: 100,
            opacity: 0,
            duration: 1.2,
            ease: 'power3.out'
        });
    });

    // Timeline Nodes
    gsap.from('.timeline-node', {
        scrollTrigger: {
            trigger: '.timeline',
            start: 'top 80%',
        },
        x: -30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.3,
        ease: 'power2.out'
    });

    // Stat counting animation
    if(window.innerWidth > 768) {
        gsap.from('.stat-num', {
            scrollTrigger: {
                trigger: '.stats-section',
                start: 'top 85%',
            },
            innerHTML: 0,
            duration: 2,
            snap: { innerHTML: 1 },
            ease: 'power1.out'
        });
    }
}

/* --- Nav & Utility --- */
function initNavBehavior() {
    const nav = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinksList = document.querySelector('.nav-links');
    
    if (mobileBtn && navLinksList) {
        mobileBtn.addEventListener('click', () => {
            navLinksList.classList.toggle('active');
            // Inline mobile styles handling for simplicity
            if(navLinksList.classList.contains('active')) {
                navLinksList.style.display = 'flex';
                navLinksList.style.flexDirection = 'column';
                navLinksList.style.position = 'absolute';
                navLinksList.style.top = '100%';
                navLinksList.style.left = '0';
                navLinksList.style.width = '100%';
                navLinksList.style.background = 'var(--surface)';
                navLinksList.style.padding = '2rem';
            } else {
                navLinksList.style.display = '';
            }
        });
    }
}

/* --- Form Handling --- */
function initFormHandling() {
    const form = document.querySelector('form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        const btn = form.querySelector('.submit-btn');
        const originalText = btn.innerHTML;
        
        btn.disabled = true;
        btn.innerHTML = 'SENDING... <i data-lucide="loader" class="spin"></i>';
        lucide.createIcons();
        
        // We'll let Formspree handle the actual redirection unless we want AJAX
        // But for a nicer UX, we could use fetch. For now, we just show "Sent" state.
        setTimeout(() => {
            btn.innerHTML = 'MESSAGE SENT! <i data-lucide="check"></i>';
            btn.style.background = 'var(--secondary)';
            lucide.createIcons();
            
            // Confetti effect on success
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#6366f1', '#22d3ee', '#ffffff']
            });
        }, 1500);
    });
}
