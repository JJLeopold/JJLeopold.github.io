    var Satellite = L.tileLayer('https://api.mapbox.com/styles/v1/jleopold/cjd303coe3wkh2rl0zoezvy8o/tiles/256/{z}/{x}/{y}?' + 'access_token=pk.eyJ1Ijoiamxlb3BvbGQiLCJhIjoiY2l5MXV2ZDIzMDAwMTMycGdxYnMwbTVvZiJ9.u54u0PD7k942ESruEVc8rg');

    var Streets = L.tileLayer('https://api.mapbox.com/styles/v1/jleopold/cjev2fxuxcdxp2ro2ctte1239/tiles/256/{z}/{x}/{y}?' + 'access_token=pk.eyJ1Ijoiamxlb3BvbGQiLCJhIjoiY2l5MXV2ZDIzMDAwMTMycGdxYnMwbTVvZiJ9.u54u0PD7k942ESruEVc8rg');

    var map = L.map('map',{
    center: [37.5, -97],
    zoom: 3,
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

        
L.control.locate().addTo(map);


