// Build the metadata panel
function buildMetadata(metadata) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let resultArray = metadata.filter(metadataObj => metadataObj.id == metadata);
    let result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, use d3 to append new tags for each key-value in the filtered metadata
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

   // Get the samples field
   let samples = data.samples;

   // Filter the samples for the object with the desired sample number
   let sampleData = samples.filter(sampleObj => sampleObj.id == sample)[0];

   // Get the otu_ids, otu_labels, and sample_values
   let otuIds = sampleData.otu_ids;
   let otuLabels = sampleData.otu_labels;
   let sampleValues = sampleData.sample_values;

   // Build a Bubble Chart
   let bubbleChartTrace = {
     x: otuIds,
     y: sampleValues,
     text: otuLabels,
     mode: 'markers',
     marker: {
       size: sampleValues,
       color: otuIds,
       colorscale: 'Earth'
     }
   };

   let bubbleChartData = [bubbleChartTrace];

   let bubbleChartLayout = {
     title: 'Bubble Chart',
     xaxis: { title: 'OTU ID' },
     yaxis: { title: 'Sample Values' }
   };

   Plotly.newPlot('bubble-chart', bubbleChartData, bubbleChartLayout);

   // For the Bar Chart, map the otu_ids to a list of strings for your yticks
   let yticks = otuIds.slice(0, 10).map(otuId => `OTU ${otuId}`).reverse();

   // Build a Bar Chart
   let barChartData = [{
     type: 'bar',
     x: sampleValues.slice(0, 10).reverse(),
     y: yticks,
     text: otuLabels.slice(0, 10).reverse(),
     orientation: 'h'
   }];

   let barChartLayout = {
     title: 'Top 10 OTUs',
     xaxis: { title: 'Sample Values' },
     yaxis: { title: 'OTU ID' }
   };

   Plotly.newPlot('bar-chart', barChartData, barChartLayout);
 });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field


    // Use d3 to select the dropdown with id of `#selDataset`


    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.


    // Get the first sample from the list


    // Build charts and metadata panel with the first sample

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected

}

// Initialize the dashboard
init();
