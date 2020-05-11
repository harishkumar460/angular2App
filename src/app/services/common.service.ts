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
}
