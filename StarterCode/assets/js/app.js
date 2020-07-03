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

// Set Initial Params 
var chosenXAxis = "Poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on the x-axis label 
function xScale(censusData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
      d3.max(censusData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;
}
// function used for updating y-scale var upon click on the y-axis label 
function yScale(censusData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8,
      d3.max(censusData, d => d[chosenYAxis]) * 1.2
    ])
    .range([0, width]);

  return yLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  xAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}
// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis){
  
  circlesGroup.transition()
  .duration(1000)
  .attr("cx", d => newXScale(d[chosenXAxis]))
  .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  var label;

  if (chosenXAxis === "Poverty") {
    label = "Hair Length:";
  }
  else {
    label = "Age (Median)";
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

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  var label;

  if (chosenXAxis === "poverty") {
    label = "poverty (%)";
  }
  else {
    label = "Age (median)";
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

// Update State names in the circles 
function updateToolTip(chosenXAxis, circlesGroup) {

  var label;
  // Setting labels for the x-Axis
  if (chosenXAxis === "poverty") {
    label = "Poverty:";
  }
  else if (chosenXAxis === "age") {
    label = "Age:";
  }
  else {
    label = "Income:";
  }

  // Setting labels for the Y-Axis
  if (chosenYAxis === "healthcare") {
      label = "HealthCare:";
    }
  else if (chosenYAxis === "obesity") {
      label = "Obesity:";
    }
  else {
      label = "Smokes:";
    }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br> ${xlabel} ${d[chosenXAxis], chosenXAxis}<br>${ylabel} ${d[chosenYAxis], chosenYAxis}`);
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

d3.csv("../data/data.csv").then(function(censusData){
  console.log(censusData);

  censusData.forEach(function(data){
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
  var xLinearScale = xScale(censusData, chosenXAxis); 

  // set the yLinearScale for the data above. 
  var yLinearScale = yScale(censusData, chosenYAxis); 

  // Initial xAxis functions 
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale); 

  // append the x axis 
  var xAxis = charGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis)

  // append the y axis 
  charGroup.append("g")
    .call(leftAxis)

  var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 20)
    .attr("fill", "darkblue")
    .attr("opacity", ".5");

// Create group for two x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`)

// Create labels for the x group variables. 
  // Poverty
  var poverty = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty")
    .classed("active", true)
    .text("Poverty (%)"); 

    // Age
    var  age = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age")
    .classed("inactive", true)
    .text("Age (Median)"); 

    // Household Income 
    var income = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income")
    .classed("active", true)
    .text("Income (Median)"); 

  // Set Y-axis labels 
  // Create a group for yaxis labels 
    var labelsGroupYAxis = chartGroup.append("g")
      .attr("transform", `translate(${0 - margin.left}, ${0 - (height / 2)})`);
    
    //HealthCare 
    var healthCare = labelsGroupYAxis.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - 20)
      .attr("dy", "1em")
      .classed("axis-text", true)
      .text("Lacks HealthCare");

    //Obesity
    var obesity = labelsGroupYAxis.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - 40)
      .attr("dy", "1em")
      .classed("axis-text", true)
      .text("Obesity (%)");

    //Smokes 
    var smokes = labelsGroupYAxis.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - 60)
      .attr("dy", "1em")
      .classed("axis-text", true)
      .text("Smokes(%");

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
    
    // x axis labels event listener
    labelsGroupYAxis.selectAll("text")
      .on("click", function() {
      // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        yLinearScale = yScale(censusData, chosenYAxis);

        // updates x axis with transition
        yAxis = renderAxes(YLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenYaxis, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
          poverty
            .classed("active", true)
            .classed("inactive", false);
          age
            .classed("active", false)
            .classed("inactive", true);
          income
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "age"){
          age
            .classed("active", true)
            .classed("inactive", false);
          poverty
            .classed("active", false)
            .classed("inactive", true);
          income
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          income
            .classed("active", true)
            .classed("inactive", false);
          poverty
            .classed("active", false)
            .classed("inactive", true);
          age
            .classed("active", false)
            .classed("inactive", true);
          }
      }

      // x axis labels event listener
    labelsGroup.selectAll("text")
    .on("click", function() {
    // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

      // replaces chosenXAxis with value
      chosenXAxis = value;

      // console.log(chosenXAxis)

      // functions here found above csv import
      // updates x scale for new data
      xLinearScale = xScale(censusData, chosenXAxis);

      // updates x axis with transition
      xAxis = renderAxes(xLinearScale, xAxis);

      // updates circles with new x values
      circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenYaxis, chosenXAxis);

      // updates tooltips with new info
      circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

      // changes classes to change bold text
      if (chosenYAxis === "healthCare") {
        healthCare
          .classed("active", true)
          .classed("inactive", false);
        obesity
          .classed("active", false)
          .classed("inactive", true);
        smokes
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (chosenYAxis === "obesity"){
        obesity
          .classed("active", true)
          .classed("inactive", false);
        healthCare
          .classed("active", false)
          .classed("inactive", true);
        smokes
          .classed("active", false)
          .classed("inactive", true);
      }
      else {
        income
          .classed("active", true)
          .classed("inactive", false);
        poverty
          .classed("active", false)
          .classed("inactive", true);
        age
          .classed("active", false)
          .classed("inactive", true);
        }
    }
    });
    


  

})
