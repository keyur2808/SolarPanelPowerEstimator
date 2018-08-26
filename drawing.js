function getBounds(polygon) {
    var bounds = new google.maps.LatLngBounds()
    polygon.getPath().forEach(function (element, index) { bounds.extend(element) })
    return bounds
}


function getDrawingManager() {
    return new google.maps.drawing.DrawingManager();
}

function drawPolygon(drawingManager) {
    drawingManager.setOptions({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [google.maps.drawing.OverlayType.POLYGON]
        },
        polygonOptions: {
            strokeColor: '#6c6c6c',
            strokeWeight: 3.5,
            fillColor: '#926239',
            fillOpacity: 0.6,
            editable: true,
            draggable: true
        }
    });

    // Loading the drawing Tool in the Map.
    drawingManager.setMap(map);
    google.maps.event.addListener(drawingManager, 'polygoncomplete', function (new_polygon) {
        if (polygon != null) {
            polygon.setMap(null);
            polygon = null;
            area = null;
            center = null;
        }
        if (cancelDrawingShape) {
            new_polygon.setMap(null);
            new_polygon = null;
            cancelDrawingShape = false;
        } else {
            polygon = new_polygon;
            area = google.maps.geometry.spherical.computeArea(polygon.getPath());
            center = getBounds(polygon).getCenter();
            var pos = {
                lat: center.lat(),
                lng: center.lng()
            };
            //location = new google.maps.LatLng(pos.lat, pos.lng);
            //marker.setPosition(location);
            showInfo(pos,area);
            //map.setCenter(pos);           
        }
        drawingManager.setDrawingMode(null);
    });
}

function showInfo(pos,area) {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        // code for modern browsers
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for old IE browsers
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var power = JSON.parse(this.responseText).outputs.dc_monthly[6];
            var infoWindow = new google.maps.InfoWindow;
            infoWindow.setPosition(pos);
            infoWindow.setContent('Position:(' + pos.lat + ',' + pos.lng + '),Nominal Power:' + power/730 + 'kWh');
            infoWindow.open(map);
        }
    };
    xmlhttp.open("GET", "https://developer.nrel.gov/api/pvwatts/v6.json?api_key=DEMO_KEY&lat="+pos.lat+"&lon="+pos.lng+"&system_capacity="+area*.016*0.8+"&azimuth=180&tilt=35&array_type=1&module_type=1&losses=15", true);
    xmlhttp.send();

}