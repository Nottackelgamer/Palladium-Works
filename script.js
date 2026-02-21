/* =====================================================
   PALLADIUM CINEMATIC ENGINE — FINAL STABLE BUILD
   ===================================================== */

/* ================= FORCE TOP ON RELOAD ================= */

if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

window.onbeforeunload = () => window.scrollTo(0,0);


/* ================= LOADER ================= */

/* ================= INTRO SCROLL GATE ================= */

const loader = document.getElementById("loader");

let introClosed = false;

function closeIntro(){
    if(introClosed) return;

    introClosed = true;
    loader.classList.add("hide");

    // remove completely after fade
    setTimeout(()=>{
        loader.style.display = "none";
    },900);
}

/* close when user scrolls slightly */
window.addEventListener("wheel", e=>{
    if(window.scrollY < 10 && e.deltaY > 5){
        closeIntro();
    }
});

/* mobile support */
window.addEventListener("touchmove", ()=>{
    if(window.scrollY > 5){
        closeIntro();
    }
});

/* fallback — never trap user */
setTimeout(closeIntro, 4000);


/* ================= SMOOTH SCROLL ================= */

document.documentElement.style.scrollBehavior = "smooth";


/* ================= SCROLL PROGRESS ================= */

const progress = document.querySelector(".scroll-progress");

window.addEventListener("scroll", () => {
    if (!progress) return;

    const h = document.documentElement;
    const scrolled =
        h.scrollTop / (h.scrollHeight - h.clientHeight);

    progress.style.width = (scrolled * 100) + "%";
});


/* ================= SPOTLIGHT ================= */

const spotlight = document.querySelector(".spotlight");

if (spotlight) {
    document.addEventListener("mousemove", e => {
        spotlight.style.left = (e.clientX - 300) + "px";
        spotlight.style.top = (e.clientY - 300) + "px";
    });
}


/* ================= PARTICLES ================= */

const canvas = document.getElementById("particles");

if (canvas) {

    const ctx = canvas.getContext("2d");

    function resizeCanvas(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles=[];

    for(let i=0;i<70;i++){
        particles.push({
            x:Math.random()*canvas.width,
            y:Math.random()*canvas.height,
            vx:(Math.random()-0.5)*0.25,
            vy:(Math.random()-0.5)*0.25,
            size:Math.random()*2+0.5
        });
    }

    function animate(){
        ctx.clearRect(0,0,canvas.width,canvas.height);

        particles.forEach(p=>{
            p.x+=p.vx;
            p.y+=p.vy;

            if(p.x<0||p.x>canvas.width) p.vx*=-1;
            if(p.y<0||p.y>canvas.height) p.vy*=-1;

            ctx.beginPath();
            ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
            ctx.fillStyle="rgba(139,92,246,0.6)";
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }

    animate();
}


/* ================= STAGGER REVEAL ================= */

/* =====================================================
   CINEMATIC STAGGER REVEAL ENGINE (FULL RESTORE)
   ===================================================== */

const revealObserver = new IntersectionObserver((entries, observer) => {

    entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        /* activate parent */
        entry.target.classList.add("active");

        /* stagger children animations */
        const animatedChildren = entry.target.querySelectorAll(
            ".card, .why-card, .step-card, .stat"
        );

        animatedChildren.forEach((el, i) => {

            el.style.transitionDelay = (i * 120) + "ms";

            requestAnimationFrame(() => {
                el.classList.add("active");
            });
        });

        observer.unobserve(entry.target);
    });

},{
    threshold: 0.18,
    rootMargin: "0px 0px -80px 0px"
});


/* observe ALL cinematic blocks */
document.querySelectorAll(
    ".section, .about-left, .about-right, .why-grid, .process-flow"
).forEach(el => {

    el.classList.add("reveal");
    revealObserver.observe(el);
});


/* safety: reveal elements already in view after load */
window.addEventListener("load", () => {

    document.querySelectorAll(".reveal").forEach(el => {

        const rect = el.getBoundingClientRect();

        if (rect.top < window.innerHeight * 0.9) {
            el.classList.add("active");

            el.querySelectorAll(
                ".card, .why-card, .step-card, .stat"
            ).forEach((child,i)=>{
                child.style.transitionDelay=(i*120)+"ms";
                child.classList.add("active");
            });
        }
    });

});


/* ================= HERO WIPE ================= */

window.addEventListener("load",()=>{

    document.querySelectorAll(".wipe").forEach((line,i)=>{

        const mask=document.createElement("div");
        mask.style.position="absolute";
        mask.style.inset="0";
        mask.style.background="linear-gradient(90deg, #05040a 70%,transparent)";
        mask.style.transition="1.2s cubic-bezier(.16,1,.3,1)";

        line.appendChild(mask);

        setTimeout(()=>{
            mask.style.transform="translateX(110%)";
        },400+i*300);

    });
});


/* ================= TILT ================= */

document.querySelectorAll(".tilt").forEach(card=>{

    card.addEventListener("mousemove",e=>{
        const r=card.getBoundingClientRect();
        const rx=((e.clientY-r.top)/r.height-0.5)*-12;
        const ry=((e.clientX-r.left)/r.width-0.5)*12;

        card.style.transform=`rotateX(${rx}deg) rotateY(${ry}deg)`;
    });

    card.addEventListener("mouseleave",()=>{
        card.style.transform="rotateX(0) rotateY(0)";
    });

});


/* ================= MAGNETIC BUTTON ================= */

document.querySelectorAll(".magnetic").forEach(btn=>{

    btn.addEventListener("mousemove",e=>{
        const r=btn.getBoundingClientRect();
        const x=e.clientX-r.left-r.width/2;
        const y=e.clientY-r.top-r.height/2;

        btn.style.transform=`translate(${x*0.2}px,${y*0.2}px)`;
    });

    btn.addEventListener("mouseleave",()=>{
        btn.style.transform="translate(0,0)";
    });

});


/* =====================================================
   CINEMATIC INTRO SCROLL GATE (MOBILE FRIENDLY)
   ===================================================== */

const introGate = document.querySelector(".intro-gate");
const navbar = document.querySelector(".nav");
let introFinished = false;

function finishIntro() {
    if(introFinished) return;
    introFinished = true;

    // Trigger the CSS transition
    introGate.style.opacity = "0";
    introGate.style.transform = "scale(1.1)"; // Slight zoom out looks more premium
    
    // Show the navbar slightly before the gate is fully gone
    setTimeout(() => {
        navbar.classList.add("active");
    }, 400);

    // Wait for the CSS transition (1.2s) to finish before deleting the element
    setTimeout(() => {
        introGate.style.display = "none";
        document.body.style.overflow = ""; // Re-enable scrolling
    }, 1200); 
}

// 1. Mouse Wheel Support
window.addEventListener("wheel", (e) => {
    if(!introFinished && e.deltaY > 10) finishIntro();
}, {passive: false});

// 2. Mobile Swipe Support
let touchStart = 0;
window.addEventListener("touchstart", e => touchStart = e.touches[0].clientY);
window.addEventListener("touchmove", e => {
    let touchEnd = e.touches[0].clientY;
    if(!introFinished && touchStart - touchEnd > 50) finishIntro();
});

// 3. Click Fallback (Best for Mobile UX)
introGate.addEventListener("click", finishIntro);

/* ================= SCROLL REVEAL ================= */

const reveals = document.querySelectorAll(".reveal");

function revealOnScroll(){
  const trigger = window.innerHeight * 0.85;

  reveals.forEach(el=>{
    const top = el.getBoundingClientRect().top;
    if(top < trigger){
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll",revealOnScroll);
revealOnScroll();

/* ================= ACCORDION ================= */

document.querySelectorAll(".acc-item").forEach(item=>{
  item.addEventListener("click",()=>{
    item.classList.toggle("active");
  });
});

/* ===== HERO CINEMATIC STAGGER ===== */

window.addEventListener("load", () => {

    const lines = document.querySelectorAll(".wipe");

    lines.forEach((line, i) => {
        setTimeout(() => {
            line.classList.add("active");
        }, 400 + (i * 220)); // stagger delay
    });

});
