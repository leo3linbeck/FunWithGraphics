﻿
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var sliderYear = {};	// @slider
	var buttonRun = {};	// @button
// @endregion// @endlock

	function position() {
	  this.style("left", function(d) { return d.x + "px"; })
	      .style("top", function(d) { return d.y + "px"; })
	      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
	      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
	}

	var margin = {top: 40, right: 10, bottom: 10, left: 10},
	    width = 1200 - margin.left - margin.right,
	    height = 800 - margin.top - margin.bottom,
	    transition_delay = 1000,
	    transition_duration = 750;
	    
	var levels = ['Federal','Transfers','State','Local'];
	
	var startYear = 1890, endYear = 2018;
	
	var jsonArray = null;
	var yearsArray = null;

	var color = function(name) {
		switch (name) {
			case 'Federal':
				return 'cyan';
			case 'Transfers':
				return 'lightcyan';
			case 'State':
				return 'yellow';
			case 'Local':
				return 'magenta';
			default:
				return 'light gray';
		}
	}

	var treemapSort = function (a, b) {
    		if (a.children === undefined) {
	    		return (a.size - b.size)	    			
    		}
    		else {
	    		if (levels.indexOf(a.name) < levels.indexOf(b.name)) {
	    			return -1;
	    		} else if (levels.indexOf(a.name) > levels.indexOf(b.name)) {
	    			return 1;
	    		} else {
	    			return 0;
	    		}	    			
	    	}
    	};
		
	var treemap = d3.layout.treemap()
	    .size([width, height])
	    .sticky(true)
	    .value(function(d) { return d.size; })
	    .mode('slice-dice')
		.sort(treemapSort);

	var div = d3.select("body").append("div")
	    .style("position", "relative")
	    .style("width", (width + margin.left + margin.right) + "px")
	    .style("height", (height + margin.top + margin.bottom) + "px")
	    .style("left", margin.left + "px")
	    .style("top", margin.top + "px");

	var title = d3.select("body").append("div")
		.attr('class', 'title');
		
	function drawTree(year, index) {
//		debugger;
		var jsonData = jsonArray[year];

		treemap.sticky(true);
    	
		var node = div.datum(jsonData).selectAll(".node")
			.data(treemap.nodes);
		
		node.enter().append("div")
			.attr("class", "node")
			.call(position)
			.style("background", function(d) { return d.children ? color(d.name) : null; })
			.text(function(d) { return d.children ? null : d.name; });
		
		node.transition()
			.delay(transition_delay * index)
			.duration(transition_duration)
			.call(position);

		node.exit()
			.remove();
		
		d3.select('.title')
			.datum(['Year: ' + year])
	    	.style("border", "solid 1px")
		.transition()
			.each('start', function() { update_slider(year) })
			.text(function(d) { return d })
			.delay(transition_delay * index)
			.duration(transition_duration);
	}
	
	function run_run_run(startYear, endYear) {
		jsonTree = d3Server.loadUSGovernmentDataAsync(
			{
				params: [startYear, endYear],
				onSuccess: function(event) {
					console.log('d3Server.loadUSGovernmentDataAsync', event);
					jsonArray = event;
					yearsArray = Object.keys(jsonArray);
					
					d3.select('body').selectAll('.legend')
						.data(['Federal','Transfers','State','Local'])
					.enter().append('div')
						.attr('class', 'legend')
						.attr('level', function(d) { return d; })
						.style("background", function(d) { return color(d); })
						.style("left", function(d, i) { return (780 + (3 - i) * 100) + 'px'; })
	    				.style("border", "solid 1px")
						.text(function(d) { return d; });

					$$('sliderYear').show();
					yearsArray.forEach(function(year, index) {
						drawTree(year, index);
					});
				},
				onError: function(error) {
					console.log('ERROR: d3Server.loadUSGovernmentDataAsync', error);
				}
			}
		);
	}
	
	function update_slider(d) {
		currentYear = parseInt(d);
		sources.currentYear.sync();
	}
	
// eventHandlers// @lock

	sliderYear.slidestop = function sliderYear_slidestop (event)// @startlock
	{// @endlock
		var year = $$('sliderYear').getValue();
		drawTree(year, 0);
		$$('buttonRun').setValue('Run')
	};// @lock

	buttonRun.click = function buttonRun_click (event)// @startlock
	{// @endlock
		if ($$('buttonRun').getValue() === 'Run') {
			run_run_run($$('sliderYear').getValue(), endYear);
			$$('buttonRun').setValue('Stop')
		}
		else {
			var year = $$('sliderYear').getValue();
			div.selectAll(".node").transition();
			d3.select(".title").transition();
			$$('buttonRun').setValue('Run')
		}
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("sliderYear", "slidestop", sliderYear.slidestop, "WAF");
	WAF.addListener("buttonRun", "click", buttonRun.click, "WAF");
// @endregion
};// @endlock
