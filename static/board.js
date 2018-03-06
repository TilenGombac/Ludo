// GAME CONSTANTS
const starts = [
    [
        {x: 11, y: 2},
        {x: 12, y: 2},
        {x: 11, y: 3},
        {x: 12, y: 3}
    ],
    [
        {x: 11, y: 11},
        {x: 12, y: 11},
        {x: 11, y: 12},
        {x: 12, y: 12}
    ],
    [
        {x: 2, y: 11},
        {x: 3, y: 11},
        {x: 2, y: 12},
        {x: 3, y: 12}
    ],
    [
        {x: 2, y: 2},
        {x: 3, y: 2},
        {x: 2, y: 3},
        {x: 3, y: 3}
    ]
];

const bases = [
    [
        {x: 7, y: 1},
        {x: 7, y: 2},
        {x: 7, y: 3},
        {x: 7, y: 4},
        {x: 7, y: 5}
    ],
    [
        {x: 13, y: 7},
        {x: 12, y: 7},
        {x: 11, y: 7},
        {x: 10, y: 7},
        {x: 9, y: 7}
    ],
    [
        {x: 7, y: 13},
        {x: 7, y: 12},
        {x: 7, y: 11},
        {x: 7, y: 10},
        {x: 7, y: 9}
    ],
    [
        {x: 1, y: 7},
        {x: 2, y: 7},
        {x: 3, y: 7},
        {x: 4, y: 7},
        {x: 5, y: 7},
    ]
];

const fields = [
    {x: 6, y: 0},
    {x: 7, y: 0},
    {x: 8, y: 0},
    {x: 8, y: 1},
    {x: 8, y: 2},
    {x: 8, y: 3},
    {x: 8, y: 4},
    {x: 8, y: 5},
    {x: 9, y: 6},
    {x: 10, y: 6},
    {x: 11, y: 6},
    {x: 12, y: 6},
    {x: 13, y: 6},
    {x: 14, y: 6},
    {x: 14, y: 7},
    {x: 14, y: 8},
    {x: 13, y: 8},
    {x: 12, y: 8},
    {x: 11, y: 8},
    {x: 10, y: 8},
    {x: 9, y: 8},
    {x: 8, y: 9},
    {x: 8, y: 10},
    {x: 8, y: 11},
    {x: 8, y: 12},
    {x: 8, y: 13},
    {x: 8, y: 14},
    {x: 7, y: 14},
    {x: 6, y: 14},
    {x: 6, y: 13},
    {x: 6, y: 12},
    {x: 6, y: 11},
    {x: 6, y: 10},
    {x: 6, y: 9},
    {x: 5, y: 8},
    {x: 4, y: 8},
    {x: 3, y: 8},
    {x: 2, y: 8},
    {x: 1, y: 8},
    {x: 0, y: 8},
    {x: 0, y: 7},
    {x: 0, y: 6},
    {x: 1, y: 6},
    {x: 2, y: 6},
    {x: 3, y: 6},
    {x: 4, y: 6},
    {x: 5, y: 6},
    {x: 6, y: 5},
    {x: 6, y: 4},
    {x: 6, y: 3},
    {x: 6, y: 2},
    {x: 6, y: 1}
];

const tokenColors = [
    'Red',
    'Blue',
    'Yellow',
    'Green'
];


var canvas = document.getElementById('board');
var context = canvas.getContext('2d');

const greenSquareColor  = '#43A047';
const blueSquareColor   = '#2962FF';
const redSquareColor    = '#E53935';
const yellowSquareColor = '#FFEA00';

const tokenColorCodes = [
    '#F44336', '#2196F3', '#FFEE58', '#4CAF50'
];

var squareWidth = canvas.width / 15;

function drawBoard() {
    var squareWidth = canvas.width / 15;

    drawGreenSquares();
    drawBlueSquares();
    drawRedSquares();
    drawYellowSquares();

    drawLines();
}

function drawGreenSquares() {
    for(var i = 1; i < 6; i++) {
        drawSquare(i, 7, greenSquareColor);
    }

    drawSquare(1, 6, greenSquareColor);

    drawSquare(2, 2, greenSquareColor);
    drawSquare(2, 3, greenSquareColor, 0, 2);
    drawSquare(3, 2, greenSquareColor, 2, 0);
    drawSquare(3, 3, greenSquareColor, 2, 2);
}

function drawBlueSquares() {
    for(var i = 9; i < 14; i++) {
        drawSquare(i, 7, blueSquareColor);
    }

    drawSquare(13, 8, blueSquareColor);

    drawSquare(11, 11, blueSquareColor);
    drawSquare(11, 12, blueSquareColor, 0, 2);
    drawSquare(12, 11, blueSquareColor, 2, 0);
    drawSquare(12, 12, blueSquareColor, 2, 2);
}

function drawRedSquares() {
    for(var i = 1; i < 6; i++) {
        drawSquare(7, i, redSquareColor);
    }

    drawSquare(8, 1, redSquareColor);

    drawSquare(11, 2, redSquareColor);
    drawSquare(11, 3, redSquareColor, 0, 2);
    drawSquare(12, 2, redSquareColor, 2, 0);
    drawSquare(12, 3, redSquareColor, 2, 2);
}

function drawYellowSquares() {
    for(var i = 9; i < 14; i++) {
        drawSquare(7, i, yellowSquareColor);
    }

    drawSquare(6, 13, yellowSquareColor);

    drawSquare(2, 11, yellowSquareColor);
    drawSquare(2, 12, yellowSquareColor, 0, 2);
    drawSquare(3, 11, yellowSquareColor, 2, 0);
    drawSquare(3, 12, yellowSquareColor, 2, 2);
}

function drawSquare(i_x, i_y, color, offset_x = 0, offset_y = 0) {
    var x = i_x * squareWidth + offset_x;
    var y = i_y * squareWidth + offset_y;

    context.beginPath();
    context.fillStyle = color;
    context.fillRect(x, y, squareWidth, squareWidth);
    context.closePath();
}

// Bordering lines
function drawLines() {
    drawLine(0, squareWidth * 6, canvas.width, squareWidth * 6); // Top
    drawLine(0, squareWidth * 9, canvas.width, squareWidth * 9); // Bottom
    drawLine(squareWidth * 6, 0, squareWidth * 6, canvas.height); // Left
    drawLine(squareWidth * 9, 0, squareWidth * 9, canvas.height); // Right

    drawTopRectangleDividers();
    drawBottomRectangleDividers();
    drawLeftRectangleDividers();
    drawRightRectangleDividers();
}

function drawTopRectangleDividers() {
    var x_1 = squareWidth * 6;
    var x_2 = squareWidth * 9;

    // Horizontal
    for(var i = 1; i < 6; i++) {
        drawLine(x_1, i * squareWidth, x_2, i * squareWidth);
    }

    // Vertical
    drawLine(x_1 + squareWidth, 0, x_1 + squareWidth, squareWidth * 6);
    drawLine(x_2 - squareWidth, 0, x_2 - squareWidth, squareWidth * 6);
}

function drawBottomRectangleDividers() {
    var x_1 = squareWidth * 6;
    var x_2 = squareWidth * 9;

    // Horizontal
    for(var i = 10; i < 15; i++) {
        drawLine(x_1, i * squareWidth, x_2, i * squareWidth);
    }

    // Vertical
    drawLine(x_1 + squareWidth, squareWidth * 9, x_1 + squareWidth, squareWidth * 15);
    drawLine(x_2 - squareWidth, squareWidth * 9, x_2 - squareWidth, squareWidth * 15);
}

function drawLeftRectangleDividers() {
    var y_1 = squareWidth * 6;
    var y_2 = squareWidth * 9;

    // Vertical
    for(var i = 1; i < 6; i++) {
        drawLine(i * squareWidth, y_1, i * squareWidth, y_2);
    }

    // Horizontal
    drawLine(0, y_1 + squareWidth, squareWidth * 6, y_1 + squareWidth);
    drawLine(0, y_2 - squareWidth, squareWidth * 6, y_2 - squareWidth);
}

function drawRightRectangleDividers() {
    var y_1 = squareWidth * 6;
    var y_2 = squareWidth * 9;

    // Vertical
    for(var i = 10; i < 15; i++) {
        drawLine(i * squareWidth, y_1, i * squareWidth, y_2);
    }

    // Horizontal
    drawLine(squareWidth * 9, y_1 + squareWidth, squareWidth * 15, y_1 + squareWidth);
    drawLine(squareWidth * 9, y_2 - squareWidth, squareWidth * 15, y_2 - squareWidth);

}

function drawLine(x_1, y_1, x_2, y_2) {
    context.beginPath();
    context.moveTo(x_1, y_1);
    context.lineTo(x_2, y_2);
    context.stroke();
    context.closePath();
}

function drawToken(i_x, i_y, color) {

    var x = i_x * squareWidth + squareWidth / 2;
    var y = i_y * squareWidth + squareWidth / 2;

    context.beginPath();
    context.arc(x, y, squareWidth / 3, 0, 2 * Math.PI, false);
    context.fillStyle = color;
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = '#000';
    context.stroke();
    context.closePath();
}

function clearSquare(i_x, i_y) {
    var x = i_x * squareWidth + 1;
    var y = i_y * squareWidth + 1;
    var w = squareWidth - 2;
    
    context.clearRect(x, y, w, w);
}

function clearBoard() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function clearDie() {
    var x = squareWidth * 7 - 1;
    var y = squareWidth * 7 - 1;
    var w = squareWidth + 2

    context.clearRect(x, y, w, w);
}

function drawDieCircle(i_x, i_y) {
    var base = 7 * squareWidth;

    var indexPositions = [
        base + 12, base + squareWidth / 2, base + squareWidth - 12
    ];

    var x = indexPositions[i_x];
    var y = indexPositions[i_y];

    context.beginPath();
    context.arc(x, y, 4, 0, 2 * Math.PI, false);
    context.fillStyle = 'black';
    context.fill();
    context.closePath();
}

// To indicate which token the player is playing with...
function drawStartCircle(tokenId) {
    var x = (tokenId == 0 || tokenId == 1) ? canvas.width - squareWidth * 3 : squareWidth * 3;
    var y = (tokenId == 0 || tokenId == 3) ? squareWidth * 3 : canvas.width - squareWidth * 3;

    context.beginPath();
    context.arc(x, y, squareWidth * 2, 0, 2 * Math.PI, false);
    context.lineStyle = 'black';
    context.stroke();
    context.closePath();
}

function drawDie(number) {
    // die border
    drawSquare(7, 7, 'black');
    clearSquare(7, 7);

    if(number === 1) {
        drawDieCircle(1, 1);
    } else if(number === 2) {
        drawDieCircle(0, 0);
        drawDieCircle(2, 2);
    } else if(number === 3) {
        drawDieCircle(0, 0);
        drawDieCircle(1, 1);
        drawDieCircle(2, 2);
    } else if(number === 4) {
        drawDieCircle(0, 0);
        drawDieCircle(0, 2);
        drawDieCircle(2, 0);
        drawDieCircle(2, 2);
    } else if(number === 5) {
        drawDieCircle(0, 0);
        drawDieCircle(0, 2);
        drawDieCircle(2, 0);
        drawDieCircle(2, 2);
        drawDieCircle(1, 1);
    } else if(number === 6) {
        drawDieCircle(0, 0);
        drawDieCircle(0, 1);
        drawDieCircle(0, 2);
        drawDieCircle(2, 0);
        drawDieCircle(2, 1);
        drawDieCircle(2, 2);
    }
}

drawBoard();