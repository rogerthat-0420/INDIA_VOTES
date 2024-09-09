import { partyColours } from "./constants.js";

d3.csv("../dataset/data.csv")
    .then((data) => {

        const data_to_plot = {};

        data.forEach((d) => {
            if (!data_to_plot[d['year']]) {
                data_to_plot[d['year']] = {};
            }

            if (!data_to_plot[d['year']][d['party']]) {
                data_to_plot[d['year']][d['party']] = 0;
            }

            data_to_plot[d['year']][d['party']] += 1;
        });

        // console.log(data_to_plot);

        const dataForLineChart = [];
        Object.keys(data_to_plot).forEach(year => {
            const dataForYear = data_to_plot[year];
            const sortedDataForYear = Object.entries(dataForYear)
                .sort((a, b) => b[1] - a[1])
                .reduce((acc, [party, seats]) => {
                    acc[party] = seats;
                    return acc;
                }, {});

            // console.log(year, sortedDataForYear);

            let seatsWonByINC = 0;
            let seatsWonByINC_I = 0;

            if (year === "1971" || year === "1980") {
                seatsWonByINC = dataForYear["Indian National Congress"] || 0;
                seatsWonByINC_I = dataForYear["Indian National Congress (I)"] || 0;
            } else {
                seatsWonByINC = Object.keys(dataForYear).reduce((acc, key) => {
                    if (key.includes("Indian National Congress") && !key.includes("(ORGANISATION)")) {
                        return acc + dataForYear[key];
                    }
                    return acc;
                }, 0);
            }

            const seatsWonByBJP = dataForYear["Bharatiya Janta Party"] || 0;
            let seatsWonByCPI_M = dataForYear["Communist Party Of India (MARXIST)"] || 0;

            const otherParties = Object.values(dataForYear).reduce((acc, val) => acc + val, 0) - seatsWonByINC - seatsWonByINC_I - seatsWonByBJP - seatsWonByCPI_M;

            dataForLineChart.push({ year, "Indian National Congress": seatsWonByINC + seatsWonByINC_I, "Bharatiya Janta Party": seatsWonByBJP, "Communist Party Of India (MARXIST)": seatsWonByCPI_M, "Others": otherParties });
        });

        // const threshold = 20; // Adjust this threshold as needed

        // const otherPartiesSeatShare = {};

        // // Calculate total seat share for other parties across all years
        // Object.values(data_to_plot).forEach(yearData => {
        //     Object.entries(yearData).forEach(([party, seats]) => {
        //         if (party !== "Indian National Congress" && party !== "Bharatiya Janta Party" && seats > threshold) {
        //             if (!otherPartiesSeatShare[party]) {
        //                 otherPartiesSeatShare[party] = 0;
        //             }
        //             otherPartiesSeatShare[party] += 1;
        //         }
        //     });
        // });

        // // Identify other parties that consistently rank high
        // // Sort the otherPartiesSeatShare object by seat share in descending order
        // const sortedOtherPartiesSeatShare = Object.entries(otherPartiesSeatShare)
        //     .sort((a, b) => b[1] - a[1]);

        // console.log("Other parties consistently ranking high in seat share:", sortedOtherPartiesSeatShare);

        const width = 1000;
        const height = 600;
        const margin = { top: 50, right: 50, bottom: 70, left: 70 };

        const svgContainer = d3.select("#landscape_analysis")
            .append("div")
            .style("display", "flex")
            .style("justify-content", "center");

        const svg = svgContainer.append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height - margin.bottom + 5)
            .text("Year");

        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "middle")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 20)
            .attr("transform", "rotate(-90)")
            .text("Seats Won");

        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
        // .style("opacity", 0)
        // .style("position", "absolute")
        // .style("background-color", "white")
        // .style("border", "solid")
        // .style("border-width", "1px")
        // .style("border-radius", "5px")
        // .style("padding", "10px");


        const years = dataForLineChart.map(d => d.year).filter(year => year !== "");

        const xScale = d3.scaleBand()
            .domain(years)
            .range([0, width - margin.left - margin.right])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(dataForLineChart, d => Math.max(d["Indian National Congress"], d["Bharatiya Janta Party"], d.Others)) + 75])
            .range([height - margin.top - margin.bottom, 0]);

        const lineINC = d3.line()
            .x(d => xScale(d.year) + xScale.bandwidth() / 2)
            .y(d => yScale(d["Indian National Congress"]));

        const lineBJP = d3.line()
            .x(d => xScale(d.year) + xScale.bandwidth() / 2)
            .y(d => yScale(d["Bharatiya Janta Party"]));

        const lineCPI_M = d3.line()
            .x(d => xScale(d.year) + xScale.bandwidth() / 2)
            .y(d => yScale(d["Communist Party Of India (MARXIST)"]));

        const lineOthers = d3.line()
            .x(d => xScale(d.year) + xScale.bandwidth() / 2)
            .y(d => yScale(d.Others));

        svg.append("path")
            .datum(dataForLineChart)
            .attr("fill", "none")
            .attr("stroke", partyColours["Indian National Congress"])
            .attr("stroke-width", 2)
            .attr("d", lineINC)
            .on("mouseover", function (event, d) {
                const mouseX = d3.pointer(event)[0];
                const yearIndex = Math.floor((mouseX - xScale.step() / 2) / xScale.step());
                const year = dataForLineChart[yearIndex].year;
                const dataPoint = dataForLineChart.find(point => point.year === year);

                if (year === "1980") {
                    tooltip.transition().duration(200).style("opacity", 0.9);
                    tooltip.html(`Seats won by Indian National Congress (O) in ${year}: ${dataPoint["Indian National Congress"]}`)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 30) + "px");
                } else {
                    tooltip.transition().duration(200).style("opacity", 0.9);
                    tooltip.html(`Seats won by Indian National Congress in ${year}: ${dataPoint["Indian National Congress"]}`)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 30) + "px");
                }
            })
            .on("mouseout", function () {
                tooltip.transition().duration(500).style("opacity", 0);
            });


        svg.append("path")
            .datum(dataForLineChart)
            .attr("fill", "none")
            .attr("stroke", partyColours["Bharatiya Janta Party"])
            .attr("stroke-width", 2)
            .attr("d", lineBJP)
            .on("mouseover", function (event) {
                const mouseX = d3.pointer(event)[0];
                const yearIndex = Math.floor((mouseX - xScale.step() / 2) / xScale.step());
                const year = dataForLineChart[yearIndex].year;
                const dataPoint = dataForLineChart.find(point => point.year === year);

                tooltip.transition().duration(200).style("opacity", 0.9);
                tooltip.html(`Seats won by Bharatiya Janta Party in ${year}: ${dataPoint["Bharatiya Janta Party"]}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 30) + "px");
            })
            .on("mouseout", function () {
                tooltip.transition().duration(500).style("opacity", 0);
            });

        svg.append("path")
            .datum(dataForLineChart)
            .attr("fill", "none")
            .attr("stroke", partyColours["Communist Party Of India (Marxist)"])
            .attr("stroke-width", 2)
            .attr("d", lineCPI_M)
            .on("mouseover", function (event) {
                const mouseX = d3.pointer(event)[0];
                const yearIndex = Math.floor((mouseX - xScale.step() / 2) / xScale.step());
                const year = dataForLineChart[yearIndex].year;
                const dataPoint = dataForLineChart.find(point => point.year === year);

                tooltip.transition().duration(200).style("opacity", 0.9);
                tooltip.html(`Seats won by Communist Party Of India (MARXIST) in ${year}: ${dataPoint["Communist Party Of India (MARXIST)"]}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 30) + "px");
            })
            .on("mouseout", function () {
                tooltip.transition().duration(500).style("opacity", 0);
            });

        svg.append("path")
            .datum(dataForLineChart)
            .attr("fill", "none")
            .attr("stroke", "gray")
            .attr("stroke-width", 2)
            .attr("d", lineOthers)
            .on("mouseover", function (event) {
                const mouseX = d3.pointer(event)[0];
                const yearIndex = Math.floor((mouseX - xScale.step() / 2) / xScale.step());
                const year = dataForLineChart[yearIndex].year;
                const dataPoint = dataForLineChart.find(point => point.year === year);

                tooltip.transition().duration(200).style("opacity", 0.9);
                tooltip.html(`Seats won by Others in ${year}: ${dataPoint["Others"]}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 30) + "px");
            })
            .on("mouseout", function () {
                tooltip.transition().duration(500).style("opacity", 0);
            });

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("transform", "rotate(-45)");

        svg.append("g")
            .call(d3.axisLeft(yScale));

        const legendWidth = 150;

        const legend = svg.append("g")
            .attr("transform", `translate(${width - margin.right - 2.5 * legendWidth},${margin.top})`);

        legend.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", partyColours["Indian National Congress"]);

        legend.append("text")
            .attr("class", "legend-text")
            .attr("x", 25)
            .attr("y", 9)
            .attr("dy", "0.32em")
            .text("Indian National Congress");

        legend.append("rect")
            .attr("x", 0)
            .attr("y", 25)
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", partyColours["Bharatiya Janta Party"]);

        legend.append("text")
            .attr("class", "legend-text")
            .attr("x", 25)
            .attr("y", 34)
            .attr("dy", "0.32em")
            .text("Bharatiya Janta Party");

        legend.append("rect")
            .attr("x", 0)
            .attr("y", 50)
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", partyColours["Communist Party Of India (Marxist)"]);

        legend.append("text")
            .attr("class", "legend-text")
            .attr("x", 25)
            .attr("y", 59)
            .attr("dy", "0.32em")
            .text("Communist Party Of India (MARXIST)");

        legend.append("rect")
            .attr("x", 0)
            .attr("y", 75)
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", "gray");

        legend.append("text")
            .attr("class", "legend-text")
            .attr("x", 25)
            .attr("y", 84)
            .attr("dy", "0.32em")
            .text("Others");

        legend.selectAll("rect")
            .on("mouseover", function (event, d) {
                const party = d3.select(this).attr("fill");
                svg.selectAll("path")
                    .attr("stroke-opacity", 0.3);
                svg.selectAll(`path[stroke="${party}"]`)
                    .attr("stroke-opacity", 1);
            })
            .on("mouseout", function () {
                svg.selectAll("path")
                    .attr("stroke-opacity", 1);
            });

    })
    .catch((error) => {
        console.error(error);
    });
