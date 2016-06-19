var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var mdns = require('mdns');

var PORT = 8080;
var clientSocket = null;
var controllerSocket = null;

server.listen(PORT);

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

var nspClient = io.of('/client');
var nspController = io.of('/controller');

nspClient.on('connection', function (socket) {
    console.log('client connected');
    clientSocket = socket;

    clientSocket.emit('status', { status: 'up and running'} )
});

nspController.on('connection', function (socket) {
    console.log('controller connected');
    controllerSocket = socket;

    controllerSocket.emit('news', { hello: 'world' });

    controllerSocket.on('controller:play', function (data) {
        console.log('controller wants to play track!' + data.track);
        nspClient.emit('playtrack', { track: data.track });
    });
});

// advertise a http server on port 4321
var ad = mdns.createAdvertisement(mdns.tcp('http'), PORT, {
    name: "Lightworld"
});
ad.start();


console.log('Server listening on ' + PORT);
