import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import {select, selectAll} from 'd3-selection';
import * as d3 from 'd3';
import { ChartService } from 'src/app/services/chart.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-view-daily-expenses',
  templateUrl: './view-daily-expenses.component.html',
  styleUrls: ['./view-daily-expenses.component.less']
})
export class ViewDailyExpensesComponent implements OnInit {

  selectedDate: string;
  expenseset: Array<any>;
  totalAmount: number;
  chartData: any;
  commonChartData: any;
  noRecordsFound: boolean;
  chartType: string = 'column';
  data: Array<any>;
  chartConfig: any;
  chartCategories: Array<string>;
  constructor(private dbService: DbService,private chartService: ChartService,
              private commonService: CommonService) { }

  ngOnInit(): void { 
   this.data = this.commonService.getChartData();
   this.chartCategories = this.chartService.getChartCategories();
   this.chartConfig = {type:this.chartType, title:'Yearly expenses Chart', xAxisLabel: 'Expense Years',
                        yAxisLabel: 'Expenses amount'}
   this.chartService.initChart('#d3-container', this.data, this.chartConfig);
  }
   
  switchChart() {
    this.chartConfig.type = this.chartType;
    this.chartService.initChart('#d3-container', this.data, this.chartConfig);
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
        this.expenseset = dataSet && dataSet.expenseset?dataSet.expenseset:[];
        this.totalAmount = dataSet?dataSet.totalAmount:0;
       // this.chartData = this.chartService.prepareChartData(this.expenseset);
       // this.commonChartData = this.chartService.commonChartData;
        console.log('chart data '+JSON.stringify(this.chartData));
        console.log('common chart data '+JSON.stringify(this.commonChartData));
        this.noRecordsFound=this.expenseset.length<1;
        console.log('actual '+JSON.stringify(this.expenseset));
    }else{
        //plugins.showToast('Error in data fetch operation!');
        alert('Error in data fetch operation!');
    }
        });
}

}
