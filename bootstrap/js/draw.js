    var Satellite = L.tileLayer('https://api.mapbox.com/styles/v1/jleopold/cjd303coe3wkh2rl0zoezvy8o/tiles/256/{z}/{x}/{y}?' + 'access_token=pk.eyJ1Ijoiamxlb3BvbGQiLCJhIjoiY2l5MXV2ZDIzMDAwMTMycGdxYnMwbTVvZiJ9.u54u0PD7k942ESruEVc8rg');

    var Streets = L.tileLayer('https://api.mapbox.com/styles/v1/jleopold/cjlgnrb6xa90w2smcaaihkexg/tiles/256/{z}/{x}/{y}?' + 'access_token=pk.eyJ1Ijoiamxlb3BvbGQiLCJhIjoiY2l5MXV2ZDIzMDAwMTMycGdxYnMwbTVvZiJ9.u54u0PD7k942ESruEVc8rg');

    var Light = L.tileLayer('https://api.mapbox.com/styles/v1/jleopold/cjdqrzpmt012c2sr1nmzcsyua/tiles/256/{z}/{x}/{y}?' + 'access_token=pk.eyJ1Ijoiamxlb3BvbGQiLCJhIjoiY2l5MXV2ZDIzMDAwMTMycGdxYnMwbTVvZiJ9.u54u0PD7k942ESruEVc8rg');

    var Pixar = L.tileLayer('https://api.mapbox.com/styles/v1/jleopold/cjaxih6oc06ri2squp8zw2yji/tiles/256/{z}/{x}/{y}?' + 'access_token=pk.eyJ1Ijoiamxlb3BvbGQiLCJhIjoiY2l5MXV2ZDIzMDAwMTMycGdxYnMwbTVvZiJ9.u54u0PD7k942ESruEVc8rg');
 
    var map = L.map('map',{
    center: [38, -95],
    zoomControl: false,
    zoom: 2,
    minZoom: 2,
    maxZoom: 18,
    maxBounds: [
        //south west
        [-80, -180],
        //north east
        [90, 180]
        ],
    attributionControl: false,
    layers: [Streets]
    });

    var layers = {
        "Streets": Streets,
        "Satellite": Satellite,
      //"Light": Light,
      //"Pixar": Pixar,
    };

    L.control.layers(layers).addTo(map);

    // Initialise the FeatureGroup to store editable layers
    var featureGroup = new L.FeatureGroup();
    map.addLayer(featureGroup);

    // Initialise the draw control and pass it the FeatureGroup of editable layers
    var drawControl = new L.Control.Draw({position: 'topleft',
        draw: {
            polyline : false,
            circle : false,
            marker : false,
            polygon: {
                  shapeOptions: {
                    color: '#00B1FF',
                    weight: 3,
                    opacity: 1,
                    fill: true,
                    fillColor: '#00B1FF', //same as color by default
                    fillOpacity: 0,

                  }
                },
            rectangle: {
                  shapeOptions: {
                    color: '#00B1FF',
                    weight: 3,
                    opacity: 1,
                    fill: true,
                    fillColor: '#00B1FF', //same as color by default
                    fillOpacity: 0,
                  }
                },
         },
        edit: {
            featureGroup: featureGroup,
            edit: true
        }
    });

    map.addControl(drawControl);


    map.on('draw:created', function(e) {

        // Each time a feature is created, it's added to the over arching feature group
        featureGroup.addLayer(e.layer);
    });

        document.getElementById('submit').onclick = function(e) {
            // Extract GeoJson from featureGroup
            var data = featureGroup.toGeoJSON();

            // Stringify the GeoJson
            var convertedData = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));

            
            document.getElementById('submit').setAttribute('href', 'data:' + convertedData);
            document.getElementById('submit').setAttribute('download','data.geojson');
        }
        
        
    //Geolocation!
    var lc = L.control.locate({
        strings: {
            title: 'Find Me!',
            popup: 'You are within {distance} {unit} from this point',
        },
        options: {
                   position: 'topleft',
                   setView: 'always',
                   cacheLocation: false
        },
        locateOptions: {
                   maxZoom: 18,
                   enableHighAccuracy: true,
                   cacheLocation: false
        },
        circleStyle: {
                color: 'springgreen',
                fillColor: '#00B1FF',
                fillOpacity: 0.25,
                weight: 1,
                opacity: 1
        },
        markerStyle: {
                color: '#00B1FF',
                fillColor: '#00B1FF',
                fillOpacity: .75,
                weight: 2,
                opacity: 1,
                radius: 5
        },
    }).addTo(map);
    
        //Other way to zoom to location, but not as accurate.
        //map.locate();

        //Move the map with the user's location.
        map.on('locationfound', function(e) {
        map.fitBounds(e.bounds, { maxZoom: 18});
        });   

    //Geocoder!
    // create the geocoding control and add it to the map
    var searchControl = L.esri.Geocoding.geosearch({
        position: 'topleft'
    }).addTo(map);

    // create an empty layer group to store the results and add it to the map
    var results = L.layerGroup().addTo(map);

    // listen for the results event and add every result to the map
    searchControl.on("results", function(data) {
        results.clearLayers();
        for (var i = data.results.length - 1; i >= 0; i--) {
            results.addLayer(L.marker(data.results[i].latlng));
        }
    });

    // Add attribution   
    var attribution = L.control.attribution();
        attribution.setPrefix('');
        attribution.addAttribution('<a href="https://www.esri.com/en-us/home">Esri</a> | <a href="https://www.mapbox.com/about/maps">© Mapbox</a> | <a href="http://openstreetmap.org/copyright">© OpenStreetMap contributors</a> | <a href="http://mapbox.com/map-feedback/" class="mapbox-improve-map">Improve this map</a>');
        attribution.addTo(map);



