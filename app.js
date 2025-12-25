/**
 * TRAE Aurora - Crystalline Christmas Logic
 * Author: Code Prism (Assistant)
 */

document.addEventListener('DOMContentLoaded', () => {
    initBackground();
    initCountdown();
    initMessageForge();
    initGame();
});

// --- Utility: Scroll to Section ---
function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// --- 1. Background Engine (Aurora + Snow) ---
function initBackground() {
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    let width, height, particles = [];

    const resize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 1;
            this.speedY = Math.random() * 1 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            if (this.y > height) {
                this.y = -10;
                this.x = Math.random() * width;
            }
        }
        draw() {
            ctx.fillStyle = `rgba(0, 255, 102, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const initParticles = () => {
        particles = [];
        for (let i = 0; i < 150; i++) {
            particles.push(new Particle());
        }
    };

    const drawAurora = () => {
        const time = Date.now() * 0.001;
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#050b14');
        gradient.addColorStop(0.5, '#0a1a2f');
        gradient.addColorStop(1, '#050b14');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Aurora waves
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.strokeStyle = i === 0 ? 'rgba(0, 255, 102, 0.1)' : 'rgba(0, 242, 255, 0.05)';
            ctx.lineWidth = 100;
            const yOffset = height * 0.3 + (i * 100);
            ctx.moveTo(0, yOffset + Math.sin(time + i) * 50);
            for (let x = 0; x < width; x += 50) {
                ctx.lineTo(x, yOffset + Math.sin(x * 0.002 + time + i) * 80);
            }
            ctx.stroke();
        }
        ctx.restore();
    };

    const animate = () => {
        drawAurora();
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    initParticles();
    animate();
}

// --- 2. Countdown Timer ---
function initCountdown() {
    const target = new Date('December 25, 2025 00:00:00').getTime();

    const update = () => {
        const now = new Date().getTime();
        const diff = target - now;

        if (diff <= 0) {
            document.getElementById('countdown').innerHTML = "<h3>MERRY CHRISTMAS!</h3>";
            return;
        }

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = d.toString().padStart(2, '0');
        document.getElementById('hours').innerText = h.toString().padStart(2, '0');
        document.getElementById('minutes').innerText = m.toString().padStart(2, '0');
        document.getElementById('seconds').innerText = s.toString().padStart(2, '0');
    };

    setInterval(update, 1000);
    update();
}

// --- 3. Magical Message Forge ---
function initMessageForge() {
    const input = document.getElementById('messageInput');
    const btn = document.getElementById('forgeBtn');
    const output = document.getElementById('outputMessage');
    const canvas = document.getElementById('snowflakeCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 300;
    canvas.height = 300;

    const drawCrystal = (text) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Draw decorative snowflake based on text length
        ctx.strokeStyle = '#00ff66';
        ctx.lineWidth = 2;
        const branches = 6 + (text.length % 6);
        const radius = 80 + (text.length * 2);

        for (let i = 0; i < branches; i++) {
            const angle = (i * 2 * Math.PI) / branches;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
            ctx.stroke();
            
            // Sub-branches
            for (let j = 1; j < 4; j++) {
                const subAngle = angle + 0.5;
                const subX = centerX + Math.cos(angle) * (radius * j / 4);
                const subY = centerY + Math.sin(angle) * (radius * j / 4);
                ctx.beginPath();
                ctx.moveTo(subX, subY);
                ctx.lineTo(subX + Math.cos(subAngle) * 20, subY + Math.sin(subAngle) * 20);
                ctx.stroke();
            }
        }
        
        output.innerText = text.toUpperCase();
        output.style.opacity = 0;
        setTimeout(() => { output.style.opacity = 1; output.style.transition = 'opacity 1s'; }, 100);
    };

    btn.addEventListener('click', () => {
        if (input.value.trim()) {
            drawCrystal(input.value);
            input.value = '';
        }
    });
}

// --- 4. Gift Catcher Mini Game ---
function initGame() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('startGameBtn');
    const scoreEl = document.getElementById('scoreVal');
    
    let score = 0;
    let gameActive = false;
    let playerX = 0;
    let gifts = [];
    let particles = [];
    let difficultyMultiplier = 1;
    let combo = 0;
    let lastCatchTime = 0;

    const resize = () => {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        playerX = canvas.width / 2;
    };

    const GIFT_TYPES = {
        common: { color: '#00ff66', points: 10, speedMult: 1, size: 25, chance: 0.6 },
        rare: { color: '#00f2ff', points: 25, speedMult: 1.3, size: 20, chance: 0.3 },
        legendary: { color: '#ff00ff', points: 50, speedMult: 1.8, size: 18, chance: 0.1 }
    };

    const ARTIFACT_TYPES = {
        crown: { color: '#ffd700', points: 100, speedMult: 1.5, size: 30, chance: 0.05, shape: 'crown' },
        trophy: { color: '#c0c0c0', points: 75, speedMult: 1.3, size: 28, chance: 0.08, shape: 'trophy' },
        gem: { color: '#ff69b4', points: 60, speedMult: 1.6, size: 22, chance: 0.1, shape: 'gem' },
        star: { color: '#ffff00', points: 40, speedMult: 1.4, size: 20, chance: 0.12, shape: 'star' }
    };

    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.size = Math.random() * 5 + 2;
            this.speedX = (Math.random() - 0.5) * 8;
            this.speedY = (Math.random() - 0.5) * 8 - 3;
            this.life = 1;
            this.decay = Math.random() * 0.02 + 0.02;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life -= this.decay;
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.life;
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    class Gift {
        constructor() {
            const rand = Math.random();
            let type;
            if (rand < 0.6) type = 'common';
            else if (rand < 0.9) type = 'rare';
            else type = 'legendary';
            
            const typeData = GIFT_TYPES[type];
            this.x = Math.random() * (canvas.width - 50) + 25;
            this.y = -60;
            this.size = typeData.size;
            this.baseSpeed = (3 + Math.random() * 3) * typeData.speedMult * difficultyMultiplier;
            this.speed = this.baseSpeed;
            this.color = typeData.color;
            this.points = typeData.points;
            this.rotation = 0;
            this.rotationSpeed = (Math.random() - 0.5) * 0.1;
            this.type = type;
        }
        update() {
            this.y += this.speed;
            this.rotation += this.rotationSpeed;
        }
        draw() {
            ctx.save();
            ctx.translate(this.x + this.size/2, this.y + this.size/2);
            ctx.rotate(this.rotation);
            ctx.shadowBlur = 20;
            ctx.shadowColor = this.color;
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.strokeRect(-this.size/2, -this.size/2, this.size, this.size);
            
            // Glow effect for legendary
            if (this.type === 'legendary') {
                ctx.beginPath();
                ctx.arc(0, 0, this.size * 0.8, 0, Math.PI * 2);
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
            ctx.restore();
        }
    }

    class Artifact {
        constructor() {
            const types = Object.keys(ARTIFACT_TYPES);
            const rand = Math.random();
            let selectedType = 'star';
            let cumulative = 0;
            for (const type of types) {
                cumulative += ARTIFACT_TYPES[type].chance;
                if (rand < cumulative) {
                    selectedType = type;
                    break;
                }
            }
            
            const typeData = ARTIFACT_TYPES[selectedType];
            this.x = Math.random() * (canvas.width - 60) + 30;
            this.y = -70;
            this.size = typeData.size;
            this.baseSpeed = (4 + Math.random() * 4) * typeData.speedMult * difficultyMultiplier;
            this.speed = this.baseSpeed;
            this.color = typeData.color;
            this.points = typeData.points;
            this.rotation = 0;
            this.rotationSpeed = (Math.random() - 0.5) * 0.08;
            this.type = selectedType;
            this.shape = typeData.shape;
            this.wobble = 0;
            this.wobbleSpeed = 0.05;
        }
        update() {
            this.y += this.speed;
            this.rotation += this.rotationSpeed;
            this.wobble += this.wobbleSpeed;
        }
        draw() {
            ctx.save();
            ctx.translate(this.x + this.size/2, this.y + this.size/2);
            ctx.rotate(this.rotation);
            ctx.translate(0, Math.sin(this.wobble) * 3);
            ctx.shadowBlur = 25;
            ctx.shadowColor = this.color;
            ctx.fillStyle = this.color;
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            
            const s = this.size;
            
            switch(this.shape) {
                case 'crown':
                    this.drawCrown(s);
                    break;
                case 'trophy':
                    this.drawTrophy(s);
                    break;
                case 'gem':
                    this.drawGem(s);
                    break;
                case 'star':
                    this.drawStar(s);
                    break;
            }
            
            ctx.restore();
        }
        drawCrown(s) {
            ctx.beginPath();
            const base = s * 0.3;
            const height = s * 0.5;
            ctx.moveTo(-s/2, base);
            ctx.lineTo(-s/2 + s/6, -height/2);
            ctx.lineTo(-s/6, 0);
            ctx.lineTo(0, -height);
            ctx.lineTo(s/6, 0);
            ctx.lineTo(s/2 - s/6, -height/2);
            ctx.lineTo(s/2, base);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(0, -height/3, s/12, 0, Math.PI * 2);
            ctx.fill();
        }
        drawTrophy(s) {
            const baseW = s * 0.5;
            const baseH = s * 0.2;
            const cupW = s * 0.4;
            const cupH = s * 0.4;
            
            ctx.fillRect(-baseW/2, s/2 - baseH, baseW, baseH);
            ctx.strokeRect(-baseW/2, s/2 - baseH, baseW, baseH);
            
            ctx.beginPath();
            ctx.moveTo(-cupW/2, s/2 - baseH);
            ctx.lineTo(-cupW/2, s/2 - baseH - cupH);
            ctx.quadraticCurveTo(0, s/2 - baseH - cupH - cupW/2, cupW/2, s/2 - baseH - cupH);
            ctx.lineTo(cupW/2, s/2 - baseH);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(-cupW/3, s/2 - baseH - cupH/2);
            ctx.lineTo(cupW/3, s/2 - baseH - cupH/2);
            ctx.stroke();
        }
        drawGem(s) {
            const h = s * 0.6;
            ctx.beginPath();
            ctx.moveTo(0, -h);
            ctx.lineTo(s/2, -h/4);
            ctx.lineTo(s/3, h/2);
            ctx.lineTo(0, h/3);
            ctx.lineTo(-s/3, h/2);
            ctx.lineTo(-s/2, -h/4);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            ctx.strokeStyle = 'rgba(255,255,255,0.5)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, -h);
            ctx.lineTo(0, h/3);
            ctx.moveTo(-s/2, -h/4);
            ctx.lineTo(s/3, h/2);
            ctx.moveTo(s/2, -h/4);
            ctx.lineTo(-s/3, h/2);
            ctx.stroke();
        }
        drawStar(s) {
            const spikes = 5;
            const outerRadius = s/2;
            const innerRadius = s/4;
            
            ctx.beginPath();
            for(let i = 0; i < spikes * 2; i++) {
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                const angle = (i * Math.PI / spikes) - Math.PI / 2;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                if(i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    }

    const createExplosion = (x, y, color) => {
        for (let i = 0; i < 15; i++) {
            particles.push(new Particle(x, y, color));
        }
    };

    const drawPlayer = () => {
        ctx.save();
        const pulse = Math.sin(Date.now() * 0.005) * 0.2 + 0.8;
        ctx.globalAlpha = pulse;
        ctx.fillStyle = 'rgba(0, 255, 102, 0.3)';
        ctx.strokeStyle = '#00ff66';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#00ff66';
        ctx.beginPath();
        ctx.roundRect(playerX - 45, canvas.height - 35, 90, 25, 8);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    };

    const updateGame = () => {
        if (!gameActive) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid background
        ctx.save();
        ctx.strokeStyle = 'rgba(0, 255, 102, 0.05)';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 30) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 30) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        ctx.restore();

        drawPlayer();

        // Update & Draw Particles
        particles = particles.filter(p => p.life > 0);
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Spawn gifts with increasing difficulty
        const spawnRate = 0.02 + (difficultyMultiplier - 1) * 0.01;
        if (Math.random() < spawnRate) gifts.push(new Gift());
        
        // Spawn rare artifacts
        const artifactSpawnRate = 0.005 + (difficultyMultiplier - 1) * 0.002;
        if (Math.random() < artifactSpawnRate) gifts.push(new Artifact());

        gifts.forEach((gift, index) => {
            gift.update();
            gift.draw();

            // Collision detection
            if (gift.y + gift.size > canvas.height - 35 && 
                gift.x > playerX - 55 && gift.x < playerX + 55) {
                
                // Combo system
                const now = Date.now();
                if (now - lastCatchTime < 1000) {
                    combo++;
                } else {
                    combo = 1;
                }
                lastCatchTime = now;
                
                const comboMultiplier = 1 + (combo - 1) * 0.2;
                const finalPoints = Math.floor(gift.points * comboMultiplier);
                
                score += finalPoints;
                scoreEl.innerText = score;
                
                createExplosion(gift.x + gift.size/2, gift.y + gift.size/2, gift.color);
                gifts.splice(index, 1);
                
                // Increase difficulty
                difficultyMultiplier = 1 + (score / 500);
            } else if (gift.y > canvas.height) {
                gifts.splice(index, 1);
                combo = 0;
            }
        });

        // Display combo
        if (combo > 1) {
            ctx.save();
            ctx.fillStyle = '#ff00ff';
            ctx.font = 'bold 24px Orbitron';
            ctx.textAlign = 'center';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ff00ff';
            ctx.fillText(`${combo}x COMBO!`, playerX, canvas.height - 50);
            ctx.restore();
        }

        requestAnimationFrame(updateGame);
    };

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        playerX = e.clientX - rect.left;
    });

    startBtn.addEventListener('click', () => {
        gameActive = true;
        score = 0;
        scoreEl.innerText = score;
        gifts = [];
        particles = [];
        difficultyMultiplier = 1;
        combo = 0;
        lastCatchTime = 0;
        startBtn.style.display = 'none';
        document.getElementById('gameUI').style.top = '40px';
        document.getElementById('gameUI').style.transform = 'translateX(-50%)';
        updateGame();
    });

    window.addEventListener('resize', resize);
    resize();
}
