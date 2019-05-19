const app = require('express')(),
    http = require("http").Server(app),
    io = require("socket.io")(http),
    { promisify } = require("util");


const usersOnline = [];

io.on('connection', function (socket) {
    usersOnline.push(socket);
    io.emit("newUserJoined", usersOnline.map(x => x.client.id));
});


(async () => {
    con

})();





http.listen(3000, () => {
    console.log('listening on *:3000');
});

