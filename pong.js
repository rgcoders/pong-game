// global variables
var canvas;
var canvasContext;

// initialize ball position values
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 4;

// initialize player values
var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;

var showingWinScreen = false;

// paddle values
var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_THICKNESS = 10; //const variables remain unchanged
const PADDLE_HEIGHT = 100;

function calculateMousePos(evt) {
	var rect = canvas.getBoundingClientRect(); 
	//returns the size of an element and position relative to the viewport.
	//The coordinates are given relative to `window`, not the document.
	
	var root = document.documentElement;
	//returns the documentElement of the document, as an Element object.
    //For HTML documents the returned object is the <html> element.
	
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	//returns the number of pixels an element's content is scrolled horizontally.
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	//returns the number of pixels an element's content is scrolled vertically.
	
	return {
		x:mouseX,
		y:mouseY
	};
}

function handleMouseClick(evt) {
	if(showingWinScreen) {
		player1Score = 0;
		player2Score = 0;
		showingWinScreen = false;
	}
}

window.onload = function() { //starts the game when the browser window loads
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	var framesPerSecond = 30; //the frequency (rate) of image displays
	setInterval(function() { 
	//calls functions at specified intervals (in milliseconds)
	//30 frames per second in this case
			moveEverything();
			drawEverything();	
		}, 1000/framesPerSecond);
    
    //listen for mouse events(movements)
	canvas.addEventListener('mousedown', handleMouseClick);
    
    //set paddle coordinate based on mouse position
	canvas.addEventListener('mousemove',
		function(evt) {
			var mousePos = calculateMousePos(evt);
			paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
		});
}

function ballReset() { //check to see if either player has won the game
	if(player1Score >= WINNING_SCORE ||
		player2Score >= WINNING_SCORE) {

		showingWinScreen = true;
	}

	ballSpeedX = -ballSpeedX; //reverse ball direction
	ballX = canvas.width/2; //reset ball position to gameboard middle
	ballY = canvas.height/2;
}

//right-side paddle2 played by computer
function computerMovement() { 
	//set paddle2 position to vertical middle
	var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2); 
		
	//determine paddle2 vertical position relative to ball.
	//move paddle2 up or down by 6 pixels to hit the ball
	if(paddle2YCenter < ballY - 35) {
		paddle2Y = paddle2Y + 6;
	} else if(paddle2YCenter > ballY + 35) {
		paddle2Y = paddle2Y - 6;
	}
}

function moveEverything() {
	if(showingWinScreen) {
		return;
	}

	computerMovement();

	ballX = ballX + ballSpeedX;
	ballY = ballY + ballSpeedY;
	
	//did paddle1 hit the ball?
	if(ballX < 0) {
		if(ballY > paddle1Y &&
			ballY < paddle1Y+PADDLE_HEIGHT) {
			ballSpeedX = -ballSpeedX; //if paddle1 hit ball, reverse ball direction

            //ball speed travels fastest when hit by paddle's edges.
            //ball speed is slowest when it hits paddle's center area.
            //this behavior encourages players to hit ball with paddle edges.
			var deltaY = ballY
					-(paddle1Y+PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.35;
		} else {
			player2Score++; // must be BEFORE ballReset() because game ends when score = 3
			ballReset();
		}
	}
	
	//did paddle2 hit the ball?
	if(ballX > canvas.width) {
		if(ballY > paddle2Y &&
			ballY < paddle2Y+PADDLE_HEIGHT) {
			ballSpeedX = -ballSpeedX;//if paddle2 hit ball, reverse ball direction
            
            //ball speed travels fastest when hit by paddle's edges.
			var deltaY = ballY
					-(paddle2Y+PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.35; // 
		} else {
			player1Score++; // must be BEFORE ballReset() because game ends when score = 3
			ballReset();	
		}
	}
	if(ballY < 0) {
		ballSpeedY = -ballSpeedY; //reverse ball direction when it hits the top of game board area
	}
	if(ballY > canvas.height) {
		ballSpeedY = -ballSpeedY; //reverse ball direction when it hits the bottom
	}
}

function drawNet() { // draw the game net
	for(var i=0;i<canvas.height;i+=40) {
		colorRect(canvas.width/2-1,i,2,20,'white');
	}
}

function drawEverything() {
	// next line blanks out the screen with black
	colorRect(0,0,canvas.width,canvas.height,'black');

	if(showingWinScreen) {
		canvasContext.fillStyle = 'white';
        
        //when game ends, displays winner message
		if(player1Score >= WINNING_SCORE) { 
			canvasContext.fillText("Left Player Won", 350, 200);
		} else if(player2Score >= WINNING_SCORE) {
			canvasContext.fillText("Right Player Won", 350, 200);
		}

		canvasContext.fillText("click to continue", 350, 500);
		return;
	}

	drawNet();

	// this is left player paddle
	colorRect(0,paddle1Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');

	// this is right computer paddle
	colorRect(canvas.width-PADDLE_THICKNESS,paddle2Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');

	// next line draws the ball
	colorCircle(ballX, ballY, 10, 'white');

	canvasContext.fillText(player1Score, 100, 100);
	canvasContext.fillText(player2Score, canvas.width-100, 100);
}

// sets the game ball's dimensions
function colorCircle(centerX, centerY, radius, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath(); //begins a new drawing path, or resets the current path
	canvasContext.arc(centerX, centerY, radius, 0,Math.PI*2,true); //generates a circle
	canvasContext.fill();
}

//the paddles
function colorRect(leftX,topY, width,height, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX,topY, width,height);
}
