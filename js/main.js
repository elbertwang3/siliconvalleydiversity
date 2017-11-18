var viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
var svg = d3.select("svg"),
margin = {top: 40, right: 40, bottom: 40, left: 40},
width = 1000 - margin.left - margin.right,
height = 325 - margin.top - margin.bottom;
if(viewportWidth < 1000){
          console.log("getting here");
          margin = {top: 40, right: 20, bottom: 40, left: 20};
          width = viewportWidth - margin.left - margin.right;
          height = 300 - margin.bottom - margin.top;
        }
svg
  .attr("viewBox", "0 0 " + (width + margin.right+margin.left) + " " + (height+margin.top+margin.bottom))
  .attr("width", width + margin.right+margin.left)
  .attr("height", height+margin.top+margin.bottom);
var cut = "Gender";
var previousChart = "swarm";
var currentChart = "swarm";
var stepperSequence = ["swarm","swarm-scatter"]
var stepNumToText = ["All Staff","Leadership"]
var midPoint;
var cellImages;
var highlightedStrokeColor = "#555555"
    var highlightedCircleStrokeDarkness = 2;
      var mouseoverOffsetX = -15;
  var mouseoverOffsetY = -120;
var mobile = false;
if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  mobile = true;
}
var xScale;
var yScale;


var percentScale = d3.scaleLinear()
.rangeRound([0, width]);

var parityScale = d3.scaleLinear()
.rangeRound([0, width]);

var genderColorScale = d3.scaleLinear().domain([0,.5,1]).range(["#2161fa","#dddddd","#ff3333"]);
var tickData = [0,.25,.5,.75,1];
var raceColorScale = d3.scaleLinear().domain([-0.8,0,.8]).range(["#2161fa","#dddddd","#ff3333"]);


  var container = d3.select(".swarm");
var chartg = svg.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
	.attr("class", "chart-g");

var chartAxis = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("class","swarm-axis");


var chartAxisContainer = chartAxis.append("g")

var chartDivContainer = d3.select(".svgcontainer")
    .append("div")
    .attr("class","swarm-chart-container")
    .style("width",width+margin.left+margin.right+"px")

var chartToolTip = chartDivContainer
    .append("div")
    .attr("class","swarm-chart-tool-tip")
    .style("transform", "translate(" + margin.left+"px" + "," + margin.top+"px" + ")")
    .on("click",function(){
      chartToolTip.style("visibility",null);
    });

 var chartTopSection = container.append("div")
    .attr("class","chart-top-section");
    var toggles = chartTopSection.append("div")
    .attr("class","histogram-chart-toggle-wrapper");
var stepperContainer = chartTopSection.append("div")
      .attr("class","stepper-container")
var stepperContainerToggle = stepperContainer.append("div")
      .attr("class","stepper-toggle-row");
var stepperContainerToggleContainer = stepperContainerToggle
      .append("div")
      .attr("class","stepper-item-container")


var defs = svg.append("svg:defs")
defs
    .append("marker")    // This section adds in the arrows
    .attr("id", "arrow-head")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 0)
    .attr("refY", 0)
    .attr("markerWidth", 5)
    .attr("markerHeight", 3)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill","#d8d8d8")
    ;
  defs
    .append("marker")    // This section adds in the arrows
    .attr("id", "arrow-head-black")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 0)
    .attr("refY", 0)
    .attr("markerWidth", 7)
    .attr("markerHeight", 10)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill","#000000")
    ;

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

        //previousChart = currentChart;
        var dataSelected = d;
        d3.select(this.parentNode).selectAll("p").classed("toggle-selected",function(d){
          if(d==dataSelected){
            return true;
          }
          return false;
        })
        cut = d;
        updateChart();
      });


  var stepperContainerToggleContainerSteps = stepperContainerToggleContainer
      .selectAll("div")
      .data(stepperSequence)
      .enter()
      .append("div")
      .attr("class",function(d,i){
        if(i==0){
          return "stepper-item stepper-item-selected";
        }
        return "stepper-item";
      })
      .html(function(d,i){
        if(i==4){
          return "<span class='stepper-text'>"+stepNumToText[i]+"</span>";
        }
        return "<span class='stepper-text'>"+stepNumToText[i]+"</span>";
        // return i+1;
      })
      .on("click",function(d,i){


        previousChart = currentChart;
        var num = i;

 

        var dataSelected = d;
        d3.select(this.parentNode).selectAll(".stepper-item").classed("stepper-item-selected",function(d,i){
          if(i==num){
            return true;
          }
          return false;
        })
        currentChart = d;
        updateChart()
      });

      var chartTitle = d3.select(".swarm")
                .append("p")
                .attr("class", "chart-title")
                .html("Company Gender Breakdown")

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
																						percentmixedleaders: d.value.totalmixedleaders/d.value.totalleaders,
																						censusmen: 0.496,
																						censuswomen: 0.504,
																						censuswhite: 0.424,
																						censusblack: 0.064,
																						censuslatino: 0.235,
																						censusasian: 0.236,
																						censusamerindian: 0.03,
																						censusmixed: 0.035

																				
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
   						.range([3, 25])

	//x.domain(d3.extent(percentagesByCompany, function(d) { return d.value.percentmen; }));
	percentScale.domain([0,1]);
	//parityScale.domain(d3.extent(percentagesByCompany, function(d) { return d.value.parity; }));
	parityScale.domain([-0.8,0.8])

	var womenAverage = d3.mean(percentagesByCompany, function(d) { return d.value.percentwomen})
	var parityAverage = d3.mean(percentagesByCompany, function(d) { return d.value.parity})
	
	buildAxis()
	buildAverage()
	var simulation = d3.forceSimulation(percentagesByCompany)
      	.force("x", d3.forceX(function(d) { 
	      
	     	return percentScale(d.value.percentwomen); 
	     }).strength(1))
      .force("y", d3.forceY(height / 2))
      .force("collide", d3.forceCollide().radius(function(d) { return circleScale(d.value.total) +1; }))
      .stop();

    
    for (var i = 0; i < 120; ++i) simulation.tick();

   	var cell = chartg.append("g")
      .attr("class", "cells")
      .selectAll("g").data(percentagesByCompany)
      .enter().append("g")
      .attr("class","swarm-cell-g");
    

    var cellCircle = cell.append("circle")
     .attr("class","swarm-circle")
      .attr("r", function(d) { 
      	return circleScale(d.value.total);
      })
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
       .style("opacity", 0.8)
      .style("fill", function(d) { return genderColorScale(d.value.percentwomen);})
      .style("stroke", function(d) { return d3.color(genderColorScale(d.value.percentwomen)).darker(1);})
     .on("mouseover",function(d){
          var data = d;
          mouseOverEvents(data,d3.select(this));
        })
        .on("mouseout",function(d){
          var data = d;
          mouseOutEvents(data,d3.select(this));
        })

     var cellImages = cell.append("g")

        .attr("transform",function(d,i){
          return "translate(" + (d.x-circleScale(d.value.total)/1.5) + "," + (d.y-circleScale(d.value.total)/1.5) + ")";
        })
        .attr("class","swarm-image-container")
    cellImages.append("image")

        .attr("class","swarm-image")
        .attr("xlink:href",function(d){
          if(d.key == "Google"){
            return "images/google-logo.svg.png"
          }
          if(d.key == "Apple"){
            return "images/apple-logo.svg.png"
          }
          if(d.key == "Facebook"){
            return "images/facebook-logo.svg.png"
          }
          if(d.key == "Cisco"){
            return "images/cisco-logo.svg"
          }
          if(d.key == "Intel"){
            return "images/intel-logo.svg.png"
          }
          if(d.key == "HPE"){
            return "images/hpe-logo.svg.png"
          }
          return null;
        })
        .attr("width",function(d){
          return circleScale(d.value.total)*2*.7;
        })
        .attr("height",function(d){
          return circleScale(d.value.total)*2*.7;
        })
        /* .on("mouseover",function(d){
          var data = d;
          mouseOverEvents(data,d3.select(this));
        })
        .on("mouseout",function(d){
          var data = d;
          mouseOutEvents(data,d3.select(this));
        })*/

    //updateChart()
 
    function updateChart() {
      chartAxis
          .selectAll("g")
          .transition()
          .duration(500)
          .style("opacity",0)
          .on("end",function(d){
            d3.select(this).remove();
          });
      viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      if (currentChart == "swarm" && previousChart == "swarm-scatter") {
        margin = {top: 40, right: 40, bottom: 40, left: 40};
        width = 1000 - margin.left - margin.right;
        height = 325 - margin.top - margin.bottom;
        if(viewportWidth < 1000){
          console.log("getting here");
          margin = {top: 40, right: 20, bottom: 40, left: 20};
          width = viewportWidth - margin.left - margin.right;
          height = 300 - margin.bottom - margin.top;
        }

        
        
        svg
          .attr("viewBox", "0 0 " +  (width+margin.left+margin.top) + " " + (height+margin.top+margin.bottom))
          .transition()
          .duration(500)
          .attr("width", width+margin.left+margin.top)
          .attr("height", height+margin.top+margin.bottom)

             
       
               
        chartg
          .transition()
          .duration(500)
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          .attr("class", "chart-g");

        chartAxis
            .transition()
            .duration(500)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("class","swarm-axis");
      } else if (currentChart == "swarm-scatter" && previousChart == "swarm") {
        margin = {top: 30, right: 20, bottom: 60, left: 20};
        width = 680 - margin.left - margin.right;
        height = 575 - margin.top - margin.bottom;
        if(viewportWidth < 680){
          margin = {top: 30, right: 20, bottom: 60, left: 20};
          console.log("getting here");
          width = viewportWidth - margin.left - margin.right;
          height = viewportWidth*(575/680) - margin.top - margin.bottom;
        }
        svg
          .attr("viewBox", "0 0 " + (width+margin.left+margin.top) + " " + (height+margin.top+margin.bottom))
          .transition()
          .duration(500)
          .attr("width", width + margin.right + margin.left)
          .attr("height", height + margin.bottom + margin.top)

     
      

        chartg
          .transition()
          .duration(500)
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          .attr("class", "chart-g");

        chartAxis
          .transition()
          .duration(500)
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          .attr("class","swarm-axis");

      }
      	
      if (currentChart == "swarm") {
        console.log(width);
        percentScale = d3.scaleLinear().domain([0,1])
.rangeRound([0, width]);

parityScale = d3.scaleLinear().domain([-0.8,0.8])
.rangeRound([0, width]);
        if (cut == "Gender") {
           chartTitle
              .html("Company Gender Breakdown")
        } else {
          chartTitle
              .html("Company Racial Diversity vs Bay Area")
        }

      	var simulation = d3.forceSimulation(percentagesByCompany)
          .force("x", d3.forceX(function(d) {
           if (cut == "Gender") {
        		return percentScale(d.value.percentwomen); 
         	} else {
         		return parityScale(d.value.parity); 
         	}})
          .strength(1))
          .force("y", d3.forceY(height / 2))
          .force("collide", d3.forceCollide().radius(function(d) { return circleScale(d.value.total) + 1; }))
          .stop();


        for (var i = 0; i < 120; ++i) simulation.tick();
        
        cellCircle
          .transition()
          .duration(500)
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; })
        	.attr("r", function(d){
            	return circleScale(d.value.total);
          })
          .style("fill", function(d) { 
          	if (cut == "Gender") {
          		return genderColorScale(d.value.percentwomen); 
         	} else {
         		return raceColorScale(d.value.parity); 
         	}})
        	.style("stroke", function(d) { 
        		if (cut == "Gender") {
          		return d3.color(genderColorScale(d.value.percentwomen)).darker(1); 
         	} else {
         		return d3.color(raceColorScale(d.value.parity)).darker(1); 
         	}})

      	cellImages
          .transition()
          .duration(500)
          .attr("transform",function(d,i){
            return "translate(" + (d.x-circleScale(d.value.total)/1.5) + "," + (d.y-circleScale(d.value.total)/1.5) + ")";
          })
          .attr("class","swarm-image-container")
      
      } else if (currentChart == "swarm-scatter") {
         if (cut == "Gender") {
           chartTitle
              .html("Company leadership vs employees by gender")
        } else {
          chartTitle
              .html("Company leadership vs employees by race")
        }


        chartAxis
          .selectAll("g")
          .transition()
          .duration(250)
          .style("opacity",0)
          .on("end",function(d){
            d3.select(this).remove();
          });



            xScale = d3.scaleLinear().domain([0,1]).range([0,width]).clamp(true);
            yScale = d3.scaleLinear().domain([0,1]).range([height,0]).clamp(true);
            if(cut == "Race"){
              //xScale.domain([0,.85]).range([0,width]).clamp(true);
              //yScale.domain([0,.85]).range([height,0]).clamp(true);
              newsNestAverageT1 = d3.mean(percentagesByCompany,function(d){ return d.value.percentasian+d.value.percentblack+d.value.percentlatino+d.value.percentamerindian+d.value.percentmixed; });
              newsNestSupAverageT1 = d3.mean(percentagesByCompany,function(d){ return d.value.percentasianleaders+d.value.percentblackleaders+d.value.percentlatinoleaders+d.value.percentamerindianleaders+d.value.percentmixedleaders; });
            }
            else{
              //xScale = d3.scaleLinear().domain([.2,.8]).range([0,width]).clamp(true);
              //yScale = d3.scaleLinear().domain([.2,.8]).range([height,0]).clamp(true);
              /*if(extentOverride[0] <.2){
                xScale.domain([extentOverride[0],.8])
              }*/
              newsNestAverageT1 = d3.mean(percentagesByCompany,function(d){ return d.value.percentwomen;});
              newsNestSupAverageT1 = d3.mean(percentagesByCompany,function(d){ return d.value.percentwomenleaders;});
            }


            cellCircle
                 .on("mouseover",function(d){
          var data = d;
          mouseOverEvents(data,d3.select(this));
        })
        .on("mouseout",function(d){
          var data = d;
          mouseOutEvents(data,d3.select(this));
        })
        .transition()
        .duration(500)
        .delay(function(d,i){
          
          return 100;
        })
        .style("opacity",1)
        .attr("cx", function(d) {
          if(cut == "Race"){
            return xScale(d.value.percentblack+d.value.percentlatino+d.value.percentasian+d.value.percentamerindian+d.value.percentmixed);
          } else {
            return xScale(d.value.percentwomen);
          }
        })
        .attr("r", function(d){
          return circleScale(d.value.total);
        })
        .attr("cy", function(d) {
          if(cut == "Race"){
          
            return yScale(d.value.percentblackleaders+d.value.percentlatinoleaders+d.value.percentasianleaders+d.value.percentamerindianleaders+d.value.percentmixedleaders);
          } else {
            return yScale(d.value.percentwomenleaders);
          }
        }).style("fill", null)
        .style("stroke", null);
        ;

          cellImages.transition().duration(500)
          .delay(function(d,i){
          
          return 100;
        })

          .attr("transform",function(d,i){
            if (cut == "Race") {
              return "translate(" + (xScale(d.value.percentblack+d.value.percentlatino+d.value.percentasian+d.value.percentamerindian+d.value.percentmixed)-circleScale(d.value.total)/1.5) + "," + 
                (yScale(d.value.percentblackleaders+d.value.percentlatinoleaders+d.value.percentasianleaders+d.value.percentamerindianleaders+d.value.percentmixedleaders)-circleScale(d.value.total)/1.5) + ")";
            } else {
              return "translate(" + (xScale(d.value.percentwomen) -circleScale(d.value.total)/1.5)+ "," + (yScale(d.value.percentwomenleaders) -circleScale(d.value.total)/1.5) +")";
            }
            
          })
          .attr("class","swarm-image-container")
        }
        buildAxis()
        buildAverage()
 

      	

		
	}
	function buildAxis() {

		  if (currentChart == "swarm") {
      	if (cut == "Gender") {
      		tickData = [0,.25,.5,.75,1];
      	} else {
      		tickData = [-.8,-.4,0,.4,.8];
      	}

      	chartAxis
          .selectAll("g")
          .transition()
          .duration(500)
          .style("opacity",0)
          .on("end",function(d){
            d3.select(this).remove();
          });

       	

      	var chartAxisContainer = chartAxis.append("g")
      	  chartAxisContainer.append("line")
	    	.style("stroke", "#dddddd")
	    	.attr("x1", 0)
	    	.attr("x2", width)
	    	.attr("y1", height/2)
	    	.attr("y2", height/2)
	    	.attr("class", "center-line")
      	if (cut == "Gender") {
          		midPoint = 0.5;
          	} else {
          		midPoint = 0;
          	}

	    var ticks = chartAxisContainer
            .append("g")

            .attr("class","swarm-axis-tick-container")
            .selectAll("g")
            .data(tickData)
            .enter()
            .append("g")
            .attr("class","swarm-axis-tick-g");
	    
	  
	    ticks
	        .append("line")
	        .style("stroke",function(d){
	          
	          if (cut == "Gender") {
          		 return genderColorScale(d);
          	} else {
          		return raceColorScale(d);
          	}
	        })
	        .attr("x1",function(d){
	          if (cut == "Gender") {
          		return percentScale(d);
          	} else {
          		return parityScale(d);
          	}
	        })
	        .attr("x2",function(d){
	          if (cut == "Gender") {
          		return percentScale(d);
          	} else {
          		return parityScale(d);
          	}
	        })
	        .attr("y1",function(d,i){
	          if(d==midPoint){
	            return height/2;
	          }
	          return 0
	        })
	        .attr("y2",function(d){
	          if(d==midPoint){
	            return 0;
	          }
	          return height*.05;
	        })
	        .attr("class","swarm-axis-tick");
	   

	    ticks
	        .append("text")
	        .attr("x",function(d){
	          if (cut == "Gender") {
          		return percentScale(d);
          	} else {
          		return parityScale(d);
          	}
	        })
	        .attr("y",-9)
	              	     .transition()
        .delay(250)
	        .attr("class","swarm-axis-tick-text")
	        .style("text-anchor",function(d,i){
	          if(i==0){
	            return "start"
	          }
	        
	          else if(i==tickData.length-1){
	            return "end"
	          }
	          return "middle";
	        })
	        .style("fill",function(d,i){
	          if(d==midPoint){
	            return "#888";
	          }
	          if (cut == "Gender") {
          		 return genderColorScale(d);
          	} else {
          		return raceColorScale(d);
          	}
	        })
	        .text(function(d,i){
	          if(i==0){
	            if(cut == "Race"){
	              if(viewportWidth < 800){
	                return "+"+Math.floor(Math.abs(d)*100)+" pts. White";
	              }
	              return "More white vs. Bay Area"
	            }
	            return Math.floor((1-d)*100)+"% Male"
	          }
	          if(i==tickData.length-1){
	            if(cut == "Race"){
	              if(viewportWidth < 800){
	                return "+"+Math.floor(Math.abs(d)*100)+" pts. Non-white";
	              }
	              return "More people of color vs. Bay Area"
	            }
	            return Math.floor(d*100)+"% Female"
	          }
	          if(d==midPoint){
	            if(cut == "Race"){
	              return "Parity with Bay Area"
	            }
	            return "50/50 Split";
	          }
	          if(d<midPoint){
	            if(cut == "Race"){
	              return "+"+Math.floor(Math.abs(d)*100)+" pts.";
	            }
	            return Math.floor((1-d)*100)+"%";
	          }
	          if(cut == "Race"){
	            return "+"+Math.floor(Math.abs(d)*100)+" pts.";
	          }
	          return Math.floor(d*100)+"%";
	        });
      } else if (currentChart == "swarm-scatter") {
        var chartAxisContainer = chartAxis.append("g")

        var chartAxisLines = chartAxisContainer.append("g")

        chartAxisLines
          .append("g")
          .attr("class","swarm-scatter-rect-gender-g")
          .append("line")
          .attr("class","swarm-scatter-rect-gender-line")
          .attr("x1",0)
          .attr("x2",width)
          .attr("y1",function(d){
            return height/2;
          })
          .attr("y2",function(d){
            return height/2;
          })
          .style("visibility",function(){
            if(cut=="Race"){
              return "hidden"
            }
            return null;
          })
          ;

        chartAxisLines
         .append("g")
         .attr("class","swarm-scatter-x-axis-lines")
         .selectAll("line")
         .data(function(){
           if(cut=="Race"){
             return [.1,.3,.5,.7]
           }
           return [.25,.35,.45,.55,.65,.75];
         })
         .enter()
         .append("line")
         .attr("x1",function(d){
           return xScale(d);
         })
         .attr("x2",function(d){
           return xScale(d);
         })
         .attr("y1",0)
         .attr("y2",height)
         .attr("class","swarm-axis-line")
         ;

        chartAxisLines.append("g")
          .attr("class","swarm-scatter-y-axis-lines")
          .selectAll("line")
          .data(function(){
            if(cut=="Race"){
              return [.1,.3,.5,.7];
            }
            return [.3,.5,.4,.6,.7];
          })
          .enter()
          .append("line")
          .attr("x1",0)
          .attr("x2",width)
          .attr("y1",function(d){
            return yScale(d);
          })
          .attr("y2",function(d){
            return yScale(d);
          })
          .attr("class","swarm-axis-line")
          ;

        var chartAxisText = chartAxisContainer.append("g")

        chartAxisText
          .append("g")
          .selectAll("text")
          .data(function(){
            if(viewportWidth < 450){
              if(cut=="Race"){
                return ["← More White","Employee Race","More Non-white →"]
              }
              return ["← More Male Employees","Employee Gender","More Female Employees →"]
            }
            if(cut=="Race"){
              return ["← More White","Employee Race","More People of Color →"]
            }
            return ["← More Male Employees","Employee Gender","More Female Employees →"]
          })
          .enter()
          .append("text")
          .attr("x",function(d,i){
            if(i==0){
              return 0;
            }
            if(i==1){
              return width/2;
            }
            return width;
          })
          .attr("y",function(d,i){
            return height
          })
          .attr("class",function(d,i){
            if(i!=1){
              return "swarm-axis-tick-text scatter-axis-chart-text scatter-axis-chart-side"
            }
            return "swarm-axis-tick-text scatter-axis-chart-text";
          })
          .text(function(d){
            return d;
          })
          .style("text-anchor",function(d,i){
            if(i==0){
              return "start"
            }
            if(i!=1){
              return "end";
            }
            return "middle"
          })
          ;

        chartAxisText
          .select("g")
          .transition()
          .duration(500)
          .style("opacity",0)
          .on("end",function(d){
            d3.select(this).remove();
          });

        chartAxisText
          .append("g")
          .selectAll("text")
          .data(function(){
            if(cut=="Race"){
              return [{text:"75% Leaders are Not White",value:.75},{text:"Leaders: 50-50 White/Non-White",value:.5},{text:"25% Non-White",value:.25},{text:"0% Non-White Leaders",value:.0}]
            }
            return [{text:"75% Leaders are Women",value:.75},{text:"65% Female",value:.65},{text:"Leaders: 50-50 Male/Female",value:.5},{text:"35% Female",value:.35},{text:"25% Leaders are Female",value:.25}]
          })
          .enter()
          .append("text")
          .attr("transform","translate("+(width-10)+",0)")
          .attr("y",function(d,i){
            return yScale(d.value);
          })
          .attr("class",function(d,i){
            return "swarm-axis-tick-text scatter-axis-chart-text-y";
          })
          .style("text-anchor",function(d,i){
            return "end"
          })
          .text(function(d){
            return d.text;
          })
          .attr("dy",0)
          .call(wrap,95)
          ;
      }
      

		}
		function buildAverage(){
          svg.select(".swarm-average").remove();
         svg.select(".swarm-annnotation").remove();
        if (currentChart == "swarm") {
       

          var chartAnnotation = svg.append("g")
             .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
             .attr("class","swarm-annnotation")
             ;
          
          if(!mobile && viewportWidth > 550){
            var adjustWidth = 0;
            if(viewportWidth < 650){
              adjustWidth = 100;
            }
            chartAnnotation.append("line")
              .attr("x1",width-147+adjustWidth)
              .attr("x2",width-10)
              .attr("y1",height/2+25)
              .attr("y2",height/2+25)
              .attr("class","swarm-annnotation-line")
              .attr("marker-end", function(d){
                return "url(#arrow-head)"
              })
              ;

            chartAnnotation.append("text")
              .attr("x",width-147+adjustWidth)
              .attr("y",height/2+25)
              .attr("class","swarm-annnotation-text")
              .text(function(d){
                if(cut == "Race"){
                  return "More People of Color";
                }
                return "More Women";
              })
              ;

          }

          var chartAverage = svg.append("g")
             .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
             .attr("class","swarm-average")
             ;

         chartAverage.append("text")
           .attr("class","swarm-average-text swarm-average-text-label")
           .attr("x", function() {
           		if (cut == "Gender") {
           			return 	percentScale(d3.mean(percentagesByCompany, function(d) { return d.value.percentwomen}))
           		} else {
           			return 	parityScale(d3.mean(percentagesByCompany, function(d) { return d.value.parity}))
           		}
           	})
           
           .attr("y",height*.2-30)
           .text("Average")

          chartAverage.append("text")
            .attr("class","swarm-average-text")
             .attr("x", function() {
           		if (cut == "Gender") {
           			return 	percentScale(d3.mean(percentagesByCompany, function(d) { return d.value.percentwomen}))
           		} else {
           			return 	parityScale(d3.mean(percentagesByCompany, function(d) { return d.value.parity}))
           		}
           	})
            .attr("y",height*.2-15)
            .text(function(){
              if(cut == "Race"){
                return Math.round((Math.abs(parityAverage))*100)+" pts. over-represented white"
              }
              return Math.round((1-womenAverage)*100)+"% Male"
            })

          chartAverage.append("line")
            .attr("class","swarm-average-line")
            .attr("x1", function() {
           		if (cut == "Gender") {
           			return 	percentScale(d3.mean(percentagesByCompany, function(d) { return d.value.percentwomen}))
           		} else {
           			return 	parityScale(d3.mean(percentagesByCompany, function(d) { return d.value.parity}))
           		}
           	})
            .attr("x2", function() {
           		if (cut == "Gender") {
           			return 	percentScale(d3.mean(percentagesByCompany, function(d) { return d.value.percentwomen}))
           		} else {
           			return 	parityScale(d3.mean(percentagesByCompany, function(d) { return d.value.parity}))
           		}
           	})
            .attr("y1",height*.2)
            .attr("y2",height*.8);
          } else if (currentChart == "swarm-scatter") {


         function leastSquares(xSeries, ySeries) {
          var reduceSumFunc = function(prev, cur) { return prev + cur; };

          var xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
          var yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

          var ssXX = xSeries.map(function(d) { return Math.pow(d - xBar, 2); })
            .reduce(reduceSumFunc);

          var ssYY = ySeries.map(function(d) { return Math.pow(d - yBar, 2); })
            .reduce(reduceSumFunc);

          var ssXY = xSeries.map(function(d, i) { return (d - xBar) * (ySeries[i] - yBar); })
            .reduce(reduceSumFunc);

          var slope = ssXY / ssXX;
          var intercept = yBar - (xBar * slope);
          var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);
          return {slope:slope,intercept:intercept,r2:rSquare};
        }
         var xValues = cellCircle.data().map(function(d){
           if(cut=="Race"){
             return d.value.percentasian+d.value.percentblack+d.value.percentlatino+d.value.percentamerindian+d.value.percentmixed;
           }
           return d.value.percentwomen;
         });
         var yValues = cellCircle.data().map(function(d){
           if(cut=="Race"){
             return d.value.percentasianleaders+d.value.percentblackleaders+d.value.percentlatinoleaders+d.value.percentamerindianleaders+d.value.percentmixedleaders;
           }
           return d.value.percentwomenleaders;
         });
         var linear = leastSquares(xValues,yValues);


         var chartAverage = svg.append("g")
             .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
             .attr("class","swarm-average")
             ;

         var chartAnnotation = chartAverage.append("g")
          .attr("class","swarm-annnotation")
          ;


        chartAverage.append("line")
          .attr("class","swarm-scatter-regression-line")
          .attr("x1", 0)
          .attr("y1", yScale(linear.intercept))
          .attr("x2", function(d){
            if(cut=="Race"){
              return xScale(.85)
            }
            return xScale(.85)
          })
          .attr("y2", function(){
            if(cut=="Race"){
              return yScale( (.85 * linear.slope) + linear.intercept )
            }
            return yScale( (.85 * linear.slope) + linear.intercept )
          })
          ;

        var regressionAnnotation = chartAnnotation.append("g")
          .attr("class","swarm-scatter-regression-annotation")
          .attr("transform",function(){
            if(cut=="Race"){
              return "translate("+xScale(.8*.8)+","+yScale( (.8*.8 * linear.slope) + linear.intercept )+")"
            }
            return "translate("+xScale(.8*.8)+","+yScale( (.8*.8 * linear.slope) + linear.intercept )+")"
          })

        regressionAnnotation
          .append("text")
          .attr("class","swarm-scatter-regression-annotation-text")
          .text(function(){
            if(cut=="Race"){
              return "Companies with racially diverse leadership tend to have more racially diverse employees"
            }
            return "Companies with female leadership tend to have more female employees"
          })
          .attr("transform","translate("+-40+","+-55+")")
          .attr("dy",0)
          .call(wrapTwo,250)
          ;

        regressionAnnotation
          .append("line")
          .attr("class","swarm-scatter-regression-annotation-line")
          .attr("x1", -35)
          .attr("y1", -35)
          .attr("x2", -5)
          .attr("y2", -5)
          .attr("marker-end","url(#arrow-head-black)")
          ;

        /*var highlightedAnnotationOffset = 150;
        //
        var highlightedAnnotation = chartAverage.append("g")
           .attr("transform","translate("+highlightedPosition[0]+","+highlightedPosition[1]+")")
        //
        highlightedAnnotation
          .append("line")
          .attr("class","swarm-axis-annotation-line")
          .attr("x1",highlightedPosition[2])
          .attr("x2",highlightedPosition[2] + highlightedAnnotationOffset)
          .attr("y1",0)
          .attr("y2",0)
          .style("stroke",highlightedStrokeColor)
          ;
        //
        highlightedAnnotation
         .append("text")
         .text(function(d){
           return newsIDName.get(newsIdSelected).Company
         })
         .attr("class","swarm-axis-annotation-text")
         .attr("x",highlightedPosition[2] + highlightedAnnotationOffset)
         .style("text-anchor","start")
         ;*/

        // chartAnnotation.append("line")
        //   .attr("x1",function(){
        //     if(cut=="race"){
        //       return xScale(.5);
        //     }
        //     return xScale(.65);
        //   })
        //   .attr("x2",function(){
        //     if(cut=="race"){
        //       return xScale(.55)
        //     }
        //     return xScale(.7)
        //   })
        //   .attr("y1",height-20)
        //   .attr("y2",height-20)
        //   .attr("class","swarm-annnotation-line")
        //   .attr("marker-end", function(d){
        //     return "url(#arrow-head)"
        //   })
        //   ;

        // chartAnnotation.append("text")
        //   .style("transform",function(){
        //     if(cut == "race"){
        //       var transform = "translate("+(xScale(.5)-10)+"px,"+(height-20)+"px) rotate(0)";
        //       return transform;
        //     }
        //     var transform = "translate("+(xScale(.65)-10)+"px,"+(height-20)+"px) rotate(0)";
        //     return transform;
        //   })
        //   .attr("class","swarm-annnotation-text swarm-scatter-y-annnotation-text")
        //   .text(function(d){
        //     if(cut=="race"){
        //       return "People of Color Staff"
        //     }
        //     return "Women Staff";
        //   })
        //   ;
        //
         chartAnnotation.append("line")
           .attr("x1",20)
           .attr("x2",20)
           .attr("y1",function(){
             
             return yScale(.75);
           })
           .attr("y2",15)
           .attr("class","swarm-annnotation-line")
           .attr("marker-end", function(d){
             return "url(#arrow-head)"
           })
           ;

         chartAnnotation.append("text")
           .style("transform",function(){
             if(cut == "Race"){
               var transform = "translate("+20+"px,"+(yScale(.75)+10)+"px) rotate(270deg)";
               return transform;
             }
             var transform = "translate("+20+"px,"+(yScale(.75)+10)+"px) rotate(270deg)";
             return transform;
           })
           .attr("class","swarm-annnotation-text swarm-scatter-y-annnotation-text")
           .text(function(d){
             if(cut=="Race"){
               return "People of Color Leadership"
             }
             return "Women Leaders";
           })
           ;
         chartAverage.append("circle")
           .attr("class","swarm-circle swarm-circle-average")
           .attr("cx",xScale(newsNestAverageT1))
           .attr("cy",function(d){
             return yScale(newsNestSupAverageT1);
           })
           .attr("r",6)
           .style("fill", "black")
           .style("stroke", "black")
           ;

         chartAverage.append("text")
           .attr("class","swarm-average-text swarm-average-text-label")
           .attr("x",xScale(newsNestAverageT1))
           .attr("y",yScale(newsNestSupAverageT1) - 12)
           .style("fill","black")
           .text("Average")

      }

          }
           



      function mouseOverEvents(data,element){
      chartToolTip.selectAll("div").remove();

      var chartToolTipContainer = chartToolTip.append("div");

      var chartToolTipCompany = chartToolTipContainer.append("p")
        .attr("class","swarm-chart-tool-tip-company")
        .text(function(d){
        
          if(data.key.length > 30){
            return data.key.replace(/\b\w/g, l => l.toUpperCase()).slice(0,30)+"..."
          }
          return data.key.replace(/\b\w/g, l => l.toUpperCase())
        });

      var colData = ["white","black","hisp.","asian", "female"];
      var dataForToolTip = [{cut:"leaders",cols:colData},{cut:"staff",cols:colData},{cut:"census",cols:colData}];

      var rows = chartToolTipContainer.selectAll("div")
        .data(dataForToolTip)
        .enter()
        .append("div")
        .attr("class","swarm-chart-tool-tip-row")

      var rowLabels = rows.append("p")
        .attr("class","swarm-chart-tool-tip-row-label")
        .html(function(d){
          if(d.cut == "census"){
            var cityString = "Bay Area";
            return "census<span>"+cityString+"</span>"
          }
          if(d.cut == "staff" && currentChart != "swarm-scatter"){
            return "all"
          }
          return d.cut;
        })
        ;

      var cols = rows.selectAll("div")
        .data(function(d){
          return d.cols;
        })
        .enter()
        .append("div")
        .attr("class","swarm-chart-tool-tip-col")

      cols.append("p")
        .attr("class","swarm-chart-tool-tip-col-label")
        .text(function(d){
          if(d3.select(this.parentNode.parentNode).datum().cut == "leaders"){
            return d;
          }
          return null;
        })
        ;

      cols
        .append("p")
        .text(function(d){
          var cutData = d3.select(this.parentNode.parentNode).datum().cut;
          if(cutData == "census"){
            if(d=="female"){
              var femaleData = data.value.femaleCensus;
              if(femaleData == "n/a"){
                return femaleData;
              }
              return Math.round(data.value.censuswomen*100)+"%";
            }
            if(d=="white"){
              return Math.round(data.value.censuswhite*100)+"%";
            }
            if(d=="hisp."){
              return Math.round(data.value.censuslatino*100)+"%";
            }
            if(d=="black"){
              return Math.round(data.value.censusblack*100)+"%";
            }
            if(d=="asian"){
              return Math.round(data.value.censusasian*100)+"%";
            }
            if(d=="am. ind."){
              return Math.round(data.value.censusamerindian*100)+"%";
            }
            if(d=="mixed"){
              return Math.round(data.value.censusmixed*100)+"%";
            }
          }
          if(cutData == "staff"){
            	
              if(d=="white"){
                return Math.round(data.value.percentwhite*100)+"%";
              }
              if(d=="black"){
                return Math.round(data.value.percentblack*100)+"%";
              }
              if(d=="hisp."){
                return Math.round(data.value.percentlatino*100)+"%";
              }
              if(d=="asian"){
                return Math.round(data.value.percentasian*100)+"%";
              }
               if(d=="am. ind."){
                return Math.round(data.value.percentamerindian*100)+"%";
              }
               if(d=="mixed"){
                return Math.round(data.value.percentmixed*100)+"%";
              }
              if(d=="female"){
                return Math.round(data.value.percentwomen*100)+"%";
              }
            
          }
          if(cutData = "leaders"){
             if(d=="white"){
                return Math.round(data.value.percentwhiteleaders*100)+"%";
              }
              if(d=="black"){
                return Math.round(data.value.percentblackleaders*100)+"%";
              }
              if(d=="hisp."){
                return Math.round(data.value.percentlatinoleaders*100)+"%";
              }
              if(d=="asian"){
                return Math.round(data.value.percentasianleaders*100)+"%";
              }
               if(d=="am. ind."){
                return Math.round(data.value.percentamerindianleaders*100)+"%";
              }
               if(d=="mixed"){
                return Math.round(data.value.percentmixedleaders*100)+"%";
              }
              if(d=="female"){
                return Math.round(data.value.percentwomenleaders*100)+"%";
              }
          }
          return "tbd";
        })
        .attr("class","swarm-chart-tool-tip-text")
        ;

      if(currentChart == "swarm" || currentChart == "swarm-scatter"){

        element.style("stroke",function(){
          return "black";
        })
        ;

        chartToolTip
          .style("visibility","visible")
          .style("top",function(d){
            if(viewportWidth < 450 || mobile){
              return "0px";
            }
            return (d3.event.pageY) + mouseoverOffsetY +"px"
          })
          .style("left",function(d){
            if(viewportWidth < 450 || mobile){
              return "0px";
            }
            return (d3.event.pageX) + circleScale(data.value.total) + mouseoverOffsetX +"px";
          })
      }
      /*else if(chartType == "swarm-scatter"){

        element.style("stroke",function(){
          return "black";
        })
        ;
        chartToolTip
          .style("visibility","visible")
          .style("top", function(){
            if(viewportWidth < 450 || mobile){
              return "0px";
            }
            if(cut=="race"){
              return yScale(getPercentType("supWhite",data.value)) + mouseoverOffsetY +"px"
            }
            return yScale(getPercentType("supGender",data.value)) + mouseoverOffsetY +"px"
          })
          .style("left",function(){
            if(viewportWidth < 450 || mobile){
              return "0px";
            }
            if(cut=="race"){
              return xScale(getPercentType("raceStaff",data.value)) + data.value.radius + mouseoverOffsetX +"px"
            }
            return xScale(getPercentType("genderStaff",data.value)) + data.value.radius + mouseoverOffsetX +"px"
          })
      }*/
    }
    
    function mouseOutEvents(data,element){

      chartToolTip
        .style("visibility",null)
        ;
        
     
          element.style("stroke",function(d) {
            if (currentChart == "swarm") {
              if (cut == "Gender") {
    	      		return d3.color(genderColorScale(d.value.percentwomen)).darker(1); 
      	     	} else {
      	     		return d3.color(raceColorScale(d.value.parity)).darker(1); 
      	     	}
            } else {
              return null;
            }

          }) 
        

      /*if(chartType == "swarm" || chartType == "new"){

        element
          .style("stroke",function(d){
            var value = getPercentType(cut,d.value);
            if(+d.key == newsIDSearch){
              return newsIDSearchColor;
            }
            if(d.key == newsIdSelected){
              return d3.color(genderColorScale(value)).darker(highlightedCircleStrokeDarkness);
            }
            return d3.color(genderColorScale(value)).darker(1);
          })
          ;

      }
      else if(chartType == "swarm-scatter"){
        element
          .style("stroke",function(d){
            var value = getPercentType(cut,d.value);
            if(+d.key == newsIDSearch){
              return newsIDSearchColor;
            }
            if(d.key == newsIdSelected){
              return d3.color(genderColorScale(value)).darker(highlightedCircleStrokeDarkness);
            }
            return null;
          })
          ;*/
      }
      $(window).on("resize", function() {
  viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  var bchart = $("#graph"),
    baspect = bchart.width() / bchart.height(),
    bcontainer = bchart.parent();
  console.log(bchart.width())
  console.log(bchart.height())
  var targetWidth;
     if (currentChart == "swarm-scatter") {
      if (viewportWidth <= 680) {
        targetWidth = viewportWidth;
        targetHeight = targetWidth / baspect;
                 bchart.attr("width", targetWidth);
    bchart.attr("height", targetHeight);

      } else {
        targetWidth = 680;
        targetHeight = 575;
        //width = 680;
        //height = 575;
        updateChart()


      }

    } else {

      if (viewportWidth <= 1000) {
        targetWidth = viewportWidth;
        targetHeight = targetWidth / baspect;
           bchart.attr("width", targetWidth);
    bchart.attr("height", targetHeight);

      } else {
         svg
          .attr("viewBox", "0 0 1000 325")
        targetWidth = 1000;
        targetHeight = 325;
        //height =325;
        //width = 1000;
        updateChart()
       

      }
    }
  

         
 
    //bchart.attr("height", Math.round(targetWidth / baspect));

}).trigger("resize");
}) 

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.05, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em").style("font-weight", 500);
    while (word = words.pop()) {

      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").style("font-size","12px").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

function wrapTwo(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.3, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}



function type(d) {
  if (!d.count) return;
  d.count = +d.count;
  return d;
}








