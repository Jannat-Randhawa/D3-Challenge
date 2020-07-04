// @TODO: YOUR CODE HERE!
//Svg Width
var svgWidth = 960;
var svgHeight = 600; 

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
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on the x-axis label 
function xScale(acsData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(acsData, d => d[chosenXAxis]) * 0.8,
      d3.max(acsData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;
}
// function used for updating y-scale var upon click on the y-axis label 
function yScale(acsData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(acsData, d => d[chosenYAxis]) * 0.8,
      d3.max(acsData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);

  return yLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderXAxis(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(2000)
    .call(leftAxis);

  return yAxis;
}
// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis){
  
  circlesGroup.transition()
    .duration(2000)
    .attr("dx", d => newXScale(d[chosenXAxis]))
    // .attr("dy", d => newYScale(d[chosenYAxis]))

  return circlesGroup;
}

function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis){

  textGroup.transition()
    .duration(2000)
    .attr('x', d => newXScale(d[chosenXAxis]))
    .attr('y', d => newYScale(d[chosenYAxis]))

  return textGroup;
}

// Update State names in the circles 
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  var xlabel;
  // Setting labels for the x-Axis
  if (chosenXAxis === "poverty") {
    xlabel = "Poverty:";
  }
  else if (chosenXAxis === "age") {
    xlabel = "Age:";
  }
  else {
    xlabel = "Income:";
  }

  var ylabel;
  // Setting labels for the Y-Axis
  if (chosenYAxis === "healthcare") {
      ylabel = "HealthCare:";
    }
  else if (chosenYAxis === "obesity") {
      ylabel = "Obesity:";
    }
  else {
      ylabel = "Smokes:";
    }

  var toolTip = d3.tip()
    .attr("class", 'd3-tip')
    .offset([-8, 0])
    .html(function(d) {
      return (`${d.state}<br> ${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
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

d3.csv("./assets/data/data.csv").then(function(acsData){
  console.log(acsData);

    acsData.forEach(function(data){
    //Parse the data 
    // yAxis Values
      data.healthcare = +data.healthcare;
      data.obesity = +data.obesity;
      data.income = +data.income;
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;

  });

  // set the xLinearScale for the data above. 
  var xLinearScale = xScale(acsData, chosenXAxis); 

  // set the yLinearScale for the data above. 
  var yLinearScale = yScale(acsData, chosenYAxis); 

  // Initial xAxis functions 
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale); 

  // append the x axis 
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis)

  // append the y axis 
  var yAxis = chartGroup.append("g")
    .call(leftAxis)

  var circlesGroup = chartGroup.selectAll("circle")
    .data(acsData)
    .enter()
    .append("circle")
    .attr("class", "stateCircle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 20)
    .attr("fill", "darkblue")
    .attr("opacity", ".5");

  var textGroup = chartGroup.selectAll(".stateText")
    .data(acsData)
    .enter()
    .append("text")
    .attr("class", "stateText")
    .text(d => d.abbr)
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    .attr("dy", 3);


// Create group for two x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`)

// Create labels for the x group variables. 
  // Poverty
  var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty")
    .attr("class", "aText active") 
    .text("Poverty (%)"); 

    // Age
    var  ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age")
    .attr("class", "aText inactive") 
    .text("Age (Median)"); 

    // Household Income 
    var incomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income")
    .attr("class", "aText inactive") 
    .text("Income (Median)"); 

  // Set Y-axis labels 
  // Create a group for yaxis labels 
    var labelsGroupYAxis = chartGroup.append("g")
      .attr("transform", `translate("rotate (-90)")`);
    
    //HealthCare 
    var healthcareLabel = labelsGroupYAxis.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -60)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "aText active")
      .attr("value", "healthcare") 
      .text("Lacks HealthCare");

    //Obesity
    var obesityLabel = labelsGroupYAxis.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - 80)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "aText inactive") 
      .attr("value", "obesity") 
      .text("Obesity (%)");

    //Smokes 
    var smokesLabel = labelsGroupYAxis.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - 100)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "aText inactive")
      .attr("value", "smokes") 
      .text("Smokes(%");

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
    
    // x axis labels event listener
    labelsGroup.selectAll(".aText")
      .on("click", function() {
      // get value of selection
        var value = d3.select(this).attr("value");
        if (value != chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(acsData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxis(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "age"){
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
        }
      }
    });
    
    labelsGroupYAxis.selectAll(".aText")
      .on("click", function() {
    // get value of selection
        var value = d3.select(this).attr("value");
        if (value != chosenYAxis) {

      // replaces chosenXAxis with value
        chosenYAxis = value;

      // console.log(chosenXAxis)

      // functions here found above csv import
      // updates Y scale for new data
       yLinearScale = yScale(acsData, chosenYAxis);

      // updates y axis with transition
        yAxis = renderYAxis(yLinearScale, yAxis);

      // updates circles with new values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

      // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

      // changes classes to change bold text
        if (chosenYAxis === "healthcare") {
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
      }
        else if (chosenYAxis === "obesity"){
          obesityLabel
            .classed("active", true)
            .classed("inactive", false);
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
      }
        else {
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
      }
    }
  });
}).catch(function(error) {
  console.log(error);
});
