const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('high-score');
const overlay = document.getElementById('overlay');

const gridSize = 20;
const tileCount = 20;
canvas.width = gridSize * tileCount;
canvas.height = gridSize * tileCount;

let snake = [];
let food = {};
let dx = 0;
let dy = 0;
let nextDx = 0;
let nextDy = 0;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameLoop = null;
let isPlaying = false;

highScoreEl.innerText = highScore;

function init() {
    snake = [{x: 10, y: 10}, {x: 9, y: 10}, {x: 8, y: 10}];
    dx = 0; // На старте стоим
    dy = 0;
    nextDx = 0;
    nextDy = 0;
    score = 0;
    scoreEl.innerText = score;
    spawnFood();
    draw();
}

function spawnFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    for (let part of snake) {
        if (part.x === food.x && part.y === food.y) return spawnFood();
    }
}

function draw() {
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    snake.forEach((part, index) => {
        const isHead = index === 0;
        const x = part.x * gridSize;
        const y = part.y * gridSize;
        
        ctx.fillStyle = isHead ? '#00ff88' : '#00cc66';
        ctx.shadowBlur = isHead ? 20 : 5;
        ctx.shadowColor = '#00ff88';
        
        const padding = 2;
        const r = 6;
        ctx.beginPath();
        ctx.roundRect(x + padding, y + padding, gridSize - padding*2, gridSize - padding*2, r);
        ctx.fill();
        ctx.shadowBlur = 0;
    });

    const pulse = Math.sin(Date.now() / 200) * 2;
    ctx.fillStyle = '#ff3366';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ff3366';
    ctx.beginPath();
    ctx.arc(food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2, (gridSize / 2 - 2) + pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

function update() {
    // Если стоим (dx=0, dy=0), но есть нажатая кнопка (nextDx/nextDy), начинаем движение
    if (dx === 0 && dy === 0 && (nextDx !== 0 || nextDy !== 0)) {
        dx = nextDx;
        dy = nextDy;
    } 
    // Если уже двигаемся, применяем буфер следующего направления
    else if (nextDx !== 0 || nextDy !== 0) {
        // Проверка, чтобы не развернуться на 180
        if (!(nextDx === -dx && nextDy === -dy)) {
            dx = nextDx;
            dy = nextDy;
        }
    }

    // Если до сих пор стоим — ничего не делаем
    if (dx === 0 && dy === 0) return;

    const head = {x: snake[0].x + dx, y: snake[0].y + dy};

    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return gameOver();
    }

    for (let part of snake) {
        if (head.x === part.x && head.y === part.y) return gameOver();
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreEl.innerText = score;
        spawnFood();
    } else {
        snake.pop();
    }

    draw();
}

function gameOver() {
    isPlaying = false;
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = null;
    
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        highScoreEl.innerText = highScore;
    }

    overlay.querySelector('h2').innerText = 'GAME OVER';
    overlay.querySelector('p').innerText = `Счёт: ${score}`;
    overlay.querySelector('button').innerText = 'ИГРАТЬ СНОВА';
    overlay.classList.add('active');
}

function startGame() {
    overlay.classList.remove('active');
    init();
    isPlaying = true;
    
    document.activeElement.blur();
    
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(() => {
        if (isPlaying) update();
    }, 100); 
    
    draw();
}

// Управление WASD — записываем в буфер (nextDx, nextDy), не меняя сразу
document.addEventListener('keydown', (e) => {
    if (!isPlaying) return;
    
    if (e.code === 'KeyW') { nextDx = 0; nextDy = -1; }
    if (e.code === 'KeyS') { nextDx = 0; nextDy = 1; }
    if (e.code === 'KeyA') { nextDx = -1; nextDy = 0; }
    if (e.code === 'KeyD') { nextDx = 1; nextDy = 0; }
    
    if (['KeyW','KeyA','KeyS','KeyD'].includes(e.code)) {
        e.preventDefault();
    }
});

// Свайпы
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, {passive: true});

canvas.addEventListener('touchend', (e) => {
    if (!isPlaying) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 30) { nextDx = 1; nextDy = 0; }
        if (diffX < -30) { nextDx = -1; nextDy = 0; }
    } else {
        if (diffY > 30) { nextDx = 0; nextDy = 1; }
        if (diffY < -30) { nextDx = 0; nextDy = -1; }
    }
}, {passive: true});

function renderLoop() {
    draw();
    requestAnimationFrame(renderLoop);
}

init();
renderLoop();