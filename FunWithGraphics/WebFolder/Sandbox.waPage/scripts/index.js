
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var iconNext = {};	// @icon
	var iconPrevious = {};	// @icon
	var sliderYear = {};	// @slider
	var buttonRun = {};	// @button
// @endregion// @endlock

	function position() {
	  this.style("left", function(d) { return d.x + "px"; })
	      .style("top", function(d) { return d.y + "px"; })
	      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
	      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
	}

	var margin = {top: 90, right: 10, bottom: 10, left: 10},
	    width = 1200 - margin.left - margin.right,
	    height = 600 - margin.top - margin.bottom,
	    transition_delay = 1000,
	    transition_duration = 750;
	    
	var levels = ['Federal','Transfers','State','Local'];
	
	var startYear = 1890, endYear = 2018;
	
	var jsonArray = null;
	var yearsArray = null;
	var gdp2010 = null;

	var color = function(name) {
		switch (name) {
//			case 'Private':
//				return 'lightgray';
			case 'Federal':
				return 'skyblue';
			case 'Transfers':
				return 'powderblue';
			case 'State':
				return 'khaki';
			case 'Local':
				return 'plum';
			default:
				return 'lightgray';
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
		
	function nodeLabel(d) {
		var prec = 2, prefix = '$', suffix = ' B', v = d.size, name = d.name;
		var mode = $$('comboboxMetric').getValue();
		
		switch (mode) {
			case 'gdp':
				v = d.size / d.parent.parent.gdp * 100;
				suffix = '%';
				prefix = '';
				break;
			case 'constant2010':
				v = d.size / d.parent.parent.gdp * gdp2010;
			default:
				if (v < 1.0) {
					v *= 1000;
					suffix = ' M';
				}
				else if (v > 1000.0) {
					v *= 0.001;
					suffix = ' T';
				}
				if (v > 100) {
					prec = 0;
				}
				else if (v > 10) {
					prec = 1;
				}
		}
		
		if (d.name === 'Pensions' && d.parent.name === 'Federal') {
			name = 'Pensions, including Social Security';
		}
		
		return (name.replace('_', ' ') + ': ' + prefix + v.toFixed(prec) + suffix);
	}
	
	function drawTree(year, index) {
//		debugger;
		var jsonData = jsonArray[year];

		treemap.sticky(true);
    	
		var node = div.datum(jsonData).selectAll(".node")
			.data(treemap.nodes);
		
		node.enter().append("div")
			.attr("class", "node")
			.call(position)
			.style("background", function(d) { return d.children ? color(d.name) : null; });
				
		node.transition()
			.delay(transition_delay * index)
			.duration(transition_duration)
			.text(function(d) { return d.children ? null : nodeLabel(d); })
			.style('font-size', function(d) { return d.children ? null : (d.size < 1 ? 14 : (d.size > 1000 ? 54 : (14 + d.size / 25).toFixed())) + 'px'; })
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
	
	function getComponentArray() {
		var arr = [], i, w;
		
		for (i = 0; i < 10; i += 1) {
			w = $$('checkbox' + i);
			if (w.getValue()) {
				arr.push(w.getLabel().getValue().replace(' ', '_'));
			}
		}
		
		return arr;
	}
	
	function run_run_run(startYear, endYear) {
		var arr = getComponentArray();
		
		d3Server.loadUSGovernmentDataAsync(
			{
				params: [startYear, endYear, arr],
				onSuccess: function(event) {
					console.log('d3Server.loadUSGovernmentDataAsync', event);
					
					jsonArray = event;
					gdp2010 = jsonArray['2010'].gdp;
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
					$$('iconPrevious').show();
					$$('iconNext').show();
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
	
	function pause_please() {
		div.selectAll(".node").transition();
		d3.select(".title").transition();
		$$('buttonRun').setValue('Run')
	}
	
// eventHandlers// @lock

	iconNext.click = function iconNext_click (event)// @startlock
	{// @endlock
		if (currentYear < endYear) {
			pause_please();
			currentYear += 1;
			sources.currentYear.sync();
			drawTree(currentYear, 0);
		}
	};// @lock

	iconPrevious.click = function iconPrevious_click (event)// @startlock
	{// @endlock
		if (currentYear > startYear) {
			pause_please();
			currentYear -= 1;
			sources.currentYear.sync();
			drawTree(currentYear, 0);
		}
	};// @lock

	sliderYear.slidestop = function sliderYear_slidestop (event)// @startlock
	{// @endlock
		pause_please();
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
			pause_please();
		}
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("iconNext", "click", iconNext.click, "WAF");
	WAF.addListener("iconPrevious", "click", iconPrevious.click, "WAF");
	WAF.addListener("sliderYear", "slidestop", sliderYear.slidestop, "WAF");
	WAF.addListener("buttonRun", "click", buttonRun.click, "WAF");
// @endregion
};// @endlock
