d3.csv('../../dataset/partywise_seats.csv').then(data => {
    const states = Array.from(new Set(data.map(d => d.state)));
    
    
    const stateSelect = document.getElementById('state71');
    states.forEach(state => {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
       });

       const selectedState = stateSelect.value;
           const parties = Array.from(new Set(data.filter(d => d.state === selectedState).map(d => d.party)));
           
           const partySelects = [document.getElementById('party171'), document.getElementById('party271')];
           
           partySelects.forEach(select => {
               select.innerHTML = ''; // Clear existing options
               parties.forEach(party => {
                   const option = document.createElement('option');
                   option.value = party;
                   option.textContent = party;
                   select.appendChild(option);
               });
           });
       
       stateSelect.addEventListener('change', function() {
           const selectedState = stateSelect.value;
           const parties = Array.from(new Set(data.filter(d => d.state === selectedState).map(d => d.party)));
           
           const partySelects = [document.getElementById('party171'), document.getElementById('party271')];
           
           partySelects.forEach(select => {
               select.innerHTML = ''; // Clear existing options
               parties.forEach(party => {
                   const option = document.createElement('option');
                   option.value = party;
                   option.textContent = party;
                   select.appendChild(option);
               });
           });
       });

   const state = document.getElementById('state71').value;
   const party1 = document.getElementById('party171').value;
   const party2 = document.getElementById('party271').value;

   const data1 = data.filter(d => d.state === state && d.party === party1);
   const data2 = data.filter(d => d.state === state && d.party === party2);



   d3.select("#chart71").selectAll("*").remove();
   const svg = d3
       .select("#chart71")
       .append("svg")
       .attr("height", 600)
       .attr("width", 1000);
   const margin = { top: 0, bottom: 20, left: 30, right: 20 };
   const chart = svg.append("g").attr("transform", `translate(${margin.left},0)`);
   const width = +svg.attr("width") - margin.left - margin.right;
   const height = +svg.attr("height") - margin.top - margin.bottom;
   const grp = chart.append("g").attr("transform", `translate(-${margin.left},-${margin.top})`);

   chart.append("g").attr("class", "x-axis");
   chart.append("g").attr("class", "y-axis");

   const path1 = grp
       .append("path")
       .attr("transform", `translate(${margin.left},0)`)
       .attr("fill", "none")
       .attr("stroke", "steelblue")
       .attr("stroke-linejoin", "round")
       .attr("stroke-linecap", "round")
       .attr("stroke-width", 4);

   const path2 = grp
       .append("path")
       .attr("transform", `translate(${margin.left},0)`)
       .attr("fill", "none")
       .attr("stroke", "orange") // Change color for the second line
       .attr("stroke-linejoin", "round")
       .attr("stroke-linecap", "round")
       .attr("stroke-width", 4);

   function updateScales(data1, data2) {
       const yScale = d3
           .scaleLinear()
           .range([height, 0])
           .domain([0, Math.max(d3.max(data1, dataPoint => dataPoint.seats), d3.max(data2, dataPoint => dataPoint.seats)) +40]);
       const xScale = d3
           .scaleLinear()
           .range([0, width])
           .domain([1962.0,
                   2019.0]);
       return { yScale, xScale };
   }

   function createLine(xScale, yScale) {
       return d3
           .line()
           .x(dataPoint => xScale(dataPoint.year))
           .y(dataPoint => yScale(dataPoint.seats!=null ? dataPoint.seats : 0));
   }

   function updateAxes(data1,data2, chart, xScale, yScale) {
       const years = ['1962', '1967', '1971', '1977', '1980', '1984', '1989', '1991', '1996', '1998', '2004', '2009', '2014', '2019'];
       chart
           .select(".x-axis")
           .attr("transform", `translate(0,${height})`)
           // .call(d3.axisBottom(xScale).tickValues(data1.map(d => d.year)))
           .call(d3.axisBottom(xScale).tickValues(years));
           
       chart
           .select(".y-axis")
           .attr("transform", `translate(0, 0)`)
           .call(d3.axisLeft(yScale));
           // .call(d3.axisLeft(yScale).tickValues(data.map(d => d.year)));
   }

   function updatePath(data, line, path) {
       const updatedPath = path
           .interrupt()
           .datum(data)
           .attr("d", line);

       const pathLength = updatedPath.node().getTotalLength();
       const transitionPath = d3
           .transition()
           .ease(d3.easeSin)
           .duration(5000);
       updatedPath
           .attr("stroke-dashoffset", pathLength)
           .attr("stroke-dasharray", pathLength)
           .transition(transitionPath)
           .attr("stroke-dashoffset", 0);
   }

   function updateChart(data1, data2) {
       const { yScale, xScale } = updateScales(data1, data2);
       const line1 = createLine(xScale, yScale);
       const line2 = createLine(xScale, yScale); // Use the same scales for both lines
       updateAxes(data1,data2, chart, xScale, yScale);
       updatePath(data1, line1, path1);
       updatePath(data2, line2, path2);
   }

   updateChart(data1, data2); // Call updateChart with your data arrays
   d3.select(".button71").on("click", () => {
       const state = document.getElementById('state71').value;
       const party1 = document.getElementById('party171').value;
       const party2 = document.getElementById('party271').value;

       const data1 = data.filter(d => d.state === state && d.party === party1);
       const data2 = data.filter(d => d.state === state && d.party === party2);
       updateChart(data1, data2);
   });

   });