const svgWidth = document.getElementById("content").offsetWidth - 40; // Adjusted for padding
const svgHeight = document.getElementById("content").offsetHeight - 40; // Adjusted for padding
const margin = { top: 20, right: 20, bottom: 40, left: 40 }; // Adjusted for padding
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

const svg = d3.select("#scatterplot")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

d3.csv("../../dataset/modified_data.csv").then(function (data) {
    data.forEach(d => {
        d.Turnout = parseFloat(d.Turnout.replace(",", ""));
        d.votes = parseFloat(d.votes.replace(/,/g, ""));
        d.marginPercentage = parseFloat(d["margin%"].replace("%", ""));
    });

    function updatePlot(minMargin, state, year) {
        const filteredData = data.filter(d =>
            d.state === state &&
            d.year === year
        );

        const xScale = d3.scaleLinear()
            .domain([d3.min(filteredData, d => d.Turnout) - 2, d3.max(filteredData, d => d.Turnout) + 2])
            .range([margin.left, width - margin.right]);

        const yScale = d3.scaleLinear()
            .domain([d3.min(filteredData, d => d.votes) - 50000, d3.max(filteredData, d => d.votes) + 50000])
            .range([height - margin.bottom, margin.top]);

        const radiusScale = d3.scaleLinear()
            .domain([minMargin, d3.max(filteredData, d => d.marginPercentage)])
            .range([5, 30]);

        const colorScale = d3.scaleOrdinal()
            .domain(filteredData.map(d => d.party))
            .range(d3.schemeCategory10);

        svg.selectAll("*").remove();

        // Add x-axis
        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(d3.axisBottom(xScale));

        // Add y-axis
        svg.append("g")
            .attr("class", "y-axis")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(yScale));

        // Add circles
        svg.selectAll("circle")
            .data(filteredData.filter(d =>
                d.marginPercentage >= minMargin))
            .enter().append("circle")
            .attr("cx", d => xScale(d.Turnout))
            .attr("cy", d => yScale(d.votes))
            .attr("r", d => radiusScale(d.marginPercentage))
            .attr("fill", d => colorScale(d.party))
            .attr("opacity", 0.7)
            .attr("stroke", "white")
            .attr("stroke-width", 1)
            .on("mouseover", function (event, d) {
                d3.select("#tooltip")
                    .style("visibility", "visible")
                    .html(`<b>Constituency:</b>${d.Pc_name} <br><b>Party:</b> ${d.party}<br><b>Turnout:</b> ${d.Turnout}<br><b>Votes:</b> ${d.votes}<br><b>Margin Percentage:</b> ${d.marginPercentage}%`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 10) + "px");
            })
            .on("mouseout", function () {
                d3.select("#tooltip").style("visibility", "hidden");
            });

        // Add legend
        const legend = svg.selectAll(".legend")
            .data(colorScale.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(0, ${i * 20 + margin.top})`);

        legend.append("rect")
            .attr("x", width - margin.right - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", colorScale);

        legend.append("text")
            .attr("x", width - margin.right - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(d => d)
            .attr("fill", "white");
    }

    const marginSlider = document.getElementById("margin-slider");
    const marginValue = document.getElementById("margin-value");
    const stateSelect = document.getElementById("state-select");
    const yearSelect = document.getElementById("year-select");
    const button = document.getElementById("myButton");

    updatePlot(marginSlider.value, stateSelect.value, yearSelect.value);

    marginSlider.addEventListener("input", function () {
        const value = +this.value;
        marginValue.textContent = value + "%";
    });

    button.addEventListener("click", function () {
        updatePlot(+marginSlider.value, stateSelect.value, yearSelect.value);
    });

    stateSelect.addEventListener("change", function () {
        updatePlot(+marginSlider.value, this.value, yearSelect.value);
    });

    yearSelect.addEventListener("change", function () {
        updatePlot(+marginSlider.value, stateSelect.value, this.value);
    });

}).catch(function (error) {
    console.log("Error loading the data:", error);
});