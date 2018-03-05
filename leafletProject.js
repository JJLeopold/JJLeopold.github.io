function createMap(){

    var Grayscale = L.tileLayer('https://api.mapbox.com/styles/v1/jleopold/cjdqrzpmt012c2sr1nmzcsyua/tiles/256/{z}/{x}/{y}?' + 'access_token=pk.eyJ1Ijoiamxlb3BvbGQiLCJhIjoiY2l5MXV2ZDIzMDAwMTMycGdxYnMwbTVvZiJ9.u54u0PD7k942ESruEVc8rg');
    
    var Satellite = L.tileLayer('https://api.mapbox.com/styles/v1/jleopold/cjd303coe3wkh2rl0zoezvy8o/tiles/256/{z}/{x}/{y}?' + 'access_token=pk.eyJ1Ijoiamxlb3BvbGQiLCJhIjoiY2l5MXV2ZDIzMDAwMTMycGdxYnMwbTVvZiJ9.u54u0PD7k942ESruEVc8rg');

    var map = L.map('map',{
    center: [37, -98],
    zoom: 4,
    minZoom: 1,
    maxZoom: 18,
    zoomControl: true,
    layers: [Grayscale]
    });

    getData(map);

    var layers = {
        "Grayscale": Grayscale,
        "Satellite": Satellite,
    };

    L.control.layers(layers).addTo(map);    
}

$(document).ready(createMap);


//Calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //scale factor to adjust symbol size evenly
    var scaleFactor = 750;
    //area based on attribute value and scale factor
    var area = attValue * scaleFactor;
    //radius calculated based on area
    var radius = Math.sqrt(area/Math.PI);
    
    return radius;
};

function pointToLayer(feature, latlng, attributes){
    
    var attribute = attributes[0];
    //check
    console.log(attribute);

    //create marker options
    var options = {
        radius: 8,
        fillColor: "#0300FF",
        color: "#FF0000",
        weight: 1,
        opacity: 0.8,
        fillOpacity: 0.8
    };

    //For each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]);

    //Give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRadius(attValue);

    //create circle marker layer
    var layer = L.circleMarker(latlng, options);

    //original popupContent changed to panelContent...Example 2.2 line 1
    var panelContent = "<p><b>City:</b> " + feature.properties.City + "</p>";
    
    //add formatted attribute to panel content string
    var year = attribute.split("_")[1];
    
    //popup content is now just the city name
    var popupContent = feature.properties.City;
    
    //bind the popup to the circle marker
    layer.bindPopup(popupContent, {
        offset: new L.Point(0,-options.radius),
        closeButton: false
    });
    
    //event listeners to open popup on hover and fill panel on click
    layer.on({
        mouseover: function(){
            this.openPopup();
        },
        mouseout: function(){
            this.closePopup();
        }
    });
    
    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

//Add circle markers for point features to the map
function createPropSymbols(data, map, attributes){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
         pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);
};

//Create new sequence controls
function createSequenceControls(map, attributes){
    //create range input element (slider)
    
$('#panel').append('<input id="range-slider" type="range">');

    //set slider attributes
    $('#range-slider').attr({
        max: 6,
        min: 0,
        value: 0,
        step: 1
    });

 $('#panel').append('<button class="skip" id="back"><<</button>');

 $('#panel').append('<button class="skip" id="forward">>></button>');
        
    //Click listener for buttons
    $('.skip').click(function(){
        //get the old index value
        var index = $('#range-slider').val();

        //Step 6: increment or decrement depending on button clicked
        if ($(this).attr('id') == 'forward'){
            index++;
            //Step 7: if past the last attribute, wrap around to first attribute
            index = index > 6 ? 0 : index;
        } else if ($(this).attr('id') == 'back'){
            index--;
            //Step 7: if past the first attribute, wrap around to last attribute
            index = index < 0 ? 6 : index;
        };

        //Update slider
        $('#range-slider').val(index);
        //Pass new attribute to update symbols
        updatePropSymbols(map, attributes[index]);
        updateLegend(map, attributes[index])

})
    
        //input listener for slider
        $('#range-slider').on('input', function(){
        //pass new attribute to update symbols
        var index = $(this).val();
        //Pass new attribute to update symbols
        updatePropSymbols(map, attributes[index]);
        updateLegend(map, attributes[index])

    });
    
};
    

//Import GeoJSON data
function getData(map){
    //Example 3.3 line 8...load the data
    $.ajax("data/CityData.geojson", {
        dataType: "geojson",
        success: function(response){
            //create an attributes array
            var attributes = processData(response);

            createPropSymbols(response, map, attributes);
            createSequenceControls(map, attributes);
            createLegend(map, attributes);
        }
    });
};

//Build an attributes array from the data
function processData(data){
    //empty array to hold attributes
    var attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;

    //push each attribute name into attributes array
    for (var attribute in properties){
        //only take attributes with population values
        if (attribute.indexOf("Pop") > -1){
            attributes.push(attribute);
        };
    };

    //check result
    console.log(attributes);

    return attributes;
};

//Resize proportional symbols according to new attribute values
function updatePropSymbols(map, attribute){
    map.eachLayer(function(layer){
        if (layer.feature && layer.feature.properties[attribute]){
            //access feature properties
            var props = layer.feature.properties;

            //update each feature's radius based on new attribute values
            var radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);

            //add city to popup content string
            var popupContent = "<p><b>City:</b> " + props.City + "</p>";

            //add formatted attribute to panel content string
            var year = attribute.split("_")[1];
            popupContent += "<p><b>Population in " + year + ":</b> " + props[attribute] + " million</p>";

            //replace the layer popup
            layer.bindPopup(popupContent, {
                offset: new L.Point(0,-radius)
            })
        }
    }             
)};


//Function to create the legend
function createLegend(map, attributes){
    var LegendControl = L.Control.extend({
        options: {
            position: 'bottomright'
        },

        onAdd: function (map) {
            // create the control container
            var container = L.DomUtil.create('div', 'legend-control-container');

            //add temporal legend div to container
            $(container).append('<div id="temporal-legend">')

            var svg = '<svg id="attribute-legend" width="270px" height="122px">';

            //object to base loop on
        var circles = {
            max: 55,
            mean: 80,
            min: 105
        };

        //loop to add each circle and text to svg string
        for (var circle in circles){
            //circle string
            svg += '<circle class="legend-circle" id="' + circle + '" fill="#0300FF" fill-opacity="1" stroke="#FF0000" cx="75"/>';

            //text string
            svg += '<text id="' + circle + '-text" x="165" y="' + circles[circle] + '"></text>';
        };

            //loop to add each circle and text to svg string
            for (var i=0; i<circles.length; i++){
                
            //circle string
            svg += '<circle class="legend-circle" id="' + circles[i] + 
            '" fill="#0300FF" fill-opacity="0.8" stroke="#FF0000" cx=""/>';
                
                //text string
            svg += '<text id="' + circles[i] + '-text" x="65" y="60"></text>';
                
        };

        //close svg string
        svg += "</svg>";

        //add attribute legend svg to container
        $(container).append(svg);

            return container;
        }
    });

    map.addControl(new LegendControl());

    updateLegend(map, attributes[0]);
};

//Calculate the max, mean, and min values for a given attribute
function getCircleValues(map, attribute){
    //start with min at highest possible and max at lowest possible number
    var min = Infinity,
        max = -Infinity;

    map.eachLayer(function(layer){
        //get the attribute value
        if (layer.feature){
            var attributeValue = Number(layer.feature.properties[attribute]);

            //test for min
            if (attributeValue < min){
                min = attributeValue;
            };

            //test for max
            if (attributeValue > max){
                max = attributeValue;
            };
        };
    });

    //set mean
    var mean = (max + min) / 2;

    //return values as an object
    return {
        max: max,
        mean: mean,
        min: min
    };
};

//Update the legend with new attribute
function updateLegend(map, attribute){
    //create content for legend
    var year = attribute.split("_")[1];
    var content = "Population in " + year;

    //replace legend content
    $('#temporal-legend').html(content);

    //get the max, mean, and min values as an object
    var circleValues = getCircleValues(map, attribute);
    
    for (var key in circleValues){
        //get the radius
        var radius = calcPropRadius(circleValues[key]);

        //Step 3: assign the cy and r attributes
        $('#'+key).attr({
            cy: 115 - radius,
            r: radius
        });
        
         //Step 4: add legend text
        $('#'+key+'-text').text(Math.round(circleValues[key]*100)/100 + " million");
    };
    
};







































