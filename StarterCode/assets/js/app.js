// @TODO: YOUR CODE HERE!
//Svg Width
var svgWidth = 960;
var svgHeight = 00; 

//Set Chart Margins;  
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
}; 

//Set Chart Height and Width 
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom; 

// SVG  wrapper, to append the svg group that will hold our chart and shift it by left and top margins. 
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight); 

// Append an SVG group 
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`); 

// Set Initial Params 
var chosenXAxis = "Poverty";
var chosenYAxis = "Healthcare";

// // function used for updating x-scale var upon click on the x-axis label
function xScale(hairData, chosenXAxis){
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(acsData, d => d[chosenXAxis]) * 0.8,
      d3.max(acsData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;
}

// function used for updating y-scale var upon click on the y-axis label 
function yScale(censusData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(acsData, d => d[chosenYAxis]) * 0.8,
      d3.max(acsData, d => d[chosenYAxis]) * 1.2
    ])
    .range([0, width]);

  return yLinearScale;
}
// Update the xAxis when click on the labels on the x-axis. 
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}
// Update the yAxis when click on the label on the x-axis. 
function renderAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  xAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}
// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  var label;

  if (chosenXAxis === "hair_length") {
    label = "Hair Length:";
  }
  else {
    label = "# of Albums:";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.rockband}<br>${label} ${d[chosenXAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}
