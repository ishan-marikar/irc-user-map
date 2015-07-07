var map;
var socket;
var users = {};
var mapStyle = [{
    "featureType": "all",
    "elementType": "labels.text.fill",
    "stylers": [{
        "saturation": 36
    }, {
        "color": "#000000"
    }, {
        "lightness": 40
    }]
}, {
    "featureType": "all",
    "elementType": "labels.text.stroke",
    "stylers": [{
        "visibility": "on"
    }, {
        "color": "#000000"
    }, {
        "lightness": 16
    }]
}, {
    "featureType": "all",
    "elementType": "labels.icon",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "administrative",
    "elementType": "geometry.fill",
    "stylers": [{
        "color": "#000000"
    }, {
        "lightness": 20
    }]
}, {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [{
        "color": "#000000"
    }, {
        "lightness": 17
    }, {
        "weight": 1.2
    }]
}, {
    "featureType": "landscape",
    "elementType": "geometry",
    "stylers": [{
        "color": "#000000"
    }, {
        "lightness": 20
    }]
}, {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [{
        "color": "#000000"
    }, {
        "lightness": 21
    }]
}, {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [{
        "color": "#000000"
    }, {
        "lightness": 17
    }]
}, {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [{
        "color": "#000000"
    }, {
        "lightness": 29
    }, {
        "weight": 0.2
    }]
}, {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [{
        "color": "#000000"
    }, {
        "lightness": 18
    }]
}, {
    "featureType": "road.local",
    "elementType": "geometry",
    "stylers": [{
        "color": "#000000"
    }, {
        "lightness": 16
    }]
}, {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [{
        "color": "#000000"
    }, {
        "lightness": 19
    }]
}, {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{
        "color": "#000000"
    }, {
        "lightness": 17
    }]
}];

function initialize() {
    var mapCanvas = document.getElementById("map");
    var mapOptions = {
        center: new google.maps.LatLng(5, -30),
        zoom: 3,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(mapCanvas, mapOptions);
    map.set("styles", mapStyle);
}

function createMarker(data) {
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.latitude, data.longitude),
        animation: google.maps.Animation.DROP,
        title: data.nickname
    });
    users[data.nickname] = marker;
    marker.setMap(map);
    map.setCenter({
        lat: data.latitude,
        lng: data.longitude
    });
    map.panTo({lat: data.latitude, lng: data.longitude});
    createInfoWindow(marker, data);
}

function deleteMarker(data) {
    var marker = users[data.nickname];
    marker.setMap(null);
}

function clearAllMarkers() {
    for (var singleMarker in users) {
        delete user[singleMarker];
    }
    user.length = 0;
}

var lastOpenInfoWin = null;

function createInfoWindow(marker, data) {
    var infowindow = new google.maps.InfoWindow({
        content: data.nickname,
        maxWidth: 150
    });
    google.maps.event.addListener(marker, 'click', function() {
        if (lastOpenInfoWin) {
            lastOpenInfoWin.close();
        }
        lastOpenInfoWin = infowindow;
        infowindow.open(marker.get('map'), marker);
    });
}

google.maps.event.addDomListener(window, 'load', initialize);
socket = io.connect();
socket.on("connect", function() {
    console.log("Connected to the server.");
});
socket.on("userJoin", function(data) {
    console.log(data);
    createMarker(data);
});
socket.on("userLeave", function(data) {
    console.log(data);
    deleteMarker(data);
});
socket.on("disconnect", function() {
    console.log("Disconnected from server.");
});