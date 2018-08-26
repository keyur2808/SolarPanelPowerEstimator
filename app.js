function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 42.3816688, lng: -71.0782263 },
        zoom: 19
    });
    return map;
}



