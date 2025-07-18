const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const messageEl = document.getElementById('message');

let bird;
let pipes;
let score;
let gameOver;
let highScore = 0;
let started = false;

function reset() {
    bird = { x: 50, y: 150, w: 30, h: 30, velocity: 0, gravity: 0.5, jump: -8 };
    pipes = [];
    score = 0;
    gameOver = false;
    scoreEl.textContent = score;
}

function startGame() {
    reset();
    frames = 0;
    started = true;
    messageEl.style.display = 'none';
    requestAnimationFrame(loop);
}

function spawnPipe() {
    const gap = 100;
    const topHeight = Math.floor(Math.random() * (canvas.height - gap));
    pipes.push({ x: canvas.width, w: 40, top: topHeight, gap: gap });
}

function drawBird() {
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(bird.x, bird.y, bird.w, bird.h);
}

function drawPipes() {
    ctx.fillStyle = '#228B22';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipe.w, pipe.top);
        ctx.fillRect(pipe.x, pipe.top + pipe.gap, pipe.w, canvas.height - pipe.top - pipe.gap);
    });
}

function updatePipes() {
    pipes.forEach(pipe => pipe.x -= 2);
    if (pipes.length && pipes[0].x + pipes[0].w < 0) {
        pipes.shift();
        score++;
        scoreEl.textContent = score;
    }
}

function checkCollision() {
    if (bird.y + bird.h > canvas.height || bird.y < 0) return true;
    return pipes.some(pipe => {
        if (bird.x + bird.w > pipe.x && bird.x < pipe.x + pipe.w) {
            if (bird.y < pipe.top || bird.y + bird.h > pipe.top + pipe.gap) {
                return true;
            }
        }
        return false;
    });
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (frames % 100 === 0) spawnPipe();
    updatePipes();

    drawBird();
    drawPipes();

    if (checkCollision()) {
        gameOver = true;
    }

    frames++;

    if (!gameOver) {
        requestAnimationFrame(loop);
    } else {
        highScore = Math.max(highScore, score);
        messageEl.textContent = `Game Over! Score: ${score} (Best: ${highScore}). Click or press Space to restart`;
        messageEl.style.display = 'block';
        started = false;
    }
}

document.addEventListener('keydown', e => {
    if (e.code === 'Space') {
        bird.velocity = bird.jump;
        if (!started) startGame();
    }
});
canvas.addEventListener('click', () => {
    bird.velocity = bird.jump;
    if (!started) startGame();
});

let frames = 0;
reset();
messageEl.textContent = 'Click or press Space to start';
messageEl.style.display = 'block';
