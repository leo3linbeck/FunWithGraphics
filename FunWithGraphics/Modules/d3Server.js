/*	In order to make the helloWorld() function available client-side, you have to add a reference to the 'd3Server' module in the GUI Designer.
	The helloWorld() function can be executed from your JS file as follows:
	alert(d3Server.helloWorld());
	
	For more information, refer to http://doc.wakanda.org/Wakanda0.Beta/help/Title/en/page1516.html
*/

var filepath = getFolder('path') + 'Data/';

var filenames = {
		Defense: 			'usgs_1792_2018_defense.csv',
	 	Education: 			'usgs_1792_2018_education.csv',
		General_Government:	'usgs_1792_2018_general_government.csv',
//		Gross Public Debt: 'usgs_1792_2018_gross_public_debt.csv',
		Health_Care: 		'usgs_1792_2018_health_care.csv',
		Interest: 			'usgs_1792_2018_interest.csv',
		Other_Spending: 	'usgs_1792_2018_other_spending.csv',
		Pensions: 			'usgs_1792_2018_pensions.csv',
		Protection: 		'usgs_1792_2018_protection.csv',
		Transportation: 	'usgs_1792_2018_transportation.csv',
		Welfare: 			'usgs_1792_2018_welfare.csv'
//		Total:				'usgs_1792_2018_total.csv'
};

var spending_categories = Object.keys(filenames).sort();

var government_levels = [
	'Federal',
	'Transfers',
	'State',
	'Local'
]

function addToTree(node, category, value, label) {	
	node.children.push({
		name: category,
		label: (label === undefined ? '' : label),
		size: value
	});
}

function pfRound(s) {
	return Math.round(parseFloat(s) * 100) * 0.01;
}

exports.loadUSGovernmentData = function loadUSGovernmentData (startYear, endYear, components) {
	var cat, data = [], fileText = '', i, tree = {};
	
	for (i = startYear; i <= endYear; i += 1) {
		tree[i] = {
			name: 'Year',
			gdp: null,
			population: null,
			children: [
				{ name: 'Federal', size: 0, children: [] },
				{ name: 'Transfers', size: 0, children: [] },
				{ name: 'State', size: 0, children: [] },
				{ name: 'Local', size: 0, children: [] }
			]
		};
	}

	for (i = 0; i < components.length; i += 1) {
		cat = components[i];
		fileText = loadText(filepath + filenames[cat]);
		data = fileText.split('\r');
		data.forEach(function(d) {
			var f = d.split(',');
			if (f.length === 10) {
				f.push('');
			}
			f.forEach(function(e, j, a) { (e[0] === '"' ? a[j] = e.substr(1, e.length - 2) : a[j] = e) });
			var obj;
			
			if (f !== undefined && f.length === 11 && tree[f[0]] !== undefined) {
				obj = tree[f[0]];
				obj.name = f[0];
				obj.gdp = obj.gdp || pfRound(f[1]);
				obj.population = obj.population || pfRound(f[2]);
				obj.nonGov = obj.gdp - (pfRound(f[3]) + pfRound(f[5]) + pfRound(f[7]) + pfRound(f[9]))
				addToTree(obj.children[0], cat, pfRound(f[3]) + pfRound(f[5]), f[4]);
				addToTree(obj.children[1], cat, -pfRound(f[5]), f[6]);
				addToTree(obj.children[2], cat, pfRound(f[7]) + pfRound(f[5]), f[8]);
				addToTree(obj.children[3], cat, pfRound(f[9]), f[10]);
			}
		});
	}
	
	return (tree);
};
=======
﻿/*	In order to make the helloWorld() function available client-side, you have to add a reference to the 'd3Server' module in the GUI Designer.
	The helloWorld() function can be executed from your JS file as follows:
	alert(d3Server.helloWorld());
	
	For more information, refer to http://doc.wakanda.org/Wakanda0.Beta/help/Title/en/page1516.html
*/

var filepath = getFolder('path') + 'Data/';

var filenames = {
		Defense: 			'usgs_1792_2018_defense.csv',
	 	Education: 			'usgs_1792_2018_education.csv',
		General_Government:	'usgs_1792_2018_general_government.csv',
//		Gross Public Debt: 'usgs_1792_2018_gross_public_debt.csv',
		Health_Care: 		'usgs_1792_2018_health_care.csv',
		Interest: 			'usgs_1792_2018_interest.csv',
		Other_Spending: 	'usgs_1792_2018_other_spending.csv',
//		Pensions: 			'usgs_1792_2018_pensions.csv',
		Protection: 		'usgs_1792_2018_protection.csv',
		Transportation: 	'usgs_1792_2018_transportation.csv',
		Welfare: 			'usgs_1792_2018_welfare.csv'
//		Total:				'usgs_1792_2018_total.csv'
};

var spending_categories = Object.keys(filenames).sort();

var government_levels = [
	'Federal',
	'Transfers',
	'State',
	'Local'
]

function addToTree(node, category, value, label) {	
	node.children.push({
		name: category,
		label: (label === undefined ? '' : label),
		size: value
	});
}

function pfRound(s) {
	return Math.round(parseFloat(s) * 100) * 0.01;
}

exports.loadUSGovernmentData = function loadUSGovernmentData (startYear, endYear) {
	var cat, data = [], fileText = '', i, tree = {};
	
	for (i = startYear; i <= endYear; i += 1) {
		tree[i] = {
			name: 'Year',
			gdp: null,
			population: null,
			children: [
//				{ name: 'Private', size: 0, children: [] },
				{ name: 'Federal', size: 0, children: [] },
				{ name: 'Transfers', size: 0, children: [] },
				{ name: 'State', size: 0, children: [] },
				{ name: 'Local', size: 0, children: [] }
			]
		};
	}

	for (i = 0; i < spending_categories.length; i += 1) {
		cat = spending_categories[i];
		fileText = loadText(filepath + filenames[cat]);
		data = fileText.split('\r');
		data.forEach(function(d) {
			var f = d.split(',');
			if (f.length === 10) {
				f.push('');
			}
			f.forEach(function(e, j, a) { (e[0] === '"' ? a[j] = e.substr(1, e.length - 2) : a[j] = e) });
			var obj;
			
			if (f !== undefined && f.length === 11 && tree[f[0]] !== undefined) {
				obj = tree[f[0]];
				obj.name = f[0];
				obj.gdp = obj.gdp || pfRound(f[1]);
				obj.population = obj.population || pfRound(f[2]);
				obj.nonGov = obj.gdp - (pfRound(f[3]) + pfRound(f[5]) + pfRound(f[7]) + pfRound(f[9]))
//				if (obj.children[0].children.length === 0) {
//					obj.children[0].children.push({name: 'Private', size: obj.nonGov});
//				}
				addToTree(obj.children[0], cat, pfRound(f[3]) + pfRound(f[5]), f[4]);
				addToTree(obj.children[1], cat, -pfRound(f[5]), f[6]);
				addToTree(obj.children[2], cat, pfRound(f[7]) + pfRound(f[5]), f[8]);
				addToTree(obj.children[3], cat, pfRound(f[9]), f[10]);
			}
		});
	}
	
	return (tree);
};
