// Paper Toss Minigame Logic

class PaperTossGame {
    constructor(canvasId, onClose, onScore) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.onClose = onClose;
        this.onScore = onScore;
        
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.state = 'idle'; // idle, flying, reset
        this.ball = { x: this.width / 2, y: this.height - 100, radius: 20, vx: 0, vy: 0, z: 1 };
        this.bin = { x: this.width / 2, y: 150, width: 100, height: 120 };
        this.wind = (Math.random() - 0.5) * 10; // Random wind -5 to 5
        
        this.dragStart = null;
        this.score = 0;
        this.bestStreak = 0;
        this.currentStreak = 0;

        // Assets (simple shapes for now, could be images)
        this.images = {}; 
        
        this.loop = this.loop.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);

        this.initListeners();
        requestAnimationFrame(this.loop);
    }

    initListeners() {
        this.canvas.addEventListener('touchstart', this.handleTouchStart, {passive: false});
        this.canvas.addEventListener('touchend', this.handleTouchEnd, {passive: false});
        this.canvas.addEventListener('mousedown', this.handleMouseDown);
        window.addEventListener('mouseup', this.handleMouseUp);
        
        // Resize handler
        window.addEventListener('resize', () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            if (this.state === 'idle') {
                this.resetBall();
                this.bin.x = this.width / 2;
            }
        });
    }

    resetBall() {
        this.ball.x = this.width / 2;
        this.ball.y = this.height - 100;
        this.ball.vx = 0;
        this.ball.vy = 0;
        this.ball.z = 1; // Scale factor (1 = close, 0.5 = far)
        this.state = 'idle';
        this.wind = (Math.random() - 0.5) * 15; // New wind
    }

    handleInputStart(x, y) {
        if (this.state !== 'idle') return;
        this.dragStart = { x, y, time: Date.now() };
    }

    handleInputEnd(x, y) {
        if (!this.dragStart || this.state !== 'idle') return;
        
        const dx = x - this.dragStart.x;
        const dy = y - this.dragStart.y;
        const dt = Date.now() - this.dragStart.time;
        
        // Simple swipe detection
        if (dy < -50 && dt < 500) {
            // Launch!
            const speed = Math.min(Math.abs(dy) / dt * 25, 40); // Cap speed
            this.ball.vy = -speed;
            this.ball.vx = dx / dt * 20;
            this.state = 'flying';
        }
        
        this.dragStart = null;
    }

    handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        this.handleInputStart(touch.clientX, touch.clientY);
    }

    handleTouchEnd(e) {
        e.preventDefault();
        const touch = e.changedTouches[0];
        this.handleInputEnd(touch.clientX, touch.clientY);
    }

    handleMouseDown(e) {
        this.handleInputStart(e.clientX, e.clientY);
    }

    handleMouseUp(e) {
        this.handleInputEnd(e.clientX, e.clientY);
    }

    update() {
        if (this.state === 'flying') {
            // Apply physics
            this.ball.x += this.ball.vx;
            this.ball.y += this.ball.vy;
            
            // Wind effect (stronger as z decreases/ball goes further)
            this.ball.x += this.wind * 0.1;

            // Gravity
            this.ball.vy += 0.8;
            
            // Perspective scaling (fake 3D)
            this.ball.z -= 0.015;

            // Hit detection with bin (at roughly z = 0.5)
            if (this.ball.z <= 0.5 && this.ball.z >= 0.4) {
                // Check collision
                const binLeft = this.bin.x - this.bin.width/2;
                const binRight = this.bin.x + this.bin.width/2;
                const binTop = this.bin.y - 10;
                
                if (this.ball.x > binLeft && this.ball.x < binRight && this.ball.y > binTop) {
                    // Score!
                    this.handleScore();
                }
            }

            // Floor/Miss detection
            if (this.ball.y > this.height || this.ball.z < 0.2) {
                this.handleMiss();
            }
        }
    }

    handleScore() {
        this.state = 'reset';
        this.score++;
        this.currentStreak++;
        if (this.currentStreak > this.bestStreak) this.bestStreak = this.currentStreak;
        if (this.onScore) this.onScore(this.score);
        
        // Visual feedback (pop)
        setTimeout(() => this.resetBall(), 1000);
    }

    handleMiss() {
        this.state = 'reset';
        this.currentStreak = 0;
        setTimeout(() => this.resetBall(), 1000);
    }

    draw() {
        // Clear
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw Office Background (simplified lines)
        this.ctx.strokeStyle = '#333';
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.height * 0.7);
        this.ctx.lineTo(this.width, this.height * 0.7); // Floor line
        this.ctx.stroke();

        // Draw Fan / Wind Indicator
        this.ctx.fillStyle = '#444';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Wind: ${this.wind.toFixed(1)}`, 20, 50);
        this.ctx.beginPath();
        this.ctx.moveTo(this.width/2, 50);
        this.ctx.lineTo(this.width/2 + this.wind * 10, 50);
        this.ctx.strokeStyle = '#00f5ff';
        this.ctx.lineWidth = 4;
        this.ctx.stroke();
        this.ctx.lineWidth = 1;

        // Draw Score
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`${this.score}`, this.width / 2, 80);
        this.ctx.font = '14px Arial';
        this.ctx.fillStyle = '#aaa';
        this.ctx.fillText(`Streak: ${this.currentStreak}`, this.width / 2, 105);

        // Draw Bin
        const binScale = 0.5; // Far away
        const bx = this.bin.x;
        const by = this.bin.y;
        const bw = this.bin.width * binScale;
        const bh = this.bin.height * binScale;
        
        this.ctx.fillStyle = '#888';
        this.ctx.fillRect(bx - bw/2, by, bw, bh);
        this.ctx.fillStyle = '#666'; // Inside
        this.ctx.fillRect(bx - bw/2 + 5, by + 5, bw - 10, 10);

        // Draw Ball
        const b = this.ball;
        const r = b.radius * b.z;
        
        this.ctx.fillStyle = '#fff';
        this.ctx.beginPath();
        this.ctx.arc(b.x, b.y, Math.max(r, 2), 0, Math.PI * 2);
        this.ctx.fill();
        
        // Crumple lines on ball
        this.ctx.strokeStyle = '#ccc';
        this.ctx.beginPath();
        this.ctx.moveTo(b.x - r*0.5, b.y);
        this.ctx.lineTo(b.x + r*0.5, b.y);
        this.ctx.stroke();
    }

    loop() {
        this.update();
        this.draw();
        if (this.state !== 'closed') requestAnimationFrame(this.loop);
    }
    
    close() {
        this.state = 'closed';
        this.canvas.removeEventListener('touchstart', this.handleTouchStart);
        this.canvas.removeEventListener('touchend', this.handleTouchEnd);
        this.canvas.removeEventListener('mousedown', this.handleMouseDown);
        window.removeEventListener('mouseup', this.handleMouseUp);
        // Clean up UI
        this.onClose();
    }
}

window.PaperTossGame = PaperTossGame;
