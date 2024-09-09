const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var width = 1000;
var height = 800;

var svg = d3.select("#india-map")
    .attr("width", width)
    .attr("height", height);

var colorScale = d3.scaleSequential(d3.interpolateBlues);

d3.json("../../dataset/india_pc_2012-17.json").then(function (geojson) {

    var projection = d3.geoMercator()
        .fitSize([width, height], geojson);

    var path = d3.geoPath()
        .projection(projection);

    d3.csv("../../dataset/modified_data.csv").then(function (data) {

        document.getElementById("year-dropdown").addEventListener("change", function () {
            var year = this.value;

            var yearInt = parseInt(year);

            var turnoutData = {};
            data.forEach(function (d) {
                if (parseInt(d.year) === parseInt(yearInt)) {
                    turnoutData[d.Pc_name.toUpperCase()] = parseInt(d.Turnout);
                }
            });
            // console.log(turnoutData);
            // Update color domain based on the new data
            var maxTurnout = d3.max(Object.values(turnoutData));
            colorScale.domain([0, maxTurnout]);

            // Remove existing paths
            svg.selectAll(".constituency").remove();

            // Draw the map
            // Draw the map
            // Draw the map
            svg.selectAll(".constituency")
                .data(geojson.features)
                .enter().append("path")
                .attr("class", "constituency")
                .attr("d", path)
                .style("fill", function (d) {
                    var pcName = d.properties.PC_NAME; // Get the PC_NAME property
                    if (pcName) {
                        // Extract the part of the name before the first space or opening parenthesis
                        var pcNameTrimmed = pcName.split(/[\s(]/)[0].toUpperCase();
                        // console.log(pcNameTrimmed, turnoutData[pcNameTrimmed] || 0)
                        return colorScale(turnoutData[pcNameTrimmed] || 0);
                    } else {
                        // Handle the case where PC_NAME is undefined
                        return "gray"; // or any other fallback color
                    }
                })
                // Event listeners omitted for brevity

                // Event listeners omitted for brevity

                // Event listener for mouseover
                .on("mouseover", function (event, d) {
                    d3.select(this)
                        .style("stroke", "cyan")
                        .style("stroke-width", 3);
                    // Extract constituency properties
                    var pc = d.properties; // Extract properties directly from the data
                    if (pc && pc.PC_NAME) {
                        var pcName = pc.PC_NAME.toUpperCase(); // Extract the constituency name
                        var value = turnoutData[pcName] || "N/A";
                        // Show tooltip
                        tooltip.style("opacity", 1)
                            .html("Constituency: " + pcName + "<br>" + "Turnout: " + value + "%")
                            .style("left", (event.pageX + 10) + "px")
                            .style("top", (event.pageY - 28) + "px");
                    }
                })

                .on("mouseout", function () {
                    d3.select(this)
                        .style("stroke", "black")
                        .style("stroke-width", 0.5);
                    // Hide tooltip
                    tooltip.style("opacity", 0);
                });
        });

        // Trigger change event to initially load data for the default year
        document.getElementById("year-dropdown").dispatchEvent(new Event("change"));
    });
});