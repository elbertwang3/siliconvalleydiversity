d3.csv('data/data.csv', type, function(error, data) {


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
					 	total: d3.sum(v, function(d) { return d.count; })
					}})
					.entries(noTotalsData);
	percentagesByCompany = totalsByCompany.map(function(d) { return {key: d.key, value: {percentmen: d.value.totalmen/d.value.total, 
																						percentwomen: d.value.totalwomen/d.value.total, 
																						percentwhite: d.value.totalwhite/d.value.total, 
																						percentblack: d.value.totalblack/d.value.total, 
																						percentlatino: d.value.totallatino/d.value.total, 
																						percentasian: d.value.totalasian/d.value.total, 
																						percentamerindian: d.value.totalamerindian/d.value.total, 
																						percentmixed: d.value.totalmixed/d.value.total
																					}}});
	console.log(totalsByCompany);
	console.log(percentagesByCompany);
	dataByCompany = d3.nest()
					.key(function(d) { return d.company})
					.entries(data);
	//console.log(dataByCompany);
}) 


function type(d) {
  if (!d.count) return;
  d.count = +d.count;
  return d;
}