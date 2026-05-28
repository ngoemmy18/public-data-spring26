const width = 1100;
const height = 650;

const margin = {
    top: 80,
    right: 220,
    bottom: 80,
    left: 100
};

// Create svg
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Load csv
d3.csv("tour_counts.csv").then(function (data) {

    // convert strings to numbers
    data.forEach(d => {
        d.Year = +d.Year;
        d.BLACKPINK = +d.BLACKPINK;
        d.BTS = +d.BTS;
        d.ENHYPEN = +d.ENHYPEN;
        d.TWICE = +d.TWICE;
    });

    // x scale
    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.Year))
        .range([margin.left, width - margin.right]);

    // y scale
    const yScale = d3.scaleLinear()
        .domain([
            0,
            d3.max(data, d =>
                Math.max(
                    d.BLACKPINK,
                    d.BTS,
                    d.ENHYPEN,
                    d.TWICE
                )
            )
        ])
        .range([height - margin.bottom, margin.top]);

    // Color scale
    const color = d3.scaleOrdinal()
        .domain(["BLACKPINK", "BTS", "ENHYPEN", "TWICE"])
        .range([
            "#ff77aa",
            "#a78bfa",
            "#6ee7b7",
            "#f9a8d4"
        ]);

    // x axis
    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(
            d3.axisBottom(xScale)
                .tickValues(data.map(d => d.Year))
                .tickFormat(d3.format("d"))
        );

    // y axis
    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale));

    // Create lines
    const line = d3.line()
        .x(d => xScale(d.Year))
        .y(d => yScale(d.value));

    // Artist names
    const artists = [
        "BLACKPINK",
        "BTS",
        "ENHYPEN",
        "TWICE"
    ];

    // Draw lines
    artists.forEach(artist => {

        const artistData = data.map(d => {
            return {
                Year: d.Year,
                value: d[artist]
            };
        });

        svg.append("path")
            .datum(artistData)
            .attr("fill", "none")
            .attr("stroke", color(artist))
            .attr("stroke-width", 5)
            .attr("d", line);
    });

    // Chart title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 40)
        .attr("text-anchor", "middle")
        .style("font-size", "32px")
        .style("font-weight", "bold")
        .text("K-pop Tour Stops Over Time");

    // x axis label
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - 20)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .text("Year");

    // y axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 40)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .text("Number of Tour Stops");

    // Legend
    artists.forEach((artist, i) => {

        svg.append("rect")
            .attr("x", width - 180)
            .attr("y", 120 + i * 40)
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", color(artist));

        svg.append("text")
            .attr("x", width - 150)
            .attr("y", 136 + i * 40)
            .style("font-size", "18px")
            .text(artist);
    });

});