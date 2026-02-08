/* ============================================
   THE MARAUDER'S RESUME - Interactive Magic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
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

    // --- Contact Form ---
    initContactForm();

    // --- Theme Toggle (Lumos/Nox) ---
    initThemeToggle();

    // --- Wand Cursor Trail ---
    initWandTrail();

    // --- Owl Post Notification ---
    setTimeout(showOwlPost, 3000);

    // --- Marauder Footprints ---
    initFootprints();
});

/* ============================================
   MAGICAL PARTICLE CANVAS
   Floating stars and sparkles background
   ============================================ */
function initMagicCanvas() {
    const canvas = document.getElementById('magic-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrame;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

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

    // Create particles
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 150);
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
        "Hmm, 8 years of IT experience... a Proxmox home lab... a thirst for knowledge that never stops. RAVENCLAW!",
        "I see someone who closes 30 tickets a day and still has time to mentor others. That dedication... RAVENCLAW!",
        "Interesting... you support C-suite executives AND run a home lab with Wazuh and local AI models. RAVENCLAW!",
        "A 95% first-day resolution rate? You clearly value solving problems right the first time. RAVENCLAW!",
        "Windows, macOS, Linux, mobile devices... you don't discriminate. A true learner. RAVENCLAW!",
        "PowerShell scripts that save 15 minutes per ticket? Efficiency is wisdom. RAVENCLAW!",
        "300+ conference rooms maintained, meeting drop-outs cut by 25%... impressive problem-solving. RAVENCLAW!",
        "From helpdesk to lead technician in 8 years, always learning, always growing. RAVENCLAW, without a doubt!"
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

// Add hat thinking animation
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
document.head.appendChild(hatStyle);

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

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
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
   CONTACT FORM
   With magical submit animation
   ============================================ */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = form.querySelector('.submit-btn');
        const btnText = btn.querySelector('.btn-text');
        const btnIcon = btn.querySelector('.btn-icon');
        const originalText = btnText.textContent;

        // Sending animation
        btn.disabled = true;
        btnText.textContent = 'Owl Dispatched!';
        btnIcon.style.animation = 'owlFly 1s ease-out forwards';
        triggerSpellOverlay();

        // Add fly animation
        const flyStyle = document.createElement('style');
        flyStyle.textContent = `
            @keyframes owlFly {
                0% { transform: translate(0, 0) scale(1); }
                50% { transform: translate(20px, -30px) scale(1.2); }
                100% { transform: translate(100px, -80px) scale(0); opacity: 0; }
            }
        `;
        document.head.appendChild(flyStyle);

        // Create success sparkles
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const spark = document.createElement('div');
                spark.className = 'wand-spark';
                const rect = btn.getBoundingClientRect();
                spark.style.left = (rect.left + Math.random() * rect.width) + 'px';
                spark.style.top = (rect.top + Math.random() * rect.height) + 'px';
                document.body.appendChild(spark);
                setTimeout(() => spark.remove(), 800);
            }, i * 50);
        }

        setTimeout(() => {
            btnText.textContent = 'Owl Sent Successfully!';
            btn.style.background = 'linear-gradient(135deg, #059669, #10b981)';
            btn.style.borderColor = '#10b981';
        }, 1500);

        setTimeout(() => {
            btnText.textContent = originalText;
            btnIcon.style.animation = '';
            btnIcon.style.transform = '';
            btnIcon.style.opacity = '1';
            btn.disabled = false;
            btn.style.background = '';
            btn.style.borderColor = '';
            form.reset();
            flyStyle.remove();
        }, 4000);
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
