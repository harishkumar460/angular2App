import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommonService{
  selectedExpenseSet: [] = [];
  selectedDay: any;
  constructor(private http: HttpClient) { }
  getApi() { 
   this.http.get('https://shiv-app.herokuapp.com/login-page-content').subscribe(res=> {
     console.log('res is '+res);
   });
  }

  getOptionsList() : Array<any> {
    const list= [
      {id: 'edit-view', label: 'Edit/View Daily Expenses', icon: 'fa-edit', navLink:'/add-expenses'},
      {id: 'view-daily', label: 'View Daily Expenses', icon: 'fa-file-text-o', navLink:'/dailyexpensesview'},
      {id: 'view-monthly', label: 'View Monthly Expenses', icon: 'fa-pie-chart', navLink:'/monthlyexpensesview'},
      {id: 'view-yearly', label: 'View Yearly Expenses', icon: 'fa-pie-chart', navLink:'/yearlyexpensesview'},
      {id: 'settings', label: 'Settings', icon: 'fa-cogs', navLink:'/settings'}
    ];
    return list;
  }

  getTotalAmount(expenseSet: Array<any>) {
    let totalAmount = 0;
    expenseSet.forEach((expense) => {
     totalAmount += expense.amount;
    });
    return totalAmount;
   }

   getChartData() {
     return [{year:2011, expenses: 45},{year:2012, expenses: 47},
      {year:2013, expenses: 50},{year:2014, expenses: 55},
      {year:2015, expenses: 55},{year:2016, expenses: 50},
      {year:2017, expenses: 55},{year:2018, expenses: 65},
      {year:2019, expenses: 55},{year:2020, expenses: 75},
      {year:2021, expenses: 55},{year:2022, expenses: 85},
      {year:2023, expenses: 55},{year:2024, expenses: 95},
      {year:2025, expenses: 55},{year:2026, expenses: 105},
      {year:2027, expenses: 155},{year:2028, expenses: 305}];
   }
}
