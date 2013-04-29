
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var buttonToggle = {};	// @button
// @endregion// @endlock
	var t = 1297110663, // start time (seconds since epoch)
	    v = 70, // start value (subscribers)
	    data = d3.range(33).map(next), // starting dataset
	    myTimer = null;

	var w = 20,
	    h = 80;

	var x = d3.scale.linear()
	    .domain([0, 1])
	    .range([0, w]);

	var y = d3.scale.linear()
	    .domain([0, 100])
	    .rangeRound([0, h]);

	var chart = d3.select("body").append("svg")
	    .attr("class", "chart")
	    .attr("width", w * data.length - 1)
	    .attr("height", h);

	chart.selectAll("rect")
	    .data(data)
	  .enter().append("rect")
	    .attr("x", function(d, i) { return x(i) - .5; })
	    .attr("y", function(d) { return h - y(d.value) - .5; })
	    .attr("width", w)
	    .attr("height", function(d) { return y(d.value); });

	chart.append("line")
	    .attr("x1", 0)
	    .attr("x2", w * data.length)
	    .attr("y1", h - .5)
	    .attr("y2", h - .5)
	    .style("stroke", "#000");
	    
	function next() {
	  return {
	    time: ++t,
	    value: v = ~~Math.max(10, Math.min(90, v + 10 * (Math.random() - .5)))
	  };
	}
	
	function redraw() {

	  var rect = chart.selectAll("rect")
	      .data(data, function(d) { return d.time; });

	  rect.enter().insert("rect", "line")
	      .attr("x", function(d, i) { return x(i + 1) - .5; })
	      .attr("y", function(d) { return h - y(d.value) - .5; })
	      .attr("width", w)
	      .attr("height", function(d) { return y(d.value); })
	    .transition()
	      .duration(200)
	      .attr("x", function(d, i) { return x(i) - .5; });

	  rect.transition()
	      .duration(400)
	      .attr("x", function(d, i) { return x(i) - .5; });

	  rect.exit().transition()
	      .duration(400)
	      .attr("x", function(d, i) { return x(i - 1) - .5; })
	      .remove();

	}
	
	function run_run_run() {
		redraw();
		
		myTimer = setInterval(function() {
		  data.shift();
		  data.push(next());
		  redraw();
		}, 450);
	}

// eventHandlers// @lock

	buttonToggle.click = function buttonToggle_click (event)// @startlock
	{// @endlock
		if (myTimer) {
			myTimer = clearInterval(myTimer);
			$$('buttonToggle').setValue('Start');
		}
		else {
			run_run_run();
			$$('buttonToggle').setValue('Stop');
		}
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("buttonToggle", "click", buttonToggle.click, "WAF");
// @endregion
};// @endlock
