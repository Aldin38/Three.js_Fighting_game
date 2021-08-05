const app = require('express')();
const http = require("http").Server(app);
const socketIo = require("socket.io")(http, {
  cors: {
    origin: '*',
  }
});

let position = {
  x: 200,
  y: 200
};

socketIo.on("connection", socket => {
  socket.emit("position", position);
  socket.on("move", data => {
    switch(data){
      case "left":
        position.x -= 5;
        socketIo.emit('position', position);
        break;
      case "right":
        position.x += 5;
        socketIo.emit('position', position);
        break;
      case "up":
        position.y -= 5;
        socketIo.emit('position', position);
        break;
      case "down":
        position.y += 5;
        socketIo.emit('position', position);
        break;
    }
  })
})

http.listen(3000, () => {
  console.log('running server on port 3000')
})
