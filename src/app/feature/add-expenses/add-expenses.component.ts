import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-add-expenses',
  templateUrl: './add-expenses.component.html',
  styleUrls: ['./add-expenses.component.less']
})
export class AddExpensesComponent implements OnInit {

  currentDate: string;

  expenseSet: any;
  constructor(private router: Router,private dbService: DbService) { }
 
  ngOnInit(): void {
   this.currentDate = this.getCurrentDate();
   this.expenseSet  = [this.getExpenseTemplate()];  
  }
  private getExpenseTemplate() {
   return {id: '', name: '', amount: 0, defaults: false, saved: false }
  }

  addNewExpense(): void {
    this.expenseSet.push(this.getExpenseTemplate()); 
  }

  getCurrentDate() {
   let date = new Date();
   let month = date.getMonth()+1;
   return (date.getDate()<10?'0'+date.getDate():date.getDate()) +'/'+(month<10?'0'+month:month)+'/'+date.getFullYear(); 
  }
 
  getMonthYear(date: Date) {
    var month = date.getMonth()+1;
    var year = date.getFullYear();
    return month+'_'+year;
  }

  markSaved(expenseSet) {
   expenseSet.forEach(expense=>expense.saved=true); 
    return expenseSet;
  }
  
  checkDefaults() {
    let defaultsInfo = this.dbService.getInfo('defaultExpenses');
    defaultsInfo= defaultsInfo ? JSON.parse(defaultsInfo) : null;
    this.expenseSet = (defaultsInfo && defaultsInfo.length) && 
    !this.expenseSet.length ? defaultsInfo: this.expenseSet;   
  }

  backToHome() {
    this.router.navigate(['']);
  }

  deleteExpense(index): void {
  if(this.expenseSet[index].saved){
   //commonService.showConfirmModal(function(res){
  //if(res){
      this.expenseSet.splice(index,1);
     // this.storeExpense();
 // } 
  //    });
   } else {
    this.expenseSet.splice(index,1);  
      }
  } 

  fetchDetails() {
    // let defaults=[];
    // if(commonService.selectedExpenseSet.length){
    // $scope.expenseSet=angular.copy(commonService.selectedExpenseSet);
    // actualDate=new Date(angular.copy(commonService.selectedDay));
    // $scope.selectedDate=showCurrentDate(actualDate);
    // commonService.selectedExpenseSet=[];
    // commonService.selectedDay='';
    // return;
    //   }else if(commonService.selectedDay){
    // actualDate=new Date(angular.copy(commonService.selectedDay));
    // $scope.selectedDate=showCurrentDate(actualDate);
    // commonService.selectedDay='';
    //   } 
    //   dbService.openIndexDB($scope.selectedDate,{action:'read',searchBy:'key'},function(status,dataSet){
    // if(status){
    //   console.log('dataSet '+JSON.stringify(dataSet)); 
    //   // plugins.showToast('Information fetched successfully!');
    //     $scope.expenseSet=dataSet && dataSet.expenseSet?dataSet.expenseSet:(defaults?defaults:[]);
    //     checkDefaults();
    //     $scope.$apply();
    //     console.log('actual '+JSON.stringify($scope.expenseSet));
    // }else{
    //     plugins.showToast('Error in data fetch operation!');
    // }
    //     });
  }

}
