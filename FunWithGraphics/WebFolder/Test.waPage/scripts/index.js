
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var containerSVG = {};	// @container
// @endregion// @endlock

	var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
	
	var cycle = 1200;
	var speed = 400;

	var width = 960,
	    height = 500;
	    myTimer = null;

	var svg = d3.select("#containerSVG").append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .attr("class", "svg_box")
	  .append("g")
	    .attr("transform", "translate(32," + (height / 2) + ")");

	function update(data) {

	  // DATA JOIN
	  // Join new data with old elements, if any.
	  var text = svg.selectAll("text")
	      .data(data, function(d) { return d; });

	  // UPDATE
	  // Update old elements as needed.
	  text.attr("class", "update")
	    .transition()
	      .duration(speed)
	      .attr("x", function(d, i) { return i * 32; });

	  // ENTER
	  // Create new elements as needed.
	  text.enter().append("text")
	      .attr("class", "enter")
	      .attr("dy", ".35em")
	      .attr("y", -60)
	      .attr("x", function(d, i) { return i * 32; })
	      .style("fill-opacity", 1e-6)
	      .text(function(d) { return d; })
	    .transition()
	      .duration(speed)
	      .attr("y", 0)
	      .style("fill-opacity", 1);

	  // EXIT
	  // Remove old elements as needed.
	  text.exit()
	      .attr("class", "exit")
	    .transition()
	      .duration(speed)
	      .attr("y", 60)
	      .style("fill-opacity", 1e-6)
	      .remove();
	}
	
	function run_run_run() {
		// The initial display.
		update(alphabet);

		// Grab a random sample of letters from the alphabet, in alphabetical order.
		myTimer = setInterval(function() {
		  update(d3.shuffle(alphabet)
		      .slice(0, Math.floor(Math.random() * 26))
		      .sort());
		}, cycle);
	}

// eventHandlers// @lock

	containerSVG.click = function containerSVG_click (event)// @startlock
	{// @endlock
		if (myTimer) {
			myTimer = clearInterval(myTimer);
		}
		else {
			run_run_run();
		}
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("containerSVG", "click", containerSVG.click, "WAF");
// @endregion
};// @endlock
