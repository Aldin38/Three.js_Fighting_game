const express = require("express");
const http = require("http").Server(express());
const socketIo = require("socket.io")(http);

let position = {
  x: 200,
  y: 200
};

socketIo.on("connection", socket => {
  socket.emit("position", position);
})

http.listen(300, () => {
  console.log('running server on port 3000')
})
