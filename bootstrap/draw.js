//mapster access token (jleopold)
//pk.eyJ1Ijoiamxlb3BvbGQiLCJhIjoiY2l5MXV2ZDIzMDAwMTMycGdxYnMwbTVvZiJ9.u54u0PD7k942ESruEVc8rg

//replacement access token(jjleopold)
//pk.eyJ1IjoiampsZW9wb2xkIiwiYSI6ImNpcXJzczhzcjAydTVnc2pmdHhlZ3Boa3UifQ.09N3L86ZJoQ7s0dgJAY4IA

    //satellite style for mapster (jleopold)
    //jleopold/cjd303coe3wkh2rl0zoezvy8o

    //replacement for satellite (jjleopold)
    //jjleopold/cjlwtgniy3wpp2rmqdf613wqk

    //Google Satellite
    //var Satellite = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
    //maxZoom: 20,
    //subdomains:['mt0','mt1','mt2','mt3']
    //});

    var Satellite = L.tileLayer('https://api.mapbox.com/styles/v1/jleopold/cjd303coe3wkh2rl0zoezvy8o/tiles/256/{z}/{x}/{y}?' +                 'access_token=pk.eyJ1Ijoiamxlb3BvbGQiLCJhIjoiY2l5MXV2ZDIzMDAwMTMycGdxYnMwbTVvZiJ9.u54u0PD7k942ESruEVc8rg', {
    maxZoom: 20,
    });

    var Streets = L.tileLayer('https://api.mapbox.com/styles/v1/jleopold/cjlgnrb6xa90w2smcaaihkexg/tiles/256/{z}/{x}/{y}?' + 'access_token=pk.eyJ1Ijoiamxlb3BvbGQiLCJhIjoiY2l5MXV2ZDIzMDAwMTMycGdxYnMwbTVvZiJ9.u54u0PD7k942ESruEVc8rg', {
    maxZoom: 20,
    });

    var map = L.map('map',{
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
        '<img src=" lib/images/mapster_vector.png">': Streets,
        '<img src=" lib/images/mapster_raster.png">': Satellite,
    };

    L.control.layers(layers).addTo(map);

    // Initialise the FeatureGroup to store editable layers
    var featureGroup = new L.FeatureGroup();
    map.addLayer(featureGroup);

        //Geolocation!
    var lc = L.control.locate({
        strings: {
            title: 'Find Me',
            popup: 'You are within {distance} {unit} from this point',
        },
        options: {
                   position: 'topleft',
                   setView: 'always',
        },
        locateOptions: {
                   maxZoom: 18,
                   enableHighAccuracy: true,
        },
        circleStyle: {
                color: 'springgreen',
                fillColor: '#009EFF',
                fillOpacity: 0.4,
                weight: 1.25,
                opacity: 1
        },
        markerStyle: {
                color: 'springgreen',
                fillColor: '#009EFF',
                fillOpacity: 1,
                weight: 2,
                opacity: 1,
                radius: 3
        },
    }).addTo(map);



    L.EditToolbar.Delete.include({
        removeAllLayers: false,
    });
        // Initialise the draw control and pass it the FeatureGroup of editable layers
    var drawControl = new L.Control.Draw({position: 'topleft',
        draw: {
            polyline : false,
            circle : false,
            marker : false,
            circlemarker : false,
            polygon: {
                  shapeOptions: {
                    color: 'springgreen',
                    weight: 3,
                    opacity: 1,
                    fill: true,
                    fillColor: '#009EFF',
                    fillOpacity: .5,
                  }
                },
            rectangle: {
                  shapeOptions: {
                    color: 'springgreen',
                    weight: 3,
                    opacity: 1,
                    fill: true,
                    fillColor: '#009EFF',
                    fillOpacity: .5,
                  }
                },
         },
        edit: {
            featureGroup: featureGroup,
            edit: true
        },
    });


    L.drawLocal = {
        // format: {
        // 	numeric: {
        // 		delimiters: {
        // 			thousands: ',',
        // 			decimal: '.'
        // 		}
        // 	}
        // },
        draw: {
            toolbar: {
                // #TODO: this should be reorganized where actions are nested in actions
                // ex: actions.undo  or actions.cancel
                actions: {
                    title: 'Cancel',
                    text: 'Cancel'
                },
                finish: {
                    title: 'Finish',
                    text: 'Finish'
                },
                undo: {
                    title: 'Delete last point',
                    text: 'Delete last point'
                },
                buttons: {
                    polyline: 'Draw a polyline',
                    polygon: 'Create a Polygon',
                    rectangle: 'Create a Rectangle or Square',
                    circle: 'Draw a circle',
                    marker: 'Draw a marker',
                    circlemarker: 'Draw a circlemarker'
                }
            },
            handlers: {
                circle: {
                    tooltip: {
                        start: 'Click and drag to draw circle'
                    },
                    radius: 'Radius'
                },
                circlemarker: {
                    tooltip: {
                        start: 'Click map to place circle marker'
                    }
                },
                marker: {
                    tooltip: {
                        start: 'Click map to place marker'
                    }
                },
                polygon: {
                    tooltip: {
                        start: 'Click to start creating shape',
                        cont: 'Click to continue creating shape',
                        end: 'Click first point to close shape'
                    }
                },
                polyline: {
                    error: '<strong>Error:</strong> shape edges cannot cross!',
                    tooltip: {
                        start: 'Click to start drawing line.',
                        cont: 'Click to continue drawing line.',
                        end: 'Click last point to finish line.'
                    }
                },
                rectangle: {
                    tooltip: {
                        start: 'Click and drag to create a rectangle or square'
                    }
                },
                simpleshape: {
                    tooltip: {
                        end: 'Release to finish'
                    }
                }
            }
        },
        edit: {
            toolbar: {
                actions: {
                    save: {
                        title: 'Save',
                        text: 'Save'
                    },
                    cancel: {
                        title: 'Cancel',
                        text: 'Cancel'
                    },
                    clearAll: {
                        title: 'Clear All Shapes',
                        text: 'Clear All'
                    }
                },
                buttons: {
                    edit: 'Edit',
                    editDisabled: 'Nothing to Edit',
                    remove: 'Delete',
                    removeDisabled: 'Nothing to Delete'
                }
            },
            handlers: {
                edit: {
                    tooltip: {
                        text: 'Drag handles to edit shape.',
                        subtext: 'Click cancel to undo changes'
                    }
                },
                remove: {
                    tooltip: {
                        text: 'Click on a shape to remove it'
                    }
                }
            }
        }
    };


    //Use this line if not hiding by zoom level.
    //map.addControl(drawControl);

    //Hide draw tools by zoom level.
    map.on('zoomend', function() {
        if (map.getZoom() <17){
            map.removeControl(drawControl);
        }
        else {
            map.addControl(drawControl);   
        }
    });


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
        position: 'topleft',
        title: 'Find a place',
        placeholder: '',
        useMapBounds: 5,
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

    map.on('zoomend', function() {
        if (map.getZoom() >16){
            map.removeControl(searchControl);
        }
        else {
            map.addControl(searchControl);   
        }
    });    

        //Other way to zoom to location, but not as accurate.
        //map.locate();

        //Move the map with the user's location.
        map.on('locationfound', function(e) {
        map.fitBounds(e.bounds, { maxZoom: 18});
        });   

    // Add attribution   
    //var attribution = L.control.attribution();
        //attribution.setPrefix('');
        //attribution.addAttribution('Powered by<a href="https://www.esri.com/en-us/home">Esri</a> | <a href="https://www.mapbox.com/about/maps">© Mapbox</a> | <a href="https://www.digitalglobe.com/">© DigitalGlobe</a> | <a href="http://openstreetmap.org/copyright">© OpenStreetMap</a> | <a href="http://mapbox.com/map-feedback/" class="mapbox-improve-map">Improve this map</a>');
        //attribution.addTo(map);




