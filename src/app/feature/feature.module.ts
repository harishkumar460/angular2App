import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirstComponent } from './first/first.component';
import { SecondComponent } from './second/second.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AddExpensesComponent } from './add-expenses/add-expenses.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewDailyExpensesComponent } from './view-daily-expenses/view-daily-expenses.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [FirstComponent, 
                 SecondComponent, 
                 AddExpensesComponent, 
                 ViewDailyExpensesComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgbModule,
    SharedModule
  ],
  exports: [SecondComponent]
})
export class FeatureModule { }
