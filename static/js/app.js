

//     Read in json data using D3 library
var url = "https://raw.githubusercontent.com/Lpaakh/plotly-challenge/master/static/js/samples.json"

//     Create empty array for data pull result from json file
var result = {};

//     Populate possible name ID options for the user
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

//     Display the sample metadata, i.e., an individual's demographic information.
    // Update and populate the metadata section titled demographic info 
function populateMetaData(id) {
    d3.select("#sample-metadata")
        .selectAll("*")
        .remove();

    // Set variable to pull metadata result using the ID of the sample
    var chosenMetaInfo = result.metadata.filter(function (metadata) {
        return metadata.id === parseInt(id)
    })[0];

//     Display each key-value pair from the metadata JSON object somewhere on the page.
    // Connect the metadata result to the HTML file and create demographic info div layout
    var mainContainerDiv = document.getElementById("sample-metadata");
    var metadataDiv = document.createElement("metadataDiv")
    metadataDiv.innerHTML = 
    'id: ' + chosenMetaInfo.id + '<br/>' +
    'ethnicity: ' + chosenMetaInfo.ethnicity + '<br/>' +
    'gender: ' + chosenMetaInfo.gender + '<br/>' +
    'age: ' + chosenMetaInfo.age + '<br/>' +
    'location: ' + chosenMetaInfo.location + '<br/>' +
    'bbtype: ' + chosenMetaInfo.bbtype + '<br/>' +
    'wfreq: ' + chosenMetaInfo.wfreq + '<br/>';

    mainContainerDiv.appendChild(metadataDiv);

//     Create gauge
    var level = chosenMetaInfo.wfreq;
    var degrees = 180 - (level * 20),
        radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);
    var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';
    var mainPath = path1,
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);
    
    var gaugeData = [{
        type: 'scatter',
        
        x: [0], 
        y:[0],
        marker: {size:18, color:'850000'},
        showlegend: false,
        name: 'gauge',
        text: level,
        hoverinfo: 'text+name'},
     
        { values: [1,1,1,1,1,1,1,1,1,9],
        rotation: 90,
        text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
        textinfo: 'text',
        textposition: 'inside',
        marker: {colors:[
            'rgba (0, 255, 255, 0.5)',
            'rgba (0, 127, 255, 0.5)',
            "rgba (2, 255, 6, 0.5)",
            'rgba (0, 191, 0, 0.5)',
            'rgba(249, 168, 37, .5)',
            'rgba (255, 127, 0, 0.5)', 
            'rgba (255, 0, 0, .5)',
            'rgba(183,28,28, .5)',    
            'rgba(0, 0, 0, 0.5)',
            'rgba (255, 255, 255, 0)']},
        hoverinfo: 'label',
        hole: .5,
        type: 'pie',
        showlegend: false
      }];
      
      var layout = {
        title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week" },
        shapes:[{
            type: 'path',
            path: path,
            fillcolor: '850000',
            line: {
              color: '850000'
            }
          }],
        height: 500,
        width: 500,
        xaxis: {zeroline:false, showticklabels:false,
                   showgrid: false, range: [-1, 1]},
        yaxis: {zeroline:false, showticklabels:false,
                   showgrid: false, range: [-1, 1]}
      };
      
      Plotly.newPlot('gauge', gaugeData, layout);
      
      
};

//     Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual sample using Plotly
    // Use sample_values as the values for the bar chart
    // Use otu_ids as the labels for the bar chart
    // Use otu_labels as the hovertext for the chart

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

//     Create a bubble chart that displays each sample
    // Use otu_ids for the x values
    // Use sample_values for the y values
    // Use sample_values for the marker size
    // Use otu_ids for the marker colors
    // Use otu_labels for the text values

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

//     Update all of the plots any time that a new sample is selected.
    populateDropdown();
    
//     Select ID name value from the dropdown menu
    var inputId = d3.select("#selDataset").property("value");
    optionChanged(inputId);
});
