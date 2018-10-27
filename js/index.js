var url = 
"https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
 
d3.json(url, function (json) {
            
  var description = d3.select(".info")
    .append("div")
    .html(json.description)
  
  var width = 800;
  var height = 400;  
    
  var svg = d3.select("#title")
     .append("svg")
     .attr("width", width + 50 )
     .attr("height", height )

    var tooltip = d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);
     
  d3.json(url, function(json) {
    
    var barWidth = ( width / json.data.length);
    
    var date = [];
    var gdp = [];
    
    json.data.map(data => {
      date.push(data[0].substring(0, 4));
      gdp.push(data[1]);
    });
       
   var gdpScale = [];
   var minGDP = d3.min(gdp);
   var maxGDP = d3.max(gdp);
   var linearS = d3.scaleLinear()
                    .domain([minGDP, maxGDP])
                    .range([minGDP/ maxGDP * height, height]);
    
    gdpScale = gdp.map ( function (item) {
                        return linearS (item);
    }); 
    
  // scales
    var xScale = d3.scaleLinear()
       .domain([d3.min(date), d3.max(date)])
       .range([0, width]);
    
    var yScale = d3.scaleLinear()
       .domain([d3.min(gdp), d3.max(gdp)])
       .range([height, 0]);
   
  // axes
    var xAxis = d3.axisBottom(xScale)
               .tickFormat(d3.format("d"))
              
    var yAxis = d3.axisLeft(yScale)
              .tickFormat(d3.format(""))
   
  //lines
   var xAxisLine = svg.append("g")
               .attr("id", "x-axis")
               .attr("transform", "translate(0, " + height + ")")
               .call(xAxis);
                   
   var yAxisLine =  svg.append("g")
               .attr("id", "y-axis")
               .call(yAxis)
                 
    
   svg.selectAll("rect")
       .data(gdpScale)
       .enter()
       .append("rect")
       .attr("class", "bar")
       .attr("x", (d, i) => i * barWidth)
       .attr("y", (d, i) => height - d)
       .attr("width", barWidth)
       .attr("fill", function (d, i) {
				return "steelblue"
			})
			.transition()
			.duration(200)
			.delay(function (d, i) {
				return i * 10;
			})
       .attr( "height", d => d)
       .attr("data-date", (d, i) => json.data[i][0])
       .attr("data-gdp", (d, i) => json.data[i][1]);
    
   svg.selectAll("rect")
        .data(gdpScale)
        .on("mouseover", function(d, i) {  
        d3.select(this)
        .style("fill", "lightsteelblue");
           tooltip.transition()        
                .duration(200)      
                .style("opacity", .9);      
     
      tooltip.html('<span><strong>$' + (gdp[i].toFixed(2)) + ' billons</strong></span><br/>'  +  (json.data[i][0]) )
            .attr('data-date', json.data[i][0])
            .style('left', (i * barWidth) + 200 + 'px')
            .style('top', height - 100 + 'px')
            .style('transform', 'translateX(60px)');
            })                  
        .on("mouseout", function(d, i) { 
           d3.select(this)
        .style("fill", "steelblue");
            tooltip.transition()        
                .duration(500)      
                .style("opacity", 0);   
        });
    
  
   svg.append("text")
       .attr("x", 120)
       .attr("y", 70)
       .attr("id", "title")
       .text("US Gross Domestic Product")
       .style("font-size", "22px")
      .style("font-weight", "bold")
      .style("font-family", "sans-serif")
      .style("fill", "#1f4e5f");
 
  svg.append("g")
    .append("text")
    .text("GDP in billions")
    .attr("x", -100)
    .attr("dy", "1.55em")
    .attr('transform', 'rotate(-90)')
    .style("font-size", "11px")
    .style("font-weight", "bold");  
    
    svg.append("g")
       .append("text")   
       .attr("y", 435)
       .attr("x", 400)
       .text('Years')
       .style("font-size", "11px")
       .style("font-weight", "bold")
       .style("font-family", "sans-serif");
    
    
       })
});