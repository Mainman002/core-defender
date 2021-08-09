const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
canvas.width = 900;
canvas.height = 600;

let gameState = "MainMenu";
const customFont = 'Orbitron'; // Verdana

let enemySpawnRate = 600;
let frame = 0;
const startTPower = 100;
let tPower = startTPower;
let score = 0;
const cellSize = 100;
const cellGap = 3;

const gameGrid = [];
const towers = [];
const enemies = [];
const enemyPositions = [];
const projectiles = [];
const resources = [];
const floatingMessages = [];
const winningScore = 300;

const controlBar = {
    width: canvas.width,
    height:cellSize,
}

// Mouse Variables
const mouse = {
    x: 10,
    y: 10,
    width: 0.1,
    height: 0.1,
}
let clickTimer = 1;
let canClick = false;
let canvasPosition = canvas.getBoundingClientRect();


window.addEventListener('resize', function(){
    canvasPosition = canvas.getBoundingClientRect();
    console.log(canvasPosition);
});


// Mouse Move Event
canvas.addEventListener('mousemove', function(e){
    mouse.x = e.x - canvasPosition.left;
    mouse.y = e.y - canvasPosition.top;
});


// Mouse Leave Event
canvas.addEventListener('mouseleave', function(e){
    mouse.y = undefined;
    mouse.x = undefined;
});


// Mouse Down Event
canvas.addEventListener('mousedown', function(e){
    if (gameState === "MainMenu" || gameState === "GameOver" || gameState === "WonLevel"){
        gameState = "Playing";
        reset();
    }

    const gridPositionX = mouse.x - (mouse.x % cellSize);
    const gridPositionY = mouse.y - (mouse.y % cellSize);
    if (gridPositionY < cellSize) return;
    for (let i = 0; i < towers.length; i++){
        if (towers[i].x === gridPositionX && towers[i].y === gridPositionY){
            floatingMessages.push(new FloatingMessage("Can't Stack", "Red", 'center', mouse.x, gridPositionY+30, 20)); 
        }
        
        if (towers[i].x === gridPositionX && towers[i].y === gridPositionY)
        return;
    }
    let towerCost = 50;
    if (canClick && tPower >= towerCost){
        towers.push(new Tower(gridPositionX, gridPositionY));
        tPower -= towerCost;
    } else {
        floatingMessages.push(new FloatingMessage("Not enough Power", "Red", 'center', mouse.x, gridPositionY+30, 20));
    }
});


// First run function
init();
function init(){
    gameState = "MainMenu";
    mainMenu();
    // update();
}

// Reset Variables
function reset(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    canClick = false;
    clickTimer = 1;
    resources.length = 0;
    towers.length = 0;
    enemies.length = 0;
    enemyPositions.length = 0;
    projectiles.length = 0;
    floatingMessages.length = 0;
    enemySpawnRate = 600;
    frame = 1;
    tPower = startTPower;
    score = 0;
    gameState = "Playing";
    // mainMenu();
    update();
}

// Show Main Menu
function mainMenu(){
    floatingMessages.length = 0;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.textAlign = 'center';
    ctx.fillStyle = 'Gold';
    ctx.font = `70px ${customFont}`;
    ctx.fillText("Main Menu", canvas.width/2, canvas.height/2-40);

    ctx.font = `30px ${customFont}`;
    ctx.fillText("Click Mouse To Play", canvas.width/2, canvas.height/2+40);
}

// Show Game Over
function gameOver(){
    floatingMessages.length = 0;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.textAlign = 'center';
    ctx.fillStyle = 'Gold';
    ctx.font = `70px ${customFont}`;
    ctx.fillText("Game Over", canvas.width/2, canvas.height/2-40);

    ctx.font = `30px ${customFont}`;
    ctx.fillText("Click Mouse To Try Again", canvas.width/2, canvas.height/2+40);
}


// Show Won Level
function wonLevel(){
    floatingMessages.length = 0;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.textAlign = 'center';
    ctx.fillStyle = 'Gold';
    ctx.font = `70px ${customFont}`;
    ctx.fillText("!You Survived!", canvas.width/2, canvas.height/2-40);

    ctx.font = `30px ${customFont}`;
    ctx.fillText("Click Mouse To Play Again", canvas.width/2, canvas.height/2+40);
}


// grid Cell class
class Cell {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.width = cellSize;
        this.height = cellSize;
    }
    // Cell draw function
    draw(){
        if (mouse.x && mouse.y && collision(this,mouse)){
            ctx.strokeStyle = 'Gold';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}


// create grid cells
function createGrid(){
    for (let y = cellSize; y < canvas.height; y += cellSize){
        for (let x = 0; x < canvas.width; x += cellSize){
            gameGrid.push(new Cell(x, y));
        }
    }
}
createGrid();


// Cycle through grid array
function handleGameGrid(){
    for (let i = 0; i < gameGrid.length; i++){
        gameGrid[i].draw();
    }
}


// Projectile class
class Projectile {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 10;
        this.dmg = 20;
        this.speed = 5;
    }

    // Projectile update function
    update(){
        this.x += this.speed;
    }

    // Projectile draw function
    draw(){
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
        ctx.fill();
    }
}


// create Projectile Projectiles
function handleProjectiles(){
    for (let i = 0; i < projectiles.length; i++){
        projectiles[i].update();
        projectiles[i].draw();


        for (let j = 0; j < enemies.length; j++){
            if (enemies[j] && projectiles[i] && collision(enemies[j], projectiles[i])){
                enemies[j].health -= projectiles[i].dmg;
                projectiles.splice(i, 1);
                i--;
            }
        }


        if (projectiles[i] && projectiles[i].x > canvas.width - cellSize){
            projectiles.splice(i, 1);
            i--;
        }
    }
}


// Tower class
class Tower {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.width = cellSize - cellGap * 2;
        this.height = cellSize - cellGap * 2;
        this.shooting = false;
        this.image = new Image();
        this.image.src = 'src/Images/Tower_01.png';
        this.health = 100;
        this.timer = 0;
    }

    // Tower update function
    update(){
        if(this.shooting){
            this.timer++;
            if (this.timer % 100 === 0){
                projectiles.push(new Projectile(this.x+this.width-10, this.y+30));
            }
        } else {
            this.timer = 0;
        }
    }

    // Tower draw function
    draw(){
        // ctx.fillStyle = 'blue';
        // ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x, this.y, cellSize, cellSize);
        // ctx.drawImage(this.x, this.y, cellSize, cellSize);

        ctx.textAlign = 'center';
        ctx.fillStyle = 'Gold';
        ctx.font = `25px ${customFont}`;
        ctx.fillText(Math.floor(this.health), this.x+this.width/2, this.y+this.height);
    }
}


// create Tower towers
function handleTowers(){
    for (let i = 0; i < towers.length; i++){
        towers[i].update();
        towers[i].draw();
        if (enemyPositions.indexOf(towers[i].y) !== -1){
            towers[i].shooting = true;
        } else {
            towers[i].shooting = false;
        }

        for (let j = 0; j < enemies.length; j ++){
            if (towers[i] && enemies[j] && collision(towers[i], enemies[j])){
               enemies[j].movement = 0; 
               towers[i].health -= 1; 
            }
            if (towers[i] && towers[i].health <= 0){
                towers.splice(i, 1);
                i--;
                enemies[j].movement = enemies[j].speed;
            }
        }
    }
}


// Floating Messages
class FloatingMessage {
    constructor(text, color, align, x, y, size){
        this.text = text;
        this.color = color;
        this.align = align;
        this.x = x;
        this.y = y;
        this.size = size;
        this.lifeSpan = 0;
        this.opacity = 1;
    }

    // Floating Messages update funtion
    update(){
        this.y -= 0.3;
        this.lifeSpan += 1;
        console.log(this.lifeSpan);
        if (this.opacity > 0.01) this.opacity -= 0.01;
    }

    // Floating Messages draw funtion
    draw(){
        ctx.globalAlpha = this.opacity;
        // ctx.fillStyle = this.color;
        // ctx.font = `25px ${customFont}`;
        // ctx.fillText(this.text, this.x, this.y);

        ctx.textAlign = this.align;
        ctx.fillStyle = this.color;
        ctx.font = `${this.size}px ${customFont}`;
        ctx.fillText(this.text, this.x, this.y);

        ctx.globalAlpha = 1;
    }
}


// Handle Floating Messages draw funtion
function handleFloatingMessages(){
    for (let i = 0; i < floatingMessages.length; i++){
        floatingMessages[i].update();
        floatingMessages[i].draw();
        if (floatingMessages[i] && floatingMessages[i].lifeSpan >= 50){
            floatingMessages.splice(i, 1);
            i--;
        }
    }
}


// Enemy class
class Enemy {
    constructor(verticalPos){
        this.x = canvas.width;
        this.y = verticalPos;
        this.width = cellSize - cellGap * 2;
        this.height = cellSize - cellGap * 2;
        this.speed = Math.random() * 0.2 + 0.4;
        this.movement = this.speed;
        this.health = 100;
        this.maxHealth = this.health;
    }

    // Enemy update function
    update(){
        this.x -= this.movement;
    }

    // Enemy draw function
    draw(){
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.textAlign = 'center';
        ctx.fillStyle = 'Gold';
        ctx.font = `30px ${customFont}`;
        ctx.fillText(Math.floor(this.health), this.x+this.width/2, this.y+30);
    }
}


// Handle Enemies
function handleEnemies(){
    for (let i = 0; i < enemies.length; i++){
        enemies[i].update();
        enemies[i].draw();
        if (enemies[i].x < 0){
            gameState = "GameOver";
            enemies.length = 0;
            towers.length = 0;
            enemyPositions.length = 0;
            projectiles.length = 0;
        }
        if (enemies[i] && enemies[i].health <= 0){
            let gainedPower = enemies[i].maxHealth/10;
            tPower += gainedPower;
            score += gainedPower;
            const findThisIndex = enemyPositions.indexOf(enemies[i].y);
            enemyPositions.splice(findThisIndex, 1);
            enemies.splice(i, 1);
            i--;
        }
    }
    if (frame % enemySpawnRate === 0 && score < winningScore){
        let verticalPos = Math.floor(Math.random() * 5 + 1) * cellSize;
        enemies.push(new Enemy(verticalPos));
        enemyPositions.push(verticalPos);
        if (enemySpawnRate > 120) enemySpawnRate -= 50;
    }
}


// random power spawner
const amounts = [20, 30, 40];
class Resource {
    constructor(){
        this.x = Math.random() * (canvas.width - cellSize);
        this.y = (Math.floor(Math.random() * 5) + 1) * cellSize + 25;
        this.width = cellSize * 0.6;
        this.height = cellSize * 0.6;
        this.amount = amounts[Math.floor(Math.random() * amounts.length)];
    }

    // Resource draw function
    draw(){
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.fillStyle = 'gold';
        ctx.textAlign = 'center';
        ctx.font = `20px ${customFont}`;
        ctx.fillText(this.amount, this.x+this.width/2, this.y+20);
    }
}


// Resource handler
function handleResource(){
    if (frame % 500 === 0 && score < winningScore){
        resources.push(new Resource());
    }
    for (let i = 0; i < resources.length; i++){
        resources[i].draw();
        if (resources[i] && mouse.x && mouse.y && collision(resources[i], mouse)){
            tPower += resources[i].amount;
            score += resources[i].amount;
            resources.splice(i, 1);
            i--;
        }
    }
}


// UI Status
function handleGameStatus(){

    // Tower Power
    ctx.fillStyle = 'gold';
    ctx.textAlign = 'left';
    ctx.font = `30px ${customFont}`;
    ctx.fillText(`${tPower}`, 20, 55);

    // Score
    ctx.textAlign = 'right';
    ctx.font = `30px ${customFont}`;
    ctx.fillText(`${score}`, canvas.width-20, 55);

    if (score >= winningScore && enemies.length <= 0){
        gameState = "WonLevel";
    }

    if (gameState === "GameOver"){
        gameOver();
    }

    if (gameState === "WonLevel"){
        wonLevel();
    }

    if (gameState === "MainMenu"){
        mainMenu();
    }
}


// Update game loop
function update(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,controlBar.width,controlBar.height);
    handleGameGrid();
    handleTowers();
    handleEnemies();
    handleProjectiles();
    handleResource();
    handleGameStatus();
    handleFloatingMessages();
    frame++;
    if (!canClick){
        clickTimer++;
    }
    
    if (gameState === "Playing"){
        if (clickTimer % 100 === 0){
            canClick = true;
        }
        requestAnimationFrame(update);
    }
}


// Grid collision
function collision(first,second){
    if (!(
        first.x > second.x + second.width  ||
        first.x + first.width < second.x   ||
        first.y > second.y + second.height ||
        first.y + first.height < second.y
    )) {
        return true;
    };
};


