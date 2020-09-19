// Read in data using d3
var url = "https://raw.githubusercontent.com/Lpaakh/plotly-challenge/master/static/js/samples.json"

var result = {};

function populateDropdown() {
    d3.select("#selDataset")
        .selectAll("*")
        .remove();
    d3.select("#selDataset")
        .selectAll('option')
        .data(result.names)
        .enter().append("option")
        .text(function(d) {
            return d;
        });
}

function optionChanged(id){
    result = data.samples.id; 
};

d3.json(url).then( function(data) {
    console.log(data);
    console.log(data.samples.id);
    result = data;
    populateDropdown();
    var sample_values = data.samples.sample_values;
    var otu_ids = data.samples.otu_ids;
    var otu_labels = data.samples.otu_labels;
    var ids = data.samples.ids;
     //console.log(data.names);
     
     var bar_otus = data.samples
        .filter(d == d)
        .sort(function(a, b) {return a-b}); 

     var trace1 = {
         type: 'bar',
         x: sample_values,
         y: otu_ids,
         orientation: 'h'
     };

     Plotly.newPlot('myDiv', trace1)
});
