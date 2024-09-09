import { partyColours } from "./constants.js";

d3.csv("../dataset/2019_elections.csv")
    .then((data) => {
        data.forEach((d) => {
            d.Turnout = parseFloat(d.Turnout.replace("%", ""));
        });

        data.sort((a, b) => {
            return a["#"] - b["#"];
        });

        const width = 800;
        const height = 400;
        const margin = { top: 20, right: 20, bottom: 30, left: 50 };

        const svg = d3
            .select("#turnout-scatterplot")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr(
                "transform",
                "translate(" + margin.left + "," + margin.top + ")"
            );

        const tooltip = d3
            .select("body")
            .append("div")
            .attr("class", "turnout-tooltip")
            .style("opacity", 0);

        svg
            .selectAll(".scatter_dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "scatter_dot")
            .attr(
                "cx",
                (d, i) => i * (width / data.length) + width / data.length / 2
            )
            .attr("cy", (d) => height - (d.Turnout / 100) * height)
            .attr("r", 5)
            // .style("fill", (d) => partyColours[d.Party])
            .on("mouseover", (event, d) => {
                tooltip.transition().duration(200).style("opacity", 0.9);
                tooltip
                    .html(
                        "Constituency: " +
                        d["PC Name"] +
                        "<br/>State: " +
                        d.State +
                        "<br/>Party: " +
                        d.Party +
                        "<br/>PC Number: " +
                        d["#"] +
                        "<br/>Turnout: " +
                        d.Turnout +
                        "%"
                    )
                    .style("left", event.pageX + "px")
                    .style("top", event.pageY - 28 + "px");
            })
            .on("mouseout", () => {
                tooltip.transition().duration(500).style("opacity", 0);
            });

        const xScale = d3
            .scaleBand()
            .domain(data.map((d) => d["#"]))
            .range([0, width], 100)
            .padding(0.1);

        svg
            .append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(
                d3.axisBottom(xScale).tickValues(
                    xScale.domain().filter(function (d) {
                        return d % 50 == 0;
                    })
                )
            )
            .selectAll("text")
            .remove();

        const yScale = d3.scaleLinear().domain([0, 100]).range([height, 0]);

        svg.append("g").call(d3.axisLeft(yScale));

        const meanTurnout = d3.mean(data, (d) => d.Turnout);

        svg
            .append("line")
            .attr("x1", 0)
            .attr("y1", height - (meanTurnout / 100) * height)
            .attr("x2", width)
            .attr("y2", height - (meanTurnout / 100) * height)
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "5,5")
            .on("mouseover", function (event) {
                tooltip.transition().duration(200).style("opacity", 0.9);
                tooltip
                    .html("Mean Turnout (Overall): " + meanTurnout.toFixed(2) + "%")
                    .style("left", event.pageX + "px")
                    .style("top", event.pageY - 28 + "px");
            })
            .on("mouseout", function () {
                tooltip.transition().duration(500).style("opacity", 0);
            });

        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height * 1.06)
            .text("Constituency");

        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "middle")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 17)
            .attr("transform", "rotate(-90)")
            .text("Turnout");

        function updateDashboard(filteredData) {
            const selectedState =
                document.getElementById("stateDropdown").value;
            const selectedParty =
                document.getElementById("partyDropdown").value;

            // Filter data based on selected state
            const stateFilteredData =
                selectedState === "all"
                    ? data
                    : data.filter((d) => d.State === selectedState);

            // Calculate total constituencies of the selected state
            const totalConstituencies = stateFilteredData.length;

            // Display total constituencies
            const constituenciesInfo =
                document.getElementById("constituenciesInfo");
            constituenciesInfo.textContent = `Total Constituencies in ${selectedState}: ${totalConstituencies}`;

            // Calculate seats won by the selected party
            let totalSeatsWon = 0;
            if (selectedParty !== "all") {
                totalSeatsWon = stateFilteredData.reduce((acc, curr) => {
                    return curr.Party === selectedParty ? acc + 1 : acc;
                }, 0);
            }

            // Display seats won by the selected party or total parties that won in the state
            const seatsWonInfo = document.getElementById("seatsWonInfo");
            if (selectedParty !== "all") {
                seatsWonInfo.textContent = `Seats Won by ${selectedParty} in ${selectedState}: ${totalSeatsWon}`;
            } else {
                // Calculate total parties that won in the state
                const totalPartiesWon = [
                    ...new Set(stateFilteredData.map((d) => d.Party)),
                ].filter((party) => party !== "Independent").length;
                seatsWonInfo.textContent = `Total Parties that Won in ${selectedState}: ${totalPartiesWon}`;
            }
        }

        function updatePlot() {
            const selectedState =
                document.getElementById("stateDropdown").value;
            const selectedParty =
                document.getElementById("partyDropdown").value;

            // Filter data based on selected state and party
            const filteredData = data.filter((d) => {
                if (selectedState === "all" && selectedParty === "all") {
                    return true;
                } else if (selectedState !== "all" && selectedParty === "all") {
                    return d.State === selectedState;
                } else if (selectedState === "all" && selectedParty !== "all") {
                    return d.Party === selectedParty;
                } else {
                    return d.State === selectedState && d.Party === selectedParty;
                }
            });

            // Calculate mean turnout of the selected data points
            const meanTurnout = d3.mean(filteredData, (d) => d.Turnout);

            // Update scatter plot based on filtered data
            svg
                .selectAll(".scatter_dot")
                .data(data)
                .enter()
                .append("circle")
                .attr("class", "scatter_dot")
                .merge(svg.selectAll(".scatter_dot"))
                .attr("opacity", (d) => {
                    if (filteredData.length === 0) {
                        return 0.5; // Reduce opacity if no data is selected
                    } else {
                        return filteredData.includes(d) ? 1 : 0.5; // Reduce opacity for non-selected data
                    }
                })
                .style("fill", (d) => {
                    if (filteredData.length === 0) {
                        return "gray"; // Make color gray if no data is selected
                    } else {
                        return filteredData.includes(d)
                            ? partyColours[d.Party]
                            : "gray"; // Make color gray for non-selected data
                    }
                })
                .attr("r", (d) => {
                    if (filteredData.length === 0) {
                        return 5; // Default radius if no data is selected
                    } else {
                        return filteredData.includes(d) ? 5 : 3; // Reduce radius for non-selected data
                    }
                });

            // Remove existing mean turnout line
            svg.selectAll(".mean-line").remove();

            // Draw mean turnout line if data is selectedx
            if (filteredData.length > 0) {
                let tooltipText = "Mean Turnout (";
                if (selectedState !== "all" && selectedParty !== "all") {
                    tooltipText += selectedParty + " in " + selectedState;
                } else if (selectedState !== "all") {
                    tooltipText += selectedState;
                } else if (selectedParty !== "all") {
                    tooltipText += selectedParty;
                }
                tooltipText += "): " + meanTurnout.toFixed(2) + "%";

                svg
                    .append("line")
                    .attr("class", "mean-line")
                    .attr("x1", 0)
                    .attr("y1", height - (meanTurnout / 100) * height)
                    .attr("x2", width)
                    .attr("y2", height - (meanTurnout / 100) * height)
                    .attr("stroke", "#00cc66")
                    .attr("stroke-width", 2)
                    .attr("stroke-dasharray", "5,5")
                    .on("mouseover", function (event) {
                        tooltip.transition().duration(200).style("opacity", 0.9);
                        tooltip
                            .html(tooltipText)
                            .style("left", event.pageX + "px")
                            .style("top", event.pageY - 28 + "px");
                    })
                    .on("mouseout", function () {
                        tooltip.transition().duration(500).style("opacity", 0);
                    });
            }

            updateDashboard(filteredData);
        }

        const states = [...new Set(data.map((d) => d.State))];
        states.sort();
        const stateDropdown = document.getElementById("stateDropdown");
        states.forEach((state) => {
            const option = document.createElement("option");
            option.value = state;
            option.textContent = state;
            stateDropdown.appendChild(option);
        });

        const parties = [...new Set(data.map((d) => d.Party))];
        parties.sort();
        const partyDropdown = document.getElementById("partyDropdown");
        parties.forEach((party) => {
            const option = document.createElement("option");
            option.value = party;
            option.textContent = party;
            partyDropdown.appendChild(option);
        });

        document
            .getElementById("stateDropdown")
            .addEventListener("change", updatePlot);
        document
            .getElementById("partyDropdown")
            .addEventListener("change", updatePlot);

        updatePlot();
    })
    .catch((error) => {
        console.error("Error loading the data:", error);
    });