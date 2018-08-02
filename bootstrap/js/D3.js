//First line of main.js...wrap everything in a self-executing anonymous function to move to local scope
(function () {

//pseudo-global variables
    var attrArray = ["Hydro", "Solar", "Bio", "Geothermal", "Total"]; //list of attributes
    var expressed = attrArray[0]; //initial attribute

    var chartWidth = window.innerWidth * 0.425,
        chartHeight = 473,
        leftPadding = 60,
        rightPadding = 2,
        topBottomPadding = 5,
        chartInnerWidth = chartWidth - leftPadding - rightPadding,
        chartInnerHeight = chartHeight - topBottomPadding * 2,
        translate = "translate(" + leftPadding + "," + topBottomPadding + ")";

    var yScale = d3.scaleLinear()
        .range([463, 0])
        .domain([0, 350]);

//begin script when window loads
    window.onload = setMap();

//set up choropleth map
    function setMap() {

        //map frame dimensions
        var width = window.innerWidth * 0.65,
            height = 1000;

        //create new svg container for the map
        var map = d3.select("body")
            .append("svg")
            .attr("class", "map")
            .attr("width", width)
            .attr("height", height);

        //create Albers equal area conic projection centered on France
        var projection = d3.geoAlbers()
            .center([4, 35])
            .rotate([102.5, 0])
            .parallels([0, 25])
            .scale(1200)
            .translate([width / 2, height / 2]);

        var path = d3.geoPath()
            .projection(projection);

        //use queue to parallelize asynchronous data loading
        d3.queue()
            .defer(d3.csv, "data/usa_renewables.csv") //load attributes from csv
            .defer(d3.json, "data/statesdata.topojson") //load background spatial data
            .await(callback);

        function callback(error, csvData, usa) {

            //translate USA TopoJSON
            var America = topojson.feature(usa, usa.objects.statesdata).features;

            //variables for data join
            var attrArray = ["Hydro", "Solar", "Bio", "Geothermal", "Total"];

            America = joinData(America, csvData);

            //create the color scale
            var colorScale = makeColorScale(csvData);

            //Loop through csv to assign each set of csv attribute values to geojson
            setEnumerationUnits(America, map, path, colorScale);

            //add coordinated visualization to the map
            setChart(csvData, colorScale);
        }
    }

//function to create color scale generator
    function makeColorScale(data) {
        var colorClasses = [
            "#99FF99",
            "#73E673",
            "#4DCC4D",
            "#26B326",
            "#009900"
        ];

        //create color scale generator
        var colorScale = d3.scaleQuantile()
            .range(colorClasses);

        //build array of all values of the expressed attribute
        var domainArray = [];
        for (var i = 0; i < data.length; i++) {
            var val = parseFloat(data[i][expressed]);
            domainArray.push(val);
        }
        ;

        //assign array of expressed values as scale domain
        colorScale.domain(domainArray);

        return colorScale;
    };

    function joinData(America, csvData) {

        //loop through csv to assign each set of csv attribute values to geojson area
        for (var i = 0; i < csvData.length; i++) {
            var csvStates = csvData[i]; //the current area
            var csvKey = csvStates.NAME; //the CSV primary key

            //loop through geojson
            for (var a = 0; a < America.length; a++) {

                var geojsonProps = America[a].properties; //the current area geojson properties
                var geojsonKey = geojsonProps.NAME; //the geojson primary key

                //where primary keys match, transfer csv data to geojson properties object
                if (geojsonKey == csvKey) {
                    //assign all attributes and values
                    attrArray.forEach(function (attr) {
                        var val = parseFloat(csvStates[attr]); //get csv attribute value
                        geojsonProps[attr] = val; //assign attribute and value to geojson properties
                    });
                }
                ;
            }
            ;
        }
        ;

        return America;
    };

    function setEnumerationUnits(America, map, path, colorScale) {
        //add states to map
        var states = map.selectAll(".states")
            .data(America)
            .enter()
            .append("path")
            .attr("class", function (d) {
                return "regions " + d.properties.NAME;
            })
            .attr("d", path)
            .style("fill", function (d) {
                return choropleth(d.properties, colorScale);
            });
    };

//function to test for data value and return color
    function choropleth(props, colorScale) {
        //make sure attribute value is a number
        var val = parseFloat(props[expressed]);
        //if attribute value exists, assign a color; otherwise assign gray
        if (typeof val == 'number' && !isNaN(val)) {
            return colorScale(val);
        } else {
            return "#CCC";
        }
        ;
    };

//function to create coordinated bar chart
    function setChart(csvData, colorScale) {


        var chart = d3.select("body")
            .append("svg")
            .attr("width", chartWidth)
            .attr("height", chartHeight)
            .attr("class", "chart");


        //annotate bars with attribute value text
        var bars = chart.selectAll(".bar")
            .data(csvData)
            .enter()
            .append("rect")
            .sort(function (a, b) {
                return a[expressed] - b[expressed]
            })
            .attr("class", function (d) {
                return "numbers " + d.NAME;
            })
            .attr("width", chartInnerWidth / csvData.length - 1);


        //create a text element for the chart title
        var chartTitle = chart.append("text")
            .attr("x", 150)
            .attr("y", 40)
            .attr("class", "chartTitle")
            .text("Percent of " + expressed[3] + " in each state");

        var yAxis = d3.axisLeft()
            .scale(yScale);

        var axis = chart.append("g")
            .attr("class", "axis")
            .attr("transform", translate)
            .call(yAxis);

        updateChart(bars, csvData.length, colorScale);

    };

    function updateChart(bars, n, colorScale) {
        bars.attr("x", function (d, i) {                                            //position bars
            return i * (chartInnerWidth / n) + leftPadding;
        })
            .attr("height", function (d, i) {                                       //size/resize bars
                return 463 - yScale(parseFloat(d[expressed]));
            })
            .attr("y", function (d, i) {
                return yScale(parseFloat(d[expressed])) + topBottomPadding;
            })
            .style("fill", function (d) {                                           //color/recolor bars
                return choropleth(d, colorScale);
            });

        var chartTitle = d3.select(".chartTitle")
            .text("Percent of " + expressed[3] + " in each state");
    };
    
//function to create a dropdown menu for attribute selection
function createDropdown(csvData){
    //add select element
    var dropdown = d3.select("body")
        .append("select")
        .attr("class", "dropdown")
        .on("change", function(){
            changeAttribute(this.value, csvData)
        });

    //add initial option
    var titleOption = dropdown.append("option")
        .attr("class", "titleOption")
        .attr("disabled", "true")
        .text("Select Attribute");

    //add attribute name options
    var attrOptions = dropdown.selectAll("attrOptions")
        .data(attrArray)
        .enter()
        .append("option")
        .attr("value", function(d){ return d })
        .text(function(d){ return d });
};
    
//dropdown change listener handler
function changeAttribute(attribute, csvData){
    //change the expressed attribute
    expressed = attribute;

    //recreate the color scale
    var colorScale = makeColorScale(csvData);

    //recolor enumeration units
    var regions = d3.selectAll(".regions")
        .transition()
        .duration(1000)
        .style("fill", function(d){
            return choropleth(d.properties, colorScale)
        });

    //re-sort, resize, and recolor bars
    var bars = d3.selectAll(".bar")
        //re-sort bars
        .sort(function(a, b){
            return b[expressed] - a[expressed];
        })
        .transition() //add animation
        .delay(function(d, i){
            return i * 20
        })
        .duration(500);

    updateChart(bars, csvData.length, colorScale);
};
    

})(); //last line of main.js