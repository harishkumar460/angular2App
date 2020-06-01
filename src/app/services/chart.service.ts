import { Injectable } from '@angular/core';
import {select, selectAll} from 'd3-selection';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor() { }

  createChartTitle(svgChart, chartTitle) {
    svgChart.append("text")
   .attr("transform", "translate(200,0)")
   .attr("x", 50)
   .attr("y", 50)
   .attr("font-size", "24px")
   .text(chartTitle)
  }
  createColumnChart(data, containerBlock) {
    let container = select(containerBlock);
    container.html('');
    let containerWidth = container.node().clientWidth;
    let containerHeight = container.node().clientHeight;
    let svgChart = container.append('svg').attr('width', containerWidth).attr('height',containerHeight);
    const isMobile = containerWidth < 650, margin = isMobile ? 0: 200;
    let width = containerWidth-margin, height = containerHeight-margin, tooltip;
    let xScale = d3.scaleBand().range([0, width]).padding(0.4),
        yScale = d3.scaleLinear().range([height, 0]);
    this.createChartTitle(svgChart,'Yearly Expenses Chart'); 
    let g = svgChart.append("g")
            .attr("transform", "translate(" + (isMobile? 30 : 100) + "," + (isMobile? -20 :100) + ")");

    xScale.domain(data.map(function(d) { return d.year; }));
    yScale.domain([0, d3.max(data, function(d) { return d.value; })]);

    g.append("g").attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale)).append("text")
    .attr("y", height - 250)
    .attr("x", width - 100)
    .attr("text-anchor", "end")
    .attr("stroke", "black")
    .text("Year");
    g.append("g").call(d3.axisLeft(yScale).tickFormat(function(d){
             return "$" + d;
         }).ticks(10));
    
    g.selectAll(".bar").data(data).enter().append('text')
    .attr('x', (d)=> { return xScale(d.year);})
    .attr('y', (d)=> {return yScale(d.value+3)})
    .attr('dy', '.35em').text((d)=> {return d.value;});

    g.selectAll("rect").data(data).enter().append("rect")
    .attr("class", "bar").attr('fill','orange')
    .style('cursor','pointer').attr("x", function(d) { return xScale(d.year); })
    .attr("y", function(d) { return yScale(0); }).attr("width", xScale.bandwidth())
    .transition().duration(1000).attr('y',function(d) { return yScale(d.value); })
    .attr('height', function(d) { return height - yScale(d.value);});
       
    tooltip = svgChart.append("g");
    tooltip.append('rect').attr('width',150).attr('height',60)
    .classed('tooltip-layout', true); 
    let textElem = tooltip.append('text');
    tooltip.style('display','none');

    svgChart.selectAll('rect.bar')
    .on('mouseover', function(d) {
        select(this).attr('fill','green');
        const position = d3.mouse(this);
        tooltip.attr('transform','translate('+position[0]+','+position[1]+')')
        .style('display','block');
        textElem.attr('x', 10).attr('y',30);
        Object.keys(d).forEach((key,i)=>{
          textElem.append('tspan').attr('x',10).attr('y',20*(++i)).text(key+': '+d[key]);
        });
        console.log('mouse event '+position+d);
      })
      .on('mouseout', function(){
        select(this).attr('fill','orange');
        textElem.text('');
        tooltip.style('display','none');
      });
  }

  createBarChart(data, containerBlock) {
    let container = select(containerBlock);
    container.html('');
    let containerWidth = container.node().clientWidth;
    let containerHeight = container.node().clientHeight;
    let svgChart = container.append('svg').attr('width', containerWidth).attr('height',containerHeight);
    const isMobile = containerWidth < 650, margin = isMobile ? 0: 200;
    let width = containerWidth-margin, height = containerHeight-margin, tooltip;
    let yScale = d3.scaleBand().range([height, 0]).padding(0.4),
        xScale = d3.scaleLinear().range([0, width]);
    
    this.createChartTitle(svgChart,'Yearly Expenses Chart'); 
    let g = svgChart.append("g")
            .attr("transform", "translate(" + (isMobile? 30 : 100) + "," + (isMobile? -20 :100) + ")");

    yScale.domain(data.map(function(d) { return d.year; }));
    xScale.domain([0, d3.max(data, function(d) { return d.value; })]);

    g.append("g").attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale).tickFormat(function(d){
      return "$" + d;
  }).ticks(10));
    g.append("g").call(d3.axisLeft(yScale));
    
    g.selectAll(".bar").data(data).enter().append('text')
    .attr('x', (d)=> { return xScale(d.value+3);})
    .attr('y', (d)=> {return yScale(d.year)})
    .attr('dy', '.35em').text((d)=> {return d.value;});

    g.selectAll("rect").data(data).enter().append("rect")
    .attr("class", "bar").attr('fill','orange')
    .style('cursor','pointer').attr("y", function(d) { return yScale(d.year); })
    .attr("height", yScale.bandwidth())
    .attr("x", function() { return xScale(0); })
    .transition().duration(1000).attr('x',function(d) { return xScale(d); })
    .attr('width', function(d) { return xScale(d.value);});
       
    tooltip = svgChart.append("g");
    tooltip.append('rect').attr('width',150).attr('height',60)
    .classed('tooltip-layout', true); 
    let textElem = tooltip.append('text');
    tooltip.style('display','none');

    svgChart.selectAll('rect.bar')
    .on('mouseover', function(d) {
        select(this).attr('fill','green');
        const position = d3.mouse(this);
        tooltip.attr('transform','translate('+position[0]+','+position[1]+')')
        .style('display','block');
        textElem.attr('x', 10).attr('y',30);
        Object.keys(d).forEach((key,i)=>{
          textElem.append('tspan').attr('x',10).attr('y',20*(++i)).text(key+': '+d[key]);
        });
        console.log('mouse event '+position+d);
      })
      .on('mouseout', function(){
        select(this).attr('fill','orange');
        textElem.text('');
        tooltip.style('display','none');
      });
  }
}
