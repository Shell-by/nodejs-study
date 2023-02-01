const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const db = require("./dbconn");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

function escapeHtml(str) {
	var map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};
	return str.replace(/[&<>"']/g, function(m) { return map[m]; });
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/list.html");
});

io.sockets.on("connection", (socket) => {

  socket.on("data", (data) => {
    
    socket.host = data.user;
    socket.user = data.to;

    
    db.select("idx", "chat_room", `(host_user_idx = (SELECT idx FROM users WHERE id = '${socket.host}') AND member_user_idx = (SELECT idx FROM users WHERE id = '${socket.user}')) OR (host_user_idx = (SELECT idx FROM users WHERE id = '${socket.user}') AND member_user_idx = (SELECT idx FROM users WHERE id = '${socket.host}'))`, (error, idx) => {
      if (error) console.error(error);
      if (idx == "0") db.insert("chat_room", `NULL, (SELECT idx FROM users WHERE id = '${socket.host}'), (SELECT idx FROM users WHERE id =  '${socket.user}'), NOW()`);
      else socket.room = idx;
      socket.join(socket.room);
      socket.leave(socket.id);
    });
  });

  socket.on("chat", (msg) => {
    db.insert("chat", `NULL, '${socket.room}', (SELECT idx FROM users WHERE id = '${socket.host}'), '${escapeHtml(msg.chat)}', NOW()`);
    socket.to(socket.room).emit("chat", {msg: escapeHtml(msg.chat), id: socket.host});
  });

});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
