function getGeoControl(map) {
    geoloccontrol = new klokantech.GeolocationControl(map, 20);
    return geoloccontrol;
}

function initMarker(){
    marker = new google.maps.Marker({
        clickable: false,
        icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
            new google.maps.Size(22, 22),
            new google.maps.Point(0, 18),
            new google.maps.Point(11, 11)),
        shadow: null,
        zIndex: 999,
        map: map
    });
    return marker;
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

function attempt_geolocation(map,marker,infoWindow) {
    var location=null;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            location = new google.maps.LatLng(pos.lat, pos.lng);
            marker.setPosition(location);

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
            searchBar();           
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
            searchBar();
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
        searchBar();
    }
    return location;
}
