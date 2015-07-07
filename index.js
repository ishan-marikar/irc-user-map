// IRC
var irc     = require("irc");
// Express
var express = require("express");
var app     = express();
// Web Server
var server  = require("http").Server(app);
// Socket.io
var io      = require("socket.io")(server);
// OS agnostic path concatenation
var path    = require("path");
// Port
var port = process.env.PORT || 8080;

// Setting up a static webserver with the contents of ./public
app.use(express.static(path.join(__dirname, "public")));

// configure the IRC client
var bot = new irc.Client("irc.freenode.net", "sammykhan", {
  debug: false,
  channels: ["##linux"],
  userName: "sammykhan",
  realName: "sammykhan"
});

// Import the IRC events
require("./bot")(io, bot);

// Start listening
console.log("Server/Bot is running on port " + port);
server.listen(port);
