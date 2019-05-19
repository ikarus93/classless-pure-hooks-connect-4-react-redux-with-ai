const express = require('express'),
    app = express(),
    http = require("http").Server(app),
    io = require("socket.io")(http),
    path = require("path"),
    { promisify } = require("util");

app.use(express.static(path.join(__dirname, '..', 'dist')));


const usersOnline = [];

io.on('connection', function (socket) {
    usersOnline.push(socket);
    io.emit("newUserJoined", usersOnline.map(x => x.client.id));
});


app.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});





http.listen(3000, () => {
    console.log('listening on *:3000');
});

