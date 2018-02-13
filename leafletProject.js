//Leaflet Demo Recording

var map = L.map('map',{
    center: [48, -114],
    zoom: 8,
    minZoom: 1,
    maxZoom: 18,
    zoomControl: false,
})

var pixar = L.tileLayer('https://api.mapbox.com/styles/v1/jleopold/cjd303coe3wkh2rl0zoezvy8o/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoiamxlb3BvbGQiLCJhIjoiY2l5MXV2ZDIzMDAwMTMycGdxYnMwbTVvZiJ9.u54u0PD7k942ESruEVc8rg',{
    minZoom: 1,
    maxZoom: 22
}).addTo(map);

var place = L.marker([47, -114]).addTo(map);

var zone = L.circle([48, -114],{
    color: 'white',
    fillColor: 'white',
    opacity: .75,
    fillOpacity: .25,
    radius: 5000
}).addTo(map);

var latlngs = [[48.306755, -114.252972],[48.307171, -114.253701],[48.308531, -114.252230],[48.308256, -114.251462]];
var polygon = L.polygon(latlngs, {color: '#00D7FF', fillColor: "#00D7FF", opacity: .33, fillOpacity: .25}).addTo(map);


var latlngs = [[48.240130, -114.352044],[48.240246, -114.351756],[48.240250, -114.345007],[48.240050, -114.343690],[48.239650, -114.342800],[48.239297, -114.342319],[48.238492, -114.341759],[48.236977, -114.341669],[48.236028, -114.345494],[48.238240, -114.350675],[48.238250, -114.352044]];
var polygon = L.polygon(latlngs, {color: '#00D7FF', fillColor: "#00D7FF", opacity: 1, fillOpacity: .33}).addTo(map);
    
var geojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
}.addTo(map);