var chatBox = document.getElementById('chatBox');
var messages    = document.getElementById('messages');

chatBox.addEventListener('keyup', function(e) {
    if(e.keyCode == 13) {
        sendData('message', chatBox.value);

        chatBox.value = '';
    }
});

function addMessage(sender, message, color) {
    var message = '<p><span style="color: ' + color + ';">' + sender + '</span>: ' + message + '</p>';

    messages.innerHTML += message;

    messages.scrollTop = messages.scrollHeight;
}

socket.on('message', function(data) {
    var sender = 'Anonymous';
    var color = '#000';

    if(data.sender !== -1) {
        sender = tokenColors[data.sender];
        color  = tokenColorCodes[data.sender];
    }

    addMessage(sender, data.message, color);
    
});

socket.on('server-message', function(data) {
    addMessage('Server', data, '#000');
});