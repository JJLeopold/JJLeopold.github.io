//mapster access token (jleopold)
//pk.eyJ1Ijoiamxlb3BvbGQiLCJhIjoiY2l5MXV2ZDIzMDAwMTMycGdxYnMwbTVvZiJ9.u54u0PD7k942ESruEVc8rg

//replacement access token(jjleopold)
//pk.eyJ1IjoiampsZW9wb2xkIiwiYSI6ImNpcXJzczhzcjAydTVnc2pmdHhlZ3Boa3UifQ.09N3L86ZJoQ7s0dgJAY4IA

    //satellite style for mapster (jleopold)
    //jleopold/cjd303coe3wkh2rl0zoezvy8o

    //replacement for satellite (jjleopold)
    //jjleopold/cjlwtgniy3wpp2rmqdf613wqk

    var Satellite = L.tileLayer('https://api.mapbox.com/styles/v1/jleopold/cjd303coe3wkh2rl0zoezvy8o/tiles/256/{z}/{x}/{y}?' + 'access_token=pk.eyJ1Ijoiamxlb3BvbGQiLCJhIjoiY2l5MXV2ZDIzMDAwMTMycGdxYnMwbTVvZiJ9.u54u0PD7k942ESruEVc8rg');

    //streets style for mapster (jleopold)
    //jleopold/cjlgnrb6xa90w2smcaaihkexg

    //replacement for streets (jjleopold)
    //jjleopold/cjlwtacg23wjp2rpgsx3xibdf

    var Streets = L.tileLayer('https://api.mapbox.com/styles/v1/jleopold/cjlgnrb6xa90w2smcaaihkexg/tiles/256/{z}/{x}/{y}?' + 'access_token=pk.eyJ1Ijoiamxlb3BvbGQiLCJhIjoiY2l5MXV2ZDIzMDAwMTMycGdxYnMwbTVvZiJ9.u54u0PD7k942ESruEVc8rg');

    var Light = L.tileLayer('https://api.mapbox.com/styles/v1/jleopold/cjdqrzpmt012c2sr1nmzcsyua/tiles/256/{z}/{x}/{y}?' + 'access_token=pk.eyJ1Ijoiamxlb3BvbGQiLCJhIjoiY2l5MXV2ZDIzMDAwMTMycGdxYnMwbTVvZiJ9.u54u0PD7k942ESruEVc8rg');

    var Pixar = L.tileLayer('https://api.mapbox.com/styles/v1/jleopold/cjaxih6oc06ri2squp8zw2yji/tiles/256/{z}/{x}/{y}?' + 'access_token=pk.eyJ1Ijoiamxlb3BvbGQiLCJhIjoiY2l5MXV2ZDIzMDAwMTMycGdxYnMwbTVvZiJ9.u54u0PD7k942ESruEVc8rg');
 
    var map = L.map('map',{
    tileLayer: {
        maxNativeZoom: 19 
    },
    center: [38, -95],
    zoomControl: false,
    zoom: 2,
    minZoom: 2,
    maxBounds: [
        //south west
        [-79, -180],
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

        //Geolocation!
    var lc = L.control.locate({
        strings: {
            title: 'Find Me!',
            popup: 'You are within {distance} {unit} from this point',
        },
        options: {
                   position: 'topleft',
                   setView: 'always',
        },
        locateOptions: {
                   maxZoom: 19,
                   enableHighAccuracy: true,
        },
        circleStyle: {
                color: 'springgreen',
                fillColor: '#00B1FF',
                fillOpacity: 0.25,
                weight: 1,
                opacity: 1
        },
        markerStyle: {
                color: 'springgreen',
                fillColor: '#00B1FF',
                fillOpacity: 1,
                weight: 1.5,
                opacity: 1,
                radius: 4
        },
    }).addTo(map);

    // Initialise the draw control and pass it the FeatureGroup of editable layers
    var drawControl = new L.Control.Draw({position: 'topleft',
        draw: {
            polyline : false,
            circle : false,
            marker : false,
            polygon: {
                  shapeOptions: {
                    color: 'springgreen',
                    weight: 3,
                    opacity: 1,
                    fill: true,
                    fillColor: '#00B1FF', //same as color by default
                    fillOpacity: .5,

                  }
                },
            rectangle: {
                  shapeOptions: {
                    color: 'springgreen',
                    weight: 3,
                    opacity: 1,
                    fill: true,
                    fillColor: '#00B1FF', //same as color by default
                    fillOpacity: .5,
                  }
                },
         },
        edit: {
            featureGroup: featureGroup,
            edit: true,
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

    
        //Other way to zoom to location, but not as accurate.
        //map.locate();

        //Move the map with the user's location.
        map.on('locationfound', function(e) {
        map.fitBounds(e.bounds, { Zoom: 19});
        });   

    // Add attribution   
    var attribution = L.control.attribution();
        attribution.setPrefix('');
        attribution.addAttribution('Powered by<a href="https://www.esri.com/en-us/home">Esri</a> | <a href="https://www.mapbox.com/about/maps">© Mapbox</a> | <a href="https://www.digitalglobe.com/">© DigitalGlobe</a> | <a href="http://openstreetmap.org/copyright">© OpenStreetMap</a>contributors | <a href="http://mapbox.com/map-feedback/" class="mapbox-improve-map">Improve this map</a>');
        attribution.addTo(map);



