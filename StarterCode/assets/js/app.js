// @TODO: YOUR CODE HERE!
//Svg Width
var svgWidth = 960;
var svgHeight = 500; 

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
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight); 

// Append an SVG group 
var charGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`); 
    