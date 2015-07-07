window.onload = function() {
  var socket = io.connect();
  var map = new GMaps({
    el: '#map',
    lat: 5,
    lng: -30,
    zoom: 4
  });

  socket.on("connect", function() {
    console.log("Connected.");
  });

  socket.on("userJoin", function(data) {
    console.log(data);
    map.addMarker({
      lat: data.latitude,
      lng: data.longitude,
      title: data.nickname,
      infoWindow: {
        content: '<p>' + data.nickname + '</p>'
      }
    });
    map.setCenter(data.latitude, data.longitude);
  });

  socket.on("disconnect", function() {
    console.log("Disconnected.");
  });
};