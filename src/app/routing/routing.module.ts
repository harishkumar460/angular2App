import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router'; 
import { FirstComponent } from '../feature/first/first.component';
import { AddExpensesComponent } from '../feature/add-expenses/add-expenses.component';
import { ViewDailyExpensesComponent } from '../feature/view-daily-expenses/view-daily-expenses.component';
const routes: Routes = [
  {path:'', component: FirstComponent},
  {path:'add-expenses', component: AddExpensesComponent},
  {path:'dailyexpensesview', component: ViewDailyExpensesComponent},
  {path:'submodule', loadChildren: ()=> { 
    return import('src/app/subfeature/subfeature.module').then(m=> m.SubfeatureModule);
   }
  }
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ]
})
export class RoutingModule { }
