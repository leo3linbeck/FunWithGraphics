﻿
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var containerGraph = {};	// @container
// @endregion// @endlock

var data = [4, 8, 15, 16, 23, 42];

var chart = d3.select("#containerGraph").append("svg")
    .attr("class", "chart")
    .attr("width", 440)
    .attr("height", 140)
  .append("g")
    .attr("transform", "translate(10,15)");

var x = d3.scale.linear()
    .domain([0, d3.max(data)])
    .range([0, 420]);

var y = d3.scale.ordinal()
    .domain(data)
    .rangeBands([0, 120]);

// eventHandlers// @lock

	containerGraph.click = function containerGraph_click (event)// @startlock
	{// @endlock
		chart.selectAll("rect")
		    .data(data)
		  .enter().append("rect")
		    .attr("y", y)
		    .attr("width", x)
		    .attr("height", y.rangeBand());

		chart.selectAll("text")
		    .data(data)
		  .enter().append("text")
		    .attr("x", x)
		    .attr("y", function(d) { return y(d) + y.rangeBand() / 2; })
		    .attr("dx", -3) // padding-right
		    .attr("dy", ".35em") // vertical-align: middle
		    .attr("text-anchor", "end") // text-align: right
		    .attr("fill", "white")
		    .text(String);

		chart.selectAll("line")
		    .data(x.ticks(10))
		  .enter().append("line")
		    .attr("x1", x)
		    .attr("x2", x)
		    .attr("y1", 0)
		    .attr("y2", 120)
		    .style("stroke", "#ccc");

		chart.selectAll(".rule")
		    .data(x.ticks(10))
		  .enter().append("text")
		    .attr("class", "rule")
		    .attr("x", x)
		    .attr("y", 0)
		    .attr("dy", -3)
		    .attr("text-anchor", "middle")
		    .text(String);

		chart.append("line")
		    .attr("y1", 0)
		    .attr("y2", 120)
		    .style("stroke", "#000");
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("containerGraph", "click", containerGraph.click, "WAF");
// @endregion
};// @endlock
