var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var clientSocket = null;
var controllerSocket = null;

server.listen(8080);

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

var nspClient = io.of('/client');
var nspController = io.of('/controller');

nspClient.on('connection', function (socket) {
    console.log("client connected");
    clientSocket = socket;

    clientSocket.emit('status', { status: 'up and running'} )
});

nspController.on('connection', function (socket) {
    controllerSocket = socket;

    controllerSocket.emit('news', { hello: 'world' });

    controllerSocket.on('controller:play', function (data) {
        console.log('controller wants to play track!' + data.track);
        nspClient.emit('playtrack', { track: data.track });
    });
});



console.log('Server listening on 8080');
