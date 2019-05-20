const express = require('express'),
    app = express(),
    http = require("http").Server(app),
    io = require("socket.io")(http),
    path = require("path"),
    { promisify } = require("util");

app.use(express.static(path.join(__dirname, '..', 'dist')));



io.on('connection', socket => {

    socket.opponent = null;
    let usersOnline = Object.keys(io.of('/').connected);
    io.emit("newUserJoined", usersOnline);

    socket.on('fetchListOfUsers', () => {
        //emit this event again for user that just logged in
        io.emit("newUserJoined", usersOnline);
    })

    socket.on('requestMatch', id => {
        io.to(id).emit("gameRequested", socket.client.id);
    })

    socket.on('matchAccepted', id => {
        let opponent = io.sockets.connected[id];
        [socket.opponent, opponent.opponent] = [opponent, socket];
        socket.emit('')
    })

    socket.on('disconnect', () => {
        usersOnline.splice(usersOnline.indexOf(socket.id), 1);
        io.emit("userLeft", usersOnline);
        if (socket.opponent) socket.opponent.opponent = null;
        io.to(socket.opponent).emit("opponentDisconnected");
    })

});




app.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});





http.listen(3000, () => {
    console.log('listening on *:3000');
});

