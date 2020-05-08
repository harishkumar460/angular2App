import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirstComponent } from './first/first.component';
import { SecondComponent } from './second/second.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AddExpensesComponent } from './add-expenses/add-expenses.component';



@NgModule({
  declarations: [FirstComponent, SecondComponent, AddExpensesComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [SecondComponent]
})
export class FeatureModule { }
