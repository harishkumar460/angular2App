import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  selectedDay: Date;
  constructor(private router: Router,private dbService: DbService,
    private commonService: CommonService) { }

  @ViewChild('datePicker', {static:false, read:ElementRef}) datePicker: ElementRef;

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

  nextDate() {
   this.manageDates('next');
   this.fetchDetails();
  }

  prevDate() {
      this.manageDates('prev');
      this.fetchDetails();
  }

  openDatePicker() {
      console.log('clicked date');
      //document.getElementById(id).click();
      this.datePicker.nativeElement.click();
  }

  setSelectedDay() {
    console.log('selected date value '+this.datePicker.nativeElement.value);
    let selectedDate = this.datePicker.nativeElement.value;
    selectedDate = selectedDate.indexOf('-') ? selectedDate.replace(/-/g,'/') : selectedDate;
    this.actualDate = new Date(selectedDate);
    this.currentDate = this.getCurrentDate(this.actualDate);
    this.fetchDetails();
  }
  
    manageDates(dateType: string) {
     let todayDate = this.actualDate;
     let datesInfo = this.getMonthDates(this.actualDate),newDate,newMonth,newYear;
     if (dateType === 'next') {
      const isLastDate = (this.actualDate.getDate()+1) > datesInfo.lastDate;
      const isLastMonth = (this.actualDate.getMonth()===11);
      if (isLastDate) {
        newMonth = isLastMonth ? 0 : (this.actualDate.getMonth()+1);
        newYear = isLastMonth ? (this.actualDate.getFullYear()+1) : this.actualDate.getFullYear();
        newDate = 1;
      } else {
          newDate = this.actualDate.getDate()+1;
          newMonth = this.actualDate.getMonth();
          newYear = this.actualDate.getFullYear();
      }
    } else {
        const isFirstDate = (this.actualDate.getDate()-1) < datesInfo.firstDate;
        const isFirstMonth = (this.actualDate.getMonth()===0);
        if (isFirstDate) {
          newMonth = isFirstMonth ? 11 : (this.actualDate.getMonth()-1);
          newYear = isFirstMonth ? (this.actualDate.getFullYear()-1) : this.actualDate.getFullYear();
          newDate = this.getMonthDates(new Date((newMonth+1)+'/'+'01/'+newYear)).lastDate;
        } else {
            newDate = this.actualDate.getDate()-1;
            newMonth = this.actualDate.getMonth();
            newYear = this.actualDate.getFullYear();
        }
      }
      todayDate.setDate(newDate);
      todayDate.setMonth(newMonth, newDate);
      todayDate.setFullYear(newYear, newMonth, newDate);
      this.actualDate = todayDate;
      this.currentDate = this.getCurrentDate(todayDate);  
  }

  getMonthDates(date) {
    var y = date.getFullYear(), m = date.getMonth();
    var firstDate = new Date(y, m, 1).getDate();
    var lastDate = new Date(y, m + 1, 0).getDate();  
    return {firstDate: firstDate, lastDate: lastDate};
 }

  checkDefaults() {
    let defaultsInfo = this.dbService.getInfo('defaultExpenses');
    defaultsInfo= defaultsInfo ? JSON.parse(defaultsInfo) : null;
    this.expenseSet = (defaultsInfo && defaultsInfo.length) && 
    !this.expenseSet.length ? defaultsInfo: this.expenseSet;   
  }

  storeExpense() {
      this.expenseSet = this.markSaved(this.expenseSet);
      const data = { date: this.currentDate,
          month_year: this.getMonthYear(this.actualDate),
          expenseSet: this.expenseSet,
          year: this.actualDate.getFullYear().toString(),
          totalAmount: this.commonService.getTotalAmount(this.expenseSet)
      };
      console.log('data input is '+JSON.stringify(data));
      this.dbService.openIndexDB(data,{action:'readwrite',searchBy:''},(status) => {
        if(status){
          //plugins.showToast('Information saved!'); 
          alert('Information saved!');   
        }
      });
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
    this.dbService.openIndexDB(this.currentDate,{action:'read',searchBy:'key'},(status,dataSet) => {
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
