const express = require("express");
const app = express();
const dotenv = require("dotenv");
const router = express.Router();


// dotenv config 
dotenv.config();

// Set static path
app.use(express.static(__dirname + "/public"));

// body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

// Create server
const http = require("http");
const server = http.createServer(app);

// Set view engine
app.set("view engine", "ejs");


// Xu ly get request
app.get("/", (req, res) => {
	res.render("index");
});

// Web socket 
const { Server } = require("socket.io");
const io = new Server(server);

let users = {};
// Xu ly socket.io
io.on("connection", (socket) => {
	console.log("user connected");

	socket.on("newuser", (data) =>{
		users[socket.id] = data.username;
		socket.broadcast.emit("update-join", { username: data.username })
		io.emit("user-list", users);
	})

	socket.on("disconnect", () =>{
		const username = users[socket.id];
		socket.broadcast.emit("update-exit", {username: username})
		delete users[socket.id];
		io.emit("user-list", users);
	})

	socket.on("exituser", () =>{
		const username = users[socket.id];
		socket.broadcast.emit("update-exit", {username: username})
		delete users[socket.id];
		io.emit("user-list", users);
	})

	socket.on("on-chat", (data) => {
		console.log(data.username);
		socket.broadcast.emit("on-chat", { message: data.message, username: data.username });
	});
});



// Set port and server listener
const port = process.env.PORT || 5000;

server.listen(port, () => {
	console.log("http://localhost:" + port);
});
