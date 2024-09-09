d3.csv("../../dataset/constituencies.csv").then(function (data) {
    // Parse the seat count as numbers
    data.forEach(function (d) {
      d.seats = +d.total;
    });

    // Sort data by the number of seats
    data.sort(function (a, b) {
      return d3.descending(a.seats, b.seats);
    });

    // Set the dimensions and margins of the graph
    const margin = { top: 20, right: 20, bottom: 100, left: 60 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    // Set the ranges
    const x = d3.scaleBand().range([0, width]).padding(0.1);
    const y = d3.scaleLinear().range([height, 0]);

    // Append the svg object to the body of the page
    const svg = d3
      .select(".k72")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr(
        "transform",
        "translate(" + margin.left + "," + margin.top + ")"
      );

    // Scale the range of the data in the domains
    x.domain(
      data.map(function (d) {
        return d.state;
      })
    );
    y.domain([
      0,
      d3.max(data, function (d) {
        return d.seats;
      }),
    ]);

    // Tooltip setup
    var tooltip = d3.select(".tooltip");

    // Append the rectangles for the bar chart
    svg
      .selectAll(".bar2")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar2")
      .attr("x", function (d) {
        return x(d.state);
      })
      .attr("width", x.bandwidth())
      .attr("y", height) // Start from the bottom of the chart
      .attr("height", 0)
      .on("mouseover", function (event, d) {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(d.state + "<br/>" + d.seats + " seats")
          .style("left", event.pageX - 60 + "px")
          .style("top", event.pageY - 28 + "px");
        d3.select(this).style("fill", "orange");
      })
      .on("mouseout", function (d) {
        tooltip.transition().duration(500).style("opacity", 0);
        d3.select(this).style("fill", "steelblue");
      })
      .transition()
      .duration(4000)
      .attr("y", function (d) {
        return y(d.seats);
      })
      .attr("height", function (d) {
        return height - y(d.seats);
      })
      .delay(function (d, i) {
        return i * 50;
      });

    // Add the x Axis
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");

    // Add the y Axis
    svg.append("g").call(d3.axisLeft(y));

    // X axis label
    svg
      .append("text")
      .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")"
      )
      .style("text-anchor", "middle")
      .text("States");

    // Y axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Number of Seats");

    // Initial ani // Stagger the animation of bars
  });