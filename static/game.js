var gameData = {};
var joined = false;
var playerTokenId = -1;
var currentDieValue = 1;

// Get initial game data
sendData('get-game-data');

function getMousePosition(event) {
    var rect = canvas.getBoundingClientRect();

    console.log(event)

    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    }
}

function mouseInsideRect(mousePosition, rect) {
    if((mousePosition.x >= rect.x && mousePosition.x <= rect.x + rect.w) && (mousePosition.y >= rect.y && mousePosition.y <= rect.y + rect.h)) {
        return true;
    }

    return false;
}

function dieClicked(mousePosition) {
    var x = 7 * squareWidth;
    var y = 7 * squareWidth;
    var w = squareWidth;

    return mouseInsideRect(mousePosition, {x: x, y: y, w: w, h:w});
}

function getTokenPosition(tokenId, token) {
    if(token.start !== -1) {
        return starts[tokenId][token.start];
    } else if(token.base !== -1) {
        return bases[tokenId][token.base];
    } else {
        return fields[token.field];
    }
}

function getTokenRect(tokenPosition) {
    var x = tokenPosition.x * squareWidth;
    var y = tokenPosition.y * squareWidth;
    var w = squareWidth;
    var h = squareWidth;

    return {x: x, y: y, w: w, h: h};
}

function tokenClicked(mousePosition) {
    for(var i = 0; i < 4; i++) {
        for(var j = 0; j < 4; j++) {
            if(mouseInsideRect(mousePosition, getTokenRect(getTokenPosition(i, gameData.tokens[i][j])))) {
                return {tokenId: i, tokenIndex: j};
            }
        }
    }

    return {tokenId: -1, tokenIndex: -1};
}

function playSound(source) {
    var sound = new Audio(source);
    sound.play();
}

canvas.addEventListener('mousedown', function(event) {
    var mousePosition = getMousePosition(event);

    var clickedTokenData = tokenClicked(mousePosition);

    if(clickedTokenData.tokenId !== -1) {
        sendData('token-clicked', clickedTokenData)
    }
});

const dieButton = document.getElementById('roll-die');

dieButton.addEventListener('click', function(event) {
    sendData('roll-die');
});


// Received game data
socket.on('game-data', function(data) {
    gameData = data;

    drawGameState();
});

// Received player joined
socket.on('player-joined', function(data) {
    gameData.players.push(data);

    if(socket.id === data.id) {
        joined = true;
        playerTokenId = data.tokenId;

        playSound('static/sound/join.mp3');
    }
});

// Received player left
socket.on('player-left', function(data) {
    for(var i = 0; i < gameData.players.length; i++) {
        if(gameData.players[i].id === data) {
            var tokenId = gameData.players[i].tokenId;

            gameData.players.splice(i, 1);
        }
    }
});

// Received join failed
socket.on('join-failed', function(data) {
    alert(data);
});

socket.on('die-rolled', function(data) {
    clearDie();
    drawDie(data);

    playSound('static/sound/die-roll.mp3');

    gameData.currentDieValue = data;
});

socket.on('move', function(data) {
    gameData.tokens = data;

    console.log(data);

    drawGameState();
});

socket.on('turn-changed', function(data) {
    gameData.playerTurn = data;

    if(gameData.playerTurn === playerTokenId) {
        playSound('static/sound/ding.mp3');
    }

    drawGameState();
});

function drawGameState() {
    clearBoard();
    drawBoard();
    drawDie(gameData.currentDieValue);

    drawStartCircle(gameData.playerTurn);

    gameData.tokens.forEach(function(playerTokens, tokenId) {
        playerTokens.forEach(function(token) {
            var currentField;

            if(token.start !== -1) {
                currentField = starts[tokenId][token.start];
            } else if(token.base !== -1) {
                currentField = bases[tokenId][token.base];
            } else {
                currentField = fields[token.field];
            }

            drawTokenOnField(currentField, tokenColorCodes[tokenId]);
        });
    });
}