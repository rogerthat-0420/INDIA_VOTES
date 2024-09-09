d3.csv("../../dataset/constituencies.csv").then(function(data) {
    // Extract just the state names for the dropdown
    var states = data.map(function(d) { return d.state; });
    var select = d3.select("#stateSelector73");
    select.selectAll("option")
        .data(states)
        .enter()
        .append("option")
        .text(function(d) { return d; });

    // Function to update the chart
    function update(selectedState) {
        var dataForState = data.filter(function(d) { return d.state === selectedState; })[0];
        var dataset = [
            {label: "ST", count: +dataForState.ST},
            {label: "SC", count: +dataForState.SC},
            {label: "Normal", count: +dataForState.total - dataForState.ST - dataForState.SC }
        ];
        
        var tooltip = d3.select(".tooltip");
        var width = 500;
        var height = 500;
        var radius = Math.min(width, height) / 2;

        var color = d3.scaleOrdinal()
            .range(["#98abc5", "#8a89a6", "#7b6888"]);

        var arc73 = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(0);

        var pie = d3.pie()
            .sort(null)
            .value(function(d) { return d.count; });

        // Select the SVG area and append group
        var svg = d3.select(".k73")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        // Remove existing arcs
        svg.selectAll(".arc73").remove();

        var g = svg.selectAll(".arc73")
            .data(pie(dataset))
            .enter().append("g")
            .attr("class", "arc73");

        g.append("path")
            .attr("d", arc73)
            .style("fill", function(d) { return color(d.data.label); })
            .on("mouseover", function (event, d) {
                tooltip.transition().duration(200).style("opacity", 0.9);
                tooltip
                  .html(d.data.label + "<br/>" + d.data.count + " seats")
                  .style("left", event.pageX - 60 + "px")
                  .style("top", event.pageY - 28 + "px");
                d3.select(this).style("stroke", "cyan")
                .style("stroke-width","4");
              })
              .on("mouseout", function (d) {
                tooltip.transition().duration(500).style("opacity", 0);
                d3.select(this).style("stroke", "white")
                .style("stroke-width","1");
                
              })
            .transition()
            .duration(1000)
            .attrTween("d", function(d) {
                var interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d);
                return function(t) {
                    return arc73(interpolate(t));
                };
            });
            

        g.append("text")
            .attr("transform", function(d) { return "translate(" + arc73.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .text(function(d) { return d.data.label; });
    }

    // Initial update
    update(states[0]); // Update with the first state initially

    // Update based on dropdown change
    select.on("change", function() {
        update(this.value);
    });

});