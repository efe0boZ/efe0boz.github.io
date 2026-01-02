// Canvas ve context ayarları
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Oyun değişkenleri
const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameLoop;
let isPaused = false;
let gameStarted = false;

// DOM elementleri
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const finalScoreElement = document.getElementById('finalScore');
const gameOverElement = document.getElementById('gameOver');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');

// Yüksek skoru göster
highScoreElement.textContent = highScore;

// Rastgele yiyecek konumu oluştur
function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
    
    // Yiyecek yılanın üzerinde olmasın
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            generateFood();
            return;
        }
    }
}

// Yılanı çiz
function drawSnake() {
    snake.forEach((segment, index) => {
        // Gradient renk efekti
        const gradient = ctx.createLinearGradient(
            segment.x * gridSize, 
            segment.y * gridSize,
            segment.x * gridSize + gridSize, 
            segment.y * gridSize + gridSize
        );
        
        if (index === 0) {
            // Baş daha parlak
            gradient.addColorStop(0, '#4facfe');
            gradient.addColorStop(1, '#00f2fe');
        } else {
            gradient.addColorStop(0, '#667eea');
            gradient.addColorStop(1, '#764ba2');
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(
            segment.x * gridSize + 1, 
            segment.y * gridSize + 1, 
            gridSize - 2, 
            gridSize - 2
        );
        
        // Baş için göz ekle
        if (index === 0) {
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(
                segment.x * gridSize + 6, 
                segment.y * gridSize + 6, 
                2, 
                0, 
                Math.PI * 2
            );
            ctx.arc(
                segment.x * gridSize + 14, 
                segment.y * gridSize + 6, 
                2, 
                0, 
                Math.PI * 2
            );
            ctx.fill();
        }
    });
}

// Yiyecek çiz
function drawFood() {
    const gradient = ctx.createRadialGradient(
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        0,
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        gridSize / 2
    );
    gradient.addColorStop(0, '#ff6b6b');
    gradient.addColorStop(1, '#ee5a24');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        gridSize / 2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

// Grid çiz
function drawGrid() {
    ctx.strokeStyle = '#2d2d2d';
    ctx.lineWidth = 0.5;
    
    for (let i = 0; i <= tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }
}

// Yılanı hareket ettir
function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    
    // Yeni baş ekle
    snake.unshift(head);
    
    // Yiyecek yendi mi kontrol et
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();
        
        // Yüksek skor güncelle
        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
            localStorage.setItem('snakeHighScore', highScore);
        }
    } else {
        // Yiyecek yenmemişse kuyruğu kaldır
        snake.pop();
    }
}

// Çarpışma kontrolleri
function checkCollision() {
    const head = snake[0];
    
    // Duvara çarpma
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }
    
    // Kendine çarpma
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    
    return false;
}

// Oyun döngüsü
function update() {
    if (isPaused) return;
    
    // Hareket varsa
    if (dx !== 0 || dy !== 0) {
        moveSnake();
        
        if (checkCollision()) {
            endGame();
            return;
        }
    }
    
    // Çiz
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawGrid();
    drawFood();
    drawSnake();
}

// Oyunu bitir
function endGame() {
    clearInterval(gameLoop);
    gameStarted = false;
    finalScoreElement.textContent = score;
    gameOverElement.classList.remove('hidden');
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

// Oyunu başlat
function startGame() {
    if (gameStarted) return;
    
    // Oyun durumunu sıfırla
    snake = [{ x: 10, y: 10 }];
    dx = 0;
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
    isPaused = false;
    gameStarted = true;
    
    gameOverElement.classList.add('hidden');
    generateFood();
    
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    
    clearInterval(gameLoop);
    gameLoop = setInterval(update, 100);
}

// Oyunu duraklat/devam ettir
function togglePause() {
    if (!gameStarted) return;
    
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? 'Devam' : 'Duraklat';
}

// Klavye kontrolleri
document.addEventListener('keydown', (e) => {
    // Oyun başlamamışsa başlat
    if (!gameStarted && (e.key.startsWith('Arrow') || e.key === ' ')) {
        startGame();
        e.preventDefault();
    }
    
    switch (e.key) {
        case 'ArrowUp':
            if (dy === 0) {
                dx = 0;
                dy = -1;
            }
            e.preventDefault();
            break;
        case 'ArrowDown':
            if (dy === 0) {
                dx = 0;
                dy = 1;
            }
            e.preventDefault();
            break;
        case 'ArrowLeft':
            if (dx === 0) {
                dx = -1;
                dy = 0;
            }
            e.preventDefault();
            break;
        case 'ArrowRight':
            if (dx === 0) {
                dx = 1;
                dy = 0;
            }
            e.preventDefault();
            break;
        case ' ':
            togglePause();
            e.preventDefault();
            break;
    }
});

// Buton olayları
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);
restartBtn.addEventListener('click', startGame);

// İlk çizim
ctx.fillStyle = '#1a1a1a';
ctx.fillRect(0, 0, canvas.width, canvas.height);
drawGrid();
drawFood();
drawSnake();

// Başlangıç durumu
pauseBtn.disabled = true;
