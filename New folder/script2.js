var width = 960, height = 600;

// Create a projection
var projection = d3.geoMercator()
  .center([78.9629, 23.5937]) // Center the Map in India
  .scale(1000)
  .translate([width / 2, height / 2]);

// Path generator
var path = d3.geoPath()
  .projection(projection);

// Create an SVG
var svg = d3.select("#map")
  .attr("width", width)
  .attr("height", height);


// Load and display the states
d3.json("india_state_geo.json").then(function (data) {
  svg.selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .attr("d", path)
    .on("click", function (event, d) {
      // On state click, load the pie charts
      updatePieCharts(d.properties.NAME_1);
    });
});

function updatePieCharts(state) {
  d3.csv("indian_states_data.csv").then(function (data) {
    var stateData = data.filter(function (d) { return d.State === state; })[0];

    // Prepare data for pie charts
    var populationAreaData = [
      { label: "Population", value: stateData.Population },
      { label: "Area", value: stateData.Area }
    ];

    var areaConstituenciesData = [
      { label: "Area", value: stateData.Area },
      { label: "Constituencies", value: stateData.Constituencies }
    ];

    // Pie function
    var pie = d3.pie().value(function (d) { return d.value; });

    // Generate pie data
    var pieData1 = pie(populationAreaData);
    var pieData2 = pie(areaConstituenciesData);

    // Render Pie Charts
    renderPieChart("#piechart1", pieData1, 300);  // Assuming a renderPieChart function exists
    renderPieChart("#piechart2", pieData2, 300);  // Assuming a renderPieChart function exists
  });
}

function renderPieChart(container, data, size) {
  var svg = d3.select(container).html("").append("svg")
    .attr("width", size)
    .attr("height", size)
    .append("g")
    .attr("transform", "translate(" + size / 2 + "," + size / 2 + ")");

  var arc = d3.arc().innerRadius(0).outerRadius(size / 2 - 10);
  var color = d3.scaleOrdinal(d3.schemeCategory10);

  svg.selectAll("path")
    .data(data)
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", function (d, i) { return color(i); });

  // Optionally, add labels or other decorative elements here
}

