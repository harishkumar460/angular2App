import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-add-expenses',
  templateUrl: './add-expenses.component.html',
  styleUrls: ['./add-expenses.component.less']
})
export class AddExpensesComponent implements OnInit {

  currentDate: string;
  actualDate: Date;
  expenseSet: any;
  constructor(private router: Router,private dbService: DbService,
    private commonService: CommonService) { }
 
  ngOnInit(): void {
   this.actualDate = new Date();
   this.currentDate = this.getCurrentDate(this.actualDate);
   this.expenseSet  = [this.getExpenseTemplate()];
   this.fetchDetails();  
  }
  private getExpenseTemplate() {
   return {id: '', name: '', amount: 0, defaults: false, saved: false }
  }

  addNewExpense(): void {
    this.expenseSet.push(this.getExpenseTemplate()); 
  }

  getCurrentDate(date: Date) {
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
    let defaults=[];
     if(this.commonService.selectedExpenseSet.length){
      this.expenseSet = [...this.commonService.selectedExpenseSet];
      this.actualDate = new Date({...this.commonService.selectedDay});
      this.currentDate = this.getCurrentDate(this.actualDate);
      this.commonService.selectedExpenseSet=[];
      this.commonService.selectedDay='';
      return;
    }else if(this.commonService.selectedDay){
      this.actualDate = new Date({...this.commonService.selectedDay});
      this.currentDate = this.getCurrentDate(this.actualDate);
      this.commonService.selectedDay='';
      } 
    this.dbService.openIndexDB(this.currentDate,{action:'read',searchBy:'key'},function(status,dataSet){
     if (status) {
      console.log('dataSet '+JSON.stringify(dataSet)); 
      // plugins.showToast('Information fetched successfully!');
      this.expenseSet=dataSet && dataSet.expenseSet?dataSet.expenseSet:(defaults?defaults:[]);
      this.checkDefaults();
      console.log('actual '+JSON.stringify(this.expenseSet));
     } else {
        // plugins.showToast('Error in data fetch operation!');
        alert('Error in data fetch operation!');
      }
      });
    }
}
