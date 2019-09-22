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

    //L.esri.basemapLayer("Imagery");

    //styles/jleopold/ck0veopx23idf1dlim3q91t1f

    var Satellite = L.tileLayer('https://api.mapbox.com/styles/v1/jleopold/cjd303coe3wkh2rl0zoezvy8o/tiles/256/{z}/{x}/{y}?' +                 'access_token=pk.eyJ1Ijoiamxlb3BvbGQiLCJhIjoiY2l5MXV2ZDIzMDAwMTMycGdxYnMwbTVvZiJ9.u54u0PD7k942ESruEVc8rg', {
    maxZoom: 20,
    });
                
    var Streets = L.tileLayer('https://api.mapbox.com/styles/v1/jleopold/ck0veopx23idf1dlim3q91t1f/tiles/256/{z}/{x}/{y}?' + 'access_token=pk.eyJ1Ijoiamxlb3BvbGQiLCJhIjoiY2l5MXV2ZDIzMDAwMTMycGdxYnMwbTVvZiJ9.u54u0PD7k942ESruEVc8rg', {
    maxZoom: 19,
    });

    var map = L.map('map',{
    center: [38, -95],
    zoomControl: false,
    zoom: 2,
    minZoom: 2,
    maxZoom: 19,
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

    //Geolocation!
    var lc = L.control.locate({
        strings: {
            title: 'Find Me',
            popup: false
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

    //Another way to zoom to user location, but not as accurate
    //map.locate();

    //Move the map with the user's location
    map.on('locationfound', function(e) {
    map.fitBounds(e.bounds, { maxZoom: 18});
    });   


    //Initialise the FeatureGroup to store editable layers
    var drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    L.Draw.Polygon.include({
        completeShape: false
    });

    //L.EditToolbar.Delete.include({
        //removeAllLayers: false
    //});

    //Initialise the draw control and pass it the FeatureGroup of editable layers
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
            featureGroup: drawnItems,
            edit: true
        },
    });


    var drawControlEditOnly = new L.Control.Draw({position: 'topleft',
        draw: {
            polyline : false,
            circle : false,
            marker : false,
            circlemarker : false,
            polygon: false,
            rectangle: false,
         },
        edit: {
            featureGroup: drawnItems,
            edit: true
        },
    });

    L.drawLocal = {
        draw: {
            toolbar: {
                actions: {
                    title: 'Cancel',
                    text: 'Cancel'
                },
                finish: {
                    title: 'Finish the shape',
                    text: 'Finish'
                },
                undo: {
                    title: 'Undo last point',
                    text: 'Undo'
                },
                buttons: {
                    polyline: 'Draw a polyline',
                    polygon: 'Create a Polygon',
                    rectangle: 'Create a Rectangle',
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
                        start: 'Click to start drawing line',
                        cont: 'Click to continue drawing line',
                        end: 'Click last point to finish line'
                    }
                },
                rectangle: {
                    tooltip: {
                        start: 'Click and drag to create a rectangle'
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
                        title: 'Save changes',
                        text: 'Save'
                    },
                    cancel: {
                        title: 'Cancel',
                        text: 'Cancel'
                    },
                    clearAll: {
                        title: 'Clear the map now',
                        text: 'Reset'
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
                        text: 'Drag handles to edit shape',
                        subtext: 'Click cancel to undo changes'
                    }
                },
                remove: {
                    tooltip: {
                        text: 'Click the shape to remove it'
                    }
                }
            }
        }
    };

    //Hide draw and edit controls and remove drawn shapes by zoom level
    map.on('zoomend', function() {
        if (map.getZoom() <17){
            map.removeControl(drawControl);
            map.removeLayer(drawnItems);
        }
        else {
            map.addControl(drawControl);
            map.addLayer(drawnItems);
        }
    });

    //Use this line if not hiding draw tools by zoom level
    //map.addControl(drawControl);

    map.on("draw:created", function (e) {
        drawControl.setDrawingOptions({
            //Remove the draw tools after a shape is created
            polygon:false,
            rectangle: false
        });
        map.addControl(drawControl);
    });

    map.on("draw:deleted", function (e) {
        drawControl.setDrawingOptions({
            //Add the draw tools back if the shape is deleted
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
        });
            //Only add draw controls back if zero shapes are currently drawn
            if (drawnItems.getLayers().length == 0){
                map.addControl(drawControl);
                map.removeControl(drawControlEditOnly);
            };
    
            //If a shape is drawn, remove the draw control and add the EditOnly control
            map.on('zoomend', function() {
                if (drawnItems.getLayers().length == 1){
                    map.removeControl(drawControl);
                    map.addControl(drawControlEditOnly);

                }
            });
        
            map.on('zoomend', function() {
                if (map.getZoom() <17){
                    map.removeControl(drawControlEditOnly);
                }  
            });
        
    });


function openForm() {
  document.getElementById("form-popup").style.display = "block";
}

function closeForm() {
  document.getElementById("form-popup").style.display = "none";
}






    //Handling the data!
    //create cartodb.SQL object to grab geojson of table
    //see here https://carto.com/blog/the-versatility-of-retreiving-and-rendering-geospatial
    var sql = new cartodb.SQL({ user: 'jjleopold', format:'GeoJSON'});
    sql.execute("SELECT * FROM project_1")
      .done(function(data) {

        //add geojson features to the drawnItems FeatureGroup
        //console.log(data);//optional/debugging
        geojsonLayer = L.geoJson(data, {
          onEachFeature: function (feature, layer) {
            layer.cartodb_id=feature.properties.cartodb_id;
            //Turn this on to see all polygons
            //drawnItems.addLayer(layer);
          }
          });
        //add the drawnItems FeatureGroup, populated with geojson from carto table, to the map
        map.addLayer(drawnItems);
      })
      .error(function(errors) {
        // errors contains a list of errors
        console.log("errors:" + errors);
      });

    function persistOnCartoDB(action, layers) {
      /*
        this function interacts with the Security Definer
        function previously defined in our CARTO account.
        Gets an action (update, insert, or delete) and a list
        of GeoJSON objects (the geometry objects only, to work
        with ST_GeomFromGeojson()) with which to change the table.
        see http://gis.stackexchange.com/questions/169219/invalid-geojson-when-inserting-data-to-a-cartodb-postgis-table-from-leaflet
      */
      var cartodb_ids = [];
      var geojsons = [];
      //console.log(action + " persistOnCartoDB");

      switch (action) {
              
        //case "UPDATE":
          //console.log(layers.getLayers().length);
          //if (layers.getLayers().length < 1) return;

          //layers.eachLayer(function(layer) {
            //cartodb_ids.push(layer.cartodb_id);
            //geojsons.push("'" + JSON.stringify(layer.toGeoJSON().geometry) + "'");
          //});
          //break;

        case "INSERT":
          cartodb_ids.push(-1);
          //console.log("here is the geojsons");
          //console.log(geojsons);
          //console.log("'" + JSON.stringify(layers.toGeoJSON().geometry) + "'");
          geojsons.push("'" + JSON.stringify(layers.toGeoJSON().geometry) + "'");

          break;

        //case "DELETE":
          //layers.eachLayer(function(layer) {
            //cartodb_ids.push(layer.cartodb_id);
            //geojsons.pushname
          //});
          //break;
              
      }

      //constructs the SQL statement
      var sql = "SELECT project_example_upsert_project_1(ARRAY[";
      sql += cartodb_ids.join(",");
      sql += "],ARRAY[";
      sql += geojsons.join(",");
      sql += "]);";

        

      console.log("persisting... " + sql);//optional/debugging
      //POST the SQL up to CARTO
      $.ajax({
        type: 'POST',
        url: 'https://jjleopold.carto.com/api/v2/sql',
        crossDomain: true,
        data: {
          "q": sql
        },
        dataType: 'json',
        success: function(responseData, textStatus, jqXHR) {
          console.log("Data saved");

          if (action == "INSERT")
            layers.cartodb_id = responseData.rows[0].cartodb_id;
        },
        error: function(responseData, textStatus, errorThrown) {
          console.log("Problem saving the data " + responseData);
        }
      });
    }


    map.on('draw:created', function(e) {
        {
        var layers = e.layer;//was e.layers not layer
        //Each time a shape is created, it's added to the feature group
        drawnItems.addLayer(layers);
        }

        document.getElementById('submit').onclick = function(e) {
        
            //console.log(e);
            persistOnCartoDB("INSERT", layers);
            //console.log("draw:created:insert persistOnCartoDB fired");
        
            closeForm();
            
            setTimeout(function() {
                location.reload();         
            }, 1000); 
                          
        }
        
    });
    
    
    
    //To allow edit
    //map.on('draw:edited', function (e) {
      //console.log("draw:edited fired");
      //var layers = e.layers;
      //persistOnCartoDB("UPDATE", layers);
      //console.log("draw:edited:update persistOnCartoDB fired");
    //});

    //To allow delete
    //map.on('draw:deleted', function (e) {
      //console.log("draw:deleted fired");
      //var layers = e.layers;
      //persistOnCartoDB("DELETE", layers);
      //console.log("draw:deleted:delete persistOnCartoDB fired");
    //});



                // Use this to download GeoJSON instead
                //map.on('draw:created', function(e) {
                    //Each time a shape is created, it's added to the feature group
                    //drawnItems.addLayer(e.layer);
                //});

                //document.getElementById('submit').onclick = function(e) {
                    //Extract GeoJson from featureGroup
                    //var data = drawnItems.toGeoJSON();

                    //Stringify the GeoJson
                    //var convertedData = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));

                    //document.getElementById('submit').setAttribute('href', 'data:' + convertedData);
                    //document.getElementById('submit').setAttribute('download','data.geojson');
                //}
        
    //Geocoder!
    //Create the geocoding control and add it to the map
    var searchControl = L.esri.Geocoding.geosearch({
        providers: [
        L.esri.Geocoding.arcgisOnlineProvider({
        maxResults: 5
        })
        ],
        position: 'topleft',
        title: 'Find a Place or Address',
        placeholder: '',
        useMapBounds: 5,
        allowMultipleResults: true,
        zoomToResult: true
    }).addTo(map);

    //Create an empty layer group to store the results and add it to the map
    var results = L.layerGroup().addTo(map);

    
    //Listen for the results event and add every result to the map
    searchControl.on('results', function(data) {
        
           results.clearLayers();

            if (data.results.length > 0) {

                // set map view
                map.setView(data.results[0].latlng, 17);

                // open pop-up for location
                var popup = L.popup({closeOnClick: true, reOpenOnClick: true, maxWidth: 5000, closeButton: false}).setLatLng(data.results[0].latlng).setContent(data.results[0].text).openOn(map);
            }  
        
            for (var i = data.results.length - 1; i >= 0; i--) {
                    results.addLayer(L.marker(data.results[0].latlng));
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



    // Add attribution   
    //var attribution = L.control.attribution();
        //attribution.setPrefix('');
        //attribution.addAttribution('Powered by<a href="https://www.esri.com/en-us/home">Esri</a> | <a href="https://www.mapbox.com/about/maps">© Mapbox</a> | <a href="http://openstreetmap.org/copyright">© OpenStreetMap</a> | <a href="https://www.digitalglobe.com/">© DigitalGlobe</a> | <a href="http://mapbox.com/map-feedback/" class="mapbox-improve-map">Improve this map</a>');
        //attribution.addTo(map);



        document.getElementById('form-sitename').onclick = function(e) {
        
                  $("#form-popup")[0].reset();

        }