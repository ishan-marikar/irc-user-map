# irc-user-map

A simple web app/irc bot that displays the location of anyone visiting an IRC channel.

To install dependencies:
```
npm install
```

To run:
```
npm start
```
or
```
node index.js
```
To configure, change the following fields in index.js
```
var bot = new irc.Client("irc.freenode.net", "nickname", {
  debug: false,
  channels: ["#channel"],
  userName: "username",
  realName: "realname"
});
```
