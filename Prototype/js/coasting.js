//TODO: Change to your username, insert function on Carto, and Carto tablename
var config = {
    cartoUsername : "jjleopold",
    cartoInsertFunction : "insert_crowd_mapping_data",
    cartoTablename : "coasting",
    mapcenter: [38, -96],
    drawOptions: {
        draw : {
            polygon : true,
            polyline : false,
            rectangle : true,
            //Circles aren't supported by the GeoJSON spec.
            circle : false,
            circlemarker : false,
            marker: false
        },
        edit : false,
        remove: false
    }
};


// Add Data from Carto using the SQL API
// Declare Variables
// Create Global Variable to hold Carto points
var cartoData = null;

// Write SQL Selection Query to be Used on Carto Table
var sqlQuery = "SELECT the_geom, description, name FROM " + config.cartoTablename;

var map = L.map('map',{
center: [22, -96],
zoomControl: true,
zoom: 2,
minZoom: 2,
maxBounds: [
    //south west
    [-90, -180],
    //north east
    [90, 180]
    ],
maxBoundsViscosity: 1.0,
attributionControl: true,
});

var layer = L.esri.basemapLayer('Oceans').addTo(map);
var layerLabels;

function setBasemap (basemap) {
    if (layer) {
    map.removeLayer(layer);
    }

    layer = L.esri.basemapLayer(basemap);

    map.addLayer(layer);

    if (layerLabels) {
    map.removeLayer(layerLabels);
    }

    if (
    basemap === 'Oceans' ||
    basemap === 'Gray' ||
    basemap === 'DarkGray'
    ) {
    layerLabels = L.esri.basemapLayer(basemap + 'Labels');
    map.addLayer(layerLabels);
    } else if (basemap.includes('Imagery')) {
    layerLabels = L.esri.basemapLayer('ImageryLabels');
    map.addLayer(layerLabels);
    }
}

document
    .querySelector('#basemaps')
    .addEventListener('change', function (e) {
    var basemap = e.target.value;
    setBasemap(basemap);
    });

//Fetches
var getData = "https://" + config.cartoUsername + ".carto.com/api/v2/sql?format=GeoJSON&q=" + sqlQuery;

function getGeoJSON() {
    $.getJSON(getData, function (data) {
        cartoData = L.geoJson(data, {
        color: '#fd6812',                
        weight: 3,
        opacity: 1,
        fill: true,
        fillColor: '#0084ff',
        fillOpacity: .4,
            onEachFeature: function (feature, layer) {
                layer.bindPopup('' + feature.properties.description + '<br>Submitted by ' + feature.properties.name + '');
            }
        }).addTo(map);
    });
}

getGeoJSON();

var drawnItems = new L.FeatureGroup();

var drawControl = new L.Control.Draw(config.drawOptions);

map.addControl(drawControl);
// Add this (and delete the line above) if you want to add buttons turning on or off the draw control.
/*var controlOnMap = false;
function startEdits() {
    if (controlOnMap === true) {
        map.removeControl(drawControl);
        controlOnMap = false;
    }
    map.addControl(drawControl);
    controlOnMap = true;
}
function stopEdits() {
    map.removeControl(drawControl);
    controlOnMap = false;
}*/


map.on(L.Draw.Event.CREATED, function (e) {
    var layer = e.layer;
    map.addLayer(drawnItems);
    drawnItems.addLayer(layer);
    dialog.dialog("open");
});

var dialog = $("#dialog").dialog({
    autoOpen: false,
    height: 300,
    width: 350,
    modal: true,
    position: {
        my: "center center",
        at: "center center",
        of: "#map"
    },
    buttons: {
        "Submit": setData,
        Cancel: function () {
            dialog.dialog("close");
            refreshLayer();				
        }
    },
    close: function () {
        form[0].reset();
        refreshLayer();
        console.log("Dialog closed");
    }
});

form = dialog.find("form").on("submit", function (event) {
    event.preventDefault();
    setData();
});

function setData() {
    //.replace() doubles each single quote in order to escape them for PostgreSQL 
    //so that user input containing single quotes doesn't escape the SQL function
    //JSON.stringify properly escapes double quotes " so they don't break the SQL function either https://stackoverflow.com/questions/24559625/javascript-escape-double-quotes
    //There might be a better way https://stackoverflow.com/questions/57844173/how-can-i-sanitize-user-input-data-to-be-inserted-into-my-carto-table
    var enteredUsername = "'" + JSON.stringify(username.value.replace("'", "''")) + "'"
    var enteredDescription = "'" + JSON.stringify(description.value.replace("'", "''")) + "'";
    drawnItems.eachLayer(function (layer) {
        
    //Convert the drawing to a GeoJSON to pass to the Carto sql database
        var drawing = "'" + JSON.stringify(layer.toGeoJSON().geometry) + "'",

          //Construct the SQL query to insert data from the three parameters: the drawing, the input username, and the input description of the drawn shape
            sql = "SELECT " + config.cartoInsertFunction + "(";
        sql += drawing;
        sql += "," + enteredDescription;
        sql += "," + enteredUsername;
        sql += ");";

        console.log(drawing);

        //Sending the data
        $.ajax({
            type: 'POST',
            url: 'https://' + config.cartoUsername + '.carto.com/api/v2/sql',
            crossDomain: true,
            data: {"q": sql},
            dataType: 'json',
            success: function (responseData, textStatus, jqXHR) {
                console.log("Data saved");
            },
            error: function (responseData, textStatus, errorThrown) {

                console.log("Problem saving the data");
            }
        });

        /* 
        * Transfer submitted drawing to the Carto layer, this results in the user's data appearing on the map without
        * requerying the database (see the refreshLayer() function for an alternate way of doing this) 
        */
        var newData = layer.toGeoJSON();
          newData.properties.description = description.value;
          newData.properties.name = username.value;

        cartoData.addData(newData);

    });
    
    dialog.dialog("close");
}
function refreshLayer() {
    console.log("drawnItems has been cleared");
    map.removeLayer(drawnItems);
    drawnItems = new L.FeatureGroup();
/* 
    This would refresh the data-layer to include new data from the Carto table after each drawing is submitted. 
*/
//      if (map.hasLayer(cartoData)) {
//        map.removeLayer(cartoData);
//      };
//      getGeoJSON();
}