var ballX = 75;
var ballY = 75;
var ballSpeedX = 5;
var ballSpeedY = 7;

const BRICK_H = 20;
const BRICK_W = 80;
const BRICK_COLS = 10;
const BRICK_GAP = 2;
const BRICK_ROWS = 14;

var brickGrid = new Array(BRICK_COLS * BRICK_ROWS);

const PADDLE_WIDTH = 100;
const PADDLE_THICKNESS = 10;
const PADDLE_DIST_FROM_EDGE = 60;
var paddleX = 400;

var canvas;
var canvasContext;

var mouseX = 0;
var mouseY = 0;

function updateMousePos(evt) {
    "use strict";
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    mouseX = evt.clientX - rect.left - root.scrollLeft;
    mouseY = evt.clientY - rect.top - root.scrollTop;

    paddleX = mouseX - PADDLE_WIDTH / 2;
}

function ballReset() {
    "use strict";
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

function moveAll() {
    "use strict";
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballX > canvas.width) {
        ballSpeedX *= -1;
    }
    if (ballX < 0) {
        ballSpeedX *= -1;
    }
    if (ballY > canvas.height) {

        ballReset();
    }
    if (ballY < 0) {
        ballSpeedY *= -1;
    }


    var paddleTopEdgeY = canvas.height - PADDLE_DIST_FROM_EDGE;
    var paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS;
    var paddleLeftEdgeX = paddleX;
    var paddleRightEdgeX = paddleLeftEdgeX + PADDLE_WIDTH;
    if (
        ballY > paddleTopEdgeY
        && ballY < paddleBottomEdgeY
        && ballX < paddleRightEdgeX
        && ballX > paddleLeftEdgeX
    ) {

        ballSpeedY *= -1;

        var centerOfPaddleX = paddleX + PADDLE_WIDTH / 2;
        var ballDistFromPaddleCenterX = ballX - centerOfPaddleX;
        ballSpeedX = ballDistFromPaddleCenterX * 0.4;
    }
}

function colorText(showWords, textX, textY, fillColor) {
    "use strict";
    canvasContext.fillStyle = fillColor;
    canvasContext.fillText(showWords, textX, textY);
}

function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
    "use strict";
    //colors canvas black
    canvasContext.fillStyle = fillColor;
    canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function colorCircle(centerX, centerY, radius, fillColor) {
    "use strict";
    canvasContext.fillStyle = fillColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}

function rowColToArrayIndex(col, row) {
    "use strict";
    return BRICK_COLS * row + col;
}

function drawBricks() {
    "use strict";
    var eachRow;
    var eachCol;
    var arrayIndex;
    for (eachRow = 0; eachRow < BRICK_ROWS; eachRow += 1) {
        for (eachCol = 0; eachCol < BRICK_COLS; eachCol += 1) {

            arrayIndex = rowColToArrayIndex(eachCol, eachRow);

            if (brickGrid[arrayIndex]) {
                colorRect(
                    BRICK_W * eachCol,
                    BRICK_H * eachRow,
                    BRICK_W - BRICK_GAP,
                    BRICK_H - BRICK_GAP,
                    "blue"
                );
            }
        }
    }
}

function brickReset() {
    "use strict";
    var i;
    for (i = 0; i < BRICK_COLS * BRICK_ROWS; i += 1) {
        brickGrid[i] = true;
    }
}

function drawAll() {
    "use strict";
    colorRect(0, 0, canvas.width, canvas.height, "black");
    colorCircle(ballX, ballY, 10, "green");
    colorRect(
        paddleX,
        canvas.height - PADDLE_DIST_FROM_EDGE,
        PADDLE_WIDTH,
        PADDLE_THICKNESS,
        "gray"
    );

    drawBricks();


    var ballBrickCol = Math.floor(ballX / BRICK_W);
    var ballBrickRow = Math.floor(ballY / BRICK_H);
    var brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow);

    if (
        ballBrickCol >= 0 &&
        ballBrickCol < BRICK_COLS &&
        ballBrickRow >= 0 &&
        ballBrickRow < BRICK_ROWS
    ) {
        if (brickGrid[brickIndexUnderBall]) {
            brickGrid[brickIndexUnderBall] = false;
            ballSpeedY *= -1;
        }
    }
}

function updateAll() {
    "use strict";
    moveAll();
    drawAll();
}

window.onload = function () {
    "use strict";
    canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext("2d");
    var fps = 30;
    setInterval(updateAll, 1000 / fps);

    canvas.addEventListener("mousemove", updateMousePos);

    brickReset();
};