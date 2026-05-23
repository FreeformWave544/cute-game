const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 648;
canvas.height = 648;

// create a player object (looks like a python dictionary!!)
const player = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 50,
    width: 40,
    height: 40,
    dx: 0
};

// store items to collect
const items = [];
let score = 0;

// draw your player
function drawPlayer() {
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    // draw a cuteee face
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(player.x + 15, player.y + 15, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(player.x + 25, player.y + 15, 3, 0, Math.PI * 2);
    ctx.fill();
}

// draw the items
function drawItems() {
    items.forEach((item, index) => {
        ctx.fillStyle = item.color;
        ctx.beginPath();
        ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
        ctx.fill();
    });
}

// draw your score
function drawScore() {
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

// update the player's position
function updatePlayer() {
    player.x += player.dx;
    player.dx *= 0.9;
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

function updateItems() {
    items.forEach((item, index) => {
        item.y += item.dy;
        if (item.x + item.radius > canvas.width || item.x - item.radius < 0) {
            item.direction *= -1;
        }
        item.x += item.dx * item.direction;
        const closestX = Math.max(player.x, Math.min(item.x, player.x + player.width));
        const closestY = Math.max(player.y, Math.min(item.y, player.y + player.height));

        const distanceX = item.x - closestX;
        const distanceY = item.y - closestY;

        const distanceSquared = distanceX * distanceX + distanceY * distanceY;

        if (distanceSquared < item.radius * item.radius) {
            items.splice(index, 1);
            score += 5;
        }
        
        if (item.y > canvas.height) {
            items.splice(index, 1);
            score -= 2;
        }
    });
}

// create items
function createItem() {
    const item = {
        x: Math.random() * (canvas.width - 20),
        y: -20,
        radius: 10,
        dx: (Math.random() - 0.5) * 20,
        dy: Math.random() * 2 + 1,
        color: `hsl(${Math.random() * 360}, 70%, 75%)`,
        direction: 1
    };
    console.log(Math.random())
    if (Math.random() <= 0.9) {item.dx = Math.random() - 0.5};
    items.push(item);
}

// your main game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    updatePlayer();
    updateItems();
    
    drawPlayer();
    drawItems();
    drawScore();
    
    requestAnimationFrame(gameLoop);
}

let highScore = 0
function drawEndScreen() {
    ctx.fillStyle = "white";
    ctx.font = "48px Arial";
    ctx.fillText("Game Over!", 180, 300);

    ctx.font = "32px Arial";
    ctx.fillText("Final Score: ${score}", 200, 360);
    if (score > highScore){
        ctx.font = "48px Arial";
        ctx.fillText("New High Score!", 200, 400);
        highScore = score;
    }
}

// add some controls
document.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    if (e.key === 'ArrowLeft' && player.dx > -5) player.dx = -5;
    if (e.key === 'ArrowRight' && player.dx < 5) player.dx = 5;
});

let count = 0
const targetCount = 200
const creationLoop = setInterval(() => {
    createItem();
    count += 1;
    if (count >= targetCount) {
        clearInterval(creationLoop);
        drawEndScreen()
    }
}, 1000);

// start the game!
gameLoop();
