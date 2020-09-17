const express = require("express");
const path = require("path");
const app = express();
const { v4: uuidv4 } = require("uuid");
const { isObject } = require("util");
const server = require("http").Server(app);
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});
const io = require("socket.io")(server);

app.use("/peerjs", peerServer);
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//take the user to a unique uuid param
app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Listening on port ${port}`));

// socket config
io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);
  });
});
