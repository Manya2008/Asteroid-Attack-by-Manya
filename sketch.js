let ground;
let lander;
var lander_img;
var bg_img;
var meteorImg,asteroidImg;
var asteroidsGroup, meteoroidsGroup;
var boom;
var restart, restartImg;
var PLAY = 1;
var END = 0;
var winImg,win;
var gamesate= PLAY;
var gameoverImg, gameover;
var invGround;
var explosion,restartSound,deathConfirm,winnerSound;
var deaths=0;

var vx = 0;
var g = 0.05;
var vy = 0;

function preload()
{
  lander_img = loadImage("normal.png");
  bg_img = loadImage("bg.png");
  meteorImg = loadImage("meteor2.png");
  asteroidImg = loadImage("meteor.png");
  boom = loadImage("boom.png");
  restartImg = loadImage("restart.png");
  gameoverImg = loadImage("gameOver.png");
  winImg= loadImage("Winner.png");
  //Sound
  explosion= loadSound("Explosion.mp3");
  restartSound= loadSound("Restart.mp3");
  deathConfirm= loadSound("deathConfirm.mp3");
  winnerSound= loadSound("Winner.mp3");
}

function setup() {
  createCanvas(1000,600);
  frameRate(80);

  invGround= createSprite(0,600,2000,10);
  invGround.shapeColor="red";

  win = createSprite(500,200,10,10);
  win.addImage(winImg);
  win.scale=0.5;
  win.visible=false;

  restart = createSprite(500,300,10,10);
  restart.addImage(restartImg);
  restart.scale=0.05;

  gameover = createSprite(500,200,10,10);
  gameover.addImage(gameoverImg);
  gameover.scale=0.12;

  lander = createSprite(100,50,30,30);
  lander.addImage(lander_img);
  lander.scale = 0.13;

  meteoroidsGroup=new Group();
  asteroidsGroup=new Group();

  lander.setCollider("circle",0,0,100);
  lander.debug= false;

  rectMode(CENTER);
  textSize(15);

}

function draw() 
{
  background(51);
  image(bg_img,0,0);
  push()
  fill(255);
  text("Vertical Velocity: "+round(vy),800,75);
  text("Deaths:"+deaths,800,90);
  pop();

if(gamesate===PLAY){
  //Movements
  if(keyDown("DOWN_ARROW")){
    vy +=g;
    lander.position.y+=vy;
    }

  if(keyDown("LEFT_ARROW")){
    lander.position.x-=3;
  }

  if(keyDown("RIGHT_ARROW")){
    lander.position.x+=3;
  }

  if(keyDown("UP_ARROW")){
    lander.position.y-=3;
  }

  //Obstacles
  spawnMeteroids();
  spawnAsteroids();

  if(meteoroidsGroup.isTouching(lander)){
    lander.position.x= 10;
    lander.position.y= 10;
    vy=0;
    restartSound.play();
  }

  if(asteroidsGroup.isTouching(lander)){
    lander.addImage(boom);
    explosion.play();
    deaths+=1;
    gamesate=END;
  }
  gameover.visible= false;
  restart.visible= false; 
  if(lander.isTouching(invGround)){
      youWon();
  }
} 
else if (gamesate===END){
  restart.visible=true;
  gameover.visible= true;
  meteoroidsGroup.velocityX=0;
  asteroidsGroup.velocityX=0;
  meteoroidsGroup.setLifetimeEach(-1);
  asteroidsGroup.setLifetimeEach(-1);
  win.visible=false;
  if(mousePressedOver(restart)){
    reset();
    deathConfirm.play();
  }
} 

  drawSprites();
}

function spawnMeteroids(){
  if(frameCount%100===0){
    var meteor = createSprite(900,150,10,10);
    meteor.velocityX=-5;

    meteor.addImage(meteorImg);

    meteor.scale=0.09;
    meteor.lifetime=250;
    meteoroidsGroup.add(meteor);
    }
}

function spawnAsteroids(){
  if(frameCount%80===0){
    var asteroid = createSprite(100,500,10,10);
    asteroid.velocityX=5;

    asteroid.addImage(asteroidImg);

    asteroid.scale=0.3;
    asteroid.lifetime=250;
    asteroidsGroup.add(asteroid);
  }
}

function reset(){
  gamesate=PLAY;
  gameover.visible= false;
  restart.visible= false; 
  lander.position.x= 100;
  lander.position.y= 50;
  lander.addImage(lander_img)
  asteroidsGroup.destroyEach();
  meteoroidsGroup.destroyEach();
  vy=0;
  win.visible=false;
}
function youWon(){
  win.visible=true;
  winnerSound.play();
}