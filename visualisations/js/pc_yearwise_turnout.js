d3.csv("../dataset/data.csv").then(function (data) {
    // Convert 'Turnout' column to numeric format and remove '%' sign
    data.forEach(function (d) {
        d.Turnout = parseFloat(d.Turnout.replace('%', '').replace(/,/g, ''));
    });

    // Extract constituency names from the year 2019 data
    const constituencyNames = Array.from(new Set(data.filter(d => d.year === "2019").map(d => d.Pc_name)));

    // Populate dropdown with constituency names
    var dropdown = d3.select("#dropdown");
    constituencyNames.forEach(function (name) {
        dropdown.append("option").text(name).attr("value", name);
    });

    // Define SVG dimensions and margins
    var margin = { top: 50, right: 50, bottom: 70, left: 70 }, // Adjusted margins for axis labels
        width = 1200 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;

    // Append SVG element to the body
    var svg = d3.select("#pc-yearwise-turnout-svg-container")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define scales for x and y axes
    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);

    var y = d3.scaleLinear()
        .range([height, 0]);

    // Add gridlines
    // Add gridlines
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSize(-height).tickFormat("").tickSizeOuter(0));

    svg.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y).tickSize(-width).tickFormat("").tickSizeOuter(0));



    // Function to update the plot based on selected constituency
    function updatePlot(selectedConstituency) {
        // Filter data for the selected constituency
        var constituencyData = data.filter(d => d.Pc_name === selectedConstituency);

        // Update domains of x and y scales
        x.domain(constituencyData.map(d => d.year));
        y.domain([0, d3.max(constituencyData, d => d.Turnout)]);

        // Define line function
        var line = d3.line()
            .x(d => x(d.year) + x.bandwidth() / 2)
            .y(d => y(d.Turnout));

        // Append path element for the line
        svg.selectAll(".line").remove(); // Remove existing line
        svg.append("path")
            .datum(constituencyData)
            .attr("class", "line")
            .attr("d", line);

        // Append vertices
        svg.selectAll(".dot").remove(); // Remove existing vertices
        svg.selectAll(".dot")
            .data(constituencyData)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", d => x(d.year) + x.bandwidth() / 2)
            .attr("cy", d => y(d.Turnout))
            .attr("r", 5)
            .on("mouseover", function (event, d) {
                // Show tooltip
                tooltip.style("opacity", 1)
                    .html(`Year: ${d.year}<br>Turnout: ${d.Turnout.toFixed(2)}%`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");

                // Highlight corresponding grid lines
                svg.select(".hover-line").remove();
                svg.append("line")
                    .attr("class", "hover-line")
                    .attr("x1", 0)
                    .attr("y1", y(d.Turnout))
                    .attr("x2", width)
                    .attr("y2", y(d.Turnout));
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

        // Update x and y axes
        svg.select(".x-axis").remove();
        svg.select(".y-axis").remove();
        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        svg.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y));

        // Label for the y-axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Turnout Percentage")
            .attr("class", "axis-text");

        // Label for the x-axis
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + margin.top + 20)
            .style("text-anchor", "middle")
            .text("Year")
            .attr("class", "axis-text");
    }

    // Add event listener to the dropdown
    dropdown.on("change", function () {
        var selectedConstituency = this.value;
        updatePlot(selectedConstituency);
    });

    // Initial plot with the first constituency selected
    var initialConstituency = constituencyNames[0];
    updatePlot(initialConstituency);

    // Append tooltip element
    const tooltip = d3.select("body").append("div")
        .attr("class", "pc-yearwise-tooltip")
        .style("opacity", 0);
});