// SVG dimensions
const width = 1000;
const height = 500;

const tourCount = d3.select("#tourCount");
const counterYear = d3.select("#counterYear");

// Select SVG
const svg = d3
    .select("#map")
    .attr("width", width)
    .attr("height", height);

// Create tooltip
const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip");

// Projection
const projection = d3
    .geoAlbersUsa()
    .translate([width / 2 + 40, height / 2 - 30])    
    .scale(1100);

// Path generator
const path = d3.geoPath().projection(projection);

const colorScale = d3
    .scaleOrdinal()
    .domain([
        2015,
        2016,
        2017,
        2018,
        2019,
        2020,
        2021,
        2022,
        2023,
        2024
    ])
    .range([
        "#f9a8d4",
        "#f472b6",
        "#ec4899",
        "#db2777",
        "#c026d3",
        "#a855f7",
        "#9333ea",
        "#7e22ce",
        "#6b21a8",
        "#581c87"
    ]);

// Create legend

const legend = d3.select("#legend");

const years = [
    2015,
    2016,
    2017,
    2018,
    2019,
    2020,
    2021,
    2022,
    2023,
    2024
];

years.forEach(function (year) {

    const item = legend
        .append("div")
        .attr("class", "legend-item");

    item
        .append("div")
        .attr("class", "legend-color")
        .style("background-color", colorScale(year));

    item
        .append("span")
        .text(year);

});

// Slider elements
const slider = d3.select("#yearSlider");
const yearLabel = d3.select("#yearLabel");

// Current selected year
let currentYear = 2015;

// Load BOTH files
Promise.all([

    // US map topojson
    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"),

    // Your CSV file
    d3.csv("tours.csv")

]).then(function ([usData, tourData]) {

    // Convert year + coordinates into numbers
    tourData.forEach(function (d) {

        d.Year = +d.Year;
        d.Latitude = +d.Latitude;
        d.Longitude = +d.Longitude;

    });

    // Convert topojson into geojson
    const states = topojson.feature(
        usData,
        usData.objects.states
    );

    // Draw states
    svg
        .selectAll(".state")
        .data(states.features)
        .enter()
        .append("path")
        .attr("class", "state")
        .attr("d", path);

    // Draw initial circles
    updateMap(currentYear);

    // Slider interaction
    slider.on("input", function () {

        currentYear = +this.value;

        yearLabel.text(currentYear);

        updateMap(currentYear);

    });

    // Update function
    function updateMap(selectedYear) {

        // FILTER:
        // show all tours UP TO selected year
        const filteredData = tourData.filter(function (d) {

            return d.Year <= selectedYear;

        });

        tourCount.text(filteredData.length);

        counterYear.text(selectedYear);

        // Bind data
        const circles = svg
            .selectAll(".tour-circle")
            .data(filteredData);

        // Remove old circles
        circles.exit().remove();

        // Add new circles
        circles
            .enter()
            .append("circle")
            .attr("class", "tour-circle")
            .attr("fill", function (d) {

                return colorScale(d.Year);

            })

            .attr("cx", function (d) {

                const coords = projection([
                    d.Longitude,
                    d.Latitude
                ]);

                return coords ? coords[0] : -100;

            })

            .attr("cy", function (d) {

                const coords = projection([
                    d.Longitude,
                    d.Latitude
                ]);

                return coords ? coords[1] : -100;

            })

            // Tooltip interactions
            .on("mouseover", function (event, d) {

                tooltip
                    .style("opacity", 1)
                    .html(`
                        <strong>${d.Artist}</strong><br>
                        ${d.City}<br>
                        ${d.Venue}<br>
                        ${d.Date}
                    `);

            })

            .on("mousemove", function (event) {

                tooltip
                    .style("left", (event.pageX + 15) + "px")
                    .style("top", (event.pageY - 28) + "px");

            })

            .on("mouseout", function () {

                tooltip
                    .style("opacity", 0);

            })

            .attr("r", 5)

            .attr("opacity", 0)

            .transition()
            .duration(600)
            .ease(d3.easeCubicOut)

            .attr("opacity", function (d) {

                if (d.Year === selectedYear) {
                    return 0.95;
                }

                return 0.18;
            });

    }

});