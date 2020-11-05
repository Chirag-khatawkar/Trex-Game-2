var PLAY = 1;
var END = 0;
var gameState = PLAY;
var restart,RestartImage;
var gameover,GameoverImage;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;
var ob1, ob2, ob3, ob4,ob5 ,ob6;
var obstacleGroup;

var jumpsound,diesound,checkpoint;

var newImage;
var score;
function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  ob1 = loadImage("obstacle1.png");
  ob2  = loadImage("obstacle2.png");
  ob3 = loadImage("obstacle3.png");
  ob4 = loadImage("obstacle4.png");
  ob5 = loadImage("obstacle5.png");
  ob6 = loadImage("obstacle6.png");
  
  RestartImage=loadImage("restart.png");
  GameoverImage=loadImage("gameOver.png");
  jumpsound=loadSound("jump.mp3");
  diesound=loadSound("die.mp3");
  checkpointsound=loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(windowWidth,windowHeight);

  trex = createSprite(50,height-50,20,50);
   trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(200,height-30,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  invisibleGround = createSprite(width/2,height-20,width,10);
  invisibleGround.visible = false;
  
  //trex.debug = true;
  trex.setCollider("rectangle",0,0,80,80);
  
  
  score=0;
  cloudsGroup = new Group();
  obstacleGroup = new Group();
  
  restart=createSprite(width/2,100)
  restart.addImage(RestartImage);
  restart.scale = 0.4;
  restart.visible=false;
  
  gameover=createSprite(width/2,75);
  gameover.addImage(GameoverImage);
  gameover.scale=0.4;
  gameover.visible=false;
}
function draw() {
  
  background("white");
  if(gameState === PLAY){
    
   score = score+Math.round(getFrameRate () / 30);
   if (score % 100 === 0) {
     checkpointsound.play();
   } 
     ground.velocityX = -(4+(score / 100)); 
  if(touches.length>0||keyDown("space")&& trex.y >= height-120) {
    trex.velocityY = -11;
    jumpsound.play();
    touches = [];
  }
  
  trex.velocityY = trex.velocityY + 0.8 
  
    if (ground.x < 0){
    ground.x = ground.width/2;
  }
    //spawn the clouds
  spawnClouds();
  
  spawnOb();
    
  if (obstacleGroup.isTouching(trex)) {
    gameState = END;
    diesound.play();
  }
     
  }
  else if(gameState === END){
    ground.velocityX = 0;
    trex.changeAnimation("collided",trex_collided);
    obstacleGroup.setVelocityEach(0, 0);
    cloudsGroup.setVelocityEach(0, 0);
    trex.velocityY = 0;
    obstacleGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    restart.visible = true;
    gameover.visible = true;
    
    if (mousePressedOver(restart)){
      reset();
    }
  }
  
  textSize (15)
  text ("score : "+score,500,30);
  
  
  
  
  trex.collide(invisibleGround);
  
 
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    cloud = createSprite(width,100,40,10);
    cloud.addImage(cloudImage)
    cloud.y = Math.round(random(height-150,height-100))
    cloud.scale = 0.8;
    cloud.velocityX = -3;
    
    
    //assigning lifetime to the variable
    cloud.lifetime = width/3;
    
    //adjust the depth
    cloud.depth = trex.depth
    trex.depth = trex.depth + 1;
    cloudsGroup.add(cloud);
    }
  
}
function spawnOb () {
 if (frameCount % 100 === 0){
var obstacle = createSprite (width,height-20,10,10)
obstacle.velocityX = -(4+(score / 100));
var rar = Math.round(random(1,6));
   switch(rar){
     case 1: obstacle.addImage(ob1);
       break;
       case 2: obstacle.addImage(ob2);
       break;
        case 3: obstacle.addImage(ob3);
       break;
        case 4: obstacle.addImage(ob4);
       break;
        case 5: obstacle.addImage(ob5);
       break;
        case 6: obstacle.addImage(ob6);
       break;
       default: break;
}
   obstacle.scale=0.5;
  obstacleGroup.add(obstacle);
  obstacle.lifetime=width/4;
  
}
  }
  function reset() {
   gameState = PLAY;
   score = 0;
   obstacleGroup.destroyEach();
   cloudsGroup.destroyEach();
   gameover.visible = false;
    restart.visible = false;
    trex.changeAnimation("running", trex_running);
  }
