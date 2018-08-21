var ballX = 400;
var ballY = 300;
var ballSpeedX = 5;
var ballSpeedY = 7;

const TRACK_H = 20;
const TRACK_W = 80;
const TRACK_COLS = 10;
const TRACK_GAP = 2;
const TRACK_ROWS = 14;

var trackGrid = new Array(TRACK_COLS * TRACK_ROWS);
var tracksLeft = 0;


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
}

function ballReset() {
    "use strict";
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

function ballMove() {
    "use strict";
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (//RIGHT
        ballX > canvas.width &&
        ballSpeedX > 0.0
    ) {
        ballSpeedX *= -1;
    }
    if (//LEFT
        ballX < 0 &&
        ballSpeedX < 0.0
    ) {
        ballSpeedX *= -1;
    }
    if (
        ballY > canvas.height
    ) {//BOTTOM
        ballReset();
        trackReset();
        console.log("ha you lose");
    }
    if (//TOP
        ballY < 0 &&
        ballSpeedY < 0.0
        ) {
        ballSpeedY *= -1;
    }
}

function isTrackAtColRow(col, row) {
    "use strict";
    if (
        col >= 0
        && col < TRACK_COLS
        && row >= 0
        && row < TRACK_ROWS
    ) {
        var trackIndexUnderCoord = rowColToArrayIndex(col, row);
        return trackGrid[trackIndexUnderCoord];
    }else{
        return false;
    }
}

function ballTrackHandling() {
    "use strict";
    var ballTrackCol = Math.floor(ballX / TRACK_W);
    var ballTrackRow = Math.floor(ballY / TRACK_H);
    var trackIndexUnderBall = rowColToArrayIndex(ballTrackCol, ballTrackRow);

    if (
        ballTrackCol >= 0
        && ballTrackCol < TRACK_COLS
        && ballTrackRow >= 0
        && ballTrackRow < TRACK_ROWS
    ) {

        if (isTrackAtColRow(ballTrackCol, ballTrackRow)) {
            trackGrid[trackIndexUnderBall] = false;
            tracksLeft -= 1;
            //console.log(tracksLeft);

            var prevBallX = ballX - ballSpeedX;
            var prevBallY = ballY - ballSpeedY;
            var prevTrackCol = Math.floor(prevBallX / TRACK_W);
            var prevTrackRow = Math.floor(prevBallY / TRACK_H);

            var bothTestsFailed = true;
            if (prevTrackRow !== ballTrackRow) {
                if (isTrackAtColRow(prevTrackCol,
                    prevTrackRow) === false) {
                    ballSpeedY *= -1;
                    bothTestsFailed = false;
                }
            }
            if (prevTrackCol !== ballTrackCol) {
                if (isTrackAtColRow(ballTrackCol,
                    prevTrackRow)=== false) {
                    ballSpeedX *= -1;
                    bothTestsFailed = false;
                }
            }
            if (bothTestsFailed) {
                ballSpeedX *= -1;
                ballSpeedY *= -1;
            }
        }
    }
}



function moveAll() {
    "use strict";
    ballMove();
    ballTrackHandling();
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
    return TRACK_COLS * row + col;
}

function drawTracks() {
    "use strict";
    var eachRow;
    var eachCol;
    var arrayIndex;
    for (eachRow = 0; eachRow < TRACK_ROWS; eachRow += 1) {
        for (eachCol = 0; eachCol < TRACK_COLS; eachCol += 1) {

            arrayIndex = rowColToArrayIndex(eachCol, eachRow);

            if (trackGrid[arrayIndex]) {
                colorRect(
                    TRACK_W * eachCol,
                    TRACK_H * eachRow,
                    TRACK_W - TRACK_GAP,
                    TRACK_H - TRACK_GAP,
                    "blue"
                );
            }
        }
    }
}

function trackReset() {
    "use strict";
    tracksLeft = 0;
    var i;
    for (i = 0; i < 3 * TRACK_COLS; i += 1) {
        trackGrid[i] = false;
    }
    for (i = 3 * TRACK_COLS; i < TRACK_COLS * TRACK_ROWS; i += 1) {
        trackGrid[i] = true;
        tracksLeft += 1;
    }
}

function drawAll() {
    "use strict";
    colorRect(0, 0, canvas.width, canvas.height, "black");
    colorCircle(ballX, ballY, 10, "white");
    drawTracks();
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

    trackReset();
};
