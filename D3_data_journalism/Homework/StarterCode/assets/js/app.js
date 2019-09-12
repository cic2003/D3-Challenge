//assign SVG attributes
var svgWidth = 600;
var svgHeight = 400;

// Set the chart margin 
var margin = {
  top: 40,
  right: 40,
  bottom: 80,
  left: 90
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("data.csv", function(error, statesdata) {

    // Log an error if one exists
    if (error) return console.warn(error);
  
    // Print the tvData
    console.log(statesdata);

  });

function successHandle(statesdata) {

  statesdata.map(function (data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

  var xLinearScale = d3.scaleLinear()
    .domain([8.1, d3.max(statesdata, d => d.poverty)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([20, d3.max(statesdata, d => d.healthcare)])
    .range([height, 0]);

  var bottomAxis = d3.axisBottom(xLinearScale)
    .ticks(7);
  var leftAxis = d3.axisLeft(yLinearScale);

  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  var circlesGroup = chartGroup.selectAll("circle")
    .data(statesdata)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "13")
    .attr("fill", "#788dc2")
    .attr("opacity", ".75")


  var circlesGroup = chartGroup.selectAll()
    .data(statesdata)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .style("font-size", "13px")
    .style("text-anchor", "middle")
    .style('fill', 'white')
    .text(d => (d.abbr));

 
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
      return (`${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}% `);
    });

  chartGroup.call(toolTip);

  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data, this);
  })

    .on("mouseout", function (data) {
      toolTip.hide(data);
    });

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("NoCare (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Impoverished (%)");
}