
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var buttonToggle = {};	// @button
	var documentEvent = {};	// @document
// @endregion// @endlock

	var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

	var width = 960,
	    height = 500;

	var svg = d3.select("body").append("svg")
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
	      .duration(250)
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
	      .duration(250)
	      .attr("y", 0)
	      .style("fill-opacity", 1);

	  // EXIT
	  // Remove old elements as needed.
	  text.exit()
	      .attr("class", "exit")
	    .transition()
	      .duration(250)
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
		}, 500);
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

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		run_run_run();
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("buttonToggle", "click", buttonToggle.click, "WAF");
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
