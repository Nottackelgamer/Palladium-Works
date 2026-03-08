/* =====================================================
   PALLADIUM CINEMATIC ENGINE — ULTIMATE FULL BUILD
   ===================================================== */

/** * BROWSER RESET 
 * Prevents the browser from jumping to a middle-page scroll 
 * position on refresh, which breaks the intro gate.
 **/
if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}
window.onbeforeunload = () => window.scrollTo(0,0);

/* ================= GLOBAL SELECTORS ================= */
const loader = document.getElementById("loader");
const introGate = document.querySelector(".intro-gate");
const navbar = document.querySelector(".nav");
const scrollIndicator = document.querySelector('.scroll-indicator');
const progress = document.querySelector(".scroll-progress");
const canvas = document.getElementById("particles");
const spotlight = document.querySelector(".spotlight");

/* ================= STATE MANAGEMENT ================= */
let introClosed = false;   // Stage 1: Loader Finished
let gateOpened = false;    // Stage 2: Hero Gate Opened
let startY = 0;            // Support for Mobile Swipe

/* ================= INTRO & UNLOCK LOGIC ================= */

/**
 * PHASE 1: closeLoader
 * Closes the initial blinking text/logo loader.
 **/
function closeLoader() {
    if(introClosed) return;
    introClosed = true;

    if(loader) {
        loader.classList.add("hide");
        setTimeout(() => {
            loader.style.display = "none";
        }, 850);
    }

    // Show the "Scroll Down" mouse icon once loader is gone
    if(scrollIndicator) scrollIndicator.classList.add('active');
}

/**
 * PHASE 2: finishIntro
 * This is the "Key" that unlocks your stuck page.
 **/
function finishIntro() {
    if(gateOpened || !introClosed) return; 
    gateOpened = true;

    introGate.style.opacity = "0";
    introGate.style.transform = "scale(1.1)";

    // THE MASTER UNLOCK
    document.body.classList.add("unlocked");
    document.documentElement.classList.add("unlocked"); // Targets the <html> tag
    
    // Inline safety overrides
    document.body.style.overflow = "visible";
    document.body.style.position = "relative";
    document.documentElement.style.overflow = "visible";

    if(scrollIndicator) scrollIndicator.style.opacity = "0";

    setTimeout(() => {
        navbar.classList.add("active");
    }, 400);

    setTimeout(() => {
        introGate.style.display = "none";
    }, 1200); 
}

/* ================= INTERACTION ENGINES ================= */

// Auto-timer for loader (2 blinks)
setTimeout(closeLoader, 2200); 

// Skip/Click Listeners
if(loader) loader.addEventListener("click", closeLoader);
if(introGate) introGate.addEventListener("click", finishIntro);

// Scroll/Wheel Detection
window.addEventListener("wheel", (e) => {
    if(!gateOpened && e.deltaY > 5) finishIntro();
}, {passive: true});

// Mobile Swipe Detection
window.addEventListener("touchstart", (e) => {
    startY = e.touches[0].pageY;
}, {passive: true});

window.addEventListener("touchmove", (e) => {
    if(gateOpened) return;
    let moveY = e.touches[0].pageY;
    if (startY - moveY > 40) finishIntro(); 
}, {passive: true});

// Scroll Progress Bar & Indicator Cleanup
window.addEventListener("scroll", () => {
    if (progress) {
        const h = document.documentElement;
        const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
        progress.style.width = (scrolled * 100) + "%";
    }

    if (window.scrollY > 100 && scrollIndicator) {
        scrollIndicator.classList.remove('active');
    }
}, { passive: true });

/* ================= VISUAL EFFECTS ENGINE ================= */

// 1. Spotlight Mouse Follow
if (spotlight) {
    document.addEventListener("mousemove", e => {
        spotlight.style.left = (e.clientX - 300) + "px";
        spotlight.style.top = (e.clientY - 300) + "px";
    });
}

// 2. Interactive Particles
if (canvas) {
    const ctx = canvas.getContext("2d");
    const particles = [];
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    for(let i=0; i<80; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: Math.random() * 2 + 0.5
        });
    }

    function render() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = "rgba(167, 139, 250, 0.5)";
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if(p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if(p.y < 0 || p.y > canvas.height) p.vy *= -1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
            ctx.fill();
        });
        requestAnimationFrame(render);
    }
    render();
}

// 3. Intersection Observer (Reveal on Scroll)
const revealOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("active");
        
        const children = entry.target.querySelectorAll(".card, .why-card, .step-card, .stat, .game-card");
        children.forEach((child, i) => {
            child.style.transitionDelay = (i * 120) + "ms";
            child.classList.add("active");
        });
        revealObserver.unobserve(entry.target);
    });
}, revealOptions);

document.querySelectorAll(".section, .about-left, .about-right, .why-grid, .process-flow, .game-grid").forEach(el => {
    el.classList.add("reveal");
    revealObserver.observe(el);
});

// 4. Hero Wipe Animation
window.addEventListener("load", () => {
    document.querySelectorAll(".wipe").forEach((line, i) => {
        const mask = document.createElement("div");
        mask.className = "wipe-mask";
        mask.style.cssText = "position:absolute; inset:0; background:linear-gradient(90deg, #05040a 70%, transparent); transition:1.5s cubic-bezier(.16,1,.3,1); z-index:10;";
        line.appendChild(mask);

        setTimeout(() => {
            mask.style.transform = "translateX(110%)";
            line.classList.add("active");
            setTimeout(() => mask.remove(), 6000);
        }, 1200 + (i * 200));
    });
});

/* ================= COMPONENT INTERACTIVITY ================= */

// Tilt Cards
document.querySelectorAll(".tilt").forEach(card => {
    card.addEventListener("mousemove", e => {
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * 15;
        const y = ((e.clientY - r.top) / r.height - 0.5) * -15;
        card.style.transform = `rotateX(${y}deg) rotateY(${x}deg)`;
    });
    card.addEventListener("mouseleave", () => card.style.transform = "rotateX(0) rotateY(0)");
});

// Magnetic Buttons
document.querySelectorAll(".magnetic").forEach(btn => {
    btn.addEventListener("mousemove", e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width/2) * 0.3;
        const y = (e.clientY - r.top - r.height/2) * 0.3;
        btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener("mouseleave", () => btn.style.transform = "translate(0,0)");
});

// Accordion & Modals
document.querySelectorAll(".acc-item").forEach(item => {
    item.addEventListener("click", () => item.classList.toggle("active"));
});

const modal = document.getElementById('contactModal');
const contactBtn = document.querySelector('.btn-contact');
const closeBtn = document.querySelector('.close-modal');

if(contactBtn && modal) {
    contactBtn.addEventListener('click', (e) => { e.preventDefault(); modal.classList.add('active'); });
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    window.addEventListener('click', (e) => { if(e.target === modal) modal.classList.remove('active'); });
}

// Smooth Scrolling for all Hyperlinks
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if(target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

console.log("Palladium Cinematic Engine: 100% Loaded.");
