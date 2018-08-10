    var Satellite = L.tileLayer('https://api.mapbox.com/styles/v1/jleopold/cjd303coe3wkh2rl0zoezvy8o/tiles/256/{z}/{x}/{y}?' + 'access_token=pk.eyJ1Ijoiamxlb3BvbGQiLCJhIjoiY2l5MXV2ZDIzMDAwMTMycGdxYnMwbTVvZiJ9.u54u0PD7k942ESruEVc8rg');

    var Streets = L.tileLayer('https://api.mapbox.com/styles/v1/jleopold/cjev2fxuxcdxp2ro2ctte1239/tiles/256/{z}/{x}/{y}?' + 'access_token=pk.eyJ1Ijoiamxlb3BvbGQiLCJhIjoiY2l5MXV2ZDIzMDAwMTMycGdxYnMwbTVvZiJ9.u54u0PD7k942ESruEVc8rg');

    var map = L.map('map',{
    center: [37.5, -97],
    zoom: 4,
    minZoom: 1,
    maxZoom: 18,
    layers: [Satellite]
    });

    var layers = {
        "Satellite": Satellite,
        "Streets": Streets,
    };

    L.control.layers(layers).addTo(map);


    // Initialise the FeatureGroup to store editable layers
    var featureGroup = new L.FeatureGroup();
    map.addLayer(featureGroup);

    // Initialise the draw control and pass it the FeatureGroup of editable layers
    var drawControl = new L.Control.Draw({
        draw: {
            polygon: {
                  shapeOptions: {
                    color: '#0033FF'
                  }
                },
            rectangle: {
                  shapeOptions: {
                    color: '#0033FF'
                  }
                },
             circle:false,
             polyline: false,
             marker: false
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
        position: 'topleft',
        strings: {
            title: "Find Me!",
        },
        locateOptions: {
                   maxZoom: 18,
        },
        locateOptions: {
                   enableHighAccuracy: true
        }
    }).addTo(map);

    //Geocoder!
    // create the geocoding control and add it to the map
    var searchControl = L.esri.Geocoding.geosearch().addTo(map);

    // create an empty layer group to store the results and add it to the map
    var results = L.layerGroup().addTo(map);

    // listen for the results event and add every result to the map
    searchControl.on("results", function(data) {
        results.clearLayers();
        for (var i = data.results.length - 1; i >= 0; i--) {
            results.addLayer(L.marker(data.results[i].latlng));
        }
    });



