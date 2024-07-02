// Build the metadata panel
function buildMetadata(sample) {
  // Fetch the JSON data
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the metadata field
    var metadataArray = data.metadata;

    // Filter the metadata for the object with the desired sample number
    var filteredMetadata = metadataArray.filter(metadata => metadata.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    var metadata_panel = d3.select("#sample-metadata");

    // Clear any existing metadata
    metadata_panel.html("");

    metadata_panel.style("background-color", "lightblue")
                  .style("border", "1px solid grey"); // Add border style

    // Iterate through each key-value pair in filtered metadata object
    Object.entries(filteredMetadata).forEach(([key, value]) => {
      
      var capitalizedKey = key.toUpperCase();

      // Append a tag (e.g., <p>) for each key-value pair
      metadata_panel.append("p")
                    .style("font-size", "14px") // Set font size for each key-value pair
                    .style("line-height", ".5") // Set line height for spacing
                    .text(`${capitalizedKey}: ${value}`);
    });
  });
}

// Example usage: call buildMetadata with a sample ID (e.g., "940")
buildMetadata("940");

// function to build bubble chart
function buildCharts(sample) {
  // Fetch the JSON data
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the samples field
    var sampleArray = data.samples;

    // Filter the samples for the object with the desired sample number
    var filteredSample = sampleArray.filter(sampleObj => sampleObj.id == sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    var otu_ids = filteredSample.otu_ids;
    var otu_labels = filteredSample.otu_labels;
    var sample_values = filteredSample.sample_values;

    // Build Bubble Chart
    buildBubbleChart(otu_ids, otu_labels, sample_values);

    // Build Bar Chart
    buildBarChart(otu_ids.slice(0, 10), otu_labels.slice(0, 10), sample_values.slice(0, 10));
  });
}

function buildBubbleChart(otu_ids, otu_labels, sample_values) {
  // Clear any existing chart
  d3.select("#bubble").html("");

  // Set up dimensions and margins for the chart
  var width = 800;
  var height = 500;
  var margin = { top: 50, right: 20, bottom: 50, left: 50 };

  // Create scales for the bubble chart
  var xScale = d3.scaleLinear()
    .domain([d3.min(otu_ids), d3.max(otu_ids)])
    .range([margin.left, width - margin.right]);

  var yScale = d3.scaleLinear()
    .domain([0, 250])
    .range([height - margin.bottom, margin.top]);

  var sizeScale = d3.scaleLinear()
    .domain([0, d3.max(sample_values)])
    .range([1, 100]);

  // Create SVG element for the chart
  var svg = d3.select("#bubble")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Sets colors of bubbles
  var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  var tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

  // Create circles for each data point (bubble chart)
  svg.selectAll("circle")
    .data(otu_ids)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d))
    .attr("cy", (d, i) => yScale(sample_values[i]))
    .attr("r", (d, i) => sizeScale(sample_values[i]))
    .style("fill", (d, i) => colorScale(d))
    .style("opacity", 0.7)
    .on("mouseover", function(event, d) {
      tooltip.transition()
        .duration(200)
        .style("opacity", .9);
      tooltip.html(otu_labels[otu_ids.indexOf(d)])
        .style("left", (event.pageX + 5) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    });

  // Add x-axis
  svg.append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(xScale));

  // Add y-axis
  svg.append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(yScale));

  // Add chart title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", margin.top)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Bacteria Cultures Per Sample");

  // Add x-axis label
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height - margin.bottom / 10)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text("OTU ID");

  // Add y-axis label
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", margin.left / 4)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Number of Bacteria");
}

function buildBarChart(otu_ids, otu_labels, sample_values) {
  // Clear any existing chart
  d3.select("#bar").html("");

  // Create the SVG element for the bar chart
  var svg = d3.select("#bar")
    .append("svg")
    .attr("width", 800)
    .attr("height", 400);

  // Create scales for the bar chart
  var xScale = d3.scaleLinear()
    .domain([0, d3.max(sample_values)])
    .range([100, 700]);

  var yScale = d3.scaleBand()
    .domain(otu_ids.map(id => `OTU ${id}`))
    .range([50, 350])
    .padding(0.1);
  
  var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Create bars for each data point (bar chart)
  svg.selectAll("rect")
    .data(sample_values)
    .enter()
    .append("rect")
    .attr("x", xScale(0))
    .attr("y", (d, i) => yScale(`OTU ${otu_ids[i]}`))
    .attr("width", d => xScale(d))
    .attr("height", yScale.bandwidth())
    .style("fill", "steelblue")
    .on("mouseover", function(event, d) {
      tooltip.transition()
        .duration(200)
        .style("opacity", .9);
      tooltip.html(otu_labels[sample_values.indexOf(d)])
        .style("left", (event.pageX + 5) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    });

  // Add x-axis
  svg.append("g")
    .attr("transform", "translate(0, 360)")
    .call(d3.axisBottom(xScale).ticks(10).tickFormat(d => d));
    
  // Add y-axis
  svg.append("g")
    .attr("transform", "translate(100, 0)")
    .call(d3.axisLeft(yScale));

  // Add chart title
  svg.append("text")
    .attr("x", 400)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Top 10 Bacteria Cultures Found");

  // Add x-axis label
  svg.append("text")
    .attr("x", 400)
    .attr("y", 390)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Number of Bacteria");

  // Add y-axis label
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -200)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text("OTU ID");
}

function init() {
  // Fetch the JSON data
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the names field (assuming it contains sample IDs)
    var names = data.names;

    // Use d3 to select the dropdown with id of `selDataset`
    var dropdown = d3.select("#selDataset");

    // Populate the dropdown with options
    names.forEach((name) => {
      dropdown.append("option")
        .attr("value", name)
        .text(name);
    });

    // Get the first sample from the list
    var firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
  });
}

// Function to handle dropdown change
function optionChanged(newSample) {

  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);

  buildMetadata(newSample);
}

// Initialize the dashboard
init();

