const app = require('express')(),
    http = require("http").Server(app),
    io = require("socket.io")(http);


io.on('connection', function (socket) {
    console.log('a user connected');
});



http.listen(3000, () => {
    console.log('listening on *:3000');
});

