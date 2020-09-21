

// Read in data using d3
var url = "https://raw.githubusercontent.com/Lpaakh/plotly-challenge/master/static/js/samples.json"

var result = {};

//Populate possible name ID options for the user
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


// Populate the metadata section titled demographic info 
function populateMetaData(id) {
    var chosenMetaInfo = result.metadata.filter(function (metadata) {
        return metadata.id === parseInt(id)
    });
    //console.log(d3.select("#sample-metadata"));
    // d3.select("#sample-metadata")
    //     .selectAll("*")
    //     .remove();
    var temp = d3.select("#sample-metadata")
        .selectAll("div")
        .data(chosenMetaInfo)
        .enter()
        .append("div")
        .text(function(d,i){
            console.log(d);
          return d.ethnicity;
        });
};


// Create function for the optionChanged div to populate two plots
function optionChanged(id){
    var chosenSample = result.samples.filter(function (sample) {
        return sample.id === id
    })[0];

    var top10sampleValues = [];
    chosenSample.sample_values
        .slice(0, 10)
        .map(sample_value => top10sampleValues.push(sample_value));

    var top10otuIds = [];
    chosenSample.otu_ids
        .slice(0, 10)
        .map(otu_id => top10otuIds.push("OTU ID " + otu_id));

    var top10otuLabels = [];
    chosenSample.otu_labels
        .slice(0, 10)
        .map(otu_label => top10otuLabels.push(otu_label));
        
    var trace1 = {
        type: 'bar',
        x: top10sampleValues,
        y: top10otuIds,
        text: top10otuLabels,
        orientation: 'h'
    }
    var layout = {
        yaxis: {autorange:'reversed'}
    };

    Plotly.newPlot('bar', [trace1], layout)

// Use sample_values for the marker size.
// Use otu_ids for the marker colors.
// Use otu_labels for the text values.

    var trace2 = {
        x: chosenSample.otu_ids,
        y: chosenSample.sample_values,
        mode: 'markers',
        marker: {
            size: chosenSample.sample_values,
            color: chosenSample.otu_ids
        },
        text: chosenSample.otu_labels
    }
    Plotly.newPlot('bubble', [trace2])

    

    populateMetaData(id);

};

d3.json(url).then( function(data) {
    result = data;
    populateDropdown();
    
    // Select ID name value from the dropdown menu
    var inputId = d3.select("#selDataset").property("value");
    optionChanged(inputId);
});
