var request = require("request");

module.exports = function(io, bot) {
  // This is where we store the current users
  var currentUsers = {};

  // Listen for errors
  bot.addListener("error", function(message) {
    console.error("ERROR: %s: %s", message.command, message.args.join(" "));
  });

  // Listen for user "join" events
  bot.addListener("join", function(channel, who, message) {
    // Check to see if the host of the user is not either from services or is
    // undefined
    if ( (typeof message.host !== "undefined") && (message.host !== "services") ) {

      try {
        var ip = message.host;
        // check to see if the hostname field has slashes, which is unnatural
        // in normal hostnames, but pretty common with web-based IRC clients
        // like KiwiIRC.
        // gateway/web/cgi-irc/kiwiirc.com/ip.127.0.0.1
        if (ip.indexOf("/") > -1) {
          // extract the IP address using a regular expression
          ip = message.host.match("[0-9]+(?:\.[0-9]+){3}")[0];
          // so the variable now contains 127.0.0.1 from the above
          // string
        }
        // concatenate it with the API"s base URL
        var url = "http://ip-api.com/json/" + ip;
        // and fire off a request..
        request(url, function(error, response, body) {
          // parse the JSON response and format it into an elegant dictionary
          // which the client end can parse without the excessive bloat
          try {
            var jsonResponse = JSON.parse(body);
          }
          catch (error){
            console.log("Parsing error: ", error);
          }
          var data = {
            status: "join",
            nickname: who,
            channel: channel,
            country: jsonResponse.country,
            countryCode: jsonResponse.countryCode,
            city: jsonResponse.city,
            latitude: jsonResponse.lat,
            longitude: jsonResponse.lon
          };
          // append the user into the global dictionary of currentUsers
          currentUsers[who] = data;
          console.log(data);
          // .. and then finally emit it to the clients
          io.emit("userJoin", data);
        });
        // Oh noes. Something went wrong.
      } catch (exception) {
        // I knew it. The user is probably running a cloak.
        // (which, honestly, is a good thing.)
        console.log("I can't seem to find a location on that name: " + exception);
      }
    }
  });

  // "Till death do we part"
  // Listen for the user"s parting messages
  bot.addListener("part", function(channel, who, reason, message) {
    // Delete the user"s entry in the currentUsers dictionary
    // if it exists
    delete currentUsers[who];
    // create a nice little dictionary with the data we need
    var data = {
      status: "leave",
      nickname: who,
      channel: channel
    };
    // and fire it off to the client
    io.emit("userLeave", data);
  });

  // Whenever a user connects to the website
  io.sockets.on("connection", function(socket) {
    // send him the data we have collected in the currentUsers dictionary
    for (var user in currentUsers) {
      io.sockets.connected[socket.id].emit("userJoin", currentUsers[user]);
    }
  });
};
