const { PeerServer } = require("peer");

const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

var peer = new PeerServer(undefined, {
  path: "./peerjs",
  host: "/",
  port: "3030",
});

let myVideoStream;
// get video from the chrome
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
  });

peer.on("open", (id) => {
  // join with a specific room id
  socket.emit("join-room", ROOM_ID, id);
});

socket.on("user-connected", (userId) => {
  connectToNewUser(userId, stream);
});

const connectToNewUser = () => {
  console.log("connected new user");
};

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};
