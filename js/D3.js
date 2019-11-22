(function () {

//pseudo-global variables
    var attrArray = ["Hydropower", "Solar", "Wind", "Biomass", "Geothermal"]; //list of attributes
    var expressed = attrArray[0]; //initial attribute

    var chartWidth = window.innerWidth * 0.33,
        chartHeight = 800,
        leftPadding = 20,
        rightPadding = 2,
        topBottomPadding = 300,
        chartInnerWidth = chartWidth - leftPadding - rightPadding,
        chartInnerHeight = chartHeight - topBottomPadding * 2,
        translate = "translate(" + leftPadding + "," + topBottomPadding + ")";

    var yScale = d3.scaleLinear()
        .range([463, 0])
        .domain([0, 100]);

//start when window loads
    window.onload = setMap();

//set up choropleth map
    function setMap() {

        //map frame dimensions
        var width = window.innerWidth * 0.65,
            height = 900;

        //create new svg container for the map
        var map = d3.select("body")
            .append("svg")
            .attr("class", "map")
            .attr("width", width)
            .attr("height", height);

        //create Albers equal area conic projection centered on USA
        var projection = d3.geoAlbers()
            .center([5, 42])
            .rotate([102.5, 0])
            .parallels([0, 25])
            .scale(1400)
            .translate([width / 2, height / 2]);

        var path = d3.geoPath()
            .projection(projection);

        //use queue to load both data types at the same time
        d3.queue()
            .defer(d3.csv, "data/usa_renewables.csv") //load attributes from csv file
            .defer(d3.json, "data/statesdata.topojson") //load background spatial data
            .await(callback);

        function callback(error, csvData, usa) {

            //translate USA TopoJSON
            var America = topojson.feature(usa, usa.objects.statesdata).features;

            //variables for data join
            var attrArray = ["Hydropower", "Solar", "Wind", "Biomass", "Geothermal"];

            America = joinData(America, csvData);

            //create the color scale
            +0
            var colorScale = makeColorScale(csvData);

            //Loop through csv to assign each set of csv attribute values to geojson
            setEnumerationUnits(America, map, path, colorScale);

            //add coordinated visualization to the map
            setChart(csvData, colorScale);
            
            createDropdown(csvData);
        }
    }

//Allow the map to change color according to the selected attribute
function makeColorScale(data) {
        
        if (expressed == "Hydropower") {
        var colorClasses = [
            "#eff3ff",
            "#bdd7e7",
            "#6baed6",
            "#3182bd",
            "#08519c"
        ];
            
        } else if (expressed == "Solar") {
        var colorClasses = [
            "#ffffdf",
            "#ffffbf",
            "#ffff7a",
            "#ffff52",
            "#ffff00"
        ];
            
        } else if (expressed == "Wind") {
        var colorClasses = [
            "#f2f0f7",
            "#cbc9e2",
            "#9e9ac8",
            "#756bb1",
            "#54278f"
        ];
        
        } else if (expressed == "Biomass") {
        var colorClasses = [
            "#edf8e9",
            "#bae4b3",
            "#74c476",
            "#31a354",
            "#006d2c"
        ];
        
        } else {
        var colorClasses = [
            "#fee5d9",
            "#fcae91",
            "#fb6a4a",
            "#de2d26",
            "#a50f15"
        ];
            
        }


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
            var csvKey = csvStates.STUSPS; //the CSV primary key

            //loop through geojson
            for (var a = 0; a < America.length; a++) {

                var geojsonProps = America[a].properties; //the current area geojson properties
                var geojsonKey = geojsonProps.STUSPS; //the geojson primary key

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
                return "states " + d.properties.STUSPS;
            })
            .attr("d", path)
            .style("fill", function (d) {
                return choropleth(d.properties, colorScale);
            })
            .on("mouseover", function(d){
                highlight(d.properties);
            })
            .on("mouseout", function(d){
            dehighlight(d.properties);
            })
            .on("mousemove", moveLabel);
        var desc = states.append("desc")
            .text('{"stroke": "#000", "stroke-width": "0.1px"}');
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
        var bars = chart.selectAll(".bars")
            .data(csvData)
            .enter()
            .append("rect")
            .sort(function (a, b) {
                return b[expressed] - a[expressed]
            })
            .attr("class", function (d) {
                return "bars " + d.STUSPS;
            })
            .attr("width", chartInnerWidth / csvData.length - 1)
            .on("mouseover", highlight)
            .on("mouseout", dehighlight)
            .on("mousemove", moveLabel);

        var desc = bars.append("desc")
            .text('{"stroke": "#000", "stroke-width": "0.1px"}');

        //create a text element for the chart title
        var chartTitle = chart.append("text")
            .attr("x", 120)
            .attr("y", 310)
            .attr("class", "chartTitle")
            .text("Percent of Energy from " + expressed);

        var yAxis = d3.axisLeft()
            .scale(yScale);

        var axis = chart.append("g")
            .attr("class", "axis")
            .attr("transform", translate)
            .call(yAxis);

        updateChart(bars, csvData.length, colorScale);

    };

    function updateChart(bars, n, colorScale) {
        bars.attr("x", function (d, i) {
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
            .text("Percent of Energy Production from " + expressed);
    };
    
//function to create the dropdown menu for attribute selection
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
    var states = d3.selectAll(".states")
        .transition()
        .duration(1000)
        .style("fill", function(d){
            return choropleth(d.properties, colorScale)
        });

    //re-sort, resize, and recolor bars
    var bars = d3.selectAll(".bars")
        //re-sort bars
        .sort(function(a, b){
            return b[expressed] - a[expressed];
        })
        .transition() //add animation
        .delay(function(d, i){
            return i * 0 //duration
        })
        .duration(500);
    
    var changeArray = [];
    for (var i = 0; i< csvData.length; i++) {
        var val = parseFloat(csvData[i][expressed]);
        changeArray.push(val);
    }
    
    var maxValue = d3.max(changeArray);
    
    yScale = d3.scaleLinear()
        .range([463, 0])
        .domain([0, maxValue]);
    
    var yAxis = d3.axisLeft()
        .scale(yScale);
    
    d3.selectAll("g.axis")
        .call(yAxis);
    
    updateChart(bars, csvData.length, colorScale);
};
    
 //function to highlight enumeration units and bars
function highlight(props){
    //change stroke
    var selected = d3.selectAll("." + props.STUSPS)
        .style("stroke", "#00FF61")
        .style("stroke-width", "5");
    
    setLabel(props);
};
    
 //function to reset the element style on mouseout
function dehighlight(props){
    var selected = d3.selectAll("." + props.STUSPS)
        .style("stroke", function(){
            return getStyle(this, "stroke")
        })
        .style("stroke-width", function(){
            return getStyle(this, "stroke-width")
        });

    function getStyle(element, styleName){
        var styleText = d3.select(element)
            .select("desc")
            .text();

        var styleObject = JSON.parse(styleText);

        return styleObject[styleName];
    };
        d3.select(".infolabel")
            .remove();
    };
    
//function to create dynamic label
function setLabel(props){
    //label content
    var labelAttribute = "<h2>" + props[expressed] +
        "</h2><b>" + expressed + "</b>";

    //create info label div
    var infolabel = d3.select("body")
        .append("div")
        .attr("class", "infolabel")
        .attr("id", props.STUSPS + "_label")
        .html(labelAttribute);

    var statesName = infolabel.append("div")
        .attr("class", "labelname")
        .html(props.STUSPS);
};

//function to move info label with mouse
function moveLabel(){
    //get width of label
    var labelWidth = d3.select(".infolabel")
        .node()
        
    //use coordinates of mousemove event to set label coordinates
    var x1 = d3.event.clientX + 50,
        y1 = d3.event.clientY - 75,
        x2 = d3.event.clientX - labelWidth - 10,
        y2 = d3.event.clientY + 25;

    //horizontal label coordinate, testing for overflow
    var x = d3.event.clientX > window.innerWidth - labelWidth - 20 ? x2 : x1; 
    //vertical label coordinate, testing for overflow
    var y = d3.event.clientY < 75 ? y2 : y1; 

    d3.select(".infolabel")
        .style("left", x + "px")
        .style("top", y + "px");
};
    

})();