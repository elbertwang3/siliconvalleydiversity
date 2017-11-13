var svg = d3.select("svg"),
margin = {top: 40, right: 40, bottom: 40, left: 40},
width = svg.attr("width") - margin.left - margin.right,
height = svg.attr("height") - margin.top - margin.bottom;
var toggles = d3.select(".container").append("div")
    .attr("class","histogram-chart-toggle-wrapper");
var cut;

var percentScale = d3.scaleLinear()
.rangeRound([0, width]);

var parityScale = d3.scaleLinear()
.rangeRound([0, width]);

var genderColorScale = d3.scaleLinear().domain([.2,.5,.8]).range(["#2161fa","#dddddd","#ff3333"]);
var raceColorScale = d3.scaleLinear().domain([-0.8,0,.8]).range(["#2161fa","#dddddd","#ff3333"]);


var chartg = svg.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
.attr("class", "chart-g");

d3.csv('data/data.csv', type, function(error, data) {
	toggles
    .append("div")
    .attr("class","histogram-chart-toggle-type")
    .selectAll("p")
    .data(["Gender","Race"])
    .enter()
    .append("p")
    .attr("class","histogram-chart-toggle-item")
    .text(function(d){
      return d;
    })
     .attr("class",function(d,i){
        if(i==0){
          return "toggle-selected front-curve histogram-chart-toggle-item";
        }
        if(i==1){
          return "back-curve histogram-chart-toggle-item";
        }
        return "histogram-chart-toggle-item";
      })
      .text(function(d){
        return d;
      })
      .on("click",function(d){


        var dataSelected = d;
        d3.select(this.parentNode).selectAll("p").classed("toggle-selected",function(d){
          if(d==dataSelected){
            return true;
          }
          return false;
        })
        cut = d;
        console.log(d);
        updateChart();
      });


	men = data.filter(function(d) { return d.gender == "male"});
	women = data.filter(function(d) { return d.gender == "female"});
	noTotalsData = data.filter(function(d) { return d.race != "Overall_totals" && d.job_category != "Previous_totals" && d.job_category != "Totals"});
	raceTotals = data.filter(function(d) { return d.job_category == "Totals"});
	overallTotals = data.filter(function(d) { return d.race == "Overall_totals"});
	console.log(raceTotals);
	console.log(overallTotals);
	totalsByCompany = d3.nest()
					.key(function(d) { return d.company})
					.rollup(function(v) { return {
						totalmen: d3.sum(v, function(d) { if (d.gender == "male") {return d.count; }}),
						totalwomen: d3.sum(v, function(d) { if (d.gender == "female") {return d.count; }}),
						totalwhite: d3.sum(v, function(d) { if (d.race == "White") {return d.count; }}),
						totalblack: d3.sum(v, function(d) { if (d.race == "Black_or_African_American") {return d.count; }}),
						totallatino: d3.sum(v, function(d) { if (d.race == "Latino") {return d.count; }}),
						totalasian: d3.sum(v, function(d) { if (d.race == "Asian" || d.race == "Native_Hawaiian_or_Pacific_Islander") { return d.count; }}),
						totalamerindian: d3.sum(v, function(d) { if (d.race == "American_Indian_Alaskan_Native") { return d.count; }}),
						totalmixed: d3.sum(v, function(d) { if (d.race == "Two_or_more_races") { return d.count; }}),
					 	total: d3.sum(v, function(d) { return d.count; }),
					 	totalmenleaders: d3.sum(v, function(d) { if (d.gender == "male" && d.job_category == "Executive/Senior officials & Mgrs") {return d.count; }}),
					 	totalwomenleaders: d3.sum(v, function(d) { if (d.gender == "female" && d.job_category == "Executive/Senior officials & Mgrs") {return d.count; }}),
					 	totalwhiteleaders: d3.sum(v, function(d) { if (d.race == "White" && d.job_category == "Executive/Senior officials & Mgrs") {return d.count; }}),
					 	totalblackleaders: d3.sum(v, function(d) { if (d.race == "Black_or_African_American" && d.job_category == "Executive/Senior officials & Mgrs") {return d.count; }}),
					 	totallatinoleaders: d3.sum(v, function(d) { if (d.race == "Latino" && d.job_category == "Executive/Senior officials & Mgrs") {return d.count; }}),
					 	totalasianleaders: d3.sum(v, function(d) { if ((d.race == "Asian" || d.race == "Native_Hawaiian_or_Pacific_Islander") && d.job_category == "Executive/Senior officials & Mgrs") {return d.count; }}),
					 	totalamerindianleaders: d3.sum(v, function(d) { if (d.race == "American_Indian_Alaskan_Native" && d.job_category == "Executive/Senior officials & Mgrs") {return d.count; }}),
					 	totalmixedleaders: d3.sum(v, function(d) { if (d.race == "American_Indian_Alaskan_Native" && d.job_category == "Executive/Senior officials & Mgrs") {return d.count; }}),
					 	totalleaders: d3.sum(v, function(d) { if (d.job_category == "Executive/Senior officials & Mgrs") {return d.count; }})
					}})
					.entries(noTotalsData);
	console.log(totalsByCompany);
	percentagesByCompany = totalsByCompany.map(function(d) { return {key: d.key, value: { total: d.value.total,
																						percentmen: d.value.totalmen/d.value.total, 
																						percentwomen: d.value.totalwomen/d.value.total, 
																						percentwhite: d.value.totalwhite/d.value.total, 
																						percentblack: d.value.totalblack/d.value.total, 
																						percentlatino: d.value.totallatino/d.value.total, 
																						percentasian: d.value.totalasian/d.value.total, 
																						percentamerindian: d.value.totalamerindian/d.value.total, 
																						percentmixed: d.value.totalmixed/d.value.total,
																						percentmenleaders: d.value.totalmenleaders/d.value.totalleaders, 
																						percentwomenleaders: d.value.totalwomenleaders/d.value.totalleaders, 
																						percentwhiteleaders: d.value.totalwhiteleaders/d.value.totalleaders, 
																						percentblackleaders: d.value.totalblackleaders/d.value.totalleaders, 
																						percentlatinoleaders: d.value.totallatinoleaders/d.value.totalleaders, 
																						percentasianleaders: d.value.totalasianleaders/d.value.totalleaders, 
																						percentamerindianleaders: d.value.totalamerindianleaders/d.value.totalleaders, 
																						percentmixedleaders: d.value.totalmixedleaders/d.value.totalleaders
																				
																					}}});
	for (var i = 0; i < percentagesByCompany.length; i++) {
		company = percentagesByCompany[i]
		company.value.parity = -company.value.percentwhite + company.value.percentblack + company.value.percentlatino + company.value.percentasian + company.value.percentamerindian + company.value.percentmixed + 0.424 - 0.064-0.03-0.236-0.235-0.035;
	}
	

	console.log(percentagesByCompany);
	dataByCompany = d3.nest()
					.key(function(d) { return d.company})
					.entries(data);
	//console.log(dataByCompany);

	var circleScale = d3.scaleLinear()
   						.domain(d3.extent(percentagesByCompany, function(d) { return d.value.total;}))
   						.range([3, 30])

	//x.domain(d3.extent(percentagesByCompany, function(d) { return d.value.percentmen; }));
	percentScale.domain([0,1]);
	console.log(d3.extent(percentagesByCompany, function(d) { return d.value.parity; }));
	//parityScale.domain(d3.extent(percentagesByCompany, function(d) { return d.value.parity; }));
	parityScale.domain([-0.8,0.8])
	
	
	var simulation = d3.forceSimulation(percentagesByCompany)
      	.force("x", d3.forceX(function(d) { 
	      	/*if (cut == "Gender") {
	      		return percentScale(d.value.percentmen); 
	     	} else {
	     		return parityScale(d.value.parity); 
	     	}*/
	     	return percentScale(d.value.percentwomen); 
	     }).strength(1))
      .force("y", d3.forceY(height / 2))
      .force("collide", d3.forceCollide().radius(function(d) { return circleScale(d.value.total) + 2; }))
      .stop();

    
    for (var i = 0; i < 120; ++i) simulation.tick();

   	/*chartAxis = g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(percentScale));*/

   	var cell = chartg.append("g")
      .attr("class", "cells")
      .selectAll("g").data(percentagesByCompany)
      .enter().append("g")
      .attr("class","swarm-cell-g");
    /*.selectAll("g").data(d3.voronoi()
        .extent([[-margin.left, -margin.top], [width + margin.right, height + margin.top]])
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
      .polygons(percentagesByCompany)).enter().append("g");*/

    var cellCircle = cell.append("circle")
     .attr("class","swarm-circle")
      .attr("r", function(d) { 
      	//console.log(d); 
      	return circleScale(d.value.total);
      	//return 3;
      })
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .style("fill", function(d) { return genderColorScale(d.value.percentwomen);})
      .style("stroke", function(d) { return d3.color(genderColorScale(d.value.percentwomen)).darker(1);})

      
    
      function updateChart() {

      	var simulation = d3.forceSimulation(percentagesByCompany)
          .force("x", d3.forceX(function(d) {
           if (cut == "Gender") {
           	console.log("getting to gender");
	      		return percentScale(d.value.percentwomen); 
	     	} else {
	     		console.log("getting here");
	     		return parityScale(d.value.parity); 
	     	}
          })
          .strength(1))
          .force("y", d3.forceY(height / 2))
          .force("collide", d3.forceCollide().radius(function(d) { return circleScale(d.value.total) + 2; }))
          .stop();

          console.log(cellCircle);

           for (var i = 0; i < 120; ++i) simulation.tick();
        cellCircle
        .transition()
        .duration(500)
        .style("opacity", 1)
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
      	.attr("r", function(d){
          	return circleScale(d.value.total);
        })
        .style("fill", function(d) { 
        	if (cut == "Gender") {
	      		return genderColorScale(d.value.percentwomen); 
	     	} else {
	     		console.log("getting here");
	     		return raceColorScale(d.value.parity); 
	     	}
        })
      	.style("stroke", function(d) { 
      		if (cut == "Gender") {
	      		return d3.color(genderColorScale(d.value.percentwomen)).darker(1); 
	     	} else {
	     		return d3.color(raceColorScale(d.value.parity)).darker(1); 
	     	}
	     
      	})
    }

}) 




function type(d) {
  if (!d.count) return;
  d.count = +d.count;
  return d;
}