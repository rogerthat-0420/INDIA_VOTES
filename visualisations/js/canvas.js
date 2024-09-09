function createRadarChartFromCSV(stateName) {
    d3.csv("../../dataset/states_wise_population_Income.csv").then(function(data1) {
        var filteredData = data1.filter(function(d) {
            return d.States == stateName;
        });

        console.log(filteredData[0]["2011-12-INC"]);

        var data = {
            labels: ['Poverty Rate', 'Unemployment Rate', 'Literacy Rate', 'Sex Ratio (per 1000 male)', 'Income per individual (in 10000s)'],
            datasets: [{
                label: '2001 Data',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                data: [filteredData[0]["2001 -Poverty"], filteredData[0]["2001 -UNEMP"], filteredData[0]["2001 - LIT"], filteredData[0]["2001 -SEX_Ratio"]/10, filteredData[0]["2011-12-INC"]*100/filteredData[0]["2001 - POP"]]
            }, {
                label: '2011 Data',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                data: [filteredData[0]["2011 -Poverty"], filteredData[0]["2011 -UNEMP"], filteredData[0]["2011- LIT"], filteredData[0]["2011 -SEX_Ratio"]/10, filteredData[0]["2011-12-INC"]*100/filteredData[0]["2011- POP"]]
            }]
        };

        // Radar chart options
        var options = {
            scales: {
                r: {
                    angleLines: {
                        color: '#ffffff',
                        lineWidth: 0.25,
                        display: true
                    },
                    // suggestedMin: 50,
                    // suggestedMax: 100
                    grid: {
                        color: '#ffffff',
                        lineWidth: 0.25,
                        display: true
                    }
                },
            },
            maintainAspectRatio: false,
            responsive: true,
            // legend: {
            //     labels: {
            //         fontColor: 'white' // Keep the legend text color white
            //     }
            // }
        };

        // Get the context of the canvas element we want to select
        var ctx = document.getElementById('radarChart').getContext('2d');

        // Create the radar chart
        var radarChart = new Chart(ctx, {
            type: 'radar',
            data: data,
            options: options
        });

    }).catch(function(error) {
        console.error('Error loading data:', error);
    });
}

createRadarChartFromCSV("Maharashtra");
