/**
 * TRAE Aurora - Crystalline Christmas Logic
 * Author: Code Prism (Assistant)
 */

document.addEventListener('DOMContentLoaded', () => {
    initBackground();
    initCountdown();
    initMessageForge();
    initGame();
    initTraoom();
    initNeonPuzzle();
    initRhythmBeat();
    initCosmicArena();
    initTetris();
    initPlatformer();
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

    window.addEventListener('resize', () => {
        isMobile = window.innerWidth < 768;
        resize();
    });
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
    const cloudContainer = document.getElementById('cloudContainer');
    const ctx = canvas.getContext('2d');

    canvas.width = 300;
    canvas.height = 300;

    // Load persistent messages
    let communityMessages = JSON.parse(localStorage.getItem('trae_messages') || '[]');
    
    const updateCloud = () => {
        cloudContainer.innerHTML = '';
        communityMessages.slice(-15).reverse().forEach(msg => {
            const span = document.createElement('span');
            span.className = 'cloud-msg';
            span.innerText = msg;
            cloudContainer.appendChild(span);
        });
    };

    const drawCrystal = (text) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
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
        const text = input.value.trim();
        if (text) {
            drawCrystal(text);
            communityMessages.push(text);
            if (communityMessages.length > 50) communityMessages.shift();
            localStorage.setItem('trae_messages', JSON.stringify(communityMessages));
            updateCloud();
            input.value = '';
        }
    });

    updateCloud();
}

// --- 4. Gift Catcher Mini Game ---
function initGame() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('startGameBtn');
    const scoreEl = document.getElementById('scoreVal');
    const overlay = document.getElementById('gameOverlay');
    const submitBtn = document.getElementById('submitScoreBtn');
    const nameInput = document.getElementById('playerName');
    const leaderboardList = document.getElementById('leaderboardList');
    const timerDisplay = document.getElementById('timerDisplay');
    const timeBtns = document.querySelectorAll('.time-btn');
    
    let score = 0;
    let gameActive = false;
    let playerX = 0;
    let playerWidth = 90;
    let playerHeight = 25;
    let playerBottomOffset = 35;
    let gifts = [];
    let particles = [];
    let difficultyMultiplier = 1;
    let combo = 0;
    let lastCatchTime = 0;
    let timeLeft = 15;
    let timerInterval = null;
    let selectedDuration = 15;
    let isMobile = window.innerWidth < 768;

    timeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            timeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedDuration = parseInt(btn.dataset.time);
            timeLeft = selectedDuration;
            timerDisplay.innerText = timeLeft + 's';
        });
    });

    // Leaderboard logic
    let leaderboard = JSON.parse(localStorage.getItem('trae_leaderboard') || '[]');
    
    const updateLeaderboardUI = () => {
        leaderboardList.innerHTML = '';
        leaderboard.sort((a, b) => b.score - a.score).slice(0, 10).forEach((entry, idx) => {
            const dateStr = new Date(entry.date).toLocaleDateString();
            const durationStr = entry.duration ? `${entry.duration}s` : 'N/A';
            const div = document.createElement('div');
            div.className = 'leader-item';
            div.innerHTML = `
                <span class="leader-rank">#${idx + 1}</span>
                <span class="leader-name">${entry.name}</span>
                <span class="leader-score">${entry.score}</span>
                <span class="leader-duration">${durationStr}</span>
                <span class="leader-date">${dateStr}</span>
            `;
            leaderboardList.appendChild(div);
        });
    };

    const startTimer = () => {
        timeLeft = selectedDuration;
        timerDisplay.innerText = timeLeft + 's';
        timerDisplay.classList.remove('warning');
        
        if (timerInterval) clearInterval(timerInterval);
        
        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.innerText = timeLeft + 's';
            
            const warningThreshold = Math.max(5, Math.floor(selectedDuration * 0.2));
            if (timeLeft <= warningThreshold) {
                timerDisplay.classList.add('warning');
            }
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                gameOver();
            }
        }, 1000);
    };

    const gameOver = () => {
        gameActive = false;
        if (timerInterval) clearInterval(timerInterval);
        document.body.style.overflow = '';
        overlay.classList.remove('hidden');
        document.getElementById('overlayTitle').innerText = `GAME OVER - SCORE: ${score}`;
    };

    submitBtn.addEventListener('click', () => {
        const name = nameInput.value.trim() || 'Anonymous';
        leaderboard.push({ name, score, date: new Date().toISOString(), duration: selectedDuration });
        localStorage.setItem('trae_leaderboard', JSON.stringify(leaderboard));
        updateLeaderboardUI();
        overlay.classList.add('hidden');
        startBtn.style.display = 'block';
        document.body.style.overflow = '';
    });

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
        ctx.roundRect(playerX - playerWidth / 2, canvas.height - playerBottomOffset, playerWidth, playerHeight, 8);
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
            if (gift.y + gift.size > canvas.height - playerBottomOffset - playerHeight / 2 && 
                gift.x > playerX - playerWidth / 2 - 10 && gift.x < playerX + playerWidth / 2 + 10) {
                
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

    updateLeaderboardUI();

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        playerX = e.clientX - rect.left;
        playerX = Math.max(playerWidth / 2, Math.min(canvas.width - playerWidth / 2, playerX));
    });

    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        playerX = touch.clientX - rect.left;
        playerX = Math.max(playerWidth / 2, Math.min(canvas.width - playerWidth / 2, playerX));
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        playerX = touch.clientX - rect.left;
        playerX = Math.max(playerWidth / 2, Math.min(canvas.width - playerWidth / 2, playerX));
    }, { passive: false });

    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
    }, { passive: false });

    canvas.addEventListener('touchcancel', (e) => {
        e.preventDefault();
    }, { passive: false });

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
        document.body.style.overflow = 'hidden';
        startTimer();
        updateGame();
    });

    document.addEventListener('touchmove', (e) => {
        if (gameActive) {
            const gameCanvas = document.getElementById('gameCanvas');
            if (!gameCanvas.contains(e.target)) {
                e.preventDefault();
            }
        }
    }, { passive: false });

    window.addEventListener('resize', resize);
    resize();
}

// Export/Import Leaderboard
window.exportLeaderboard = () => {
    const leaderboard = JSON.parse(localStorage.getItem('trae_leaderboard') || '[]');
    const dataStr = JSON.stringify(leaderboard, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trae_leaderboard_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
};

window.importLeaderboard = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (Array.isArray(data)) {
                localStorage.setItem('trae_leaderboard', JSON.stringify(data));
                location.reload();
            }
        } catch (err) {
            alert('Invalid file format');
        }
    };
    reader.readAsText(file);
};

// --- 5. Traoom - Bug Hunter Game ---
function initTraoom() {
    const canvas = document.getElementById('traoomCanvas');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('startTraoomBtn');
    const restartBtn = document.getElementById('restartTraoomBtn');
    const killEl = document.getElementById('killVal');
    const timeEl = document.getElementById('traoomTime');
    const waveEl = document.getElementById('waveVal');
    const overlay = document.getElementById('traoomOverlay');
    const finalKillsEl = document.getElementById('finalKills');
    const finalTimeEl = document.getElementById('finalTime');

    let gameActive = false;
    let kills = 0;
    let wave = 1;
    let gameTime = 0;
    let timerInterval = null;
    let lastShot = 0;
    const SHOOT_COOLDOWN = 200;

    const keys = {};
    const mouse = { x: 0, y: 0 };

    const resize = () => {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
    };

    const drawRobloxBug = (x, y, size, color, health, maxHealth) => {
        ctx.save();
        
        const scale = size / 40;
        
        ctx.translate(x, y);
        
        ctx.fillStyle = color;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        
        const pulse = Math.sin(Date.now() * 0.01) * 0.1 + 1;
        ctx.scale(pulse, pulse);
        
        ctx.beginPath();
        ctx.roundRect(-20 * scale, -20 * scale, 40 * scale, 40 * scale, 5 * scale);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-8 * scale, -5 * scale, 4 * scale, 0, Math.PI * 2);
        ctx.arc(8 * scale, -5 * scale, 4 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(-8 * scale, -5 * scale, 2 * scale, 0, Math.PI * 2);
        ctx.arc(8 * scale, -5 * scale, 2 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-10 * scale, 8 * scale);
        ctx.lineTo(10 * scale, 8 * scale);
        ctx.stroke();
        
        const healthPercent = health / maxHealth;
        ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
        ctx.fillRect(-15 * scale, -30 * scale, 30 * scale, 5 * scale);
        ctx.fillStyle = '#00ff66';
        ctx.fillRect(-15 * scale, -30 * scale, 30 * scale * healthPercent, 5 * scale);
        
        ctx.restore();
    };

    const drawPlayer = (x, y, size) => {
        ctx.save();
        ctx.translate(x, y);
        
        const angle = Math.atan2(mouse.y - y, mouse.x - x);
        ctx.rotate(angle);
        
        ctx.fillStyle = '#00ff66';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.roundRect(-size / 2, -size / 2, size, size, 5);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(3, -3, 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#00f2ff';
        ctx.fillRect(size / 2 - 5, -3, 15, 6);
        
        ctx.restore();
    };

    const drawBullet = (x, y, size) => {
        ctx.save();
        ctx.fillStyle = '#00f2ff';
        ctx.shadowColor = '#00f2ff';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    };

    const drawParticle = (p) => {
        ctx.save();
        ctx.globalAlpha = p.life / p.maxLife;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    };

    class Bug {
        constructor() {
            const side = Math.floor(Math.random() * 4);
            switch(side) {
                case 0:
                    this.x = -30;
                    this.y = Math.random() * canvas.height;
                    break;
                case 1:
                    this.x = canvas.width + 30;
                    this.y = Math.random() * canvas.height;
                    break;
                case 2:
                    this.x = Math.random() * canvas.width;
                    this.y = -30;
                    break;
                case 3:
                    this.x = Math.random() * canvas.width;
                    this.y = canvas.height + 30;
                    break;
            }
            this.size = 30 + Math.random() * 20;
            this.speed = 1 + Math.random() * (1 + wave * 0.3);
            this.health = 2 + Math.floor(wave * 0.5);
            this.maxHealth = this.health;
            
            const bugTypes = [
                { color: '#ff0000', name: 'SyntaxError' },
                { color: '#ff6600', name: 'TypeError' },
                { color: '#ff00ff', name: 'LogicBug' },
                { color: '#ffff00', name: 'MemoryLeak' },
                { color: '#00ffff', name: 'NullPointer' }
            ];
            this.type = bugTypes[Math.floor(Math.random() * bugTypes.length)];
        }

        update(playerX, playerY) {
            const dx = playerX - this.x;
            const dy = playerY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist > 0) {
                this.x += (dx / dist) * this.speed;
                this.y += (dy / dist) * this.speed;
            }
        }

        draw() {
            drawRobloxBug(this.x, this.y, this.size, this.type.color, this.health, this.maxHealth);
        }

        takeDamage(amount) {
            this.health -= amount;
            return this.health <= 0;
        }
    }

    class Bullet {
        constructor(x, y, targetX, targetY) {
            this.x = x;
            this.y = y;
            const dx = targetX - x;
            const dy = targetY - y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            this.vx = (dx / dist) * 12;
            this.vy = (dy / dist) * 12;
            this.size = 5;
            this.life = 60;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life--;
            return this.life > 0 && 
                   this.x > 0 && this.x < canvas.width && 
                   this.y > 0 && this.y < canvas.height;
        }

        draw() {
            drawBullet(this.x, this.y, this.size);
        }
    }

    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 8;
            this.vy = (Math.random() - 0.5) * 8;
            this.size = 3 + Math.random() * 4;
            this.color = color;
            this.life = 30;
            this.maxLife = 30;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.2;
            this.life--;
            return this.life > 0;
        }

        draw() {
            drawParticle(this);
        }
    }

    let player = { x: 0, y: 0, size: 30, speed: 5, health: 100 };
    let bugs = [];
    let bullets = [];
    let particles = [];
    let spawnTimer = 0;
    let spawnRate = 120;

    const spawnBug = () => {
        bugs.push(new Bug());
    };

    const createExplosion = (x, y, color) => {
        for (let i = 0; i < 10; i++) {
            particles.push(new Particle(x, y, color));
        }
    };

    const checkCollisions = () => {
        bullets.forEach((bullet, bi) => {
            bugs.forEach((bug, gi) => {
                const dx = bullet.x - bug.x;
                const dy = bullet.y - bug.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < bug.size / 2 + bullet.size) {
                    bullets.splice(bi, 1);
                    
                    if (bug.takeDamage(1)) {
                        bugs.splice(gi, 1);
                        kills++;
                        killEl.innerText = kills;
                        createExplosion(bug.x, bug.y, bug.type.color);
                        
                        if (kills % 10 === 0) {
                            wave++;
                            waveEl.innerText = wave;
                            spawnRate = Math.max(30, 120 - wave * 10);
                        }
                    } else {
                        createExplosion(bullet.x, bullet.y, '#ffffff');
                    }
                }
            });
        });

        bugs.forEach((bug) => {
            const dx = player.x - bug.x;
            const dy = player.y - bug.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < player.size / 2 + bug.size / 2) {
                player.health -= 10;
                createExplosion(player.x, player.y, '#ff0000');
                
                if (player.health <= 0) {
                    gameOver();
                }
            }
        });
    };

    const updateGame = () => {
        if (!gameActive) return;

        ctx.fillStyle = 'rgba(5, 11, 20, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (keys['KeyW'] || keys['ArrowUp']) player.y = Math.max(player.size / 2, player.y - player.speed);
        if (keys['KeyS'] || keys['ArrowDown']) player.y = Math.min(canvas.height - player.size / 2, player.y + player.speed);
        if (keys['KeyA'] || keys['ArrowLeft']) player.x = Math.max(player.size / 2, player.x - player.speed);
        if (keys['KeyD'] || keys['ArrowRight']) player.x = Math.min(canvas.width - player.size / 2, player.x + player.speed);

        drawPlayer(player.x, player.y, player.size);

        spawnTimer++;
        if (spawnTimer >= spawnRate) {
            spawnBug();
            spawnTimer = 0;
        }

        bullets = bullets.filter(b => b.update());
        bullets.forEach(b => b.draw());

        bugs.forEach(bug => {
            bug.update(player.x, player.y);
            bug.draw();
        });

        particles = particles.filter(p => p.update());
        particles.forEach(p => p.draw());

        checkCollisions();

        requestAnimationFrame(updateGame);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const startTimer = () => {
        gameTime = 0;
        timerInterval = setInterval(() => {
            gameTime++;
            timeEl.innerText = formatTime(gameTime);
        }, 1000);
    };

    const gameOver = () => {
        gameActive = false;
        clearInterval(timerInterval);
        
        finalKillsEl.innerText = kills;
        finalTimeEl.innerText = formatTime(gameTime);
        overlay.classList.remove('hidden');
    };

    const startGame = () => {
        gameActive = true;
        kills = 0;
        wave = 1;
        gameTime = 0;
        player = { x: canvas.width / 2, y: canvas.height / 2, size: 30, speed: 5, health: 100 };
        bugs = [];
        bullets = [];
        particles = [];
        spawnTimer = 0;
        spawnRate = 120;
        
        killEl.innerText = '0';
        waveEl.innerText = '1';
        timeEl.innerText = '0:00';
        overlay.classList.add('hidden');
        
        startTimer();
        updateGame();
    };

    window.addEventListener('keydown', (e) => {
        keys[e.code] = true;
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
            e.preventDefault();
        }
    });

    window.addEventListener('keyup', (e) => {
        keys[e.code] = false;
    });

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('click', (e) => {
        if (!gameActive) return;
        
        const now = Date.now();
        if (now - lastShot >= SHOOT_COOLDOWN) {
            bullets.push(new Bullet(player.x, player.y, mouse.x, mouse.y));
            lastShot = now;
        }
    });

    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        mouse.x = touch.clientX - rect.left;
        mouse.y = touch.clientY - rect.top;
        
        const now = Date.now();
        if (now - lastShot >= SHOOT_COOLDOWN) {
            bullets.push(new Bullet(player.x, player.y, mouse.x, mouse.y));
            lastShot = now;
        }
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        mouse.x = touch.clientX - rect.left;
        mouse.y = touch.clientY - rect.top;
    }, { passive: false });

    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);

    window.addEventListener('resize', resize);
    resize();
}

// --- 6. Neon Puzzle Game ---
function initNeonPuzzle() {
    const canvas = document.getElementById('neonpuzzleCanvas');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('startPuzzleBtn');
    const nextBtn = document.getElementById('nextPuzzleBtn');
    const levelEl = document.getElementById('puzzleLevel');
    const movesEl = document.getElementById('puzzleMoves');
    const overlay = document.getElementById('neonpuzzleOverlay');
    const finalMovesEl = document.getElementById('finalMoves');

    let gameActive = false;
    let level = 1;
    let moves = 0;
    let nodes = [];
    let connections = [];

    const resize = () => {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
    };

    class Node {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.connections = [];
            this.angle = 0;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            
            ctx.fillStyle = '#ff0066';
            ctx.shadowColor = '#ff0066';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(0, 0, 20, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 0;
            ctx.beginPath();
            ctx.arc(0, 0, 8, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }

        rotate() {
            this.angle += Math.PI / 4;
            moves++;
            movesEl.innerText = moves;
        }
    }

    const generateLevel = () => {
        nodes = [];
        connections = [];
        moves = 0;
        movesEl.innerText = '0';
        
        const nodeCount = 4 + level;
        const positions = [];
        
        for (let i = 0; i < nodeCount; i++) {
            let x, y;
            let valid = false;
            let attempts = 0;
            
            while (!valid && attempts < 100) {
                x = 100 + Math.random() * (canvas.width - 200);
                y = 100 + Math.random() * (canvas.height - 200);
                valid = true;
                
                for (const pos of positions) {
                    const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
                    if (dist < 80) valid = false;
                }
                attempts++;
            }
            
            if (valid) {
                positions.push({ x, y });
                nodes.push(new Node(x, y));
            }
        }

        for (let i = 0; i < nodes.length - 1; i++) {
            connections.push([i, i + 1]);
            nodes[i].connections.push(i + 1);
            nodes[i + 1].connections.push(i);
        }

        connections.push([nodes.length - 1, 0]);
        nodes[0].connections.push(nodes.length - 1);
        nodes[nodes.length - 1].connections.push(0);
    };

    const checkWin = () => {
        for (const [from, to] of connections) {
            const nodeA = nodes[from];
            const nodeB = nodes[to];
            const targetAngle = Math.atan2(nodeB.y - nodeA.y, nodeB.x - nodeA.x);
            let currentAngle = nodeA.angle % (Math.PI * 2);
            if (currentAngle < 0) currentAngle += Math.PI * 2;
            let diff = Math.abs(targetAngle - currentAngle);
            if (diff > Math.PI) diff = Math.PI * 2 - diff;
            
            if (diff > 0.3) return false;
        }
        
        return true;
    };

    const updateGame = () => {
        if (!gameActive) return;

        ctx.fillStyle = 'rgba(5, 11, 20, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        connections.forEach(([from, to]) => {
            const nodeA = nodes[from];
            const nodeB = nodes[to];
            const aligned = Math.abs(nodeA.angle - Math.atan2(nodeB.y - nodeA.y, nodeB.x - nodeA.x)) < 0.3;
            
            ctx.strokeStyle = aligned ? '#00ff66' : '#ff6600';
            ctx.lineWidth = 3;
            ctx.shadowColor = aligned ? '#00ff66' : '#ff6600';
            ctx.shadowBlur = aligned ? 20 : 10;
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.stroke();
        });

        nodes.forEach(node => node.draw());

        requestAnimationFrame(updateGame);
    };

    const startGame = () => {
        gameActive = true;
        level = 1;
        levelEl.innerText = level;
        generateLevel();
        overlay.classList.add('hidden');
        updateGame();
    };

    const nextLevel = () => {
        level++;
        levelEl.innerText = level;
        generateLevel();
        overlay.classList.add('hidden');
    };

    canvas.addEventListener('click', (e) => {
        if (!gameActive) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        for (const node of nodes) {
            const dist = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
            if (dist < 25) {
                node.rotate();
                break;
            }
        }
        
        if (checkWin()) {
            gameActive = false;
            finalMovesEl.innerText = moves;
            overlay.classList.remove('hidden');
        }
    });

    startBtn.addEventListener('click', startGame);
    nextBtn.addEventListener('click', nextLevel);

    window.addEventListener('resize', resize);
    resize();
}

// --- 7. Rhythm Beat Game ---
function initRhythmBeat() {
    const canvas = document.getElementById('rhythmCanvas');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('startRhythmBtn');
    const restartBtn = document.getElementById('restartRhythmBtn');
    const scoreEl = document.getElementById('rhythmScore');
    const comboEl = document.getElementById('rhythmCombo');
    const streakEl = document.getElementById('rhythmStreak');
    const overlay = document.getElementById('rhythmOverlay');
    const finalScoreEl = document.getElementById('finalRhythmScore');

    let gameActive = false;
    let score = 0;
    let combo = 0;
    let streak = 0;
    let beats = [];
    let beatInterval = 0;
    let totalBeats = 0;
    let maxBeats = 50;
    let keyFeedback = { D: 0, F: 0, J: 0, K: 0 };
    const keyLabels = ['D', 'F', 'J', 'K'];
    const keyColors = ['#ff0066', '#ff6600', '#00ff66', '#00f2ff'];
    const laneX = [];

    const resize = () => {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        const laneWidth = canvas.width / 4;
        for (let i = 0; i < 4; i++) {
            laneX[i] = laneWidth * i + laneWidth / 2;
        }
    };

    const drawKeyIndicators = () => {
        keyLabels.forEach((label, i) => {
            const x = laneX[i];
            const y = canvas.height - 50;
            const feedback = keyFeedback[label];
            
            ctx.save();
            ctx.strokeStyle = keyColors[i];
            ctx.shadowColor = keyColors[i];
            ctx.shadowBlur = 15 + feedback * 20;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(x, y, 30, 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.fillStyle = feedback > 0 ? keyColors[i] : 'rgba(255,255,255,0.3)';
            ctx.shadowBlur = feedback * 20;
            ctx.beginPath();
            ctx.arc(x, y, 25, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 0;
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, x, y);
            ctx.restore();
            
            if (feedback > 0) keyFeedback[label] -= 0.1;
        });
    };

    const drawBeat = (beat) => {
        const x = laneX[beat.lane];
        const y = canvas.height - 50 - beat.y;
        const progress = beat.y / (canvas.height - 100);
        
        ctx.save();
        ctx.strokeStyle = keyColors[beat.lane];
        ctx.shadowColor = keyColors[beat.lane];
        ctx.shadowBlur = 20;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.fillStyle = keyColors[beat.lane];
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    };

    const spawnBeat = () => {
        if (totalBeats >= maxBeats) return;
        const lane = Math.floor(Math.random() * 4);
        beats.push({ y: 0, lane: lane, hit: false });
        totalBeats++;
    };

    const updateGame = () => {
        if (!gameActive) return;

        ctx.fillStyle = 'rgba(5, 11, 20, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < 4; i++) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(laneX[i], 0);
            ctx.lineTo(laneX[i], canvas.height);
            ctx.stroke();
        }

        beatInterval++;
        if (beatInterval % 40 === 0) {
            spawnBeat();
        }

        beats = beats.filter(beat => {
            if (beat.hit) return false;
            beat.y += 4;
            drawBeat(beat);
            
            if (beat.y > canvas.height - 50) {
                combo = 0;
                streak = 0;
                comboEl.innerText = '0';
                streakEl.innerText = '0';
                return false;
            }
            return true;
        });

        drawKeyIndicators();

        if (totalBeats >= maxBeats && beats.length === 0) {
            gameActive = false;
            finalScoreEl.innerText = score;
            overlay.classList.remove('hidden');
        }

        requestAnimationFrame(updateGame);
    };

    const startGame = () => {
        gameActive = true;
        score = 0;
        combo = 0;
        streak = 0;
        beats = [];
        beatInterval = 0;
        totalBeats = 0;
        keyFeedback = { D: 0, F: 0, J: 0, K: 0 };
        scoreEl.innerText = '0';
        comboEl.innerText = '0';
        streakEl.innerText = '0';
        overlay.classList.add('hidden');
        updateGame();
    };

    window.addEventListener('keydown', (e) => {
        if (!gameActive) return;
        const keyIdx = keyLabels.indexOf(e.code.replace('Key', ''));
        if (keyIdx === -1) return;
        
        keyFeedback[keyLabels[keyIdx]] = 1;
        
        for (const beat of beats) {
            if (beat.lane === keyIdx && !beat.hit) {
                const distance = Math.abs(beat.y - (canvas.height - 100));
                if (distance < 40) {
                    beat.hit = true;
                    if (distance < 15) {
                        score += 100 + combo * 20;
                        combo++;
                        streak++;
                    } else if (distance < 25) {
                        score += 50 + combo * 10;
                        combo++;
                        streak++;
                    } else {
                        score += 20;
                        combo = 0;
                    }
                    scoreEl.innerText = score;
                    comboEl.innerText = combo;
                    streakEl.innerText = streak;
                    break;
                }
            }
        }
    });

    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);

    window.addEventListener('resize', resize);
    resize();
}

// --- 8. Cosmic Arena Game ---
function initCosmicArena() {
    const canvas = document.getElementById('arenaCanvas');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('startArenaBtn');
    const restartBtn = document.getElementById('restartArenaBtn');
    const hpEl = document.getElementById('arenaHP');
    const killsEl = document.getElementById('arenaKills');
    const waveEl = document.getElementById('arenaWave');
    const overlay = document.getElementById('arenaOverlay');
    const finalKillsEl = document.getElementById('finalArenaKills');

    let gameActive = false;
    let player = { x: 0, y: 0, hp: 100, speed: 4, size: 30 };
    let enemies = [];
    let bullets = [];
    let particles = [];
    let kills = 0;
    let wave = 1;
    let enemySpawnTimer = 0;
    let spawnRate = 90;

    const keys = {};
    const mouse = { x: 0, y: 0 };

    const resize = () => {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
    };

    const drawPlayer = () => {
        ctx.save();
        ctx.translate(player.x, player.y);
        
        const angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
        ctx.rotate(angle);
        
        ctx.fillStyle = '#00ffcc';
        ctx.shadowColor = '#00ffcc';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(20, 0);
        ctx.lineTo(-15, -10);
        ctx.lineTo(-15, 10);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    };

    const drawEnemy = (enemy) => {
        ctx.save();
        ctx.translate(enemy.x, enemy.y);
        
        ctx.fillStyle = enemy.type;
        ctx.shadowColor = enemy.type;
        ctx.shadowBlur = 10;
        
        const pulse = Math.sin(Date.now() * 0.01) * 0.2 + 1;
        ctx.scale(pulse, pulse);
        
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const x = Math.cos(angle) * enemy.size;
            const y = Math.sin(angle) * enemy.size;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    };

    const drawBullet = (bullet) => {
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    };

    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.vx = (Math.random() - 0.5) * 6;
            this.vy = (Math.random() - 0.5) * 6;
            this.life = 1;
            this.decay = 0.03 + Math.random() * 0.02;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life -= this.decay;
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.life;
            ctx.fillStyle = this.color;
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    const createExplosion = (x, y, color) => {
        for (let i = 0; i < 15; i++) {
            particles.push(new Particle(x, y, color));
        }
    };

    const spawnEnemy = () => {
        const side = Math.floor(Math.random() * 4);
        let x, y;
        switch(side) {
            case 0: x = -30; y = Math.random() * canvas.height; break;
            case 1: x = canvas.width + 30; y = Math.random() * canvas.height; break;
            case 2: x = Math.random() * canvas.width; y = -30; break;
            case 3: x = Math.random() * canvas.width; y = canvas.height + 30; break;
        }
        
        const types = ['#ff0066', '#ff6600', '#ffcc00'];
        enemies.push({
            x, y,
            size: 15 + Math.random() * 10,
            speed: 1 + wave * 0.2,
            hp: 2 + Math.floor(wave * 0.5),
            type: types[Math.floor(Math.random() * types.length)]
        });
    };

    const updateGame = () => {
        if (!gameActive) return;

        ctx.fillStyle = 'rgba(5, 11, 20, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (keys['KeyW'] || keys['ArrowUp']) player.y = Math.max(player.size, player.y - player.speed);
        if (keys['KeyS'] || keys['ArrowDown']) player.y = Math.min(canvas.height - player.size, player.y + player.speed);
        if (keys['KeyA'] || keys['ArrowLeft']) player.x = Math.max(player.size, player.x - player.speed);
        if (keys['KeyD'] || keys['ArrowRight']) player.x = Math.min(canvas.width - player.size, player.x + player.speed);

        drawPlayer();

        enemySpawnTimer++;
        if (enemySpawnTimer >= spawnRate) {
            spawnEnemy();
            enemySpawnTimer = 0;
        }

        enemies = enemies.filter(enemy => {
            const dx = player.x - enemy.x;
            const dy = player.y - enemy.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist > 0) {
                enemy.x += (dx / dist) * enemy.speed;
                enemy.y += (dy / dist) * enemy.speed;
            }
            
            if (dist < player.size + enemy.size) {
                player.hp -= 10;
                hpEl.innerText = Math.max(0, player.hp);
                
                if (player.hp <= 0) {
                    gameActive = false;
                    finalKillsEl.innerText = kills;
                    overlay.classList.remove('hidden');
                }
            }
            
            drawEnemy(enemy);
            return true;
        });

        bullets = bullets.filter(bullet => {
            bullet.x += bullet.vx;
            bullet.y += bullet.vy;
            
            for (let i = enemies.length - 1; i >= 0; i--) {
                const enemy = enemies[i];
                const dx = bullet.x - enemy.x;
                const dy = bullet.y - enemy.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < enemy.size) {
                    enemy.hp--;
                    createExplosion(bullet.x, bullet.y, '#ffffff');
                    if (enemy.hp <= 0) {
                        createExplosion(enemy.x, enemy.y, enemy.type);
                        enemies.splice(i, 1);
                        kills++;
                        killsEl.innerText = kills;
                        
                        if (kills % 5 === 0) {
                            wave++;
                            waveEl.innerText = wave;
                            spawnRate = Math.max(30, 90 - wave * 5);
                        }
                    }
                    return false;
                }
            }
            
            if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
                return false;
            }
            
            drawBullet(bullet);
            return true;
        });

        particles = particles.filter(p => {
            p.update();
            p.draw();
            return p.life > 0;
        });

        requestAnimationFrame(updateGame);
    };

    const startGame = () => {
        gameActive = true;
        player = { x: canvas.width / 2, y: canvas.height / 2, hp: 100, speed: 4, size: 30 };
        enemies = [];
        bullets = [];
        particles = [];
        kills = 0;
        wave = 1;
        enemySpawnTimer = 0;
        spawnRate = 90;
        hpEl.innerText = '100';
        killsEl.innerText = '0';
        waveEl.innerText = '1';
        overlay.classList.add('hidden');
        updateGame();
    };

    window.addEventListener('keydown', (e) => keys[e.code] = true);
    window.addEventListener('keyup', (e) => keys[e.code] = false);

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('click', (e) => {
        if (!gameActive) return;
        const dx = mouse.x - player.x;
        const dy = mouse.y - player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        bullets.push({
            x: player.x, y: player.y,
            vx: (dx / dist) * 10,
            vy: (dy / dist) * 10
        });
    });

    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);

    window.addEventListener('resize', resize);
    resize();
}

// --- 9. Crystal Tetris Game ---
function initTetris() {
    const canvas = document.getElementById('tetrisCanvas');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('startTetrisBtn');
    const restartBtn = document.getElementById('restartTetrisBtn');
    const scoreEl = document.getElementById('tetrisScore');
    const linesEl = document.getElementById('tetrisLines');
    const levelEl = document.getElementById('tetrisLevel');
    const overlay = document.getElementById('tetrisOverlay');
    const finalScoreEl = document.getElementById('finalTetrisScore');

    let gameActive = false;
    let score = 0;
    let lines = 0;
    let level = 1;
    let grid = [];
    let currentPiece = null;
    let frameCount = 0;
    let animationId = null;
    const COLS = 10;
    const ROWS = 20;
    const BLOCK_SIZE = 25;
    const TARGET_FPS = 120;
    const FRAME_INTERVAL = 1000 / TARGET_FPS;
    let lastTime = 0;

    const COLORS = ['#ff0066', '#ff6600', '#ffcc00', '#00ff66', '#00f2ff', '#7000ff', '#ff00ff'];
    const SHAPES = [
        [[1, 1, 1, 1]],
        [[1, 1, 1], [1]],
        [[1, 1], [1, 1]],
        [[0, 1, 0], [1, 1, 1]],
        [[1, 0, 0], [1, 1, 1]],
        [[0, 1, 1], [1, 1, 0]],
        [[0, 1, 1, 1], [1, 0, 0, 0]]
    ];

    const getDropSpeed = () => {
        const framesPerDrop = Math.max(2, 120 - (level - 1) * 10);
        return framesPerDrop;
    };

    const resize = () => {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
    };

    const createGrid = () => {
        grid = [];
        for (let r = 0; r < ROWS; r++) {
            grid[r] = [];
            for (let c = 0; c < COLS; c++) {
                grid[r][c] = 0;
            }
        }
    };

    const createPiece = () => {
        const shapeIdx = Math.floor(Math.random() * SHAPES.length);
        const color = COLORS[shapeIdx];
        currentPiece = {
            shape: SHAPES[shapeIdx],
            color: color,
            x: Math.floor(COLS / 2) - 1,
            y: 0
        };
    };

    const drawBlock = (x, y, color) => {
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 5;
        ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
    };

    const drawGrid = () => {
        ctx.fillStyle = 'rgba(5, 11, 20, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (grid[r][c]) {
                    drawBlock(c, r, grid[r][c]);
                }
            }
        }
    };

    const drawPiece = () => {
        if (!currentPiece) return;
        currentPiece.shape.forEach((row, r) => {
            row.forEach((value, c) => {
                if (value) {
                    drawBlock(currentPiece.x + c, currentPiece.y + r, currentPiece.color);
                }
            });
        });
    };

    const isValidMove = (piece, offsetX, offsetY) => {
        return piece.shape.every((row, r) => {
            return row.every((value, c) => {
                if (!value) return true;
                const newX = piece.x + c + offsetX;
                const newY = piece.y + r + offsetY;
                return newX >= 0 && newX < COLS && newY < ROWS && newY >= 0 && !grid[newY][newX];
            });
        });
    };

    const lockPiece = () => {
        currentPiece.shape.forEach((row, r) => {
            row.forEach((value, c) => {
                if (value) {
                    grid[currentPiece.y + r][currentPiece.x + c] = currentPiece.color;
                }
            });
        });
        
        clearLines();
        createPiece();
        
        if (!isValidMove(currentPiece, 0, 0)) {
            gameOver();
        }
    };

    const clearLines = () => {
        let linesCleared = 0;
        for (let r = ROWS - 1; r >= 0; r--) {
            if (grid[r].every(cell => cell !== 0)) {
                grid.splice(r, 1);
                grid.unshift(Array(COLS).fill(0));
                linesCleared++;
            }
        }
        
        if (linesCleared > 0) {
            lines += linesCleared;
            score += linesCleared * 100 * linesCleared;
            level = Math.floor(lines / 10) + 1;
            scoreEl.innerText = score;
            linesEl.innerText = lines;
            levelEl.innerText = level;
        }
    };

    const updateGame = (timestamp) => {
        if (!gameActive) return;

        const deltaTime = timestamp - lastTime;
        
        if (deltaTime >= FRAME_INTERVAL) {
            lastTime = timestamp;
            frameCount++;
            
            const dropSpeed = getDropSpeed();
            if (frameCount % dropSpeed === 0) {
                if (isValidMove(currentPiece, 0, 1)) {
                    currentPiece.y++;
                } else {
                    lockPiece();
                }
            }
        }

        draw();
        animationId = requestAnimationFrame(updateGame);
    };

    const draw = () => {
        drawGrid();
        drawPiece();
    };

    const startGame = () => {
        gameActive = true;
        score = 0;
        lines = 0;
        level = 1;
        frameCount = 0;
        lastTime = performance.now();
        createGrid();
        createPiece();
        scoreEl.innerText = '0';
        linesEl.innerText = '0';
        levelEl.innerText = '1';
        overlay.classList.add('hidden');
        
        if (animationId) cancelAnimationFrame(animationId);
        animationId = requestAnimationFrame(updateGame);
    };

    const gameOver = () => {
        gameActive = false;
        if (animationId) cancelAnimationFrame(animationId);
        finalScoreEl.innerText = score;
        overlay.classList.remove('hidden');
    };

    window.addEventListener('keydown', (e) => {
        if (!gameActive || !currentPiece) return;
        
        switch(e.code) {
            case 'ArrowLeft':
                if (isValidMove(currentPiece, -1, 0)) currentPiece.x--;
                break;
            case 'ArrowRight':
                if (isValidMove(currentPiece, 1, 0)) currentPiece.x++;
                break;
            case 'ArrowDown':
                if (isValidMove(currentPiece, 0, 1)) {
                    currentPiece.y++;
                    score += 1;
                    scoreEl.innerText = score;
                    if (!isValidMove(currentPiece, 0, 1)) {
                        lockPiece();
                    }
                }
                break;
            case 'ArrowUp':
                const rotated = currentPiece.shape[0].map((_, i) => currentPiece.shape.map(row => row[i]).reverse());
                if (isValidMove({ ...currentPiece, shape: rotated }, 0, 0)) {
                    currentPiece.shape = rotated;
                }
                break;
            case 'Space':
                while (isValidMove(currentPiece, 0, 1)) {
                    currentPiece.y++;
                    score += 2;
                }
                scoreEl.innerText = score;
                lockPiece();
                break;
        }
        
        draw();
    });

    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);

    window.addEventListener('resize', resize);
    resize();
}

// --- 10. Aurora Jumper Platformer Game ---
function initPlatformer() {
    const canvas = document.getElementById('platformerCanvas');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('startPlatformerBtn');
    const restartBtn = document.getElementById('restartPlatformerBtn');
    const coinsEl = document.getElementById('coinsVal');
    const timeEl = document.getElementById('platformerTime');
    const overlay = document.getElementById('platformerOverlay');
    const finalCoinsEl = document.getElementById('finalCoins');
    const finalTimeEl = document.getElementById('finalPlatformerTime');

    let gameActive = false;
    let player = { x: 50, y: 300, vx: 0, vy: 0, onGround: false, size: 25 };
    let platforms = [];
    let coins = [];
    let collected = 0;
    let gameTime = 0;
    let timerInterval = null;
    let gravity = 0.5;
    let jumpForce = -12;
    const keys = {};

    const resize = () => {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
    };

    const generateLevel = () => {
        platforms = [];
        coins = [];
        
        const platformCount = 8 + Math.floor(Math.random() * 5);
        const jumpHeight = Math.abs(jumpForce * jumpForce / (2 * gravity));
        const maxReachableY = jumpHeight * 0.9;
        
        let prevX = 50;
        let prevY = canvas.height - 80;
        
        for (let i = 0; i < platformCount; i++) {
            let x, y;
            
            if (i === 0) {
                x = 30;
                y = canvas.height - 80;
            } else if (i === platformCount - 1) {
                x = canvas.width - 130;
                y = prevY - maxReachableY + Math.random() * 20;
            } else {
                const minDeltaX = 40;
                const maxDeltaX = canvas.width / platformCount - 20;
                x = prevX + minDeltaX + Math.random() * maxDeltaX;
                x = Math.max(50, Math.min(canvas.width - 130, x));
                
                const direction = Math.random() > 0.5 ? 1 : -1;
                y = prevY - (maxReachableY * 0.4 + Math.random() * (maxReachableY * 0.5)) * direction;
                y = Math.max(80, Math.min(canvas.height - 80, y));
            }
            
            const width = 100 + Math.random() * 40;
            platforms.push({ x, y, width: Math.floor(width), height: 15, type: i === platformCount - 1 ? 'goal' : 'normal' });
            
            if (i < platformCount - 1 && Math.random() > 0.2) {
                coins.push({
                    x: x + width / 2,
                    y: y - 30,
                    size: 12,
                    collected: false
                });
            }
            
            prevX = x;
            prevY = y;
        }
        
        player.x = platforms[0].x + platforms[0].width / 2;
        player.y = platforms[0].y - player.size;
        player.vx = 0;
        player.vy = 0;
    };

    const drawPlayer = () => {
        ctx.save();
        
        ctx.fillStyle = '#00ff00';
        ctx.shadowColor = '#00ff00';
        ctx.shadowBlur = 15;
        
        ctx.beginPath();
        ctx.roundRect(player.x - player.size / 2, player.y - player.size, player.size, player.size, 5);
        ctx.fill();
        
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(player.x + 3, player.y - player.size + 8, 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    };

    const drawPlatform = (platform) => {
        ctx.fillStyle = platform.type === 'goal' ? '#00ff66' : '#0099cc';
        ctx.shadowColor = platform.type === 'goal' ? '#00ff00' : '#00f2ff';
        ctx.shadowBlur = 10;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        
        if (platform.type === 'goal') {
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Orbitron';
            ctx.fillText('GOAL', platform.x + platform.width / 2 - 20, platform.y + 12);
        }
    };

    const drawCoin = (coin) => {
        if (coin.collected) return;
        
        ctx.save();
        const pulse = Math.sin(Date.now() * 0.01) * 0.2 + 1;
        ctx.translate(coin.x, coin.y);
        ctx.scale(pulse, pulse);
        
        ctx.fillStyle = '#ffcc00';
        ctx.shadowColor = '#ffcc00';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(0, 0, coin.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, coin.size / 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    };

    const updateGame = () => {
        if (!gameActive) return;

        ctx.fillStyle = 'rgba(5, 11, 20, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (keys['KeyA'] || keys['ArrowLeft']) player.vx = -5;
        else if (keys['KeyD'] || keys['ArrowRight']) player.vx = 5;
        else player.vx *= 0.8;

        if ((keys['Space'] || keys['ArrowUp']) && player.onGround) {
            player.vy = jumpForce;
            player.onGround = false;
        }

        player.vy += gravity;
        player.x += player.vx;
        player.y += player.vy;

        player.onGround = false;
        platforms.forEach(platform => {
            if (player.x + player.size / 2 > platform.x &&
                player.x - player.size / 2 < platform.x + platform.width &&
                player.y >= platform.y &&
                player.y <= platform.y + platform.height + player.vy + 5) {
                if (player.vy > 0) {
                    player.y = platform.y;
                    player.vy = 0;
                    player.onGround = true;
                }
                
                if (platform.type === 'goal') {
                    gameActive = false;
                    clearInterval(timerInterval);
                    finalCoinsEl.innerText = collected;
                    finalTimeEl.innerText = timeEl.innerText;
                    overlay.classList.remove('hidden');
                }
            }
        });

        player.x = Math.max(player.size / 2, Math.min(canvas.width - player.size / 2, player.x));
        player.y = Math.min(canvas.height, player.y);

        coins.forEach(coin => {
            if (coin.collected) return;
            
            const dx = player.x - coin.x;
            const dy = player.y - coin.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < player.size + coin.size) {
                coin.collected = true;
                collected++;
                coinsEl.innerText = collected;
            }
            
            drawCoin(coin);
        });

        platforms.forEach(drawPlatform);
        drawPlayer();

        if (player.y > canvas.height + 50) {
            player.x = platforms[0].x + platforms[0].width / 2;
            player.y = platforms[0].y - player.size;
            player.vx = 0;
            player.vy = 0;
            collected = Math.max(0, collected - 1);
            coinsEl.innerText = collected;
        }

        requestAnimationFrame(updateGame);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const startTimer = () => {
        gameTime = 0;
        timerInterval = setInterval(() => {
            gameTime++;
            timeEl.innerText = formatTime(gameTime);
        }, 1000);
    };

    const startGame = () => {
        gameActive = true;
        collected = 0;
        if (timerInterval) clearInterval(timerInterval);
        generateLevel();
        coinsEl.innerText = '0';
        timeEl.innerText = '0:00';
        overlay.classList.add('hidden');
        startTimer();
        updateGame();
    };

    window.addEventListener('keydown', (e) => keys[e.code] = true);
    window.addEventListener('keyup', (e) => keys[e.code] = false);

    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);

    window.addEventListener('resize', resize);
    resize();
}

// Export/Import Messages
window.exportMessages = () => {
    const messages = JSON.parse(localStorage.getItem('trae_messages') || '[]');
    const dataStr = JSON.stringify(messages, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trae_messages_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
};

window.importMessages = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (Array.isArray(data)) {
                localStorage.setItem('trae_messages', JSON.stringify(data));
                location.reload();
            }
        } catch (err) {
            alert('Invalid file format');
        }
    };
    reader.readAsText(file);
};
