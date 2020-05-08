import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SubComponent } from './sub/sub.component';

const routes: Routes = [
  {path:'', component: SubComponent}
];


@NgModule({
  declarations: [SubComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class SubfeatureModule { }
