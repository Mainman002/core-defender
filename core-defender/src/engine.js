const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// canvas.style.top = `50%+100`;
let canvasPosition = canvas.getBoundingClientRect();

const notifyCanvas = document.getElementById("notifyCanvas");
const notifyCtx = notifyCanvas.getContext('2d');
notifyCanvas.width = window.innerWidth;
notifyCanvas.height = 100;
notifyCanvas.style.top = `${canvasPosition.top}px`;
notifyCanvas.style.left = `${canvasPosition.left}px`;

// Canvas dymensions
let WIDTH = 900;
let HEIGHT = 600;
let CANVAS_WIDTH = 900;
let CANVAS_HEIGHT = 600;

// Cheats
let keylog = "";
let showCheatLog = false;
let showCheatHelp = false;

const cheats = {
    godMode: false,
    slowMotion: false,
    insaneMode: false,
    infinitePower: false,
    highHP: false,
    speedShoot: false,
    powerShoot: false,
    fpsVisible:false,
    graphicSmoothing: false,
    preserveAspect: false,
    gameOver: false,
    instaWin: false,
}

// Graphic sharpness
ctx.mozImageSmoothingEnabled = cheats.graphicSmoothing;
ctx.msImageSmoothingEnabled = cheats.graphicSmoothing;
ctx.imageSmoothingEnabled = cheats.graphicSmoothing;
notifyCtx.mozImageSmoothingEnabled = cheats.graphicSmoothing;
notifyCtx.msImageSmoothingEnabled = cheats.graphicSmoothing;
notifyCtx.imageSmoothingEnabled = cheats.graphicSmoothing;

let gameState = "MainMenu";
const customFont = 'Orbitron'; // Verdana
ctx.font = `70px ${customFont}`;

// Global Variables
globalThis.times = [];
globalThis.fps = 0;

// Game Image Assets

// Enemies
const enemyImage = new Image();
enemyImage.src = 'src/Images/Enemies.png';
const enemyTypes = 4;

// Floor Tiles
const floorImage = new Image();
floorImage.src = "src/Images/Floor_Tiles.png";

// Towers
const towerImage = new Image();
towerImage.src = 'src/Images/Towers.png';
// const towerTypes = 3;

// Cards
const cardImage = new Image();
cardImage.src = 'src/Images/Buttons.png';

let choosenTower = 2;

const cardOffset = 90;

const card0 = {
    x: 15,
    y: 15,
    width: 75,
    height: 85,
    color: 'Black',
    type: 0,
    cost: 0,
    hp: 0,
    dmg: 0,
    speed: 0,
    animSpeed: 0,
}


const card1 = {
    x: card0.x+cardOffset,
    y: 15,
    width: 75,
    height: 85,
    color: 'Teal',
    type: 1,
    cost: 50,
    hp: 100,
    dmg: 0,
    speed: 1,
    animSpeed: 350,
}

const card2 = {
    x: card1.x+cardOffset,
    y: 15,
    width: 75,
    height: 85,
    color: 'Black',
    type: 2,
    cost: 50,
    hp: 300,
    dmg: 10,
    speed: 7,
    animSpeed: 12,
}

const card3 = {
    x: card2.x+cardOffset,
    y: 15,
    width: 75,
    height: 85,
    color: 'Black',
    type: 3,
    cost: 100,
    hp: 500,
    dmg: 10,
    speed: 7,
    animSpeed: 12,
}

const card4 = {
    x: card3.x+cardOffset,
    y: 15,
    width: 75,
    height: 85,
    color: 'Black',
    type: 3,
    cost: "",
    hp: 500,
    dmg: 10,
    speed: 7,
    animSpeed: 12,
}

const card5 = {
    x: card4.x+cardOffset,
    y: 15,
    width: 75,
    height: 85,
    color: 'Black',
    type: 3,
    cost: "",
    hp: 500,
    dmg: 10,
    speed: 7,
    animSpeed: 12,
}

const card6 = {
    x: card5.x+cardOffset,
    y: 15,
    width: 75,
    height: 85,
    color: 'Black',
    type: 3,
    cost: "",
    hp: 500,
    dmg: 10,
    speed: 7,
    animSpeed: 12,
}

// const card7 = {
//     x: card6.x+cardOffset,
//     y: 15,
//     width: 75,
//     height: 85,
//     color: 'Black',
//     type: 3,
//     cost: 100,
//     hp: 500,
//     dmg: 10,
//     speed: 7,
//     animSpeed: 12,
// }

const aTower = {
    type: card2.type,
    cost: card2.cost,
    hp: card2.hp,
    dmg: card2.dmg,
    speed: card2.speed,
    animSpeed: card2.aimSpeed,
}

// Game Variables
let countdown = 3;
let firstSpawn = true;
let spawnEnemies = false;
const resetSpawnTimer = 600;
let enemySpawnRate = resetSpawnTimer;
let enemySpeedOffset = 1;
let enemyHPOffset = 1;
let frame = 0;
const startTPower = 100;
let tPower = startTPower;
let score = 0;
const cellSize = 100;
const cellGap = 3;

const gameGrid = [];
const towers = [];
const cards = [];
const enemies = [];
const enemyPositions = [];
const projectiles = [];
const resources = [];
const tResources = [];
const floatingMessages = [];
const winningScore = 3000;

// Setup Cards Array
cards.push(card0);
cards.push(card1);
cards.push(card2);
cards.push(card3);
cards.push(card4);
cards.push(card5);
cards.push(card6);

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


window.addEventListener('resize', function(){
    CANVAS_HEIGHT = window.innerHeight;
    CANVAS_WIDTH = window.innerWidth;

    if (cheats.preserveAspect){
        let ratio = 16 / 9;
        if (CANVAS_HEIGHT < CANVAS_WIDTH / ratio){
            CANVAS_WIDTH = CANVAS_HEIGHT * ratio;
        } else {
            CANVAS_HEIGHT = CANVAS_WIDTH / ratio;
        }
    }

    canvas.height = HEIGHT;
    canvas.width = WIDTH;
    notifyCanvas.height = canvas.height;
    notifyCanvas.width = canvas.width;

    canvas.style.height = `${CANVAS_HEIGHT}px`;
    canvas.style.width = `${CANVAS_WIDTH}px`;
    notifyCanvas.style.height = `${CANVAS_HEIGHT}px`;
    notifyCanvas.style.width = `${CANVAS_WIDTH}px`;

    canvasPosition = canvas.getBoundingClientRect();

    if (gameState === "Playing"){
        chooseTower();
    } else {
        update();
    }
});


// Extra resize window function
function resizeWindow(){
    CANVAS_HEIGHT = window.innerHeight;
    CANVAS_WIDTH = window.innerWidth;

    if (cheats.preserveAspect){
        let ratio = 16 / 9;
        if (CANVAS_HEIGHT < CANVAS_WIDTH / ratio){
            CANVAS_WIDTH = CANVAS_HEIGHT * ratio;
        } else {
            CANVAS_HEIGHT = CANVAS_WIDTH / ratio;
        }
    }

    canvas.height = HEIGHT;
    canvas.width = WIDTH;
    notifyCanvas.height = canvas.height;
    notifyCanvas.width = canvas.width;

    canvas.style.height = `${CANVAS_HEIGHT}px`;
    canvas.style.width = `${CANVAS_WIDTH}px`;
    notifyCanvas.style.height = `${CANVAS_HEIGHT}px`;
    notifyCanvas.style.width = `${CANVAS_WIDTH}px`;

    canvasPosition = canvas.getBoundingClientRect();

    if (gameState === "Playing"){
        chooseTower();
    } else {
        update();
    }
}


// Mouse Move Event
canvas.addEventListener('mousemove', function(e){
    mouse.x = e.pageX - canvasPosition.left - scrollX;
    mouse.y = e.pageY - canvasPosition.top - scrollY;

    mouse.x /= canvasPosition.width; 
    mouse.y /= canvasPosition.height; 

    mouse.x *= canvas.width;
    mouse.y *= canvas.height;

    if (mouse.y <= canvas.style.top+100){
        mouse.y = undefined;
        if (gameState === "Playing"){
            chooseTower();
        }
    }
});


// Mouse Leave Event
canvas.addEventListener('mouseleave', function(e){
    mouse.y = undefined;
    mouse.x = undefined;
    if (gameState === "Playing"){
        chooseTower();
    }
});


// Mouse Down Event
canvas.addEventListener('mousedown', function(e){
    mouse.clicked = true;
    if (gameState === "Playing"){
        chooseTower();
    }

    if (gameState === "MainMenu" || gameState === "GameOver" || gameState === "WonLevel"){
        gameState = "Playing";
        reset();
        resizeWindow();
    }

    const gridPositionX = mouse.x - (mouse.x % cellSize);
    const gridPositionY = mouse.y - (mouse.y % cellSize);
    const gPos = {'x':gridPositionX, 'y':gridPositionY};
    if (gridPositionY < cellSize) return;
    for (let i = 0; i < towers.length; i++){
        if (towers[i] && towers[i].x === gridPositionX && towers[i].y === gridPositionY){
            if (aTower.type > 0){
                floatingMessages.push(new FloatingMessage("Can't Stack", "Red", 'center', mouse.x, gridPositionY+30, 25, 0.02)); 
            } else {
                floatingMessages.push(new FloatingMessage(`+${Math.floor(towers[i].cost/2)}`, "Teal", 'center', mouse.x, gridPositionY+10, 25, 0.02)); 
                floatingMessages.push(new FloatingMessage("Deleted", "Red", 'center', mouse.x, gridPositionY+40, 25, 0.02)); 
                tPower += towers[i].cost/2;
                towers[i].delete(i);
                i--;
            } 
        }

        if (towers[i] && towers[i].x === gridPositionX && towers[i].y === gridPositionY)
        return;
    }
    if (canClick && aTower.type > 0 && mouse.y >= 100 && tPower >= aTower.cost){
        towers.push(new Tower(gridPositionX, gridPositionY));
        if (!cheats.infinitePower) tPower -= aTower.cost;
        if (cheats.insaneMode) enemySpeedOffset += 0.01;
    } else {
        if (aTower.type > 0 && tPower <= aTower.cost){
            floatingMessages.push(new FloatingMessage(`Needs Energy ${Math.floor(aTower.cost - tPower)}`, "Red", 'center', mouse.x, gridPositionY+30, 25, 0.02));
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
    // uiCtx.clearRect(0, 0, uiCanvas.width, uiCanvas.height);
    canClick = false;
    clickTimer = 1;
    resources.length = 0;
    tResources.length = 0;
    towers.length = 0;
    enemies.length = 0;
    enemyPositions.length = 0;
    projectiles.length = 0;
    floatingMessages.length = 0;
    gameGrid.length = 0;
    enemySpawnRate = resetSpawnTimer;
    spawnEnemies = false;
    firstSpawn = true;
    frame = 1;
    tPower = startTPower;
    score = 0;
    choosenTower = 2;
    chooseTower();
    gameState = "Playing";
    enemySpeedOffset = 1;
    enemyHPOffset = 1;
    // mainMenu();
    update();
    createGrid();
}

// Show Main Menu
function mainMenu(){
    floatingMessages.length = 0;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    notifyCtx.clearRect(0,0,notifyCanvas.width,notifyCanvas.height);
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
    notifyCtx.clearRect(0,0,notifyCanvas.width,notifyCanvas.height);
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
    notifyCtx.clearRect(0,0,notifyCanvas.width,notifyCanvas.height);
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
        this.image = floorImage;
        this.image.src = floorImage.src;
        this.maxFrame = 6;
        this.frame = Math.floor(Math.random() * this.maxFrame);
    }
    // Cell draw function
    draw(){

        ctx.fillStyle = 'Gold';
        ctx.drawImage(this.image, this.frame*this.sprite.w, 0, this.sprite.w, this.sprite.h, this.x, this.y, this.width, this.height);

        if (mouse.x && mouse.y && collision(this,mouse)){
            chooseTower();
            notifyCtx.globalAlpha = 1;
            notifyCtx.strokeStyle = 'Gold';
            notifyCtx.lineWidth = 3;
            notifyCtx.strokeRect(this.x, this.y, this.width, this.height);
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
    constructor(x, y, type, dmg, speed){
        this.x = x;
        this.y = y;
        this.width = 18;
        this.height = 8;
        this.type = type;
        this.dmg = dmg;
        this.speed = speed;
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
                floatingMessages.push(new FloatingMessage(`${Math.floor(enemies[j].health)}`, "Red", 'center', enemies[j].x + Math.random() * 50 + -20, enemies[j].y + 10 + Math.random() * 50 + 20, 20, 0.03));
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
        this.image = towerImage;
        this.image.src = towerImage.src;
        this.towerType = aTower.type;
        this.frame = {'x':0, 'y':this.towerType-1};
        this.frameRange = {'min':0, 'max':0};
        this.fps = aTower.animSpeed;
        this.sprite = {'w':256, 'h':256};
        this.cost = aTower.cost;
        this.health = aTower.hp;
        this.dmg = aTower.dmg;
        this.speed = aTower.speed;
        this.resetTime = 0;

        this.tdmg = this.dmg;
        this.tspeed = this.fps;
        this.thp = this.health;
    }

    // Remove tower
    delete(i){
        towers.splice(i, 1);
    }

    // Tower update function
    update(){
        if (frame % this.fps === 0){
            if (this.frame.x < this.frameRange.max) this.frame.x++;
            else this.frame.x = this.frameRange.min;

            // Tower 1 shoot
            if (this.frame.x === 0 && this.towerType === 1) this.shootNow = true;

            // Towers shoot
            if (this.frame.x === 1 && this.towerType > 1) this.shootNow = true;
        }
        if (this.shooting){
            this.frameRange.min = 0;
            this.frameRange.max = 4;
        } else {
            this.frameRange.min = 0;
            this.frameRange.max = 0;
        }

        if (showCheatLog) {
            if (this.towerType === 1){
                if (cheats.speedShoot) this.fps = 40;
                else this.fps = this.tspeed;

                if (cheats.highHP) this.health = 9001;
                else this.health = this.thp;
            }

            if (this.towerType === 2 || this.towerType === 3){
                if (cheats.powerShoot) this.tdmg = 9001;
                else this.tdmg = this.dmg;

                if (cheats.speedShoot) this.fps = 2;
                else this.fps = this.tspeed;

                if (cheats.highHP) this.health = 9001;
                else this.health = this.thp;
            }
        }

        if (this.shooting && this.shootNow){
            if (this.towerType === 1){
                if (!cheats.insaneMode) {
                    tResources.push(new towerResource(this.x + Math.random() * 50 + 20, this.y + Math.random() * 50 + 20, 25));
                } else {
                    tResources.push(new towerResource(this.x + Math.random() * 50 + 20, this.y + Math.random() * 50 + 20, 100));
                }
            } 

            if (this.towerType === 2){
                projectiles.push(new Projectile(this.x+this.width-13, this.y+25, this.towerType, this.tdmg, this.tspeed));
            } 

            if (this.towerType === 3){
                projectiles.push(new Projectile(this.x+this.width-12, this.y+25, this.towerType, this.tdmg, this.tspeed));
                projectiles.push(new Projectile(this.x+this.width-13, this.y+45, this.towerType, this.tdmg, this.tspeed));
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
        ctx.font = `23px ${customFont}`;
        ctx.fillText(Math.floor(this.health), this.x+this.width/2, this.y+this.height);
    }
}


// create Tower towers
function handleTowers(){
    for (let i = 0; i < towers.length; i++){
        towers[i].update();
        towers[i].draw();

        if (towers[i].towerType === 1){
            towers[i].shooting = true;
        } else{
            if (enemyPositions.indexOf(towers[i].y) !== -1){
                towers[i].shooting = true;
            } else {
                towers[i].shooting = false;
            }
        }
        
        
        for (let j = 0; j < enemies.length; j++){
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

        this.image = enemyImage;
        this.image.src = enemyImage.src;
        this.enemyType = Math.floor(Math.random() * enemyTypes);
        this.frame = {'x':0, 'y':this.enemyType};
        this.frameRange = {'min':0, 'max':3};
        this.sprite = {'w':256, 'h':256};

        if (this.enemyType == 0){
            this.health = 50;
        }

        if (this.enemyType == 1){
            this.health = 100;
        }

        if (this.enemyType == 2){
            this.health = 150;
        }

        if (this.enemyType == 3){
            this.health = 200;
        }

        if (this.enemyType == 4){
            this.health = 250;
        }
        

        if (cheats.insaneMode){
            this.movement = this.speed * enemySpeedOffset;
            this.health = this.health * enemyHPOffset;
        } else {
            this.movement = this.speed;
            this.health = this.health;
        }
        
        this.maxHealth = this.health;
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
            if (!cheats.godMode) { 
                gameState = "GameOver";
                enemies.length = 0;
                towers.length = 0;
                enemyPositions.length = 0;
                projectiles.length = 0;
            } else {
                enemies.splice(i, 1);
                i--;
            }
        }
        if (enemies[i] && enemies[i].health <= 0){
            let gainedPower = enemies[i].maxHealth/10;
            floatingMessages.push(new FloatingMessage(`+${Math.floor(gainedPower)}`, "SkyBlue", 'center', enemies[i].x+enemies[i].width/2, enemies[i].y+30, 20, 0.02));

            // Gain Resources
            tPower += gainedPower;
            score += gainedPower;

            // Increase Enemy Spawn Timer
            if (enemySpawnRate > 120) enemySpawnRate -= 25;

            if (cheats.insaneMode) enemyHPOffset += 0.15;
            chooseTower();
            const findThisIndex = enemyPositions.indexOf(enemies[i].y);
            enemyPositions.splice(findThisIndex, 1);
            enemies.splice(i, 1);
            i--;
        }
    }

    if (spawnEnemies && frame % enemySpawnRate === 0 && score < winningScore){
        let verticalPos = Math.floor(Math.random() * 5 + 1) * cellSize;
        enemies.push(new Enemy(verticalPos));
        enemyPositions.push(verticalPos);
        if (firstSpawn){
            enemySpawnRate = resetSpawnTimer;
            firstSpawn = false;
        }
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
            floatingMessages.push(new FloatingMessage(`+${Math.floor(resources[i].amount)}`, "SkyBlue", 'center', mouse.x, resources[i].y, 25, 0.02));
            tPower += resources[i].amount;
            score += resources[i].amount;
            resources.splice(i, 1);
            i--;
        }
    }
}


// tower spawner power spawner
class towerResource {
    constructor(x, y, amount){
        this.x = x;
        this.y = y;
        this.width = cellSize * 0.6;
        this.height = cellSize * 0.6;
        this.amount = amount;
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


// Tower resource handler
function handleTowerResource(){
    for (let i = 0; i < tResources.length; i++){
        tResources[i].draw();
        if (tResources[i] && mouse.x && mouse.y && collision(tResources[i], mouse)){
            floatingMessages.push(new FloatingMessage(`+${Math.floor(tResources[i].amount)}`, "SkyBlue", 'center', mouse.x, tResources[i].y, 25, 0.02));
            tPower += tResources[i].amount;
            score += 5;
            tResources.splice(i, 1);
            i--;
        }
    }
}


// Draw cards array
function cardArray(card, i, x, y, offset, size, icon){
    notifyCtx.lineWidth = 3;
    notifyCtx.globalAlpha = 0.2;
    notifyCtx.fillStyle = 'Grey';

    // Card Background
    notifyCtx.fillRect(x*offset,y,size.width,size.height);

    notifyCtx.globalAlpha = 1;

    // Card icon image
    notifyCtx.drawImage(cardImage, icon.x, icon.y, icon.w, icon.h, x*offset, y, size.width, size.height);

    // Outline
    notifyCtx.strokeStyle = card.color;
    notifyCtx.strokeRect(x*offset,y,size.width,size.height);

    // Energy cost label
    notifyCtx.fillStyle = 'Gold';
    notifyCtx.textAlign = 'center';
    notifyCtx.font = `20px ${customFont}`;
    notifyCtx.fillText(`${cards[`${i}`].cost}`, cards[`${i}`].x + cards[`${i}`].width*.5, cards[`${i}`].height+13);
}


// UI Tower Selector
function chooseTower(){
    notifyCtx.clearRect(0, 0, notifyCanvas.width, notifyCanvas.height);

    notifyCtx.fillStyle = `rgb(27, 35, 39)`;
    notifyCtx.fillRect(0,0,canvas.width,controlBar.height);

    notifyCtx.lineWidth = 3;
    notifyCtx.globalAlpha = 0.2;
    notifyCtx.fillStyle = 'Grey';

    for (let i = 0; i < cards.length; i++){
        if (choosenTower === i){
            cards[`${i}`].color = 'Teal';
            aTower.x = cards[`${i}`].x;
            aTower.y = cards[`${i}`].y;
            aTower.type = cards[`${i}`].type;
            aTower.cost = cards[`${i}`].cost;

            if (!cheats.speedShoot || !cheats.powerShoot || !cheats.highHP) {
                aTower.hp = cards[`${i}`].hp;
                aTower.dmg = cards[`${i}`].dmg;
                aTower.speed = cards[`${i}`].speed;
                aTower.animSpeed = cards[`${i}`].animSpeed;
            } else {
                cardRefresh();
            }
        } else {
            cards[`${i}`].color = 'Black';
        }

        cardArray(cards[`${i}`], i, 3+23*i, 10, 4, {width:75, height:85}, {x:0, y:0+200*i, w:150, h:200})
    }


    // Tower Power
    notifyCtx.fillStyle = 'gold';
    notifyCtx.textAlign = 'right';
    notifyCtx.font = `30px ${customFont}`;
    notifyCtx.fillText(`${Math.floor(tPower)} :Energy`, canvas.width-20, 50);

    // Score
    notifyCtx.textAlign = 'right';
    notifyCtx.font = `30px ${customFont}`;
    notifyCtx.fillText(`${Math.floor(score)}   :Score`, canvas.width-20, 90);

    notifyCtx.globalAlpha = 1;

    // mouse.clicked = false;

}


// Update Cards Values
function cardRefresh(){
    aTower.hp = 9001;
    aTower.dmg = 9001;
    aTower.speed = 1;
    aTower.animSpeed = 1;
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

let canWin = true;

// UI Status
function handleGameStatus(){
    if (gameState !== "GameOver" && score >= winningScore && enemies.length <= 0){
        if (canWin) {
            let winFloat = setTimeout(() => {
                floatingMessages.push(new FloatingMessage(`You Survived!`, "Gold", 'center', canvas.width/2, canvas.height/2, 60, 0.02));
                clearTimeout(winFloat);
                winFloat = 0;
            }, 100);

            let winOver = setTimeout(() => {
                gameState = "WonLevel";
                clearTimeout(winOver);
                winOver = 0;
            }, 2000);
            canWin = false;
        }
    }

    if (gameState === "GameOver"){
        keylog = "";
        showCheatLog = false;
        canWin = true;
        gameOver();
    }

    if (gameState === "WonLevel"){
        keylog = "";
        showCheatLog = false;
        canWin = true;
        wonLevel();
    }

    if (gameState === "MainMenu"){
        keylog = "";
        showCheatLog = false;
        canWin = true;
        mainMenu();
    }

    // uiCtx.fillStyle = 'black';
    // uiCtx.fillRect(0,0,controlBar.width,controlBar.height);
}


// Game Start Countdown
function startCountdown(){
    if (!spawnEnemies && frame % 40 === 0) {
        if (countdown > 0){
            floatingMessages.push(new FloatingMessage(`ALERT ${countdown}`, "Red", 'center', canvas.width/2, canvas.height/2, 50, 0.02));
            countdown--;
            // console.log(countdown);
        } else {
            floatingMessages.push(new FloatingMessage(`Defend The Core!`, "Red", 'center', canvas.width/2, canvas.height/2, 60, 0.02));
            enemySpawnRate = 40;
            spawnEnemies = true;
            countdown = 3;
            // console.log(spawnEnemies);
        }
    }
}


// Update game loop
function update(){
    // uiCtx.clearRect(0,0,uiCanvas.width,uiCanvas.height);
    let lineHeight = ctx.measureText(`Code: ${keylog}`).width;
    ctx.clearRect(0,0,canvas.width,canvas.height);

    for (let i = 0; i < cards.length; i++){
        if (collision(mouse, cards[`${i}`]) && mouse.clicked){
            choosenTower = cards[`${i}`].type;
            chooseTower();
        }
    }

    // ctx.fillStyle = 'black';
    // ctx.fillRect(0,0,controlBar.width,controlBar.height);
    handleGameGrid();
    handleTowers();
    handleEnemies();
    handleProjectiles();
    handleResource();
    handleTowerResource();
    // chooseTower();
    handleGameStatus();
    handleFloatingMessages();
    startCountdown();
    cheatHandler(lineHeight);

    // Show fps if cheats fpsVisible is true
    if (cheats.fpsVisible){
        // FPS Background
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = 'Black';
        ctx.fillRect(25, canvas.height-80, 120, 70);

        // FPS Draw Text
        ctx.globalAlpha = 1;
        ctx.textAlign = 'left';
        ctx.fillStyle = 'Gold';
        ctx.font = `25px ${customFont}`;
        ctx.fillText(`FPS:${fps}`, 32,canvas.height-35);

        ctx.globalAlpha = 1;
    }

    frame++;
    if (!canClick){
        clickTimer++;
    }

     // FPS Calculation Debug
     window.requestAnimationFrame(() => {
        const now = performance.now();
        while (globalThis.times.length > 0 && globalThis.times[0] <= now - 1000) {
            globalThis.times.shift();
        }
        globalThis.times.push(now);
        globalThis.fps = globalThis.times.length;
    });
    
    if (gameState === "Playing"){
        if (clickTimer % 100 === 0){
            canClick = true;
        }
        requestAnimationFrame(update);
        // if (cheats.slowMotion){
        //     setTimeout(() => {
        //         requestAnimationFrame(update);
        //     }, 1000 / 30);
        // } else {
        //     setTimeout(() => {
        //         requestAnimationFrame(update);
        //     }, 1000 / 60);
        // }
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


// Cheat Input Logger
window.addEventListener('keydown', (e) => {

    const excludeBtns = ["AudioVolumeUp", "AudioVolumeDown", "ScrollLock", "Pause", "PageUp", "PageDown", "ArrowRight",
    "Home", "Insert", "End", "Delete", "CapsLock", "Tab", "Backspace", "Enter", "Shift", "ArrowLeft", "ArrowUp", "NumLock", 
    "ArrowDown", "Control", "Alt", "F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11", "F12", "Meta"]; 

    if (showCheatLog) {

        // If button not in exclude list add letter to keylog
        if (!excludeBtns.includes(e.key)){
            keylog += e.key;
        }

    // Erase last key pressed
    if (e.key === "Backspace") keylog = keylog.slice(0, -1);
    } 

    // Tab key pressed
    // if (e.key === "Tab") keylog += "    ";

    // Open Cheat Menu
    if (e.key === "`") keylog = "", showCheatLog = !showCheatLog;

    // Enter Cheat Code
    if (showCheatLog && e.key === "Enter"){
        switch (keylog) {
            case "help":
                console.log(`god mode\ninsanity\ninfinite power\nmax hp\nspeed\npower\nfps\nsmooth\naspect`);
                // showCheatLog = false;
                showCheatHelp = !showCheatHelp;
                break;

            case "h":
                console.log(`god mode\ninsanity\ninfinite power\nmax hp\nspeed\npower\nfps\nsmooth\naspect`);
                // showCheatLog = false;
                showCheatHelp = !showCheatHelp;
                break;

            case "god mode":
                cheats.godMode = !cheats.godMode;
                console.log(`godMode:${cheats.godMode}`);
                // showCheatLog = false;
                break;

            case "insanity":
                cheats.insaneMode = !cheats.insaneMode;
                console.log(`insaneMode:${cheats.insaneMode}`);
                // showCheatLog = false;
                break;
            
            case "infinite power":
                cheats.infinitePower = !cheats.infinitePower;
                console.log(`infinitePower:${cheats.infinitePower}`);
                // showCheatLog = false;
                break;

            case "max hp":
                cheats.highHP = !cheats.highHP;
                console.log(`highHP:${cheats.highHP}`);
                // showCheatLog = false;
                break;

            case "speed":
                cheats.speedShoot = !cheats.speedShoot;
                console.log(`speedShoot:${cheats.speedShoot}`);
                // showCheatLog = false;
                break;

            case "power":
                cheats.powerShoot = !cheats.powerShoot;
                console.log(`powerShoot:${cheats.powerShoot}`);
                // showCheatLog = false;
                break;

            case "fps":
                cheats.fpsVisible = !cheats.fpsVisible;
                console.log(`fpsVisible:${cheats.fpsVisible}`);
                // showCheatLog = false;
                break;

            case "smooth":
                cheats.graphicSmoothing = !cheats.graphicSmoothing;
                console.log(`graphicSmoothing:${cheats.graphicSmoothing}`);
                // showCheatLog = false;
                break;

            case "aspect":
                cheats.preserveAspect = !cheats.preserveAspect;
                console.log(`preserveAspect:${cheats.preserveAspect}`);
                // showCheatLog = false;
                break;

            // case "slow":
            //     cheats.slowMotion = !cheats.slowMotion;
            //     console.log(`slowMotion:${cheats.slowMotion}`);
            //     // showCheatLog = false;
            //     break;

            case "game over man":
                // cheats.preserveAspect = !cheats.preserveAspect;
                console.log(`Game Over Man!`);
                gameState = "GameOver";
                // showCheatLog = false;
                break;

            case "winner":
                // cheats.preserveAspect = !cheats.preserveAspect;
                console.log(`Winner!`);
                gameState = "WonLevel";
                // showCheatLog = false;
                break;
        }
        // showCheatLog = false;
        keylog = "";
    }

    // console.log(`Key:${e.key}`);
    // keylog = "";
    cardRefresh();
});


function cheatHandler(lineHeight){
    // Cheat Input Menu
    if (showCheatLog){
        ctx.globalAlpha = .85;
        ctx.fillStyle = 'Black';
        ctx.fillRect(10, 130, lineHeight+10, 40);

        ctx.globalAlpha = 1;
        ctx.textAlign = 'left';
        ctx.fillStyle = 'Teal';
        ctx.font = `${25}px ${customFont}`;
        ctx.fillText(`Code: ${keylog}`, 15, 160);

        // Cheat Help Menu
        if (showCheatHelp){
            const topOffset = 140;
            const offset = 30;

            ctx.globalAlpha = .75;
            ctx.fillStyle = 'Black';
            ctx.fillRect(10, topOffset+40, 300, 400);

            ctx.globalAlpha = 1;
            ctx.textAlign = 'left';
            ctx.fillStyle = 'Teal';
            ctx.font = `${25}px ${customFont}`;

            // for (let i = 0; i < 11; i++){
            ctx.fillText(`god mode: ${cheats.godMode}`, 30, topOffset+40+offset);
            ctx.fillText(`insanity: ${cheats.insaneMode}`, 30, topOffset+40+offset*2);
            ctx.fillText(`infinite power: ${cheats.infinitePower}`, 30, topOffset+40+offset*3);
            ctx.fillText(`max hp: ${cheats.highHP}`, 30, topOffset+40+offset*4);
            ctx.fillText(`speed: ${cheats.speedShoot}`, 30, topOffset+40+offset*5);
            ctx.fillText(`power: ${cheats.powerShoot}`, 30, topOffset+40+offset*6);
            ctx.fillText(`fps: ${cheats.fpsVisible}`, 30, topOffset+40+offset*7);
            ctx.fillText(`smooth: ${cheats.graphicSmoothing}`, 30, topOffset+40+offset*8);
            ctx.fillText(`aspect: ${cheats.preserveAspect}`, 30, topOffset+40+offset*9);
            ctx.fillText(`game over man`, 30, topOffset+40+offset*10);
            ctx.fillText(`winner`, 30, topOffset+40+offset*11);
                // if (i > 10) break; 
            // }
        }
    }
}


// resizeWindow();
