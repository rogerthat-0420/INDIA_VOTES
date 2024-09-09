const partyColours = {
    "Aam Aadmi Party": "#0072b0",
    "All India Anna Dravida Munnetra Kazhagam": "#009546",
    "All India Majlis-E-Ittehadul Muslimeen": "#0c6b4b",
    "All India Trinamool Congress": "#20c646",
    "All India United Democratic Front": "#348017",
    "All Jharkhand Students Union": "#6827b5",
    "Apna Dal (Soneylal)": "#27176d",
    "Bahujan Samaj Party": "#22409a",
    "Bharatiya Janta Party": "#ff9933",
    "Biju Janata Dal": "#70a548",
    "Communist Party Of India": "#cb0922",
    "Communist Party Of India (Marxist)": "#cc0d0d",
    "Dravida Munetra Kazhagam": "#ff0d0d",
    "Independent": "black",
    "Indian National Congress": "#19aaed",
    "Indian Union Muslim League": "#006600",
    "Jammu & Kashmir National Conference": "#cc0d0d",
    "Janata Dal (Secular)": "#02865a",
    "Janata Dal (United)": "#003366",
    "Jharkhand Mukti Morcha": "#337316",
    "Kerala Congress(M)": "#f48385",
    "Lok Jan Shakti Party": "#5b006a",
    "Mizo National Front": "#2e5694",
    "Naga Peoples Front": "#1717cc",
    "National People's Party": "#ffca61",
    "Nationalist Congress Party": "#00b2b2",
    "Nationalist Democratic Progressive Party": "#ed1b24",
    "Rashtriya Loktantrik Party": "#ffd42a",
    "Revolutionary Socialist Party": "#d84c4c",
    "Samajwadi Party": "#ff2222",
    "Shiromani Akali Dal": "#0f204a",
    "Shiv Sena": "#f37020",
    "Sikkim Krantikari Morcha": "#ed1e26",
    "Telangana Rashtra Samithi": "#f84996",
    "Telugu Desam": "#ffed00",
    "Viduthalai Chiruthaigal Katchi": "#0000ff",
    "Yuvajana Sramika Rythu Congress Party": "#1569c7",
  };

var tooltip = d3.select(".tooltip").style("opacity", 0);

var width = 500, height = 600;

var projection = d3.geoMercator()
  .center([78.9629, 23.5937]) // Center the Map in India
  .scale(1000)
  .translate([width / 2, height / 2]);

var path = d3.geoPath()
  .projection(projection);

var svg = d3.select("#map")
  .attr("width", width)
  .attr("height", height);

Promise.all([
    d3.json("india_state_geo.json"),
    d3.json("party_vote_counts.json")
]).then(function(data){
    const constituencyData = data[0];
    const partyVoteData = data[1];

    svg.selectAll("path")
        .data(constituencyData.features)
        .enter().append("path")
        .attr("d", path)
        .style("fill", function(d) {
            const state = d.properties.NAME_1;
            const parties = partyVoteData[state];
            if (parties) {
                const maxVotesParty = Object.keys(parties).reduce((a, b) => parties[a] > parties[b] ? a : b);
                return partyColours[maxVotesParty];
            } else {
                return 'lightblue'; 
            }
        })
        .style("stroke", "white")
        .on("mouseover", function(event, d) {
            console.log("Hemang")
            const state = d.properties.NAME_1;
            const parties = partyVoteData[state];
            if (parties) {
                const maxVotesParty = Object.keys(parties).reduce((a, b) => parties[a] > parties[b] ? a : b);
                tooltip.transition()
                .duration(200)
                .style("opacity", .9);
                tooltip.html("State: " + state + "<br/>Majority Party: " + maxVotesParty)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
            }
        })
        .on("mouseout", function(d) {
            console.log("Hemang1")
            tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        })
        .on("click", function(event , d) {
            updatePieCharts(d.properties.NAME_1 ,partyVoteData[d.properties.NAME_1] );
        });
});


function updatePieCharts(state , stateData) {
    d3.csv("constituencies.csv").then(function (data) {
      var stateData2 = data.filter(function (d) { return d.state === state; })[0];
  
      var consData = [
        { label: "SC", value: stateData2.SC },
        { label: "ST", value: stateData2.ST },
        { label: "General", value: stateData2.total -stateData2.ST - stateData2.SC  },
      ];
      consData2 = [];
      console.log(stateData)
      for (var party in stateData) {
        if (stateData.hasOwnProperty(party)) {
            consData2.push({ label: party, value: stateData[party] });
        }
    }
      var pie = d3.pie().value(function (d) { return d.value; });
  
      var pieData1 = pie(consData);
      var pieData2 = pie(consData2);
  
      // Render Pie Charts
      renderPieChart("#piechart1", pieData1, 300 , "Reservation of Constituencies");  // Assuming a renderPieChart function exists
      renderPieChart("#piechart2", pieData2, 300 , "Constituencies won in 2019 elections");  // Assuming a renderPieChart function exists
    });
  }

  function renderPieChart(container, data, size , title ) {
    var svg = d3.select(container).html("").append("svg")
      .attr("width", size)
      .attr("height", size)
      .append("g")
      .attr("transform", "translate(" + size / 2 + "," + size / 2 + ")");
  
    var arc = d3.arc().innerRadius(0).outerRadius(size / 2 - 30);
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    var tooltip = d3.select(".tooltip").style("opacity", 0);

    svg.selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", function (d, i) { return color(i); })
      .on("mouseover", function(event, d) {
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip.html(d.data.label + ": " + d.data.value)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });

    svg.append("text")
        .attr("x", 0)
        .attr("y", size/2  )
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text(title);

    // Add labels
    var labelGroup = svg.append("g").attr("transform", "translate(" + 0 + "," + 0 + ")");
    labelGroup.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("transform", function(d) { return "translate(" + arc.centroid(d)+10 + ")"; })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text(function(d) { return d.data.label; });
  
    // Optionally, add labels or other decorative elements here
  }




