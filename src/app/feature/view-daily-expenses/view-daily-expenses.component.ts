import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { NumberValueAccessor } from '@angular/forms';

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
  constructor(private dbService: DbService) { }

  ngOnInit(): void {
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
