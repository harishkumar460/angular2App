import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import {select, selectAll} from 'd3-selection';
import * as d3 from 'd3';

@Component({
  selector: 'app-view-daily-expenses',
  templateUrl: './view-daily-expenses.component.html',
  styleUrls: ['./view-daily-expenses.component.less']
})
export class ViewDailyExpensesComponent implements OnInit {

  selectedDate: string;
  expenseSet: Array<any>;
  totalAmount: number;
  chartData: any;
  commonChartData: any;
  noRecordsFound: boolean;
  chartType: string = 'bar';
  constructor(private dbService: DbService) { }

  ngOnInit(): void {
    const data= [100, 400, 300, 900, 850,700,450,500,670,560,230, 475,1000];
  // this.createBarChart(data, this.chartType);
    this.createColumnChart(data);
    select(window).on('resize',this.createColumnChart);
  }

  switchChart() { //[5,10,12,15,20,25,30,35,40]
    const data= [100, 400, 300, 900, 850,700, 450,500,670,560,230,475,1000];
    select('#d3-container').html('');
    this.createBarChart(data, this.chartType);
  }

   createBarChart(data, chart = 'bar') {
    const scaleFactor =10, barHeight=40;
    const isBarChart = chart === 'bar';
    const scale = d3.scaleLinear().domain([d3.min(data), d3.max(data)]).range([50,460]);
    let svgChart = select('#d3-container').append('svg')
    .attr('width','500').attr('height', 2*barHeight * data.length);

    let bar = svgChart.selectAll('g').data(data)
    .enter().append('g').attr('transform', (d,i) => {
      return 'translate(0,'+(i*barHeight+(6*i))+')';
    });

     bar.append('rect')
     .attr('width', '20')
     .attr('height', barHeight-1)
     .attr('fill','orange')
     .on('mouseover', function() {
       select(this).attr('fill','green');
     })
     .on('mouseout', function(){
       select(this).attr('fill','orange');
     });

     bar.append('text')
     .attr('x', (d)=> {
       return scale(d);
     })
     .attr('y', barHeight/2)
     .attr('dy', '.35em')
     .text((d)=> {return d;});
     if (!isBarChart) {
      svgChart.style('transform', 'rotate(-90deg)');
      svgChart.selectAll('text').attr('transform', (d,i)=>{
        return 'rotate(90 '+(scale(d)+5)+' 26)';
      });
     }
     svgChart.selectAll('rect')
     .transition()
     .ease(d3.easeLinear)
     .duration(1000)
     .attr('width', (d)=>{
      return scale(d);
    });
   }

   createColumnChart(data) {
    let container = select('#d3-container');
    container.html('');
    let containerWidth = container.node().clientWidth;//container.node().getBoundingClientRect();
    let containerHeight = container.node().clientHeight;
    let svgChart = container.append('svg')
    .attr('width', containerWidth)
    .attr('height',containerHeight);
    const isMobile = containerWidth < 650;
    const  margin = isMobile ? 0: 200;
    let width = containerWidth-margin, height = containerHeight-margin;
    let xScale = d3.scaleBand().range([0, width]).padding(0.4),
        yScale = d3.scaleLinear().range([height, 0]);

    let g = svgChart.append("g")
            .attr("transform", "translate(" + (isMobile? 30 : 100) + "," + (isMobile? -20 :100) + ")");

       data= [{year:2011, value: 45},{year:2012, value: 47},
             {year:2013, value: 50},{year:2014, value: 55},
             {year:2015, value: 55},{year:2016, value: 50},
             {year:2017, value: 55},{year:2018, value: 65},
             {year:2019, value: 55},{year:2020, value: 75},
             {year:2021, value: 55},{year:2022, value: 85},
             {year:2023, value: 55},{year:2024, value: 95},
             {year:2025, value: 55},{year:2026, value: 105}];

        xScale.domain(data.map(function(d) { return d.year; }));
        yScale.domain([0, d3.max(data, function(d) { return d.value; })]);

        g.append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(d3.axisBottom(xScale));

        g.append("g")
         .call(d3.axisLeft(yScale).tickFormat(function(d){
             return "$" + d;
         }).ticks(10));


        g.selectAll(".bar")
         .data(data).enter()
         .append('text')
          .attr('x', (d)=> {
            return xScale(d.year);
          })
          .attr('y', (d)=> {return yScale(d.value+3)})
          .attr('dy', '.35em')
          .text((d)=> {return d.value;});

          g.selectAll("rect").data(data).enter().append("rect")
         .attr("class", "bar").attr('fill','orange')
         .style('cursor','pointer')
         .attr("x", function(d) { return xScale(d.year); })
         .attr("y", function(d) { return yScale(0); })
         .attr("width", xScale.bandwidth())
         .transition()
         .duration(1000)
         .attr('y',function(d) { return yScale(d.value); })
         .attr('height', function(d) { return height - yScale(d.value);
         });

      svgChart.selectAll('rect')
      .on('mouseover', function() {
        select(this).attr('fill','green');
      })
      .on('mouseout', function(){
        select(this).attr('fill','orange');
      });
}
  prevMonth() {

  }

  nextMonth() {
    
  }

  selectMonth() {
    console.log('clicked month');
    document.getElementById('').click();
  }

  fetchDetails() {
    this.dbService.openIndexDB(this.selectedDate,{action:'read',searchBy:'key'},(status,dataSet)=>{
    if (status) {
        this.expenseSet = dataSet && dataSet.expenseSet?dataSet.expenseSet:[];
        this.totalAmount = dataSet?dataSet.totalAmount:0;
       // this.chartData = this.chartService.prepareChartData(this.expenseSet);
       // this.commonChartData = this.chartService.commonChartData;
        console.log('chart data '+JSON.stringify(this.chartData));
        console.log('common chart data '+JSON.stringify(this.commonChartData));
        this.noRecordsFound=this.expenseSet.length<1;
        console.log('actual '+JSON.stringify(this.expenseSet));
    }else{
        //plugins.showToast('Error in data fetch operation!');
        alert('Error in data fetch operation!');
    }
        });
}

}
