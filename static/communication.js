var socket = io();

function sendData(dataName, data) {
    if(data === undefined) {
        socket.emit(dataName);
    } else {
        socket.emit(dataName, data);
    }

    // Sending something else to prevent data not sending immediately?
    ping();
}

function ping() {
    socket.emit('ping-request', (new Date).getTime());
}

var latencyDisplayElement = document.getElementById('latencyDisplay');

function displayLatency(latency) {
    var color = 'green';
    if(latency > 400 && latency < 1000) {
        color = 'orange';
    } else if(latency > 1000) {
        color = 'red';
    }

    var content = '<p><span style="color:' + color + ';">' + latency + '</span> ms</p>';

    latencyDisplayElement.innerHTML = content;
}

socket.on('ping-response', function(data) {
    var latency = (new Date).getTime() - data;

    displayLatency(latency);
});

setInterval(function() {
    ping();
}, 1000);