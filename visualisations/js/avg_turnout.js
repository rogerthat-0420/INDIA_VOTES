d3.csv("../dataset/data.csv").then(function (data) {
    // Convert 'Turnout' column to numeric format and remove '%' sign
    data.forEach(function (d) {
        d.Turnout = parseFloat(d.Turnout.replace('%', '').replace(/,/g, ''));
    });

    // Filter data for the range of years 1962 to 2019
    var filteredData = data.filter(function (d) {
        return +d.year >= 1962 && +d.year <= 2019;
    });

    // Group filtered data by 'year' and calculate average turnout percentage
    var averageTurnoutByYear = d3.group(filteredData, d => d.year);
    var averageTurnoutData = Array.from(averageTurnoutByYear, ([year, values]) => ({
        year: year,
        averageTurnout: d3.mean(values, d => d.Turnout)
    }));

    // Define SVG dimensions and margins
    var margin = { top: 50, right: 150, bottom: 70, left: 70 }, // Adjusted margins for axis labels
        width = 1200 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;

    // Append SVG element to the body
    var svg = d3.select("#avg-turnout-svg-container")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define scales for x and y axes
    var x = d3.scaleBand()
        .domain(averageTurnoutData.map(d => d.year))
        .range([0, width])
        .padding(0.1);

    var y = d3.scaleLinear()
        .domain([0, d3.max(averageTurnoutData, d => d.averageTurnout)])
        .nice()
        .range([height, 0]);

    // Add gridlines
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSize(-height).tickFormat("").tickSizeOuter(0));

    svg.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y).tickSize(-width).tickFormat("").tickSizeOuter(0));

    // Define line function
    var line = d3.line()
        .x(d => x(d.year) + x.bandwidth() / 2)
        .y(d => y(d.averageTurnout));

    // Append path element for the line
    svg.append("path")
        .datum(averageTurnoutData)
        .attr("class", "line")
        .attr("d", line);

    // Append vertices
    svg.selectAll(".dot")
        .data(averageTurnoutData)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.year) + x.bandwidth() / 2)
        .attr("cy", d => y(d.averageTurnout))
        .attr("r", 5)
        .on("mouseover", function (event, d) {
            // Show tooltip
            tooltip.style("opacity", 1)
                .html(`Year: ${d.year}<br>Average Turnout: ${d.averageTurnout.toFixed(2)}%`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");

            // Highlight corresponding grid lines
            svg.select(".hover-line").remove();
            svg.append("line")
                .attr("class", "hover-line")
                .attr("x1", 0)
                .attr("y1", y(d.averageTurnout))
                .attr("x2", width)
                .attr("y2", y(d.averageTurnout));
            svg.append("line")
                .attr("class", "hover-line")
                .attr("x1", x(d.year) + x.bandwidth() / 2)
                .attr("y1", 0)
                .attr("x2", x(d.year) + x.bandwidth() / 2)
                .attr("y2", height);
        })
        .on("mouseout", function () {
            // Hide tooltip
            tooltip.style("opacity", 0);
            // Remove highlighted grid lines
            svg.selectAll(".hover-line").remove();
        });

    // Append x axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSizeOuter(0));

    // Append y axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add x axis label
    svg.append("text")
        .attr("class", "axis-text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.top)
        .text("Year");

    // Add y axis label
    svg.append("text")
        .attr("class", "axis-text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 10)
        .text("Average Turnout Percentage");

    // Append tooltip element
    const tooltip = d3.select("body").append("div")
        .attr("class", "avg-turnout-tooltip")
        .style("opacity", 0);
});