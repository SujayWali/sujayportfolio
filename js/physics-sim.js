// Interactive Physics Simulation for Portfolio Header
const canvas = document.getElementById('physics-bg');
const ctx = canvas.getContext('2d');
let particles = [];
const PARTICLE_COUNT = 40;
const colors = ['#00bcd4', '#ff4081', '#fff', '#8bc34a', '#ffc107'];
let mouse = { x: null, y: null, down: false };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = document.getElementById('lead').offsetHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function Particle() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = 8 + Math.random() * 8;
    this.baseRadius = this.radius;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.baseColor = this.color;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
}

function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }
}
createParticles();

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.7;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
    // Draw lines between close particles
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            let p1 = particles[i];
            let p2 = particles[j];
            let dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
            if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = '#fff';
                ctx.globalAlpha = 0.2;
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        }
    }
}

function updateParticles() {
    for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        // Bounce off edges
        if (p.x < p.radius || p.x > canvas.width - p.radius) p.vx *= -1;
        if (p.y < p.radius || p.y > canvas.height - p.radius) p.vy *= -1;

        // Interactive: mouse hover effect
        if (mouse.x !== null && mouse.y !== null) {
            let dx = mouse.x - p.x;
            let dy = mouse.y - p.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                // Orbit effect: particles circle around cursor
                let angle = Math.atan2(dy, dx);
                let orbitRadius = 60;
                let orbitSpeed = 0.05 + Math.random() * 0.03;
                let targetX = mouse.x + Math.cos(angle + orbitSpeed) * orbitRadius;
                let targetY = mouse.y + Math.sin(angle + orbitSpeed) * orbitRadius;
                p.vx += (targetX - p.x) * 0.05;
                p.vy += (targetY - p.y) * 0.05;
                p.radius = Math.min(p.baseRadius + 8, 28);
                p.color = '#ff4081';
            } else {
                p.radius = p.baseRadius;
                p.color = p.baseColor;
            }
        }
    }
}

canvas.addEventListener('mousemove', function(e) {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
});
canvas.addEventListener('mouseleave', function() {
    mouse.x = null;
    mouse.y = null;
});
canvas.addEventListener('mousedown', function(e) {
    mouse.down = true;
});
canvas.addEventListener('mouseup', function(e) {
    mouse.down = false;
});

function animate() {
    updateParticles();
    drawParticles();
    requestAnimationFrame(animate);
}
animate();
