// Read in data using d3

d3.json("samples.json", function(data) {
    var sample_values = data.samples.sample_values;
    var otu_ids = data.samples.otu_ids;
    var otu_labels = data.samples.otu_labels;
     // Print the names of the columns
     console.log(data.column_names);
     // Print the data for each day
     console.log(data.data);

     var trace1 = {
         type: 'bar',
         x: sample_values,
         y: otu_ids,
         orientation: 'h'
     };

     Plotly.newPlot('myDiv', trace1)
});
