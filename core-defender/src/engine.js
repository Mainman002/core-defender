const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
canvas.width = 900;
canvas.height = 600;

let gameState = "MainMenu";
const customFont = 'Orbitron'; // Verdana

// Game Image Assets

// Enemies
const enemyImages = new Image();
const enemyTypes = 4;
enemyImages.src = 'src/Images/Enemies.png';

// Towers
const towerImages = new Image();
const towerTypes = 2;
towerImages.src = 'src/Images/Towers.png';
let choosenTower = 1;

// Game Variables
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
    clicked: false,
}
let clickTimer = 1;
let canClick = false;
let canvasPosition = canvas.getBoundingClientRect();


window.addEventListener('resize', function(){
    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;
    canvasPosition = canvas.getBoundingClientRect();
    // ctx.scale(9,6);
    // ctx.setTransform(1, 0, 0, 1, 0, 0);
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
    mouse.clicked = true;

    if (gameState === "MainMenu" || gameState === "GameOver" || gameState === "WonLevel"){
        gameState = "Playing";
        reset();
    }

    const gridPositionX = mouse.x - (mouse.x % cellSize);
    const gridPositionY = mouse.y - (mouse.y % cellSize);
    if (gridPositionY < cellSize) return;
    for (let i = 0; i < towers.length; i++){
        if (towers[i].x === gridPositionX && towers[i].y === gridPositionY){
            floatingMessages.push(new FloatingMessage("Can't Stack", "Red", 'center', mouse.x, gridPositionY+30, 25, 0.02)); 
        }

        if (towers[i].x === gridPositionX && towers[i].y === gridPositionY)
        return;
    }
    let towerCost = 50;
    if (canClick && tPower >= towerCost){
        towers.push(new Tower(gridPositionX, gridPositionY));
        tPower -= towerCost;
    } else {
        if (tPower <= towerCost){
            floatingMessages.push(new FloatingMessage(`Needs Energy ${towerCost - tPower}`, "Red", 'center', mouse.x, gridPositionY+30, 25, 0.02));
        }
    }
});

canvas.addEventListener('mouseup', function(e){
    mouse.clicked = false;
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
    gameGrid.length = 0;
    enemySpawnRate = 600;
    frame = 1;
    tPower = startTPower;
    score = 0;
    gameState = "Playing";
    // mainMenu();
    update();
    createGrid();
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
    ctx.fillText("You Survived", canvas.width/2, canvas.height/2-40);

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
        this.sprite = {'w':256, 'h':256};
        this.image = new Image();
        this.image.src = "src/Images/Floor_Tiles.png";
        this.maxFrame = 6;
        this.frame = Math.floor(Math.random() * this.maxFrame);
    }
    // Cell draw function
    draw(){

        ctx.fillStyle = 'Gold';
        ctx.drawImage(this.image, this.frame*this.sprite.w, 0, this.sprite.w, this.sprite.h, this.x, this.y, this.width, this.height);

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


// Cycle through grid array
function handleGameGrid(){
    for (let i = 0; i < gameGrid.length; i++){
        gameGrid[i].draw();
    }
}


// Projectile class
class Projectile {
    constructor(x, y, type){
        this.x = x;
        this.y = y;
        this.width = 18;
        this.height = 8;
        this.dmg = 20;
        this.speed = 5;
        this.towerType = type;

        if (this.towerType === 1){
            this.dmg = 10;
            this.speed = 5;
        } else if (this.towerType === 2){
            this.dmg = 10;
            this.speed = 5;
        }
    }

    // Projectile update function
    update(){
        this.x += this.speed;
    }

    // Projectile draw function
    draw(){
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
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
                floatingMessages.push(new FloatingMessage(`${enemies[j].health}`, "Red", 'center', enemies[j].x, enemies[j].y+30, 20, 0.03));
                projectiles.splice(i, 1);
                i--;
            }
        }


        if (projectiles[i] && projectiles[i].x > canvas.width - cellSize/2){
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
        this.shootNow = false;
        this.image = towerImages;
        this.image.src = towerImages.src;
        this.towerType = choosenTower;
        this.frame = {'x':0, 'y':this.towerType-1};
        this.frameRange = {'min':0, 'max':0};
        this.fps = 9;
        this.sprite = {'w':256, 'h':256};
        this.health = 100;
        this.resetTime = 0;

        if (this.towerType === 1){
            this.frameRange = {'min':1, 'max':4};
            this.fps = 14;
        } else if (this.towerType === 2){
            this.frameRange = {'min':1, 'max':4};
            this.fps = 10;
        }
    }

    // Tower update function
    update(){
        if (frame % this.fps === 0){
            if (this.frame.x < this.frameRange.max) this.frame.x++;
            else this.frame.x = this.frameRange.min;
            if (this.frame.x === 1) this.shootNow = true;
        }
        if (this.shooting){
            this.frameRange.min = 0;
            this.frameRange.max = 4;
        } else {
            this.frameRange.min = 0;
            this.frameRange.max = 0;
        }

        if (this.shooting && this.shootNow){
            if (this.towerType === 1){
                projectiles.push(new Projectile(this.x+this.width-13, this.y+25, this.towerType));
            } 

            if (this.towerType === 2){
                projectiles.push(new Projectile(this.x+this.width-12, this.y+25, this.towerType));
                projectiles.push(new Projectile(this.x+this.width-13, this.y+45, this.towerType));
            } 
            this.shootNow = false;
        } 
    }

    // Tower draw function
    draw(){
        ctx.fillStyle = 'black';
        // ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.frame.x*this.sprite.w, this.frame.y*this.sprite.h, this.sprite.w, this.sprite.h, this.x, this.y, this.width, this.height);

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
                enemies[j].movement = enemies[j].speed;
                towers.splice(i, 1);
                i--;
            }
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
        this.image = enemyImages;
        this.image.src = enemyImages.src;
        this.enemyType = Math.floor(Math.random() * enemyTypes);
        this.frame = {'x':0, 'y':this.enemyType};
        this.frameRange = {'min':0, 'max':3};
        this.sprite = {'w':256, 'h':256};
    }

    // Enemy update function
    update(){
        this.x -= this.movement;
        if (frame % 10 === 0){
            if (this.frame.x < this.frameRange.max) this.frame.x++;
            else (this.frame.x = this.frameRange.min);
        }
    }

    // Enemy draw function
    draw(){
        ctx.drawImage(this.image, this.frame.x*this.sprite.w, this.frame.y*this.sprite.h, this.sprite.w, this.sprite.h, this.x, this.y, this.width, this.height);
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
            floatingMessages.push(new FloatingMessage(`+${gainedPower}`, "SkyBlue", 'center', enemies[i].x+enemies[i].width/2, enemies[i].y+30, 20, 0.02));
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
            floatingMessages.push(new FloatingMessage(`+${resources[i].amount}`, "SkyBlue", 'center', mouse.x, resources[i].y, 25, 0.02));
            tPower += resources[i].amount;
            score += resources[i].amount;
            resources.splice(i, 1);
            i--;
        }
    }
}


const card1 = {
    x: 15,
    y: 15,
    width: 75,
    height: 85,
    color: 'Teal',
}

const card2 = {
    x: 105,
    y: 15,
    width: 75,
    height: 85,
    color: 'Black',
}

// UI Tower Selector
function chooseTower(){
    if (collision(mouse, card1) && mouse.clicked){
        choosenTower = 1;
    } else if (collision(mouse, card2) && mouse.clicked){
        choosenTower = 2;
    }

    if (choosenTower === 1){
        card1.color = 'Teal';
    } else {
        card1.color = 'Black';
    }

    if (choosenTower === 2){
        card2.color = 'Teal';
    } else {
        card2.color = 'Black';
    }

    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = 'Grey';

    // Card1
    ctx.fillRect(card1.x,card1.y,card1.width,card1.height);
    ctx.fillRect(card2.x,card2.y,card2.width,card2.height);

    ctx.globalAlpha = 1;

    ctx.drawImage(towerImages, 0, 0, 256, 256, card1.x, card1.y, card1.width, card1.height);
    ctx.drawImage(towerImages, 0, 256, 256, 256, card2.x, card2.y, card2.width, card2.height);

    ctx.globalAlpha = 1;
    ctx.strokeStyle = card1.color;
    ctx.strokeRect(card1.x,card1.y,card1.width,card1.height);

    ctx.strokeStyle = card2.color;
    ctx.strokeRect(card2.x,card2.y,card2.width,card2.height);
}


// Floating Messages
class FloatingMessage {
    constructor(text, color, align, x, y, size, fade){
        this.text = text;
        this.color = color;
        this.align = align;
        this.x = x;
        this.y = y;
        this.size = size;
        this.lifeSpan = 0;
        this.opacity = 1;
        this.fade = fade;
    }

    // Floating Messages update funtion
    update(){
        this.y -= 0.3;
        this.lifeSpan += 1;
        if (this.opacity > this.fade) this.opacity -= this.fade;
    }

    // Floating Messages draw funtion
    draw(){
        ctx.globalAlpha = this.opacity;
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


// UI Status
function handleGameStatus(){

    // Tower Power
    ctx.fillStyle = 'gold';
    ctx.textAlign = 'right';
    ctx.font = `30px ${customFont}`;
    ctx.fillText(`Energy_${tPower}`, canvas.width-20, 50);

    // Score
    ctx.textAlign = 'right';
    ctx.font = `30px ${customFont}`;
    ctx.fillText(`Score_${score}`, canvas.width-20, 90);

    if (gameState !== "GameOver" && score >= winningScore && enemies.length <= 0){
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
    chooseTower();
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


