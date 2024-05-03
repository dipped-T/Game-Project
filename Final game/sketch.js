/*

- Copy your game project code into this file
- for the p5.Sound library look here https://p5js.org/reference/#/libraries/p5.sound
- for finding cool sounds perhaps look here
https://freesound.org/



*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var game_score;
var ship;
var lives;

var jumpSound;
var coinSound;
var fallSound;
var oofSound;
var winSound;
var bgSound;

var platforms;
var enemies;

var w;
var changeDirection;


function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
    
    coinSound = loadSound('assets/coin.wav');
    coinSound.setVolume(0.1);
    
    fallSound = loadSound('assets/fall.wav');
    fallSound.setVolume(0.01);
    
    oofSound = loadSound('assets/oof.wav');
    oofSound.setVolume(0.1);
    
    winSound = loadSound('assets/win.mp3');
    winSound.setVolume(0.01);
    
    bgSound = loadSound('assets/bg.mp3');
    bgSound.setVolume(0.15);
}


function setup()
{
	createCanvas(1024, 576);
    changeDirection = false;
    floorPos_y = height * 3/4;
    startGame();
    bgSound.play();
    lives = 3;
}

function startGame()
{
    gameChar_x = width/2;
	gameChar_y = floorPos_y;
    

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
    

	// Initialise arrays of scenery objects.
    
    trees_x = [200, 440, 620, 720, 800, 1250, 1500,1600,2250];
    
    clouds = [
                {x_pos: random(-3000,3000), y_pos: 105, size: 50},
                {x_pos: random(-3000,3000), y_pos: 255, size: 50},
                {x_pos: random(-3000,3000), y_pos: 155, size: 50},
                {x_pos: random(-3000,3000), y_pos: 155, size: 50},
                {x_pos: random(-3000,3000), y_pos: 155, size: 50},
                {x_pos: random(-3000,3000), y_pos: 155, size: 50},
                {x_pos: random(-3000,3000), y_pos: 155, size: 50},
                {x_pos: random(-3000,3000), y_pos: 155, size: 50},
                {x_pos: random(-3000,3000), y_pos: 155, size: 50},
                {x_pos: random(-3000,3000), y_pos: 155, size: 50},    
            ];
    
    mountains = [
                    {x_pos: 500, width: 100},
                    {x_pos: 350, width: 100},
                    {x_pos: 700, width: 100},
                    {x_pos: random(1000,3000), width: 100},
                    {x_pos: random(1000,3000), width: 100},
                    {x_pos: random(1300,3000), width: 100}
            ];
    
    canyon = [
                {x_pos: 270, width: 100},
                {x_pos: 860, width: 100},
                {x_pos: 1050, width: 100},
                {x_pos: 2000, width: 100},
                {x_pos: 2600, width: 100},
                {x_pos: 2750, width: 100},
                {x_pos: 2900, width: 100},
                //{x_pos: random(-3000,3000), width: 100}
            ];
    
    collectable = [
                    {x_pos: 110, y_pos: 210, size: 50},
                    {x_pos: 300, y_pos: 350, size: 50},
                    {x_pos: 990, y_pos: 400, size: 50},
                    {x_pos: 500, y_pos: 250, size: 50},
                    {x_pos: 1300, y_pos: 200, size: 50},
                    {x_pos: 2350, y_pos: 150, size: 50},
                    {x_pos: 3000, y_pos: 210, size: 50},
                    {x_pos: random(1500,2500), y_pos: 400, size: 50}
                ];
    
    game_score = 0;
    ship = 
        {
        isReached: false,
        x_pos: 3350
        }
    
    lives -= 1;
    
    platforms = [];
    
    //platforms in game
    
    platforms.push(createPlatform(100,floorPos_y-100,150));     platforms.push(createPlatform(100,floorPos_y-180,100));       
    platforms.push(createPlatform(1300,floorPos_y-200,160));
    platforms.push(createPlatform(1650,floorPos_y-50,85));
    platforms.push(createPlatform(1520,floorPos_y-100,70));
    platforms.push(createPlatform(2400,floorPos_y-90,70));
    platforms.push(createPlatform(2500,floorPos_y-150,100));
    platforms.push(createPlatform(2350,floorPos_y-220,70));
    platforms.push(createPlatform(2500,floorPos_y-270,350))

    
    enemies = []; 
    
    //enemies in game
    
    enemies.push(new Enemy(123, floorPos_y - 80, 40));
    enemies.push(new Enemy(600, floorPos_y +20, 150));
    enemies.push(new Enemy(1720, floorPos_y+ 20, 150));
    enemies.push(new Enemy(1820, floorPos_y + 20, 100));
    enemies.push(new Enemy(3000, floorPos_y + 20, 100));
    enemies.push(new Enemy(2300, floorPos_y + 20, 100));
    enemies.push(new Enemy(2600, floorPos_y - 250, 100));
}

function draw()
{
    
	background(200, 200,0); // fill the sky blue

	noStroke();
	fill(0,130,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground
    
    
    push();
    translate(scrollPos, 0);
    drawClouds();
    drawMountains();
    drawTrees();
    
	// Draw canyons.
    
    if(gameChar_x > canyon.x_pos && gameChar_x < canyon.x_pos + canyon.width && gameChar_y >= floorPos_y)
        {
            isPlummeting = true;
        }
    if(isPlummeting == true)
        {
            gameChar_y += 1;
        }
    else
        {
            isPlummeting == false; 
        }
   
    for(var o = 0; o < canyon.length; o++)
    {
        drawCanyon(canyon[o]);
        checkCanyon(canyon[o]);
    }
    

    
    // Draw collectable items.
    for(var l = 0; l < collectable.length; l++)
    {
        if(!collectable[l].isFound)
        {
            drawCollectable(collectable[l])
            checkCollectable(collectable[l])
        }   
    
    }
    
    renderShip();
    
    for (var i = 0; i < platforms.length; i++)
        {
            platforms[i].draw();
        }
    
    for(var i = 0; i<enemies.length; i++)
        {
            enemies[i].update();
            enemies[i].draw();
            if(enemies[i].isContact(gameChar_world_x,gameChar_y))
            {
                oofSound.play();
                startGame();
                break;
            }
        }
    
    
	pop();

	// Draw game character.
	
	drawGameChar();
    
    fill(0);
    stroke(0,100,100);
    textSize(25);
    text("Talismans : " +game_score, width/1.9,70);
    
    stroke(255,0,0);
    text("Lives : " +lives, width/3,70);
    
    if(lives < 1)
        {
            fill(255,0,0);
            stroke(255);
            textSize(35);
            text("Mission Failed!", width/2-155, height/2-100);
            
            text("-Press SPACE to proceed-", width/2-250, height/2-70);
            bgSound.stop();
            isFalling = false;
            isRight = false;
            isLeft = false;
            isPlummeting = false;
            keyPressed = false;
        return;    
        }
    

	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 3;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 3// negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
    if(floorPos_y != gameChar_y)
        {
            var isContact = false;
            for(var i=0;i<platforms.length;i++)
                { if(platforms[i].checkContact(gameChar_world_x, gameChar_y))
                        {
                            isContact= true;
                            break;
                        }
                }
            if(isContact==false)
                {
                    gameChar_y +=3;
                    isFalling = true;
                }
            else   
            {
                isFalling=false;
            }
        }
        else
        {
            isFalling = false;
        }
    
    
    if(isPlummeting == true)
        {
            gameChar_y += 5;
        }
        if(gameChar_y > height)
            {
                bgSound.stop();
                startGame();
                bgSound.play();
            }
    
    if(ship.isReached == false)
        {
            checkShip();
        }

    if(ship.isReached == true)
        {
            fill(0,100,200);
            stroke(0);
            textSize(35);
            text("Mission Complete | Score: " +game_score, width/2-155, height/2-100);
            noStroke();
            
            text("-Press SPACE to proceed-", width/2-150, height/2-70);
            isFalling = false;
            isRight = false;
            isLeft = false;
            isPlummeting = false;
            keyPressed = false;
            winSound.play();
            bgSound.stop();
        return;    
        }
    
    
	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
    
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed()
{

	console.log("press" + keyCode);
	console.log("press" + key);
    
    if(keyCode == 65)
    {
        isLeft = true;
    }
    
    if(keyCode == 68)
    {
        isRight = true;
    }
    
    if (keyCode == 87 && (gameChar_y == floorPos_y || isFalling == false))
    {
        gameChar_y -= 150;
        jumpSound.play();
    }

}

function keyReleased()
{

	console.log("release" + keyCode);
	console.log("release" + key);
    
    if(keyCode == 65)
    {
        isLeft = false;
           
    }
    
    if(keyCode == 68)
    {
        isRight = false;   
        
    }

}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	// draw game character
    if(isLeft && isFalling)
	{
		// jumping-left code
        
    //body
        stroke(65,105,225);
        fill(30,144,255);
        rect(gameChar_x - 16,gameChar_y - 14,19,10,3);//rightLeg
        rect(gameChar_x - 12,gameChar_y - 35,23,25,3);//mainBody
        rect(gameChar_x - 4,gameChar_y - 12,19,10,3);//leftLeg
        rect(gameChar_x + 1,gameChar_y - 45, 7,18,4);//leftArm
        noStroke();
    //face
        fill(0);
        rect(gameChar_x - 13,gameChar_y - 29,6,2,3);
        fill(255);
        triangle(gameChar_x - 13,gameChar_y - 20 ,gameChar_x - 15,gameChar_y - 16,gameChar_x - 5,gameChar_y -21);

	}
	else if(isRight && isFalling)
	{
		// jumping-right code
        
    //body
        stroke(65,105,225);
        fill(30,144,255);
        rect(gameChar_x - 3,gameChar_y - 12,19,10,3);//leftLeg
        rect(gameChar_x - 10,gameChar_y - 45, 7,18,4);//leftArm
        rect(gameChar_x - 11,gameChar_y - 35,23,25,3);//mainBody
        rect(gameChar_x - 16,gameChar_y - 14,19,10,3);//rightLeg
        rect(gameChar_x - 10,gameChar_y - 25, 7,18,4);//rightArm
        noStroke();
    //face
        fill(0);
        rect(gameChar_x + 6,gameChar_y - 29,6,2,3);
        fill(255);
        triangle(gameChar_x + 13,gameChar_y - 20 ,gameChar_x + 15,gameChar_y - 16,gameChar_x + 5,gameChar_y -21);

	}
	else if(isLeft)
	{
		/// walking left code ///
        
     //body
        stroke(65,105,225);
        fill(30,144,255);
        rect(gameChar_x - 16,gameChar_y - 12,19,10,3);//rightLeg
        rect(gameChar_x - 12,gameChar_y - 35,23,25,3);//mainBody
        rect(gameChar_x - 4,gameChar_y - 12,19,10,3);//leftLeg
        rect(gameChar_x + 1,gameChar_y - 25, 18,7,4);//leftArm
        noStroke();
    //face
        fill(0);
        rect(gameChar_x - 12,gameChar_y - 30,5,6,3);
        fill(255);
        triangle(gameChar_x - 13,gameChar_y - 20 ,gameChar_x - 15,gameChar_y - 16,gameChar_x - 5,gameChar_y -21);

	}
	else if(isRight)
	{
		/// walking right code ///
        
    //body
        stroke(65,105,225);
        fill(30,144,255);
        rect(gameChar_x - 3,gameChar_y - 12,19,10,3);//leftLeg
        rect(gameChar_x - 11,gameChar_y - 35,23,25,3);//mainBody
        rect(gameChar_x - 16,gameChar_y - 12,19,10,3);//rightLeg
        rect(gameChar_x - 20,gameChar_y - 25, 18,7,4);//rightArm
        noStroke();
    //face
        fill(0);
        rect(gameChar_x + 8,gameChar_y - 30,5,6,3);
        fill(255);
        triangle(gameChar_x + 13,gameChar_y - 20 ,gameChar_x + 15,gameChar_y - 16,gameChar_x + 5,gameChar_y -21);

	}
	else if(isFalling || isPlummeting)
	{
		/// jumping facing forwards code ///
        
    //body
        fill(30,144,255);
        stroke(65,105,225);
        rect(gameChar_x - 14,gameChar_y - 35,30,25,3);//mainBody
        rect(gameChar_x - 16,gameChar_y - 14,12,10,2);//rightLeg
        rect(gameChar_x + 4,gameChar_y - 12,12,10,2);//leftLeg
        rect(gameChar_x - 22, gameChar_y - 25,7,18,4);//rightArm
        rect(gameChar_x + 17, gameChar_y - 42,7,18,4);//leftArm
        noStroke();
     //face
        fill(0)
        ellipse(gameChar_x - 7,gameChar_y - 25,9,1);
        ellipse(gameChar_x + 8,gameChar_y - 25,9,1);
        fill(255,255,255);
        arc(gameChar_x,gameChar_y - 18,8,8,0,PI);

	}
	else
	{
		/// standing front facing code ///
        
    //body
        fill(30,144,255);
        rect(gameChar_x - 14,gameChar_y - 35,30,25,3);//mainBody
        rect(gameChar_x - 14,gameChar_y - 12,12,10,2);//rightLeg
        rect(gameChar_x + 4,gameChar_y - 12,12,10,2);//leftLeg
    //face
        fill(0)
        ellipse(gameChar_x - 7,gameChar_y - 25,9,9);
        ellipse(gameChar_x + 8,gameChar_y - 25,9,9);
        fill(255,255,255);
        ellipse(gameChar_x +10,gameChar_y - 28,3,2);
        ellipse(gameChar_x - 5,gameChar_y - 28,3,2);
        arc(gameChar_x,gameChar_y - 18,8,8,0,PI,CHORD);
        
	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds()
{
        
        for(var a = 0; a <clouds.length; a++)
        {
        //cloud
            fill(225,225,225);
            ellipse(clouds[a].x_pos,clouds[a].y_pos,clouds[a].size,40);
            ellipse(clouds[a].x_pos + 30,clouds[a].y_pos,clouds[a].size + 7,52);
            ellipse(clouds[a].x_pos + 60,clouds[a].y_pos,clouds[a].size,50);
            ellipse(clouds[a].x_pos + 90,clouds[a].y_pos,clouds[a].size,40);

            fill(255,255,255);
            ellipse(clouds[a].x_pos,clouds[a].y_pos,clouds[a].size,40);
            ellipse(clouds[a].x_pos + 30,clouds[a].y_pos - 10,clouds[a].size + 7,52);
            ellipse(clouds[a].x_pos + 60,clouds[a].y_pos - 10,clouds[a].size,50);
            ellipse(clouds[a].x_pos + 90,clouds[a].y_pos - 10,clouds[a].size,40);
        }
        
}

// Function to draw mountains objects.
function drawMountains()
{
        
        for(var m = 0; m <mountains.length; m++)
        {
        //mountain
            fill(147,112,219);
            triangle(mountains[m].x_pos,250,mountains[m].x_pos - 100,433,mountains[m].x_pos + 150,435);
            triangle(mountains[m].x_pos - 70,300,mountains[m].x_pos - 200,433,mountains[m].x_pos + 150,435);
            fill(255)
            triangle(mountains[m].x_pos,250,mountains[m].x_pos - 27,300,mountains[m].x_pos + 40,300);
        }
        
}

// Function to draw trees objects.
function drawTrees()
{
        
        for(var i = 0; i <trees_x.length; i++)  
        {
        //tree
            fill(71,52,14);
            rect(trees_x[i] - 25,floorPos_y - 80,50,100);
            fill(0,200,0);
            ellipse(trees_x[i],floorPos_y - 114,80,80);
            ellipse(trees_x[i] - 35,floorPos_y - 64,80,60);
            ellipse(trees_x[i] + 35,floorPos_y - 64,80,60);
        //apples
            fill(255,0,0);
            ellipse(trees_x[i] + 5,floorPos_y - 114,10,10);
            ellipse(trees_x[i] + 25,floorPos_y - 64,10,10);
            ellipse(trees_x[i] - 45,floorPos_y - 64,10,10);     
        }
        
}



// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
    fill(0,119,190);
    rect(t_canyon.x_pos,432.5,t_canyon.width,150);
    fill(193,74,9);
    rect(t_canyon.x_pos - 30,432.5, t_canyon.width - 70,150);
    rect(t_canyon.x_pos + 100,432.5, t_canyon.width - 70,150);
    triangle(t_canyon.x_pos +120,680, t_canyon.x_pos + 100,500,t_canyon.x_pos + 70,510);
    triangle(t_canyon.x_pos,480, t_canyon.x_pos + 30,480,t_canyon.x_pos,450);
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
     if(gameChar_world_x > t_canyon.x_pos && gameChar_world_x < t_canyon.x_pos + t_canyon.width && gameChar_y >= floorPos_y)
    {
        isPlummeting = true;
        fallSound.play();
    }
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.
function drawCollectable(t_collectable)
{
    fill(212,175,55);
    rect(t_collectable.x_pos, t_collectable.y_pos,30,30);
    fill(0);
    ellipse(t_collectable.x_pos + 15, t_collectable.y_pos + 15,t_collectable.size-20,10);
    ellipse(t_collectable.x_pos + 15, t_collectable.y_pos + 15,t_collectable.size- 40,30);
    fill(79,114,152);
    ellipse(t_collectable.x_pos + 15, t_collectable.y_pos + 15,t_collectable.size - 43);
}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
    var d = dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos);
    
    if(d < 50)
    {
        t_collectable.isFound = true;
        coinSound.play();
        game_score += 1;
    }
    
    if(t_collectable.isFound == false);
}


function renderShip()
{
   push();
    
    stroke(255);
    fill(50,50,50);
    rect(ship.x_pos - 35, floorPos_y, 70,-10);       
    stroke(0);
    
    
   if(ship.isReached)
        {
            fill(210,210,210);
            ellipse(ship.x_pos, floorPos_y - 50,70,75);
            fill(110,110,110);
            ellipse(ship.x_pos, floorPos_y - 40,150,10);
           
        }
    else
        {
            fill(210,210,210);
            ellipse(ship.x_pos, floorPos_y - 350,70,75);
            fill(110,110,110);
            ellipse(ship.x_pos, floorPos_y - 340,150,10);
        }
    pop();
}

function checkShip()
{
    var a = abs(gameChar_world_x - ship.x_pos);
    
    if(a < 15)
        {
            ship.isReached = true;
        }
}

function createPlatform(x,y,length)
 {
        var isContact = false;
        var p = 
        {
            x: x,
            y: y,
            length: length,
            draw: function()
            {
                fill(139,79,57);
                stroke(0);
                rect(this.x, this.y, this.length, 10);
            },
            
             checkContact: function(gc_x,gc_y)
            {
                //checks gameChar contact with platform
                if(gc_x > this.x && gc_x < this.x + this.length)
                {
                    var d = this.y - gc_y+10;
                    if(d >=0 && d<5)
                    {
                        return true;
                    }
                }
                return false;
            }   
        }
        return p;
    }


function Enemy(x,y,range)
{
        this.x = x;
        this.y = y;
        this.range = range;
        this.current_x = x;
        this.incr = 1;
        
        this.draw = function()
        {
        fill(50,50,100);
        arc(this.current_x, this.y - 25, 50,100,PI,TWO_PI);
        fill(255,0,0);
        arc(this.current_x , this.y - 60, 15,15,5,3,PI,QUARTER_PI);
        }
        
        this.update = function()
        {
            this.current_x += this.incr;
            
            if(this.current_x < this.x)
            {
                this.incr = 1;
            }
            else if(this.current_x > this.x + this.range)
            {
                this.incr = -1;
            }
        }
        
        this.isContact = function(gc_x, gc_y)
        {
            var d = dist(gc_x,gc_y,this.current_x,this.y)
            if(d < 25)
            {
                return true;
            }
            return false;
        }
    }


