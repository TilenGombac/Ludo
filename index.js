// GAME CONSTANTS
var tokenColors = [
    'Red',    // 0
    'Blue',   // 1
    'Yellow', // 2
    'Green'   // 3
];

// Probably messed up
const startingFieldIndexes = [
    3, 16, 29, 42
];

const baseEnterFieldIndexes = [
    1, 14, 27, 40
];

const initialTokenStates = [
    [
        {start: 0, field: -1, base: -1},
        {start: 1, field: -1, base: -1},
        {start: 2, field: -1, base: -1},
        {start: 3, field: -1, base: -1}
    ],
    [
        {start: 0, field: -1, base: -1},
        {start: 1, field: -1, base: -1},
        {start: 2, field: -1, base: -1},
        {start: 3, field: -1, base: -1}
    ],
    [
        {start: 0, field: -1, base: -1},
        {start: 1, field: -1, base: -1},
        {start: 2, field: -1, base: -1},
        {start: 3, field: -1, base: -1}
    ],
    [
        {start: 0, field: -1, base: -1},
        {start: 1, field: -1, base: -1},
        {start: 2, field: -1, base: -1},
        {start: 3, field: -1, base: -1}
    ]
];


// Dependencies
var socketIO = require('socket.io');
var express  = require('express');
var http     = require('http');
var path     = require('path');

// Server setup
var app    = express();
var server = http.Server(app);
var io     = socketIO(server);

app.set('port', 8080);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
server.listen(8080, function() {
    var port = server.address().port;
    console.log('Server running on port %s', port);
});

var gameData = {
    tokens: initialTokenStates,
    currentDieValue: 1,
    playerTurn: 0,
    players: [
    ]
};

var rollsAvailable = 3;
var movePending = false;

function isTokenIdAvailable(tokenId) {
    for(var i = 0; i < gameData.players.length; i++) {
        if(gameData.players[i].tokenId === tokenId) {
            return false;
        }
    }

    return true;
}

function playerIdExists(playerId) {
    for(var i = 0; i < gameData.players.length; i++) {
        if(gameData.players[i].id === playerId) {
            return true;
        }
    }

    return false;
}

function getPlayerTokenId(playerId) {
    for(var i = 0; i < gameData.players.length; i++) {
        if(gameData.players[i].id === playerId) {
            return gameData.players[i].tokenId;
        }
    }

    return -1;
}

function removePlayer(playerId) {
    for(var i = 0; i < gameData.players.length; i++) {
        if(gameData.players[i].id === playerId) {
            var tokenId = gameData.players[i].tokenId;

            gameData.players.splice(i, 1);

            return tokenId;
        }
    }
    
    return -1;
}

function sendMessage(message, sender) {
    if(sender === 'server') {
        io.sockets.emit('server-message', message);
    } else {
        io.sockets.emit('message', {sender: sender, message: message});
    }
}

function allTokensOnStart(tokenId) {
    for(var i = 0; i < 4; i++) {
        if(gameData.tokens[tokenId][i].start != -1) {
            return false;
        }
    }

    return true;
}

function allTokensInBase(tokenId) {
    for(var i = 0; i < 4; i++) {
        var token = gameData.tokens[tokenId][i];
        if(token.base === -1 || token.base === 4) {
            return false;
        }
    }

    return true;
}

function hasTokensOnFields(tokenId) {
    for(var i = 0; i < 4; i++) {
        if(gameData.tokens[tokenId][i].field != -1) {
            return true;
        }
    }

    return false;
}

function canLeaveStart(tokenId, tokenIndex) {
    var fieldId = startingFieldIndexes[tokenId];

    if(canMoveToField(fieldId, tokenId, tokenIndex)) {
        return true;
    }

    return false;
}

function leaveStart(tokenId, tokenIndex) {
    if(canLeaveStart(tokenId, tokenIndex)) {
        var fieldId = startingFieldIndexes[tokenId];

        moveToField(fieldId, tokenId, tokenIndex);
        gameData.tokens[tokenId][tokenIndex].start = -1;
    }
}

function canMoveToField(fieldId, tokenId) {
    for(var i = 0; i < 4; i++) {
        if(gameData.tokens[tokenId][i].field === fieldId) {
            return false;
        }
    }

    return true;
}

function availableBaseIndexes(tokenId) {
    var available = [0, 1, 2, 3, 4];

    for(var i = 0; i < 4; i++) {
        if(gameData.tokens[tokenId][i].base !== -1) {
            var index = available.indexOf(gameData.tokens[tokenId][i].base);

            available.splice(index, 1);
        }
    }

    return available;
}

function firstAvailableStartIndex(tokenId) {
    var available = [0, 1, 2, 3];

    for(var i = 0; i < 4; i++) {
        if(gameData.tokens[tokenId][i].start !== -1) {
            var index = available.indexOf(gameData.tokens[tokenId][i].start);

            available.splice(index, 1);
        }
    }

    return available[0];
}

function getTargetBaseIndex(currentFieldId, tokenId) {
    var targetBaseIndex = (currentFieldId + gameData.currentDieValue) % 52 - baseEnterFieldIndexes[tokenId] - 1;

    return targetBaseIndex;
}

function moveTokenToBase(tokenId, tokenIndex, baseId) {
    gameData.tokens[tokenId][tokenIndex].field = -1;
    gameData.tokens[tokenId][tokenIndex].start = -1;
    gameData.tokens[tokenId][tokenIndex].base  = baseId;
}

function moveTokenToStart(fieldId) {
    for(var i = 0; i < 4; i++) {
        for(var j = 0; j < 4; j++) {
            if(gameData.tokens[i][j].field === fieldId) {
                gameData.tokens[i][j].field = -1;
                gameData.tokens[i][j].start = firstAvailableStartIndex(i);
            }
        }
    }
}

function canAdvanceInBase(tokenId, tokenIndex) {
    var targetBaseId = gameData.tokens[tokenId][tokenIndex].base + gameData.currentDieValue;

    if(availableBaseIndexes(tokenId).indexOf(targetBaseId) !== -1) {
        return true;
    }

    return false;
}

function advanceInBase(tokenId, tokenIndex) {
    if(canAdvanceInBase(tokenId, tokenIndex)) {
        var targetBaseId = gameData.tokens[tokenId][tokenIndex].base + gameData.currentDieValue;

        gameData.tokens[tokenId][tokenIndex].base = targetBaseId;
    }
}

function moveToField(fieldId, tokenId, tokenIndex) {
    // Only move to field or into base if the token is not in base yet
    if(gameData.tokens[tokenId][tokenIndex].base === -1) {
        // if taken by another token
        moveTokenToStart(fieldId);

        var currentFieldId = gameData.tokens[tokenId][tokenIndex].field;

        if(shouldMoveToBase(tokenId, tokenIndex)) {
            console.log('Should');
            if(canMoveToBase(tokenId, tokenIndex)) {
                console.log('Can!');
                moveTokenToBase(tokenId, tokenIndex, getTargetBaseIndex(currentFieldId, tokenId));
            }
        } else {
            gameData.tokens[tokenId][tokenIndex].field = fieldId;
        }

        return true;
    }

    return false;
}

function shouldMoveToBase(tokenId, tokenIndex) {
    var currentFieldId = gameData.tokens[tokenId][tokenIndex].field;

    if(currentFieldId != -1) {
        console.log(currentFieldId);
        console.log('Enter at: ' + baseEnterFieldIndexes[tokenId]);
        console.log('Target: ' + targetFieldId(tokenId, tokenIndex));
        if(currentFieldId <= baseEnterFieldIndexes[tokenId] && targetFieldId(tokenId, tokenIndex) > baseEnterFieldIndexes[tokenId]) {
            return true;
        }

        // Special case for red as the field id is not always smaller when entering the base is available
        if(tokenId === 0) {
            if(currentFieldId >= 48 && (currentFieldId + gameData.currentDieValue) % 52 > 1) {
                return true;
            }
        }
    }

    return false;
}

function canMoveToBase(tokenId, tokenIndex) {
    var currentFieldId = gameData.tokens[tokenId][tokenIndex].field;
           
    var targetBaseIndex = getTargetBaseIndex(currentFieldId, tokenId);

    if(availableBaseIndexes(tokenId).indexOf(targetBaseIndex) != -1) {
        return true;
    }
    
    return false;
}

function isPlayerTurn(playerId) {
    for(var i = 0; i < gameData.players.length; i++) {
        if(gameData.players[i].id === playerId && gameData.players[i].tokenId === gameData.playerTurn) {
            return true;
        }
    }

    return false;
}

function targetFieldId(tokenId, tokenIndex) {
    var fieldId = gameData.tokens[tokenId][tokenIndex].field;

    fieldId = (fieldId + gameData.currentDieValue) % 52;

    return fieldId;
}

function hasTokensInBase(tokenId) {
    for(var i = 0; i < 4; i++) {
        if(gameData.tokens[tokenId].base !== -1) {
            return true;
        }
    }

    return false;
}

function passTurn() {
    for(var i = 0; i < 4; i++) {
        var turnId = (gameData.playerTurn + i + 1) % 4;

        // A player is using this token
        if(isTokenIdAvailable(turnId) === false) {
            gameData.playerTurn = turnId;

            if(hasTokensOnFields(gameData.playerTurn) === true) {
                rollsAvailable = 1;
            } else {
                rollsAvailable = 3;
            }

            io.sockets.emit('turn-changed', gameData.playerTurn);

            return true;
        }
    }

    return false;
}

function hasLegalMoves(tokenId) {
    // Die value is 6, check if the player has tokens on start and can enter the game
    if(gameData.currentDieValue === 6) {
        for(var i = 0; i < 4; i++) {
            if(gameData.tokens[tokenId][i].start != -1) {
                if(canLeaveStart(tokenId, i)) {
                    return true;
                }
            }
        }
    }
    if(hasTokensOnFields(tokenId)) {
        // Has tokens on fields, check if they should & can move to base
        for(var i = 0; i < 4; i++) {
            if(shouldMoveToBase(tokenId, i)) {
                if(canMoveToBase(tokenId, i)) {
                    return true;
                }
            }
        }

        // Check if the tokens not needing to enter base have legal fields available
        for(var i = 0; i < 4; i++) {
            if(gameData.tokens[tokenId][i].field !== -1) {
                if(shouldMoveToBase(tokenId, i) === false) {
                    if(canMoveToField(targetFieldId(tokenId, i), tokenId)) {
                        return true;
                    }
                }
            }
        }
    }
    if(hasTokensInBase(tokenId)) {
        for(var i = 0; i < 4; i++) {
            if(gameData.tokens[tokenId][i].base !== -1) {
                if(canAdvanceInBase(tokenId, i)) {
                    return true;
                }
            }
        }
    }

    return false;
}

function hasFinished(tokenId) {
    for(var i = 0; i < 4; i++) {
        if(gameData.tokens[tokenId][i].base <= 0) {
            return false;
        }
    }

    return true;
}

// WebSocket handlers
io.on('connection', function(socket) {

    socket.on('ping-request', function(data) {
        socket.emit('ping-response', data);
    });

    socket.on('get-game-data', function(data) {
        socket.emit('game-data', gameData);
    });

    socket.on('roll-die', function(data) {
        var tokenId = getPlayerTokenId(socket.id);

        if(tokenId === gameData.playerTurn) {
            if(rollsAvailable > 0 && movePending === false) {
                gameData.currentDieValue = Math.floor(Math.random() * 6 + 1);

                io.sockets.emit('die-rolled', gameData.currentDieValue);

                if(hasLegalMoves(tokenId)) {
                    movePending = true;
                }

                rollsAvailable--;

                console.log(gameData.currentDieValue);

                if(gameData.currentDieValue === 6) {
                    // Can roll again
                    rollsAvailable = 1;
                }

                if(rollsAvailable <= 0 && movePending === false) {
                    passTurn();
                }
            }
        }
    });

    socket.on('token-clicked', function(data) {
        // The player hasn't joined the game yet
        if(playerIdExists(socket.id) === false) {
            if(isTokenIdAvailable(data.tokenId) === true) {
                // Player can join the game with this token
                var playerData = {
                    id: socket.id,
                    tokenId: data.tokenId
                };

                gameData.players.push(playerData);

                io.sockets.emit('player-joined', playerData);

                sendMessage(tokenColors[playerData.tokenId] + ' joined the game.', 'server');
            } else {
                socket.emit('join-failed', 'Token not available.');
            }
        } else {
            if(movePending) {
                if(isPlayerTurn(socket.id) && data.tokenId === getPlayerTokenId(socket.id)) {
                    var tokenId    = data.tokenId;
                    var tokenIndex = data.tokenIndex;
    
                    var fieldId = targetFieldId(tokenId, tokenIndex);

                    // The token is on start
                    if(gameData.tokens[tokenId][tokenIndex].start != -1) {
                        if(gameData.currentDieValue === 6) {
                            // Die value is 6, attempt to move to the starting field
                            leaveStart(tokenId, tokenIndex);

                            movePending = false;
                        }
                    } else if(canMoveToField(fieldId, tokenId)) {
                        if(moveToField(fieldId, tokenId, tokenIndex)) {
                            // token moved to field or into base
                        } else {
                            advanceInBase(tokenId, tokenIndex);
                        }

                        movePending = false;

                        if(rollsAvailable <= 0) {
                            passTurn();
                        }
                    }

                    io.sockets.emit('move', gameData.tokens);
                }
            }
        }
    });

    socket.on('message', function(data) {
        io.sockets.emit('message', {sender: getPlayerTokenId(socket.id), message: data});
    });

    socket.on('disconnect', function() {
        var tokenId = removePlayer(socket.id);
        
        if(tokenId !== -1) {
            io.sockets.emit('player-left', socket.id);
            sendMessage(tokenColors[tokenId] + ' left the game.', 'server');
        }
    });
});