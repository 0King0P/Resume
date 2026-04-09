/* ============================================
   THE MARAUDER'S RESUME - Interactive Magic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // --- Lab Cards & Modal ---
    initLabCards();

    // --- Magical Particle Canvas ---
    initMagicCanvas();

    // --- Envelope Interaction ---
    initEnvelope();

    // --- Navigation ---
    initNavigation();

    // --- Section Reveal on Scroll ---
    initScrollReveal();

    // --- Sorting Hat ---
    initSortingHat();

    // --- Skill Spell Cards ---
    initSpellCards();

    // --- Power Bars Animation ---
    initPowerBars();

    // --- Quest Timeline Animation ---
    initQuestTimeline();

    // --- Artifact Cards Tilt ---
    initArtifactTilt();

    // --- Theme Toggle (Lumos/Nox) ---
    initThemeToggle();

    // --- Wand Cursor Trail ---
    initWandTrail();

    // --- Owl Post Notification (8 seconds allows more reading time) ---
    setTimeout(showOwlPost, 8000);

    // --- Marauder Footprints ---
    initFootprints();
});

/* ============================================
   MAGICAL PARTICLE CANVAS
   Floating stars and sparkles background
   ============================================ */
function initMagicCanvas() {
    const canvas = document.getElementById('magic-canvas');
    if (!canvas) return; // Graceful failure if canvas missing

    const ctx = canvas.getContext('2d');
    if (!ctx) return; // Graceful failure if context unavailable

    let particles = [];
    let animationFrame;
    const maxParticles = window.innerWidth < 768 ? 80 : 150; // Fewer particles on mobile

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    // Use passive: true for better scroll performance
    window.addEventListener('resize', resize, { passive: true });

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.6 + 0.1;
            this.twinkleSpeed = Math.random() * 0.02 + 0.005;
            this.twinkleOffset = Math.random() * Math.PI * 2;
            // Mostly blue tones
            const colors = [
                '74, 158, 255',   // blue
                '107, 179, 255',  // light blue
                '139, 92, 246',   // purple
                '255, 215, 0',    // gold (rare)
                '192, 164, 77',   // accent
            ];
            const weights = [0.35, 0.3, 0.15, 0.1, 0.1];
            let r = Math.random();
            let cumulative = 0;
            this.color = colors[0];
            for (let i = 0; i < weights.length; i++) {
                cumulative += weights[i];
                if (r <= cumulative) {
                    this.color = colors[i];
                    break;
                }
            }
        }

        update(time) {
            this.x += this.speedX;
            this.y += this.speedY;

            // Twinkle effect
            this.currentOpacity = this.opacity * (0.5 + 0.5 * Math.sin(time * this.twinkleSpeed + this.twinkleOffset));

            // Wrap around
            if (this.x < -10) this.x = canvas.width + 10;
            if (this.x > canvas.width + 10) this.x = -10;
            if (this.y < -10) this.y = canvas.height + 10;
            if (this.y > canvas.height + 10) this.y = -10;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.currentOpacity})`;
            ctx.fill();

            // Glow effect for larger particles
            if (this.size > 1.5) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color}, ${this.currentOpacity * 0.15})`;
                ctx.fill();
            }
        }
    }

    // Create particles - respect maxParticles cap
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), maxParticles);
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }

    let time = 0;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        time++;
        particles.forEach(p => {
            p.update(time);
            p.draw();
        });
        animationFrame = requestAnimationFrame(animate);
    }

    animate();
}

/* ============================================
   ENVELOPE INTERACTION
   Click to open the Hogwarts letter
   ============================================ */
function initEnvelope() {
    const envelope = document.getElementById('envelope');
    const letter = document.getElementById('letter');

    if (!envelope || !letter) return;

    envelope.addEventListener('click', () => {
        envelope.style.transition = 'all 0.8s ease';
        envelope.style.transform = 'scale(0.8) translateY(-30px)';
        envelope.style.opacity = '0';

        setTimeout(() => {
            envelope.classList.add('hidden');
            letter.classList.remove('hidden');
            triggerSpellOverlay();
        }, 600);
    });
}

/* ============================================
   NAVIGATION
   Show/hide on scroll, highlight active section
   ============================================ */
function initNavigation() {
    const nav = document.getElementById('main-nav');
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    let lastScrollY = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Show nav after scrolling past intro
        if (scrollY > window.innerHeight * 0.5) {
            nav.classList.add('visible');
        } else {
            nav.classList.remove('visible');
        }

        // Highlight active section
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 150;
            const bottom = top + section.offsetHeight;
            if (scrollY >= top && scrollY < bottom) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });

        lastScrollY = scrollY;
    });

    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.getElementById(link.getAttribute('data-section'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/* ============================================
   SCROLL REVEAL
   Fade in sections and quest cards on scroll
   ============================================ */
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
}

/* ============================================
   SORTING HAT
   Interactive sorting hat with random quotes
   ============================================ */
function initSortingHat() {
    const sortBtn = document.getElementById('sort-btn');
    const hatSpeech = document.getElementById('hat-speech');
    const hatText = document.getElementById('hat-text');

    if (!sortBtn || !hatSpeech || !hatText) return;

    const sortingQuotes = [
        "Hmm, 8 years of enterprise IT... a Proxmox home lab... a thirst for knowledge that never stops. SLYTHERIN!",
        "I see someone who handles P1/P2 escalations AND still has time to mentor junior techs. SLYTHERIN!",
        "Interesting... you tame Exchange Hybrid AND run a home lab with Wazuh SIEM. SLYTHERIN!",
        "Writing Repair-SCCM.ps1 so the team stops fixing the same thing twice? Efficiency is wisdom. SLYTHERIN!",
        "Windows, macOS, Linux, mobile... SCCM, Intune, Jamf... you don't discriminate. SLYTHERIN!",
        "PowerShell scripts that shave 15 minutes off every diagnostic ticket? Cunning indeed. SLYTHERIN!",
        "300+ conference rooms maintained, meeting drop-outs cut by 25%... impressive problem-solving. SLYTHERIN!",
        "From helpdesk to Lead Deskside at CLS Group in 8 years, always learning. SLYTHERIN, without a doubt!"
    ];

    let isAnimating = false;

    sortBtn.addEventListener('click', () => {
        if (isAnimating) return;
        isAnimating = true;

        // Hat wobble animation
        const hat = document.querySelector('.hat-shape');
        hat.style.animation = 'none';
        hat.offsetHeight; // trigger reflow
        hat.style.animation = 'hatThink 1.5s ease-in-out';

        // Hide previous speech, pick new quote
        hatSpeech.classList.add('hidden');

        setTimeout(() => {
            const quote = sortingQuotes[Math.floor(Math.random() * sortingQuotes.length)];
            typewriterEffect(hatText, quote, () => {
                isAnimating = false;
            });
            hatSpeech.classList.remove('hidden');
            triggerSpellOverlay();
        }, 1000);
    });
}

// Add hat thinking animation (only if head exists)
try {
    const hatStyle = document.createElement('style');
    hatStyle.textContent = `
        @keyframes hatThink {
            0% { transform: rotate(0deg) scale(1); }
            15% { transform: rotate(-15deg) scale(1.1); }
            30% { transform: rotate(10deg) scale(1.05); }
            45% { transform: rotate(-10deg) scale(1.1); }
            60% { transform: rotate(8deg) scale(1.05); }
            75% { transform: rotate(-5deg) scale(1.08); }
            90% { transform: rotate(3deg) scale(1.05); }
            100% { transform: rotate(0deg) scale(1); }
        }
    `;
    if (document.head) document.head.appendChild(hatStyle);
} catch (e) {
    console.warn('Failed to add hatThink animation:', e);
}

/* Typewriter effect */
function typewriterEffect(element, text, callback) {
    element.textContent = '';
    let i = 0;
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    element.appendChild(cursor);

    function type() {
        if (i < text.length) {
            element.textContent = text.substring(0, i + 1);
            element.appendChild(cursor);
            i++;
            setTimeout(type, 25 + Math.random() * 25);
        } else {
            setTimeout(() => {
                cursor.remove();
                if (callback) callback();
            }, 1000);
        }
    }

    setTimeout(type, 200);
}

/* ============================================
   SPELL CARDS (Skills)
   Filter by category + casting animation
   ============================================ */
function initSpellCards() {
    const tabs = document.querySelectorAll('.spell-tab');
    const cards = document.querySelectorAll('.spell-card');

    // Filter
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const category = tab.getAttribute('data-category');

            cards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.classList.remove('filter-hidden');
                    // Re-trigger animation
                    card.style.animation = 'none';
                    card.offsetHeight;
                    card.style.animation = 'spellAppear 0.5s ease-out forwards';
                } else {
                    card.classList.add('filter-hidden');
                }
            });
        });
    });

    // Click to cast spell
    cards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.add('casting');
            createSparkBurst(card);
            setTimeout(() => card.classList.remove('casting'), 600);
        });
    });
}

/* Create spark burst effect on spell card click */
function createSparkBurst(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 12; i++) {
        const spark = document.createElement('div');
        spark.className = 'wand-spark';
        spark.style.left = centerX + 'px';
        spark.style.top = centerY + 'px';

        const angle = (Math.PI * 2 / 12) * i;
        const distance = 40 + Math.random() * 40;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        spark.style.setProperty('--tx', tx + 'px');
        spark.style.setProperty('--ty', ty + 'px');
        spark.style.animation = 'sparkBurst 0.6s ease-out forwards';

        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 600);
    }
}

// Add spark burst keyframes
const sparkStyle = document.createElement('style');
sparkStyle.textContent = `
    @keyframes sparkBurst {
        0% { opacity: 1; transform: translate(0, 0) scale(1); }
        100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0); }
    }
`;
document.head.appendChild(sparkStyle);

/* ============================================
   POWER BARS
   Animate skill bars when visible
   ============================================ */
function initPowerBars() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bars = entry.target.querySelectorAll('.power-bar');
                bars.forEach(bar => {
                    const power = bar.getAttribute('data-power');
                    bar.style.setProperty('--power-width', power + '%');
                    bar.classList.add('animated');
                    bar.style.width = power + '%';
                });
            }
        });
    }, { threshold: 0.2 });

    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        observer.observe(skillsSection);
    }
}

/* ============================================
   QUEST TIMELINE
   Reveal cards sequentially on scroll
   ============================================ */
function initQuestTimeline() {
    const questCards = document.querySelectorAll('.quest-card');
    if (questCards.length === 0) return; // No cards to observe

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after animation completes for better memory
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

    questCards.forEach(card => observer.observe(card));
}

/* ============================================
   ARTIFACT CARDS TILT
   3D tilt effect on hover
   ============================================ */
function initArtifactTilt() {
    const cards = document.querySelectorAll('.artifact-card');

    // Skip 3D tilt on mobile or if reduced-motion is preferred
    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isMobile || prefersReducedMotion) {
        return; // Don't add expensive tilt effect
    }

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;

            // Move shine effect
            const shine = card.querySelector('.artifact-shine');
            if (shine) {
                shine.style.transform = `translateX(${(x / rect.width) * 100 - 50}%) translateY(${(y / rect.height) * 100 - 50}%)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
            card.style.transition = 'transform 0.5s ease';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
    });
}

/* ============================================
   THEME TOGGLE - Lumos / Nox
   ============================================ */
function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
        document.body.classList.toggle('lumos');
        triggerSpellOverlay();

        // Store preference
        const isLumos = document.body.classList.contains('lumos');
        localStorage.setItem('theme', isLumos ? 'lumos' : 'nox');
    });

    // Restore preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'lumos') {
        document.body.classList.add('lumos');
    }
}

/* ============================================
   WAND CURSOR TRAIL
   Magical sparkle trail following the cursor
   ============================================ */
function initWandTrail() {
    let throttle = false;

    document.addEventListener('mousemove', (e) => {
        if (throttle) return;
        throttle = true;

        setTimeout(() => {
            throttle = false;
        }, 50);

        // Only create trail sparks occasionally
        if (Math.random() > 0.4) return;

        const spark = document.createElement('div');
        spark.className = 'wand-spark';
        spark.style.left = e.clientX + 'px';
        spark.style.top = e.clientY + 'px';

        // Random size
        const size = Math.random() * 4 + 2;
        spark.style.width = size + 'px';
        spark.style.height = size + 'px';

        // Random color
        const colors = [
            'rgba(74, 158, 255, 0.8)',
            'rgba(107, 179, 255, 0.8)',
            'rgba(255, 215, 0, 0.6)',
            'rgba(139, 92, 246, 0.7)',
        ];
        spark.style.background = colors[Math.floor(Math.random() * colors.length)];

        document.body.appendChild(spark);

        setTimeout(() => spark.remove(), 800);
    });
}

/* ============================================
   OWL POST NOTIFICATION
   ============================================ */
function showOwlPost() {
    const owl = document.getElementById('owl-post');
    if (!owl) return;

    owl.classList.remove('hidden');

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        owl.style.animation = 'owlPostSlide 0.5s ease-in reverse forwards';
        setTimeout(() => owl.classList.add('hidden'), 500);
    }, 5000);

    // Click to dismiss
    owl.addEventListener('click', () => {
        owl.style.animation = 'owlPostSlide 0.5s ease-in reverse forwards';
        setTimeout(() => owl.classList.add('hidden'), 500);
    });
}

/* ============================================
   SPELL OVERLAY FLASH
   ============================================ */
function triggerSpellOverlay() {
    const overlay = document.getElementById('spell-overlay');
    if (!overlay) return;

    overlay.classList.remove('active');
    overlay.offsetHeight; // trigger reflow
    overlay.classList.add('active');

    setTimeout(() => overlay.classList.remove('active'), 600);
}

/* ============================================
   MARAUDER FOOTPRINTS
   ============================================ */
function initFootprints() {
    const container = document.getElementById('footprints');
    if (!container) return;

    const footprints = ['👣', '👣', '👣', '👣', '👣'];
    footprints.forEach((fp, i) => {
        const span = document.createElement('span');
        span.textContent = fp;
        span.style.animationDelay = (i * 0.3) + 's';
        span.style.animation = `footprintAppear 2s ease-in-out ${i * 0.3}s infinite`;
        container.appendChild(span);
    });

    const fpStyle = document.createElement('style');
    fpStyle.textContent = `
        @keyframes footprintAppear {
            0%, 100% { opacity: 0.1; transform: scale(0.8); }
            50% { opacity: 0.5; transform: scale(1); }
        }
    `;
    document.head.appendChild(fpStyle);
}

/* ============================================
   KONAMI CODE EASTER EGG
   Up Up Down Down Left Right Left Right B A
   Reveals a secret "Mischief Managed" message
   ============================================ */
(function initKonamiCode() {
    const konamiSequence = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.code === konamiSequence[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiSequence.length) {
                activateMaraudersMap();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
})();

function activateMaraudersMap() {
    triggerSpellOverlay();

    // Create golden overlay
    const mapOverlay = document.createElement('div');
    mapOverlay.style.cssText = `
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(10, 14, 26, 0.95);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        cursor: pointer;
        animation: fadeIn 0.5s ease;
    `;

    mapOverlay.innerHTML = `
        <div style="text-align: center; animation: fadeIn 1s ease;">
            <p style="font-family: 'Cinzel Decorative', cursive; font-size: 3rem; color: #ffd700;
                letter-spacing: 5px; margin-bottom: 20px; text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);">
                Mischief Managed
            </p>
            <p style="font-family: 'Cinzel', serif; font-size: 1rem; color: #c0a44d;
                letter-spacing: 3px;">
                The Marauder's Map has been activated
            </p>
            <p style="font-family: 'Raleway', sans-serif; font-size: 0.8rem; color: #6b7a8d;
                margin-top: 30px;">
                (Click anywhere to close)
            </p>
        </div>
    `;

    const fadeStyle = document.createElement('style');
    fadeStyle.textContent = `@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`;
    document.head.appendChild(fadeStyle);

    document.body.appendChild(mapOverlay);

    // Gold sparkle burst
    for (let i = 0; i < 40; i++) {
        setTimeout(() => {
            const spark = document.createElement('div');
            spark.className = 'wand-spark';
            spark.style.left = (Math.random() * window.innerWidth) + 'px';
            spark.style.top = (Math.random() * window.innerHeight) + 'px';
            spark.style.background = 'rgba(255, 215, 0, 0.8)';
            spark.style.boxShadow = '0 0 6px rgba(255, 215, 0, 0.8), 0 0 12px rgba(255, 215, 0, 0.5)';
            spark.style.zIndex = '10001';
            const size = Math.random() * 6 + 3;
            spark.style.width = size + 'px';
            spark.style.height = size + 'px';
            document.body.appendChild(spark);
            setTimeout(() => spark.remove(), 800);
        }, i * 50);
    }

    mapOverlay.addEventListener('click', () => {
        mapOverlay.style.animation = 'fadeIn 0.5s ease reverse';
        setTimeout(() => {
            mapOverlay.remove();
            fadeStyle.remove();
        }, 500);
    });
}

/* ============================================
   LAB CARDS & INTERACTIVE MODAL
   Click any lab card to open detail modal
   with terminal demo and highlights
   ============================================ */

const LAB_DATA = {
    proxmox: {
        icon: '🖥️',
        title: 'Proxmox Hypervisor Lab',
        desc: 'A full bare-metal virtualization environment built on Proxmox VE, hosting 8+ virtual machines and LXC containers that replicate an enterprise data center. The lab includes a dedicated pfSense firewall, VLAN-segmented networking, ZFS storage pools with automated snapshots, and a simulated Active Directory domain for testing real-world IT scenarios.',
        highlights: [
            { icon: '⚙️', text: '8+ VMs & LXC containers running simultaneously' },
            { icon: '🔒', text: 'pfSense firewall with VLAN segmentation' },
            { icon: '💾', text: 'ZFS storage with automated snapshots' },
            { icon: '🌐', text: 'Full AD domain, DHCP/DNS services' },
            { icon: '📊', text: 'Resource monitoring via Grafana + Prometheus' },
            { icon: '🔄', text: 'Snapshot-based rollback for safe testing' },
        ],
        terminalTitle: 'root@proxmox:~',
        terminal: [
            { type: 'prompt', text: '$ pvesh get /nodes/pve/status' },
            { type: 'output', text: '┌─────────────────────────────────────────┐' },
            { type: 'success',text: '│  Node: pve   Status: online   ✓          │' },
            { type: 'output', text: '│  CPU: 14%    RAM: 18.2/32 GB             │' },
            { type: 'output', text: '│  VMs: 8 running  LXC: 4 running          │' },
            { type: 'output', text: '└─────────────────────────────────────────┘' },
            { type: 'blank',  text: '' },
            { type: 'prompt', text: '$ qm list' },
            { type: 'output', text: 'VMID  NAME              STATUS    MEM(MB)' },
            { type: 'output', text: '100   DC01-WinServer    running   4096' },
            { type: 'output', text: '101   Wazuh-SIEM        running   8192' },
            { type: 'output', text: '102   Nextcloud         running   2048' },
            { type: 'output', text: '103   Win11-Test        running   4096' },
            { type: 'output', text: '104   LLM-Container     running   4096' },
            { type: 'blank',  text: '' },
            { type: 'success',text: '✓ All systems operational' },
        ],
    },
    nextcloud: {
        icon: '☁️',
        title: 'Nextcloud Private Cloud',
        desc: 'A fully self-hosted Nextcloud instance replacing commercial cloud storage. Deployed inside a Proxmox LXC container with Nginx as a reverse proxy, Let\'s Encrypt SSL certificates via Certbot, and MariaDB as the backend. Supports file sync across all devices, calendar/contacts, and encrypted external shares — with zero data leaving the home network.',
        highlights: [
            { icon: '🔐', text: 'SSL/TLS via Let\'s Encrypt + auto-renewal' },
            { icon: '📁', text: 'Full file sync: Windows, macOS, iOS, Android' },
            { icon: '🗄️', text: 'MariaDB backend with daily automated backups' },
            { icon: '🔄', text: 'Nginx reverse proxy with HTTP/2 & compression' },
            { icon: '📅', text: 'CalDAV/CardDAV calendar & contacts sync' },
            { icon: '🛡️', text: 'Fail2Ban + Wazuh agent for intrusion detection' },
        ],
        terminalTitle: 'nextcloud@lxc:~',
        terminal: [
            { type: 'prompt', text: '$ occ status' },
            { type: 'success',text: '  - installed: true' },
            { type: 'success',text: '  - version: 28.0.4' },
            { type: 'success',text: '  - versionstring: 28.0.4' },
            { type: 'blank',  text: '' },
            { type: 'prompt', text: '$ occ user:list' },
            { type: 'output', text: '  - wahaj: Syed Wahaj Muhammad Ali' },
            { type: 'blank',  text: '' },
            { type: 'prompt', text: '$ certbot renew --dry-run' },
            { type: 'info',   text: 'Simulating renewal of an existing certificate' },
            { type: 'success',text: 'Congratulations, all renewals succeeded:' },
            { type: 'success',text: '  /etc/letsencrypt/live/cloud.lab/fullchain.pem' },
            { type: 'blank',  text: '' },
            { type: 'success',text: '✓ Nextcloud running | SSL valid | Backups OK' },
        ],
    },
    wazuh: {
        icon: '🛡️',
        title: 'Wazuh SIEM & SOC Lab',
        desc: 'A production-grade Wazuh SIEM/XDR deployment collecting security events from every VM and container in the lab. Built custom detection rules for brute-force attempts, privilege escalation, and configuration changes. Practiced full SOC workflows: alert triage, incident response, and post-incident reporting. Integrated with Grafana dashboards for real-time visibility.',
        highlights: [
            { icon: '📡', text: 'Agents on all 8 VMs + LXC containers' },
            { icon: '🚨', text: 'Custom rules: brute-force, privesc, config drift' },
            { icon: '📊', text: 'Grafana dashboards for real-time alerts' },
            { icon: '⚡', text: 'Active response: auto-block on SSH brute-force' },
            { icon: '📝', text: 'Full incident reports and playbook documentation' },
            { icon: '🔍', text: 'File integrity monitoring on critical paths' },
        ],
        terminalTitle: 'wazuh@siem:~',
        terminal: [
            { type: 'prompt', text: '$ /var/ossec/bin/agent_control -l' },
            { type: 'output', text: 'Wazuh agent list:' },
            { type: 'success',text: '  ID: 001 | DC01-WinServer   | Active' },
            { type: 'success',text: '  ID: 002 | Nextcloud-LXC    | Active' },
            { type: 'success',text: '  ID: 003 | Win11-Test       | Active' },
            { type: 'success',text: '  ID: 004 | LLM-Container    | Active' },
            { type: 'blank',  text: '' },
            { type: 'prompt', text: '$ tail -5 /var/ossec/logs/alerts/alerts.log' },
            { type: 'warn',   text: 'Rule 5710: Attempt to login using non-existent user' },
            { type: 'warn',   text: 'Rule 2501: User missed the password more than 5 times' },
            { type: 'success',text: 'Active Response: firewall-drop executed on 10.0.0.55' },
            { type: 'blank',  text: '' },
            { type: 'success',text: '✓ SIEM active | 4 agents | Auto-response enabled' },
        ],
    },
    windows11: {
        icon: '💻',
        title: 'Windows 11 Enterprise Lab',
        desc: 'A full Windows 11 enterprise deployment environment including an Active Directory domain controller (Windows Server 2022), Group Policy Object management, Intune co-management with a real Microsoft 365 tenant, BitLocker encryption with TPM, and Autopilot enrollment testing on physical Surface and lab machines.',
        highlights: [
            { icon: '🏢', text: 'Windows Server 2022 domain controller (DC01)' },
            { icon: '📋', text: 'Group Policy: 20+ custom policies deployed & tested' },
            { icon: '🔐', text: 'BitLocker TPM-backed encryption on all endpoints' },
            { icon: '☁️', text: 'Intune co-management with real M365 tenant' },
            { icon: '🚀', text: 'Autopilot OOBE enrollment via hardware hash' },
            { icon: '🛡️', text: 'LAPS, Defender ATP, and Okta SSO testing' },
        ],
        terminalTitle: 'PS C:\\> (Admin)',
        terminal: [
            { type: 'prompt', text: 'PS> Get-ADDomain | Select DNSRoot,DomainMode' },
            { type: 'output', text: '' },
            { type: 'output', text: 'DNSRoot      DomainMode' },
            { type: 'output', text: '-------      ----------' },
            { type: 'success',text: 'lab.local    Windows2016Domain' },
            { type: 'blank',  text: '' },
            { type: 'prompt', text: 'PS> Get-ADComputer -Filter * | Select Name' },
            { type: 'output', text: 'Name' },
            { type: 'output', text: '----' },
            { type: 'output', text: 'DC01-WINSERVER' },
            { type: 'output', text: 'WIN11-WORKSTATION' },
            { type: 'output', text: 'WIN11-SURFACE' },
            { type: 'blank',  text: '' },
            { type: 'prompt', text: 'PS> (Get-BitLockerVolume C:).ProtectionStatus' },
            { type: 'success',text: 'On — TPM+PIN protector active' },
        ],
    },
    llm: {
        icon: '🤖',
        title: 'LLM & Claude Code AI Lab',
        desc: 'A self-hosted AI automation system built around Claude Code (Anthropic) running as a persistent Telegram bot. Acts as a personal IT assistant: runs security audits, deploys code, monitors system health, manages cron jobs, and responds to natural language commands — all from a phone. Built with Python stdlib only, zero pip dependencies.',
        highlights: [
            { icon: '📱', text: 'Full IT control via Telegram from anywhere' },
            { icon: '🔒', text: 'Automated security audits & hardening scripts' },
            { icon: '⚙️', text: 'Python automation with zero pip dependencies' },
            { icon: '🧠', text: 'Claude AI: model-routed Haiku → Sonnet → Opus' },
            { icon: '📊', text: 'System health monitoring & morning briefings' },
            { icon: '🔄', text: 'Persistent memory across sessions via flat files' },
        ],
        terminalTitle: 'claude@llm-lab:~',
        terminal: [
            { type: 'prompt', text: '$ systemctl status claude-telegram' },
            { type: 'success',text: '● claude-telegram.service - Claude Telegram Bot' },
            { type: 'success',text: '   Active: active (running) since boot' },
            { type: 'output', text: '   PID: 1337 | Uptime: 12d 4h 22m' },
            { type: 'blank',  text: '' },
            { type: 'prompt', text: '$ python3 system_report.py --brief' },
            { type: 'info',   text: '[Telegram] Sending morning briefing...' },
            { type: 'success',text: '✓ CPU: 8% | RAM: 42% | Disk: 61%' },
            { type: 'success',text: '✓ All services running | 0 security alerts' },
            { type: 'blank',  text: '' },
            { type: 'prompt', text: '$ # Model routing: Haiku → Sonnet → Opus' },
            { type: 'info',   text: '[Router] Task: "run security audit" → Opus 4.6' },
            { type: 'success',text: '✓ Audit complete: 3 findings, 0 critical' },
        ],
    },
    intune: {
        icon: '🔑',
        title: 'Intune / Autopilot Lab',
        desc: 'A hands-on MDM lab using a real Microsoft 365 Developer tenant. Enrolled a Surface Laptop and Mac Mini via Autopilot and Jamf Pro respectively. Tested compliance policies, conditional access, app deployment, and remote wipe — all in a real (not simulated) M365 environment connected to Azure AD.',
        highlights: [
            { icon: '🔄', text: 'Autopilot OOBE on real Surface Laptop hardware' },
            { icon: '🍎', text: 'Jamf Pro enrollment on Mac Mini (co-managed)' },
            { icon: '📋', text: 'Compliance policies: BitLocker, PIN, screen lock' },
            { icon: '🚫', text: 'Conditional access: block non-compliant devices' },
            { icon: '📦', text: 'Win32 app deployment via Intune packaging' },
            { icon: '🗑️', text: 'Remote wipe & retire tested on enrolled devices' },
        ],
        terminalTitle: 'PS> Intune Graph API',
        terminal: [
            { type: 'prompt', text: 'PS> Connect-MgGraph -Scopes "DeviceManagementManagedDevices.Read.All"' },
            { type: 'success',text: 'Welcome to Microsoft Graph!' },
            { type: 'blank',  text: '' },
            { type: 'prompt', text: 'PS> Get-MgDeviceManagementManagedDevice | Select DeviceName,ComplianceState' },
            { type: 'output', text: 'DeviceName         ComplianceState' },
            { type: 'output', text: '----------         ---------------' },
            { type: 'success',text: 'SURFACE-WAHAJ      compliant' },
            { type: 'success',text: 'MAC-MINI-LAB       compliant' },
            { type: 'blank',  text: '' },
            { type: 'prompt', text: 'PS> Get-MgDeviceManagementDeviceCompliancePolicy | Select DisplayName' },
            { type: 'output', text: 'BitLocker-Enforcement-Policy' },
            { type: 'output', text: 'Require-PIN-Policy' },
            { type: 'success',text: '✓ All devices compliant | 2 policies active' },
        ],
    },
};

function initLabCards() {
    const modal = document.getElementById('lab-modal');
    if (!modal) return;

    const backdrop = modal.querySelector('.lab-modal-backdrop');
    const closeBtn = modal.querySelector('.lab-modal-close');
    const modalIcon = document.getElementById('modal-icon');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalHighlights = document.getElementById('modal-highlights');
    const terminalTitle = document.getElementById('terminal-title');
    const terminalBody = document.getElementById('terminal-body');

    function openModal(labKey) {
        const data = LAB_DATA[labKey];
        if (!data) return;

        // Populate content
        modalIcon.textContent = data.icon;
        modalTitle.textContent = data.title;
        modalDesc.textContent = data.desc;
        terminalTitle.textContent = data.terminalTitle;

        // Highlights
        modalHighlights.innerHTML = data.highlights.map(h =>
            `<div class="lab-highlight-item">
                <span class="lab-highlight-icon">${h.icon}</span>
                <span>${h.text}</span>
            </div>`
        ).join('');

        // Terminal
        terminalBody.innerHTML = '';
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        closeBtn.focus();

        // Animate terminal lines
        data.terminal.forEach((line, i) => {
            setTimeout(() => {
                const span = document.createElement('span');
                span.className = `terminal-line ${line.type}`;
                span.textContent = line.text || '\u00A0';
                span.style.animationDelay = '0ms';
                terminalBody.appendChild(span);
                terminalBody.scrollTop = terminalBody.scrollHeight;
            }, i * 120);
        });
    }

    function closeModal() {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    // Bind explore buttons
    document.querySelectorAll('.lab-explore-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('[data-lab]');
            if (card) openModal(card.dataset.lab);
        });
    });

    // Also clicking the card itself opens it
    document.querySelectorAll('.artifact-card[data-lab]').forEach(card => {
        card.addEventListener('click', () => openModal(card.dataset.lab));
        card.style.cursor = 'pointer';
    });

    // Close on backdrop click or close button
    backdrop.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
    });
}
