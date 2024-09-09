// Width and height
var width = 600, height = 600;

// Create a projection
var projection = d3.geoMercator()
  .center([78.9629, 23.5937]) // Center the Map in India
  .scale(1000)
  .translate([width / 2, height / 2]);

// Path generator
var path = d3.geoPath()
  .projection(projection);

// Create an SVG
var svg = d3.select(".k74")
  .attr("width", width)
  .attr("height", height);

var tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// Load both GeoJSON and CSV data
Promise.all([
  d3.json("../../dataset/india_state_geo.json"),
  d3.csv("../../dataset/indian_states_data.csv")
]).then(function ([geojson, populationData]) {
  // Process population data
  var populationByState = {};
  var populationByState2= {};
  var consByState = {};

  populationData.forEach(function (d) {
    populationByState[d.State] = +d.Population / d.Constituencies;
    populationByState2[d.State] = +d.Population ;
    consByState[d.State] = +d.Constituencies;
  });

  // Create a color scale
  var colorScale = d3.scaleQuantize()
    .domain([d3.min(Object.values(populationByState)), d3.max(Object.values(populationByState))])
    .range(d3.schemeBlues[9]); // Using a 10-step blue color scheme

  // Draw each state with a color based on its population
  svg.selectAll(".state74")
    .data(geojson.features)
    .enter()
    .append("path")
    .attr("class", "state74")
    .attr("d", path)
    .attr("fill", function (d) {
      // Ensure the state names match between GeoJSON properties and CSV
      return colorScale(populationByState[d.properties.NAME_1]);
    })
    .on("mouseover", function (event, d) {
      tooltip.transition()
        .duration(200)
        .style("opacity", .9);
      tooltip.html("State: " + d.properties.NAME_1 + "<br/>Population: " + populationByState2[d.properties.NAME_1] + "<br/>Constituency: "+ consByState[d.properties.NAME_1] )
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 28) + "px");
      d3.select(this).style("fill-opacity", 0.7);
    })
    .on("mouseout", function (d) {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
      d3.select(this).style("fill-opacity", 1);
    });
    svg.append("text")
    .attr("x", width / 2)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .text("Population per Constituency Averages over Indian States");
});
