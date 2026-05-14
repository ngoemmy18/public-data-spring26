    // Declare chart dimensions
        const margin = 30;
        const width = 700; 
        const height = 500;


    // Load CSV data
        d3.csv("tours_by_year.csv").then(data => {
            console.log("data", data)
        
            // Format data
            // year represents concert year
            // tours represents number of concerts held that year
        data.forEach(d => { 
            d.year = d.year;
            d.tours = +d.tours; 
        });
        
        const maxY = d3.max(data, d => d.tours);


    // Create scales
        const xScale = d3.scaleBand()
                        .domain(data.map(d => d.year))
                        .range([margin, width - margin])
                        .paddingInner(.02);
        
        const yScale = d3.scaleLinear()
                        .domain([0, maxY]) 
                        .range([height - margin, margin]);
        

    // Create SVG
        const svg = d3.select("body")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height);

                    
    // Create axes
        const bottomAxis = d3.axisBottom()
                             .scale(xScale);
        
        const leftAxis = d3.axisLeft()
                           .scale(yScale);
        

    // Create bars
        svg.selectAll("rect") 
            .data(data) 
            .enter()
            .append("rect")
            .attr("x", d => xScale(d.year)) 
            .attr("y", d => yScale(d.tours)) 
            .attr("width", xScale.bandwidth())
            .attr("height", d => (height-margin) - yScale(d.tours))
            .attr("fill", "pink");
        

    // Display axes
        svg.append("g")
            .attr("transform", "translate(0," + (height - margin) + ")") 
            .call(bottomAxis);

        svg.append("g")
            .attr("transform", "translate(" + margin + ",0)")
            .call(leftAxis); 

                
    });