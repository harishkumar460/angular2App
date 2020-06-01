import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import {select, selectAll} from 'd3-selection';
import * as d3 from 'd3';
import { ChartService } from 'src/app/services/chart.service';

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
  data: Array<any>;
  constructor(private dbService: DbService,private chartService: ChartService) { }

  ngOnInit(): void {
    
   this.data = [{year:2011, value: 45},{year:2012, value: 47},
    {year:2013, value: 50},{year:2014, value: 55},
    {year:2015, value: 55},{year:2016, value: 50},
    {year:2017, value: 55},{year:2018, value: 65},
    {year:2019, value: 55},{year:2020, value: 75},
    {year:2021, value: 55},{year:2022, value: 85},
    {year:2023, value: 55},{year:2024, value: 95},
    {year:2025, value: 55},{year:2026, value: 105},
    {year:2027, value: 155},{year:2028, value: 305}];
    //this.chartService.createColumnChart(data2, '#d3-container');
    this.switchChart();
    select(window).on('resize',()=> {
      this.switchChart();
    });
  }

  switchChart() {
    const containerId = '#d3-container'; 
    select(containerId).html('');
    if (this.chartType==='bar') {
      this.chartService.createBarChart(this.data, containerId);
    } else {
      this.chartService.createColumnChart(this.data, containerId);
    }
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
