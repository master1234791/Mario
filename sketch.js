var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;

var bg

function preload(){
 bg=loadImage("Classic-Mario-Background.png") 
  trex_running =   loadAnimation("mario.png");
  trex_collided =loadAnimation("mariocopia.png");
  
  groundImage = loadImage("ClassicMario.png");
  
  cloudImage = loadImage("Nubes.png");
  
  obstacle1 = loadAnimation("Planta.png","Planta2.png","Planta21.png","Planta3.png","Planta4.png");
  obstacle2 = loadAnimation("Planta.png","Planta2.png","Planta21.png","Planta3.png","Planta4.png");
  obstacle3 = loadAnimation("Planta.png","Planta2.png","Planta21.png","Planta3.png","Planta4.png");
  obstacle4 = loadAnimation("Planta.png","Planta2.png","Planta21.png","Planta3.png","Planta4.png");
  obstacle5 = loadAnimation("Planta.png","Planta2.png","Planta21.png","Planta3.png","Planta4.png");
  obstacle6 = loadAnimation("Planta.png","Planta2.png","Planta21.png","Planta3.png","Planta4.png");
  
  gameOverImg = loadImage("mario-over2.png");
  restartImg = loadImage("SpaceJam2.png");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  //ground = createSprite(200,height/2,400,20);
  trex = createSprite(50,180,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.2;
  
  ground = createSprite(200,height/2,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  ground.scale = 0;
  gameOver = createSprite(width/2,height/2);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,160);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.2;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,height/1.15,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(bg);
  textSize(24)
  fill("Red")
  text("Puntuación: "+ score,0,height/4);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if(touches.length>0||keyDown("space") && trex.y >= height/1.57) {
      trex.velocityY = -10;
    touches=[];
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = false;
    
    //establece velocidad de cada objeto del juego en 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //cambia la animación de Trex
    trex.changeAnimation("collided",trex_collided);
    
    //establece ciclo de vida a los objetos del juego para que nunca puedan ser destruidos
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(gameOver)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //escribe el código aquí para aparecer las nubes
  if (frameCount % 90 === 0) {
    var cloud = createSprite(width,height/1.8,40,10);
    cloud.y = Math.round(random(10,150));
    cloud.addImage(cloudImage);
    cloud.scale = 0.20;
    cloud.velocityX = -3;
    
     //asigna ciclo de vida a la variable
    cloud.lifetime = width;
    
    //ajusta la profundiad
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //agrega cada nube al grupo
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(width,height/1.22,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    obstacle.addAnimation(obstacle1);
        //genera obstáculos al azar
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.changeAnimation(obstacle1);
              break;
      case 2: obstacle.changeAnimation(obstacle2);
              break;
      case 3: obstacle.changeAnimation(obstacle3);
              break;
      case 4: obstacle.changeAnimation(obstacle4);
              break;
      case 5: obstacle.changeAnimation(obstacle5);
              break;
      case 6: obstacle.changeAnimation(obstacle6);
              break;
      default: break;
    }
    
    //asigna escala y ciclo de vida al obstáculo           
    obstacle.scale = 0.80;
    //obstacle.lifetime = 1;
    //agrega cada obstáculo al grupo
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
 
  
  score = 0;
  
}