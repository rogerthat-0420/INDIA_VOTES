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
    Independent: "black",
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

function generateBarGraph(stateData) {
    document.getElementById("fortress-bar-chart").innerHTML = "";
    const parties = Object.keys(stateData);
    const partyVoteCounts = parties.map((party) => stateData[party]);

    const width = 800;
    const height = 400;
    const margin = { top: 50, right: 150, bottom: 50, left: 300 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3
        .select("#fortress-bar-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3
        .scaleLinear()
        .domain([0, d3.max(partyVoteCounts)])
        .range([0, innerWidth]);

    const barHeight = 20; // Fixed height for each bar
    const padding = 5; // Desired padding between bars

    // Calculate y-scale padding based on the number of parties and padding
    const yScalePadding = (padding * (parties.length - 1)) / innerHeight;

    const yScale = d3
        .scaleBand()
        .domain(parties)
        .range([0, innerHeight])
        .padding(yScalePadding);

    svg
        .selectAll("rect")
        .data(partyVoteCounts)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", (d, i) => yScale(parties[i]))
        .attr("width", (d) => xScale(d))
        .attr("height", barHeight)
        .attr("fill", (d, i) => partyColours[parties[i]])
        .attr("stroke", "white");

    svg
        .selectAll(".party-label")
        .data(parties)
        .enter()
        .append("text")
        .attr("class", "party-label")
        .attr("x", -margin.left)
        .attr("y", (d, i) => yScale(parties[i]) + barHeight / 2)
        .attr("dy", "0.35em")
        .style("text-anchor", "start")
        .text((d) => d)
        .attr("fill", "white");

    svg
        .selectAll(".vote-label")
        .data(partyVoteCounts)
        .enter()
        .append("text")
        .attr("class", "vote-label")
        .attr("x", (d) => xScale(d) + 5)
        .attr("y", (d, i) => yScale(parties[i]) + barHeight / 2)
        .attr("dx", 15)
        .attr("dy", "0.35em")
        .style("text-anchor", "start")
        .text((d) => d)
        .attr("fill", "black");
}
Promise.all([
    d3.json("../dataset/india_state_geo.json"),
    d3.json("../dataset/party_vote_counts.json"),
])
    .then(function (data) {
        const constituencyData = data[0];
        const partyVoteData = data[1];

        const width = 960;
        const height = 600;

        const svg = d3
            .select("#fortress-state-map")
            .attr("width", width)
            .attr("height", height);

        const projection = d3
            .geoMercator()
            .scale(1000)
            .center([82, 22])
            .translate([width / 2, height / 2]);

        const path = d3.geoPath().projection(projection);

        svg
            .selectAll("path")
            .data(constituencyData.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("fill", function (d) {
                const state = d.properties.NAME_1;
                const parties = partyVoteData[state];
                if (parties) {
                    const maxVotesParty = Object.keys(parties).reduce((a, b) =>
                        parties[a] > parties[b] ? a : b
                    );
                    return partyColours[maxVotesParty];
                } else {
                    return "lightblue";
                }
            })
            .style("stroke", "white")
            .on("click", function (event, d) {
                const stateName = d.properties.NAME_1;
                console.log("Clicked on state: " + stateName);
                console.log(partyVoteData[stateName]);
                generateBarGraph(partyVoteData[stateName]);
                getState(stateName);
            });

        svg
            .append("path")
            .datum(constituencyData.features)
            .attr("d", path)
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round");
    })
    .catch(function (error) {
        console.log("Error loading the data: " + error);
    });