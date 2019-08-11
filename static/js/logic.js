
for (let i = 0; i < paisesmundo.features.length; i++) {
  poligonoActual =   paisesmundo.features[i].properties.name;
  for (let t = 0; t < datacountries.length; t++) { 
    if(datacountries[t].Country==poligonoActual){
      paisesmundo.features[i].properties.name = datacountries[t]["Country"]
      paisesmundo.features[i].properties.robHabitacion2019 = datacountries[t]["Happiness score"]
      paisesmundo.features[i].properties.robHabitacion2020 = datacountries[t]["Happiness Score Prediction"]
      paisesmundo.features[i].properties.robHabitacion2021 = datacountries[t]["Ranking"]
      paisesmundo.features[i].properties.robHabitacion2022 = datacountries[t]["Ranking 2020"]
      console.log(paisesmundo.features[i].properties)
    }
  }
}

console.log(paisesmundo.features[0].properties.name)

createFeatures(paisesmundo);

function obtienecolor(estado) {
  console.log(estado);
  return '#'+Math.floor(Math.random()*16777215).toString(16);
}

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h1>" + feature.properties.name + "<br/>" + "<h2>" + " Ranking (2019): " + feature.properties.robHabitacion2021 +
      "</h3><hr><p>" + "Happiness Score (2019): " + feature.properties.robHabitacion2019 + "<br/>" + "Happinesss Score Prediction (2020): " + 
      feature.properties.robHabitacion2020 + "<br/>" + "</h3><hr><p><b>" + "Ranking (2020): " + feature.properties.robHabitacion2022 + "<br/>" +
       "Percent Change: " + (((feature.properties.robHabitacion2020/feature.properties.robHabitacion2019) - 1) * 100).toFixed(2) + "%"
        + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    style: function(feature) {
      // switch (feature.properties.name) {
      //   case "Queretaro": return {color: "#ff0000"};
      // }
      return  {color:obtienecolor(feature.properties.name)};
    }
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Mexico: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      44.63, 28.77
    ],
    zoom: 2,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
