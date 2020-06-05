import { Injectable } from '@angular/core';
import {select, selectAll} from 'd3-selection';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  private isDonutChart: boolean;
  private colors =  ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', 
  '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1',
  '#4daf4a','#377eb8','#ff7f00','#984ea3','#e41a1c'];
  private chartCategories = ['column', 'bar', 'line', 'pie', 'donut'];
  constructor() { }

  initChart(containerId, data, chartConfig) {
    select(containerId).html('');
    select(window).on('resize',()=> {
      this.initChart(containerId, data, chartConfig);
    });
    const chartType = chartConfig.type? chartConfig.type.toLowerCase() : 'column';
    switch(chartType) {
     case 'bar': {
                  this.generateBarChart(data, containerId, chartConfig);
                  break;
                }
     case 'column': {
                  this.generateColumnChart(data, containerId, chartConfig);
                  break;
                   }
     case 'pie':  {
                  this.generatePieChart(data, containerId, chartConfig);
                  break;
                 }
     case 'donut': {
                  this.generateDonutChart(data, containerId, chartConfig);
                  break;
                }
     case 'line': {
                  this.generateLineChart(data, containerId, chartConfig);
                  break;
                }                     
     default : { 
                 this.generateColumnChart(data, containerId, chartConfig);
             }                    
    }
  }
  private createChartTitle(svgChart, chartTitle, position) {
    svgChart.append('text')
   .attr('transform', 'translate('+position.x+','+position.y+')')
   .attr("x", 50)
   .attr("y", 50)
   .attr("font-size", "24px")
   .text(chartTitle)
  }
   private createTooltip(svgChart) {
    let tooltip; 
    tooltip = svgChart.append("g");
    tooltip.append('rect').attr('width',150).attr('height',60)
    // .classed('tooltip-layout', true);
    .style('fill','white').style('outline','auto').style('opacity','0.9'); 
    tooltip.append('text');
    tooltip.style('display','none');
     return tooltip;
   }

   private displayTooltip(tooltip,selectedArea, dataElement) {
    const position = d3.mouse(selectedArea);
    let posX =position[0], posY = position[1];
    tooltip.attr('transform',// -ve Expenses check is for pie chart as we get -ve Expenses in co-ordinates
    'translate('+(posX<0? -(posX)+50 : posX)+','+(posY<0? -(posY)+50 : posY)+')')
    .style('display','block');
    tooltip.select('text').attr('x', 10).attr('y',30);
    Object.keys(dataElement).forEach((key,i)=>{
      tooltip.select('text').append('tspan').attr('x',10).attr('y',20*(++i)).text(key+': '+dataElement[key]);
    });
    console.log('mouse event '+position);
   }

   private hideTooltip(tooltip) {
    tooltip.select('text').text('');
    tooltip.style('display','none');
   }

   private autoAnimate(svgChart) {
    let paths =svgChart.select('g').selectAll('path').nodes();       
    let xt=0, interval=2000;
    setInterval(()=>{
      xt = xt >= paths.length? 0: xt;
      let event = document.createEvent("SVGEvents");
      event.initEvent("click",true,true);
      paths[xt].dispatchEvent(event);
      xt++;
    },interval);
   }

   private fetch(data,index) {
     return data[Object.keys(data)[index]];
   }

  private generateColumnChart(data, containerBlock, config) {
    let container = select(containerBlock);
    container.html('');
    let containerWidth = container.node().clientWidth;
    let containerHeight = container.node().clientHeight;
    let svgChart = container.append('svg').attr('width', containerWidth).attr('height',containerHeight);
    const isMobile = containerWidth < 650, margin = isMobile ? 0: 200;
    const service = this;
    let width = containerWidth-margin, height = containerHeight-margin, tooltip;
    let xScale = d3.scaleBand().range([0, width]).padding(0.4),
        yScale = d3.scaleLinear().range([height, 0]);
    const titlePosition = {x:isMobile?0:200,y:0};    
    this.createChartTitle(svgChart,config.title, titlePosition); 
    let g = svgChart.append("g")
            .attr("transform", "translate(" + (isMobile? 30 : 100) + "," + (isMobile? -20 :100) + ")");

    xScale.domain(data.map(function(d) { return service.fetch(d,0); }));
    yScale.domain([0, d3.max(data, function(d) { return service.fetch(d,1); })]);

    g.append("g").attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale)).append("text")
    .attr("y", height - 250)
    .attr("x", width - 100)
    .attr("stroke", "black")
    .attr("font-size", "18px")
    .text(config.xAxisLabel);
    g.append("g").call(d3.axisLeft(yScale).tickFormat(function(d){
             return "$" + d;
      }).ticks(10))
      .append("text").attr("transform", "rotate(-90)").attr("y", 20)
      .attr("dy", "-5.1em").attr("stroke", "black")
      .attr("font-size", "18px").text(config.yAxisLabel);
    
    g.selectAll(".bar").data(data).enter().append('text')
    .attr('x', (d)=> { return xScale(service.fetch(d,0));})
    .attr('y', (d)=> {return yScale(service.fetch(d,1)+3)})
    .attr('dy', '.35em').text((d)=> {return service.fetch(d,1);});

    g.selectAll("rect").data(data).enter().append("rect")
    .attr("class", "bar").attr('fill', this.colors[0])
    .style('cursor','pointer').attr("x", function(d) { return xScale(service.fetch(d,0)); })
    .attr("y", function(d) { return yScale(0); }).attr("width", xScale.bandwidth())
    .transition().duration(1000).attr('y',function(d) { return yScale(service.fetch(d,1)); })
    .attr('height', function(d) { return height - yScale(service.fetch(d,1));});
       
    tooltip = this.createTooltip(svgChart);

    svgChart.selectAll('rect.bar')
    .on('mouseover', function(d) {
        select(this).attr('fill',service.colors[1]);
        service.displayTooltip(tooltip, this, d);
      })
      .on('mouseout', function(){
        select(this).attr('fill',service.colors[0]);
        service.hideTooltip(tooltip);
      });
  }

  private generateBarChart(data, containerBlock, config) {
    let container = select(containerBlock);
    container.html('');
    let containerWidth = container.node().clientWidth;
    let containerHeight = container.node().clientHeight;
    let svgChart = container.append('svg').attr('width', containerWidth).attr('height',containerHeight);
    const isMobile = containerWidth < 650, margin = isMobile ? 0: 200;
    let width = containerWidth-margin, height = containerHeight-margin, tooltip;
    let yScale = d3.scaleBand().range([height, 0]).padding(0.4),
        xScale = d3.scaleLinear().range([0, width]);
    const service = this;
    const titlePosition = {x:isMobile?0:200,y:0};
    this.createChartTitle(svgChart,'Yearly Expenses Chart', titlePosition); 
    let g = svgChart.append("g")
            .attr("transform", "translate(" + (isMobile? 30 : 100) + "," + (isMobile? -20 :100) + ")");

    yScale.domain(data.map(function(d) { return service.fetch(d,0); }));
    xScale.domain([0, d3.max(data, function(d) { return service.fetch(d,1); })]);

    g.append("g").attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale).tickFormat(function(d){
      return "$" + d;
  }).ticks(10))
  .append("text")
    .attr("y", height - 250)
    .attr("x", width - 100)
    .attr("stroke", "black")
    .attr("font-size", "18px")
    .text(config.xAxisLabel);
    g.append("g").call(d3.axisLeft(yScale))
    .append("text").attr("transform", "rotate(-90)").attr("y", 20)
      .attr("dy", "-5.1em").attr("stroke", "black")
      .attr("font-size", "18px").text(config.yAxisLabel);
    
    g.selectAll(".bar").data(data).enter().append('text')
    .attr('x', (d)=> { return xScale(service.fetch(d,1)+3);})
    .attr('y', (d)=> {return yScale(service.fetch(d,0))})
    .attr('dy', '.35em').text((d)=> {return service.fetch(d,1);});

    g.selectAll("rect").data(data).enter().append("rect")
    .attr("class", "bar").attr('fill',this.colors[0])
    .style('cursor','pointer').attr("y", function(d) { return yScale(service.fetch(d,0)); })
    .attr("height", yScale.bandwidth())
    .attr("x", function() { return xScale(0); })
    .transition().duration(1000).attr('x',function(d) { return xScale(d); })
    .attr('width', function(d) { return xScale(service.fetch(d,1));});
       
    tooltip = this.createTooltip(svgChart);
    svgChart.selectAll('rect.bar')
    .on('mouseover', function(d) {
        select(this).attr('fill',service.colors[1]);
        service.displayTooltip(tooltip, this, d);
      })
      .on('mouseout', function(){
        select(this).attr('fill',service.colors[0]);
        service.hideTooltip(tooltip);
      });
  }

  private generatePieChart(data,containerBlock,config?) {
    
    let container = select(containerBlock);
    container.html('');
    let containerWidth = container.node().clientWidth;
    let containerHeight = container.node().clientHeight;
    let svgChart = container.append('svg').attr('width', containerWidth).attr('height',containerHeight);
    const isMobile = containerWidth < 650, margin = isMobile ? 0: 200;
    const isDesktop = containerWidth > 767;
    const service = this;
    let width = containerWidth-margin, height = containerHeight-margin, 
                tooltip, radius = Math.min(width, height) / 2, lastClicked;
    let colors = d3.scaleOrdinal(this.colors);
    const titlePosition = { x:isMobile ? 0 : 200, y:0};
    this.createChartTitle(svgChart, 'Yearly Expenses Chart', titlePosition);
    let sizes = {innerRadius: this.isDonutChart ? 90 : 0, outerRadius: radius};
    let durations = {entryAnimation: 2000, sliceAnimation:1000};
    let generator = d3.pie().value(function(d) { 
      return service.fetch(d,1); 
   }).sort(null);
    let chartData = generator(data);
    let arcs = svgChart.append('g').attr('transform', 'translate('+width/2+','+(isDesktop ? height : height/2)+')')
               .selectAll('path').data(chartData).enter()
               .append('path').style('fill', (d, i) => colors(i))
               .on('mouseover', function(d) {
                 select(this).style('opacity','0.5');
                 service.displayTooltip(tooltip, this, d.data);
               })
               .on('click', function() {
                 const sameSlice = lastClicked === this;
                 lastClicked =  sameSlice ? this : lastClicked;
                 if (lastClicked) {
                   select(lastClicked).transition().duration(durations.sliceAnimation)
                   .attr('transform', 'translate(0, 0)');
                   lastClicked = null;
                 } 
                 if(!sameSlice) {
                 select(this).transition().duration(durations.sliceAnimation)
                 .attr('transform', 'translate(30, 20)');
                 lastClicked =this; 
                } 
               })
               .on('mouseout', function() {
                select(this).style('opacity','unset');
                service.hideTooltip(tooltip);
               });           
    let angleInterpolation = d3.interpolate(generator.startAngle()(), generator.endAngle()());
    let innerRadiusInterpolation = d3.interpolate(0, sizes.innerRadius);
    let outerRadiusInterpolation = d3.interpolate(0, sizes.outerRadius);
    tooltip = this.createTooltip(svgChart);          
    let arc = d3.arc();
    arcs.transition().duration(durations.entryAnimation)
    .attrTween("d", d => {
                      let originalEnd = d.endAngle;
                      return t => {
                        let currentAngle = angleInterpolation(t);
                        if (currentAngle < d.startAngle) {
                          return "";
                        }
                
                        d.endAngle = Math.min(currentAngle, originalEnd);
                
                        return arc(d);
                      };
              });
                
    svgChart.transition().duration(durations.entryAnimation)
    .tween("arcRadii", () => {
                      return t => arc
                        .innerRadius(innerRadiusInterpolation(t))
                        .outerRadius(outerRadiusInterpolation(t));
    });  
    this.autoAnimate(svgChart);
  }

  private generateDonutChart(data,containerBlock,config?) {
    this.isDonutChart = true;
    this.generatePieChart(data,containerBlock,config);
    this.isDonutChart = false;
  }

  private generateLineChart(lineData,containerBlock,config?) {
    const service = this;
    let container = select(containerBlock);
    container.html('');
    let containerWidth = container.node().clientWidth;
    let containerHeight = container.node().clientHeight;
    let svgChart = container.append('svg').attr('width', containerWidth).attr('height',containerHeight);
    const isMobile = containerWidth < 650, margin = isMobile ? 0: 200;
    let width = containerWidth-margin, height = containerHeight-margin, tooltip,
      MARGINS = {top: 20, right: 20, bottom: 20,left: 50},

      xRange = d3.scaleLinear().range([MARGINS.left, width]).domain([d3.min(lineData, function (d) {
          return service.fetch(d,0);
        }),
        d3.max(lineData, function (d) {
          return service.fetch(d,0);
        })
      ]),
  
      yRange = d3.scaleLinear().range([height, MARGINS.bottom]).domain([d3.min(lineData, function (d) {
          return service.fetch(d,1);
        }),
        d3.max(lineData, function (d) {
          return service.fetch(d,1);
        })
      ]),
      
      xAxis = d3.axisBottom().scale(xRange).tickFormat(function(d){
          return d;}).ticks(10),
  
      yAxis = d3.axisLeft().scale(yRange).tickFormat(function(d){
          return "$" + d;}).ticks(10);
    const titlePosition = { x:isMobile ? 0 : 200, y:0};
    this.createChartTitle(svgChart, 'Yearly Expenses Chart', titlePosition);
    svgChart.append("g").attr("transform", "translate(0," + (height) + ")").call(xAxis);
    svgChart.append("g").attr("transform", "translate(" + (MARGINS.left) + ",0)").call(yAxis);
    svgChart.style('padding-top', ()=>{
      return isMobile? 0 : '100px';
    });
    svgChart.append("path").datum(lineData).attr("d", d3.line()
    .x(function (d) {
      return xRange(service.fetch(d,0));
    })
    .y(function (d) {
      return yRange(service.fetch(d,1));
    }))
    .transition().duration(2000).attr("stroke", this.colors[0]).attr("stroke-width", 2).attr("fill", "none");
    //adding circle as points for line edges
    svgChart.selectAll('circle').data(lineData).enter().append('circle')
    .on('mouseover',function(d){
      select(this).attr('fill',service.colors[1]);
      service.displayTooltip(tooltip, this, d);
    })
    .on('mouseout',function(){
      select(this).attr('fill',service.colors[0]);
      service.hideTooltip(tooltip);
    })
    .transition().duration(2000).attr('fill',this.colors[0])
    .attr('cx', function(d){ return xRange(service.fetch(d,0))})
    .attr('cy', function(d){ return yRange(service.fetch(d,1))})
    .attr('r', function(d){ return '7'});
    //create a tooltip
    tooltip = this.createTooltip(svgChart); 

  }

  getChartCategories() {
    return this.chartCategories;
  }


}
