// 获取画布和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 设置画布大小
canvas.width = 400;
canvas.height = 600;

// 加载图片
const pigImg = new Image();
pigImg.src = 'pig.png';
const shuttlecockImg = new Image();
shuttlecockImg.src = 'shuttlecock.png';

// 加载音效
const catchSound = new Audio('catch.mp3');
const missSound = new Audio('miss.mp3');
const bgMusic = new Audio('background.mp3');
bgMusic.loop = true;

// 创建猪猪对象
const pig = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 70,
    width: 50,
    height: 50,
    speed: 5
};

// 创建羽毛球对象
const shuttlecock = {
    x: Math.random() * (canvas.width - 20),
    y: 0,
    width: 20,
    height: 30,
    speed: 3
};

// 游戏状态
let gameState = 'start';
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;

// 游戏主循环
function gameLoop() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (gameState === 'playing') {
        // 绘制猪猪
        ctx.drawImage(pigImg, pig.x, pig.y, pig.width, pig.height);
        
        // 绘制羽毛球
        ctx.drawImage(shuttlecockImg, shuttlecock.x, shuttlecock.y, shuttlecock.width, shuttlecock.height);
        
        // 更新羽毛球位置
        shuttlecock.y += shuttlecock.speed;
        
        // 检测碰撞
        if (
            shuttlecock.x < pig.x + pig.width &&
            shuttlecock.x + shuttlecock.width > pig.x &&
            shuttlecock.y + shuttlecock.height > pig.y
        ) {
            // 接住羽毛球
            score++;
            document.getElementById('scoreValue').textContent = score;
            catchSound.play();
            resetShuttlecock();
            increaseSpeed();
            showPraiseMessage(); // 每次得分时显示字幕
        }
        
        // 检查是否漏掉羽毛球
        if (shuttlecock.y > canvas.height) {
            missSound.play();
            gameOver();
        }
    }
    
    // 继续下一帧
    requestAnimationFrame(gameLoop);
}

// 重置羽毛球位置
function resetShuttlecock() {
    shuttlecock.x = Math.random() * (canvas.width - shuttlecock.width);
    shuttlecock.y = 0;
}

// 增加游戏难度
function increaseSpeed() {
    if (score % 5 === 0) {
        shuttlecock.speed += 0.5;
    }
}

// 显示字幕
function showPraiseMessage() {
    const praiseMessage = document.getElementById('praise-message');
    praiseMessage.style.display = 'block';
    setTimeout(() => {
        praiseMessage.style.display = 'none';
    }, 1000); // 1秒后隐藏字幕
}

// 游戏结束
function gameOver() {
    gameState = 'over';
    bgMusic.pause();
    bgMusic.currentTime = 0;
    document.getElementById('final-score').textContent = score;
    document.getElementById('game-over-screen').style.display = 'flex';
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
}

// 重新开始游戏
function restartGame() {
    score = 0;
    document.getElementById('scoreValue').textContent = score;
    shuttlecock.speed = 3;
    resetShuttlecock();
    gameState = 'playing';
    document.getElementById('game-over-screen').style.display = 'none';
    bgMusic.play();
}

// 键盘控制
document.addEventListener('keydown', (e) => {
    if (gameState === 'playing') {
        if (e.key === 'ArrowLeft' && pig.x > 0) {
            pig.x -= pig.speed;
        } else if (e.key === 'ArrowRight' && pig.x < canvas.width - pig.width) {
            pig.x += pig.speed;
        }
    }
});

// 触摸控制
canvas.addEventListener('touchmove', (e) => {
    if (gameState === 'playing') {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const touchX = touch.clientX - rect.left;
        pig.x = touchX - pig.width / 2;
        
        // 确保猪猪不会移出画布
        pig.x = Math.max(0, Math.min(canvas.width - pig.width, pig.x));
    }
}, { passive: false });

// 添加鼠标控制
canvas.addEventListener('mousemove', (e) => {
    if (gameState === 'playing') {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        pig.x = mouseX - pig.width / 2;
        
        // 确保猪猪不会移出画布
        pig.x = Math.max(0, Math.min(canvas.width - pig.width, pig.x));
    }
});

// 开始按钮事件监听
document.getElementById('start-button').addEventListener('click', () => {
    gameState = 'playing';
    document.getElementById('start-screen').style.display = 'none';
    bgMusic.play();
});

// 重新开始按钮事件监听
document.getElementById('restart-button').addEventListener('click', restartGame);

// 开始游戏循环
gameLoop();