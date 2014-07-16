var chart, w, h, json, data, county, total_wells, dots, force, companies, colors, lines, selectedCompanies, currentView;

//this enables re-ordering of svg elements
	d3.selection.prototype.moveToFront = function() {
		return this.each(function(){
			this.parentNode.appendChild(this);
		});
	};

function type(d)
{
	if( d.lat != undefined ) d.lat = parseFloat(d.lat);
	if( d.lng != undefined ) d.lng = parseFloat(d.lng);
	
	

	if( d.dateStart != undefined ) d.dateStart = d3.time.format("%Y-%m-%d").parse(d.dateStart);
	if( d.dateEnd != undefined ) {
		// Deal with data without end dates	
		if( d.dateEnd == "" ) { d.dateEnd = d.dateStart; }
		else d.dateEnd = d3.time.format("%Y-%m-%d").parse(d.dateEnd);
	}
	
	return d;
}

function makeCompanyColors(data)
{
	colors = [];
	
	data.forEach(function(d){
		colors[d.company] = colors[d.company] || '#'+Math.floor(Math.random()*16777215).toString(16);
	});
	
}

function makeHexbinMap(json, points)
{
	
}

function makeMap(json, points, colored)
{
	// Join shapefile data
	county = chart.select("#map")
	.selectAll("g")
		.data(json.features)
	.enter().append("path")
		.attr("class", "county");

	// Detetct orientation of screen and scale map accordingly.
	var bounds = d3.geo.path().bounds(json);

	// Chooses a mercator projection, sticks it roughly in the center of the screen,
	// sets the center of Pennsylvania, scales it up based on bounds of map
	projection = d3.geo.mercator().translate([ w / 2.2, h / 1.8]).center([-77.995133, 40.696298]).scale( 800 * w / (bounds[1][0] - bounds[0][0]) );	
	
	// Apply transformation
	county.attr("d", d3.geo.path().projection(projection));
	
	//throw in wells
	dots = chart.selectAll(".dots")
		.data(points, function(d){ return d.name; });
	
	dots.selectAll("circle").transition().duration(250)
		.attr("fill", function(d){ if(colored) return colors[d.company]; else return "black" })
		.attr("r",4);
	
	// Enter selection
	newWells = dots.enter().append("g")
		.attr("class", "dots well")
		.attr("id", function(d){ return d.name })
		.attr("company", function(d){ return d.company })
		.attr("transform", function(d){ return "translate(" + projection([d.lng, d.lat])[0] + "," + projection([d.lng, d.lat])[1] + ")"; } )
	.append("circle")
		.attr("r", 0)
		.attr("fill", function(d){ if(colored) return colors[d.company]; else return "black" });
		
	newWells.transition().duration(250)
		.delay(function(d,i){ return i/2 })
		.attr("r",4);
	
	// If dots already exist, send them to their spot on the map
	dots.transition().duration(1000)
		.attr("transform", function(d){ return "translate(" + projection([d.lng, d.lat])[0] + "," + projection([d.lng, d.lat])[1] + ")"; } );
		

	
	dots.exit()
		.transition().duration(1000)
		.style("opacity", 0)
		.remove();
	
	
}

function makeCluster(data)
{
	/*
	//let's try the force function now				
	var nodes = {};
	
	//duplicate data object into nodes
	var links = d3.values( JSON.parse(JSON.stringify(data)) ).map(function(d){ 
		
		var companyCount = 0;
		data.forEach(function(result){
			if(result.company == d.company) companyCount++;
		});
	
		d.company = (companyCount > 15) ? d.company : "Other";
		
		return { 
			source: d.company,
			target: d.name,
		}
	}); 
	
	
	links.forEach(function(link) {
		link.source = nodes[link.source] || (nodes[link.source] = {name: link.source, type:"company"});
		link.target = nodes[link.target] || (nodes[link.target] = {name: link.target, type: "well"});
	});
	
	
	
	force = d3.layout.force()
		.nodes(d3.values(nodes))
		.links(links)
		.size([w,h])
		.linkDistance(70)
		.charge(-50)
		.chargeDistance(500)
		.gravity([.2])
		.on("tick", function(){ 
			 dots.attr("transform", function(d){ return "translate(" + Math.max(4, Math.min(w - 4, d.x)) + "," + Math.max(4, Math.min(h - 4, d.y)) + ")"; }); 
		}) 
		.start();
		
	// Data bind and update Selection
	dots = chart.selectAll(".dots")
		.data(force.nodes(), function(d){ return d.name; })
	
	// Enter selection
	
	dots.enter().append("g")
		.attr("class", function(d){ return "dots " + d.type; })
		.attr("id", function(d){ return d.name; })
	.append("circle")
		.attr("r", function(d){  return ( d.type == "company" ) ?  50 : 4; })
		.attr("fill", function(d){ return ( d.type == "company" ) ? '#'+Math.floor(Math.random()*16777215).toString(16) : "" })
		.call(force.drag);
	
	chart.selectAll(".company")
	.append("foreignObject")
		.attr("x",-25)
		.attr("y",-25)
		.attr("width", 50)
		.attr("height",50)
	.append("xhtml:p")
		.attr('class', 'companyLabel')
		.html(function(d){ return d.name; });
		
		
	//Exit selection
	dots.exit().transition().duration(1000)
		.style("opacity",0)
		.remove();
*/


		//in case dots aren't here -- bring em in 
				
		dots = chart.selectAll(".dots")
			.data(data, function(d){ return d.name; });
	
		dots.selectAll("circle").transition().duration(250)
			.attr("fill", function(d){ return colors[d.company]; })
			.attr("r",4);
	
		// Enter selection
		newWells = dots.enter().append("g")
			.attr("class", "dots well")
			.attr("id", function(d){ return d.name })
			.attr("company", function(d){ return d.company } )
		.append("circle")
			.attr("r", 4)
			.attr("fill", function(d){ return colors[d.company]; } );
				
				// Make array of companies included in data
				var companiesData = d3.nest().key( function(d) {return d.company} ).entries(data);
				
				var other = [];
				
				
				if( $("#canvas").width() > 1250 ) { companiesCount = 15 }
					else if( $("#canvas").width() > 1000 ) { companiesCount = 40 }
						else if( $("#canvas").width() > 850 ) { companiesCount = 60 }
							else if( $("#canvas").width() > 690 ) { companiesCount = 100 }
							else { companiesCount = 100 }
				
				var formattedCompaniesData = d3.values(companiesData).map(function(d){ 
						if (d.values.length < companiesCount) // use 15 for wider areas 
						{
							d.values.forEach(function(value) { other.push(value); });
						}
						else
						{
						return {"name":d.key, "children": d.values}				
						}
				});
				
				formattedCompaniesData = formattedCompaniesData.filter( function(value){ return value != null });
				
				formattedCompaniesData.push( {"name":"Other", "children": other} );
				
				//formattedCompaniesData = {"name":"Companies", "children": formattedCompaniesData}
				
				var offset = 0;
				var lastOffset = 0
				
				formattedCompaniesData.forEach(function(companiesData, i){
				
				var pack = d3.layout.pack()
					.size([0,h])
					.padding(10)
					.value(function(d){ return 4 })
					.radius(4);
				
				var company = pack.nodes(companiesData);
			
				wells = chart.selectAll(".well")
					.data(company, function(d){ return d.name; });
				
				companies = wells.enter()
					.append("g")
					.attr("class", "company")
					.attr("id", function(d){ return d.name })
					.attr("transform", function(d){ return "translate(" + (d.x) + "," + d.y + ")" });	
				
				offset += lastOffset + (Math.sqrt( ( companies[0].length * (3.14 * 100) ) / 3.14 ) ) +50;
				lastOffset = (Math.sqrt( ( companies[0].length * (3.14 * 100) ) / 3.14 ) );
				
				wells.transition()
					.duration(1000)
					.attr("transform", function(d){ return "translate(" + (d.x + offset) + "," + d.y + ")" });
				
				
				wells.selectAll("circle")
					.transition().duration(1000)
					.attr("fill", function(d){ return colors[d.company] });	
					
					
				companies.append("foreignObject")
					.attr("x",-45)
					.attr("y",function(d){ return - 60 - d.r })
					.attr("width", 90)
					.attr("height",60)
				.append("xhtml:p")
					.attr('class', 'companyLabel')
					.html(function(d){ return d.name; });
				
				companies.append("circle")
					.transition().duration(1000)
					.attr("r", function(d){ return d.r + 10; });
				
				// Put well dots in front of company container
				chart.selectAll(".dots").moveToFront();
				
				
				});
				
				
				
				
				//get rid of "companies" bubble
				
				
}				

function makeTimeChart(data, step2, step3, step4)
{
	var margin = {top: 60, bottom: 35, right: 0, left: 60};
	
	//lol, timex
	//this is the axis that shows when the well was plugged
	timeX = d3.time.scale()
		.domain([d3.time.format("%Y-%m-%d").parse("2005-01-01"), d3.max(data, function(d){ return d.dateEnd } )])
		.range([margin.left, w - margin.left - margin.right]);
	
	// Sort data by number of days well was active, from highest to lowest
	data.sort(function(a,b) {
		return (a.dateEnd - a.dateStart) - (b.dateEnd - b.dateStart)
	})

	y = d3.scale.linear()
		.domain([0, d3.max(data, function(d, i){ return i } )])
		.range([h - margin.bottom, margin.top]);
		
	var xAxis = d3.svg.axis()
    .scale(timeX)
		.orient('bottom')
		.ticks(d3.time.month, 6)
		.tickFormat(d3.time.format.multi([["%b", function(d) { return d.getMonth(); }], ["%Y", function() { return true; }]]))
		.tickSize(4)
		.tickPadding(8);
		
	var yAxis = d3.svg.axis()
    .scale(y)
		.orient('left')
		//.tickFormat( function(d){ return Math.floor(d / (1000*60*60*24)) });
	
	//append axes
	chart.append('g')
		.attr('class', 'x axis')
		.attr('transform', 'translate( ' + 0 + ' , ' + (h - margin.bottom) + ')')
		.call(xAxis);
	
	chart.append('g')
		.attr('class', 'y axis')
		.attr('transform', 'translate(' + margin.left + ', ' + 0 + ')')
		.call(yAxis)
	.append("text")
		.attr('transform', 'translate(-30, 50)')
		.text("Longevity ranking");
	
	
	maxWidth = w - margin.left - margin.right;
	
	// Bind well data to dots
	dots = chart.selectAll(".dots")
		.data(data, function(d){ return d.name; });
		
	//Exit selection
	dots.exit().transition().duration(1000)
		.style("opacity",0)
		.remove();	

	// Enter selection
	newDots = dots.enter().append("g")
		.attr("class", "dots well")
		.attr("id", function(d){ return d.name })
	newDots.append("circle")
		.attr("r", 4)
		.attr("fill", function(d){ return colors[d.company]; });
	
	// Update selection
	dots.selectAll("circle").attr("fill", function(d){ return colors[d.company] });	
	
	updateDuration = 1000;

	if( !step3 && !step4 ) {
			// Append timeline lines
		lines = chart.selectAll("line.timelineLine")
			.data(data, function(d){ return d.name; });
		
		lines.enter().append("line")
			.attr("class", "timelineLine")
			.attr("x1", function(d){ return timeX(d.dateStart)} )
			.attr("y1", function(d, i){ return y(i) } )
			.attr("x2", function(d){ return timeX(d.dateStart) })
			.attr("y2", function(d, i) { return y(i) } );
		
		// Update selection
		chart.selectAll(".dots").moveToFront();
		
		dots.transition().duration(updateDuration)
			.attr("transform", function(d, i){ return "translate(" + timeX(d.dateStart) + "," + (y(i)) + ")"; } )
			.transition()
			.ease("linear")
			//.delay(  function(d) { return updateDuration + timeX(d.dateStart) / maxWidth * 2000 } )
			.duration( function(d) { return ( timeX(d.dateEnd) - timeX(d.dateStart) ) / maxWidth * 2000 } )
			.attr("transform", function(d, i){ return "translate(" + timeX(d.dateEnd) + "," + (y(i)) + ")"; } );	
			
		lines.transition()
			.ease("linear")
			.delay(updateDuration)
			.duration( function(d) { return ( timeX(d.dateEnd) - timeX(d.dateStart) ) / maxWidth * 2000 } )
			.attr("x2", function(d){ return timeX(d.dateEnd); })
	}
	
	if(step2 == true)
	{	
		
	}
	
	
	if(step3)
	{
		
			
		// Update selection
		chart.selectAll(".dots").moveToFront();
		
		dots.transition().duration(1000)
			.attr("transform", function(d, i){ return "translate(" + timeX(d.dateEnd) + "," + (y(i)) + ")"; } );	
			
		lines.attr("x2", function(d){ return timeX(d.dateEnd); })
			
		chart.append("line")
			.attr("class","referenceLine")
			.attr("stroke-dasharray", "1,3")
			.attr("x1", timeX(d3.time.format("%Y-%m-%d").parse("2012-09-01")))
			.attr("x2", timeX(d3.time.format("%Y-%m-%d").parse("2012-09-01")))
			.attr("y1", 40)
			.attr("y2", h)
			.transition().duration(1000)
			.attr("opacity",1);
		
		chart.append("text")
			.attr("x", timeX(d3.time.format("%Y-%m-%d").parse("2012-09-01")))
			.attr("y", 30)
			.attr("class", "referenceLineText")
			.attr("text-anchor", "end")
			.text("First payment due")
			.transition().duration(1000)
			.attr("opacity",1);
		
		chart.append("line")
			.attr("class","referenceLine")
			.attr("stroke-dasharray", "1,3")
			.attr("x1", timeX(d3.time.format("%Y-%m-%d").parse("2013-03-01")))
			.attr("x2", timeX(d3.time.format("%Y-%m-%d").parse("2013-03-01")))
			.attr("y1", 40)
			.attr("y2", h)
			.transition().duration(1000)
			.attr("opacity",1);

		
		chart.append("text")
			.attr("x", timeX(d3.time.format("%Y-%m-%d").parse("2013-03-01")))
			.attr("y", 30)
			.attr("class", "referenceLineText")
			.attr("text-anchor", "start")
			.text("Second payment due")
			.transition().duration(1000)
			.attr("opacity",1);
		
			
	}
		
	if(step4)
	{
		
	
		
		// Enter selection
		newDots = dots.enter().append("g")
			.attr("class", "dots well")
			.attr("id", function(d){ return d.name })
		newDots.append("circle")
			.attr("r", 4);
		
		
		// Update selection
		chart.selectAll(".dots").moveToFront();
		
		dots.transition().duration(1000).attr("transform", function(d, i){ return "translate(" + timeX(d.dateEnd) + "," + (y(i)) + ")"; } );	
		
		//this section is hardcoded for annadarko and talisman
		selectedCompanies = d3.values( data ).filter(function(d){ 
			return ( d.company == "TALISMAN ENERGY USA INC" || d.company == "ANADARKO E&P ONSHORE LLC" );
		});

		
		//redo dots
		dots = chart.selectAll(".dots")
		.data(selectedCompanies, function(d){ return d.name; });
		
		//Exit selection
		dots.exit().transition().duration(1000)
			.style("opacity",0)
			.remove();	
	
		
		lines.attr("x2", function(d){ return timeX(d.dateEnd); })
			
		chart.append("line")
			.attr("class","referenceLine")
			.attr("stroke-dasharray", "1,3")
			.attr("x1", timeX(d3.time.format("%Y-%m-%d").parse("2012-09-01")))
			.attr("x2", timeX(d3.time.format("%Y-%m-%d").parse("2012-09-01")))
			.attr("y1", 40)
			.attr("y2", h)
			.transition().duration(1000)
			.attr("opacity",1);
		
		chart.append("text")
			.attr("x", timeX(d3.time.format("%Y-%m-%d").parse("2012-09-01")))
			.attr("y", 30)
			.attr("class", "referenceLineText")
			.attr("text-anchor", "end")
			.text("First payment due")
			.transition().duration(1000)
			.attr("opacity",1);
		
		chart.append("line")
			.attr("class","referenceLine")
			.attr("stroke-dasharray", "1,3")
			.attr("x1", timeX(d3.time.format("%Y-%m-%d").parse("2013-03-01")))
			.attr("x2", timeX(d3.time.format("%Y-%m-%d").parse("2013-03-01")))
			.attr("y1", 40)
			.attr("y2", h)
			.transition().duration(1000)
			.attr("opacity",1);

		
		chart.append("text")
			.attr("x", timeX(d3.time.format("%Y-%m-%d").parse("2013-03-1")))
			.attr("y", 30)
			.attr("class", "referenceLineText")
			.attr("text-anchor", "start")
			.text("Second payment due")
			.transition().duration(1000)
			.attr("opacity",1);
		
	
	}
	
}

function makeAct13(data)
{

	var margin = {top: 25, bottom: 35, right: 25, left: 60};
	
	y = d3.scale.linear()
		.domain([0, d3.max(data, function(d){ return Math.ceil( d.act13 / 50000) * 50000 }) ]) //round domain to nearest 50,000
		.range([h - margin.bottom, margin.top])
		.nice();
		
		
	var commasFormatter = d3.format(",.0f");
	
	var yAxis = d3.svg.axis()
    .scale(y)
		.orient('left')
		.ticks(4)
		.tickFormat( function(d) { return "$" + commasFormatter(d); } );
	
	chart.append('g')
		.attr('class', 'y axis')
		.attr('transform', 'translate(' + margin.left + ', ' + 0 + ')')
		.call(yAxis);
		
	// Bind well data to dots
	dots = chart.selectAll(".dots")
		.data(data, function(d){ return d.name; });
	
	//Exit selection
	dots.exit().transition().duration(1000)
		.style("opacity",0)
		.remove();
	
	// Enter selection
	newDots = dots.enter().append("g")
		.attr("class", "dots well")
		.attr("id", function(d){ return d.act13 })
	newDots.append("circle")
		.attr("r", 4);
	
	var xPos = {};
	var yPos = {};
	var r = 4;
	var p = 10;
	
	dots.transition().duration(1000)
		.attr("transform", function(d){ 
			rounded = Math.floor( d.act13 / 50000) * 50000	;
			
			// Initalize position array for each income section
			yPos[rounded] = ( yPos[rounded] == undefined ) ? y(rounded) - y(10000) : yPos[rounded] - r * 2 - p; 
			xPos[rounded] = ( xPos[rounded] == undefined ) ? r * 2 + p : xPos[rounded];
			
			// If dots reach end of screen (well, .8), send them back to the beginning one row down.
			xPos[rounded] = ( yPos[rounded] < y(rounded + 40000) ) ? xPos[rounded] + r * 2 + p : xPos[rounded]; 
			yPos[rounded] = ( yPos[rounded] < y(rounded + 40000) ) ? y(rounded) + (y(20000) - y(10000) ) : yPos[rounded]; 
			return "translate(" + ( xPos[rounded] + margin.left ) +"," + ( yPos[rounded] - r ) + ")" ;
	});
	
}

function makeHexMap(json,data) {
		
	//fade out any dots
	d3.selectAll(".dots")
		.transition().duration(1000)
		.style("opacity", 0)
		.remove();
	
	// Join shapefile data
	county = chart.select("#map")
	.selectAll("g")
		.data(json.features)
	.enter().append("path")
		.attr("class", "county");

	// Detetct orientation of screen and scale map accordingly.
	var bounds = d3.geo.path().bounds(json);
		
	projection = d3.geo.mercator().translate([ w / 2.2, h / 1.8]).center([-77.995133, 40.696298]).scale( 800 * w / (bounds[1][0] - bounds[0][0]) );	
	
	
	// Apply transformation
	county.attr("d", d3.geo.path().projection(projection));
	
	var color = d3.scale.linear()
		.domain([0, 60])
		.range(["#ecf6f8", "#04859d"])
		.interpolate(d3.interpolateLab);
	
	var hexbin = d3.hexbin()
		.size([w, h])
		.radius(10);
	
	
	
	
	var points = d3.values( data ).map(function(d){ 
		
		return [projection([d.lng, d.lat])[0], projection([d.lng, d.lat])[1]];
	});
	
	chart.selectAll(".hexagon")
		.data(hexbin(points))
	.enter().append("path")
		.attr("class", "hexagon")
		.attr("d", hexbin.hexagon())
		.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
		.attr("count", function(d){ return d.length })
		.style("fill", function(d) { return color(d.length); })
		.attr("opacity",0)
	.transition().duration(250).delay(function(d,i){ return i*5 })
		.attr("opacity",1);
	
}

function cleanUp()
{
	//turn off force animation for bubble chart
	if( force !== undefined ) { force.stop(); }
	
	if( county != undefined ) { county.transition().duration(1000).style("opacity",0).remove(); }
	
	if( d3.selectAll(".company") != undefined ) { d3.selectAll(".company").transition().duration(1000).style("opacity",0).remove(); }
	
	d3.selectAll("text").transition().duration(1000).style("opacity",0).remove();
	
	d3.selectAll("#canvas").selectAll(".hexagon").transition().duration(1000).style("opacity",0).remove();
	
	// Turn off axes and lifelines from time chart
	chart.selectAll(".axis").transition().duration(1000).style("opacity",0).remove();
	
	if( lines != undefined) lines.transition().duration(1000).style("opacity",0).remove();
	
	chart.selectAll("line").transition().duration(1000).style("opacity",0).remove();

}