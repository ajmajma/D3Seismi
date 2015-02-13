'use strict';
/**
 * @ngdoc function
 * @name dataRobot.directive:mapPlease
 * @description
 * # Our map directive
 */

angular.module('dataRobot')
  .directive('mapPlease', function ($http) {
    return {
    template: '<div id="map"></div>',
      restrict: 'EA',
      scope: {
          data: "=",
          filters: "=",
          onDone: "&"
      },
      link: function (scope, element, attrs) {

      	//update map when data changes
      	scope.$watch('data',function(update){
      		if(update){
              	plotPoints(update);
              }else{
              	//empty
              }
        },true);

        scope.$watch('filters',function(update){
              if(update){
              	plotPoints(update);
              }else{
              	//empty
              }
        },true);

      	//set size
		var m_width = document.getElementById("map").offsetWidth,
		    width = 938,
		    height = 650,
		    active;
		//color scale for intensity
		var color = d3.scale.linear()
		    .domain([1, 5, 10])
		    .range(["#FFDC69","#FF9830", "#FF3030"]);

		//width to try and make depth relative (for fun - just testing)
		var scale = d3.scale.linear()
		    .domain([0, 40006])
		    .range([0, m_width]);


		//d3 projection
		var projection = d3.geo.mercator()
		    .scale(150)
		    .translate([width / 2, height / 1.5]);
		//d3 geo path
		var path = d3.geo.path()
		    .projection(projection);
		//tooltip directive
		var tip = d3.tip()
		  .attr('class', 'd3-tip')
		  .offset([-10, 0])
		  .html(function(d) {
		    return "<strong>Region:</strong> <span>" + d.region + "</span><br/><strong>Magnitude:</strong> <span>" + d.magnitude + "</span><br/> <strong>Date/time :</strong><span>" + d.timedate + "</span><br/> <strong>Depth :</strong><span>" + d.depth + "</span>";
		  })

		  var tooltip = d3.select("#map").append("div")
		    .attr("class", "tooltip");

		var svg = d3.select("#map").append("svg")
		    .attr("preserveAspectRatio", "xMidYMid")
		    .attr("viewBox", "0 0 " + width + " " + height)
		    .attr("width", m_width)
		    .attr("height", m_width * height / width);

		svg.call(tip);

		svg.append("rect")
		    .attr("class", "background")
		    .attr("width", width)
		    .attr("height", height)
		  

		var g = svg.append("g");
		var gPins = svg.append("g");

		//build map off of topojson
		d3.json("scripts/world-110m2.json", function(error, us) {
		  g.append("g")
		    .attr("id", "countries")
		    .selectAll("path")
		    .data(topojson.feature(us, us.objects.countries).features)
		    .enter()
		    .append("path")
		    .attr("id", function(d) { return d.id; })
		    .attr("d", path)
		    .on("click", click)
		});

		//use as function so we can refresh points on command
		//data - passed in data in seismi format
		function plotPoints(data){

			//wipe clean
		  svg.selectAll("circle")
		  .transition()
		   .delay(function(d, i) { return i * 1; })
		  .attr("r", 0 )
		   .remove()

		   //add our quakes with a little animation+ stagger
		 gPins.selectAll(".pin")
		  .data(data.earthquakes)
		  .enter().append("circle", ".pin")
		  .on('mouseover', tip.show)
		  .on('mouseout', tip.hide)
		  .on("click",function(d){
		  		selected(d);
			  d3.select(this)
			  	.transition()
				.duration(200)
				.attr("stroke-width", 200)
				.attr("r", 10)
				.transition()
			    .duration(600)
			    .attr("r",function(d){
				      return scale(d.depth)
				})
			    .attr("opacity", 0.1)
			    .transition()
			    .duration(2000)
			    .attr("r",function(d){
				      return d.magnitude/1.5;
				 })
			    .attr("opacity", 0.8)
			    .attr("stroke-width", 0.5)
		
		   })
		  .attr("transform", function(d) {
		    return "translate(" + projection([
		      d.lon,
		      d.lat
		    ]) + ")"

		  })
		  .attr("fill", function(d) {
		  	return color(d.magnitude)
		  })
		  .attr("r", 0 )
		   .transition()
		   .duration(500)
		  .delay(function(d, i) { return i * 3; })
		  .duration(10)
					.attr("stroke-width", 4)
					.attr("r",function(d){
		      return d.magnitude*2;
		  })
					.transition()
					.duration(500)
					.attr('stroke-width', 0.5)
					.attr("r",function(d){
		      return d.magnitude/1.5;
		  })
		.ease('sine')

		}

		//watch resize
		window.addEventListener('resize', function(event){
		  var w = document.getElementById("map").offsetWidth;
		  svg.attr("width", w);
		  svg.attr("height", w * height / width);
		});

		//zoom behaviou
		var zoom = d3.behavior.zoom()
			.scaleExtent([1, 8])
		    .on("zoom",function() {
		        g.attr("transform","translate("+ 
		            d3.event.translate.join(",")+")scale("+d3.event.scale+")");
		       	gPins.attr("transform","translate("+ 
         			d3.event.translate.join(",")+")scale("+d3.event.scale+")");    
		  });

		svg.call(zoom)

		//click country to zoom and set active
		function click(d) {
			if (active === d) return reset();
			g.selectAll(".active").classed("active", false);
			d3.select(this).classed("active", active = d);

			var b = path.bounds(d);
			g.transition().duration(750).attr("transform",
			  "translate(" + projection.translate() + ")"
			  + "scale(" + .45 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height) + ")"
			  + "translate(" + -(b[1][0] + b[0][0]) / 2 + "," + -(b[1][1] + b[0][1]) / 2 + ")");

			gPins.transition().duration(750).attr("transform",
			  "translate(" + projection.translate() + ")"
			  + "scale(" + .45 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height) + ")"
			  + "translate(" + -(b[1][0] + b[0][0]) / 2 + "," + -(b[1][1] + b[0][1]) / 2 + ")");
		}

		function reset() {
			g.selectAll(".active").classed("active", active = false);
			g.transition().duration(750).attr("transform", "");
			gPins.transition().duration(750).attr("transform", "");
		}

		function selected(info){
			scope.onDone({
        		value: info
      		});
		}

      }
    };
  });