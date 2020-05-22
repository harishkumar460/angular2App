import { Component, OnInit, HostListener, HostBinding } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-first',
  templateUrl: './first.component.html',
  styleUrls: ['./first.component.less']
})
export class FirstComponent implements OnInit {
  testForm: FormGroup;
  optionsList: Array<any>;
  constructor(private formBuilder: FormBuilder,
    private router: Router, private commonService: CommonService,
    private dbService: DbService) { 
    this.createForm();
    this.optionsList = this.commonService.getOptionsList();
  }
  @HostListener('click')
  onClick(){
   console.log('host element clicked');
  };
  @HostBinding('style.border') hostStyle; 
  
  ngOnInit() {
    this.dbService.createDatabase();
    this.commonService.selectedExpenseSet = [];
    this.hostStyle='solid 2px';
    console.log('host style '+this.hostStyle);
  }
  createForm() {
   this.testForm = this.formBuilder.group({
      firstName: ['',Validators.required],
      lastName: [''],
      age: [''],
      address: this.formBuilder.group({
         address: [''],
         zipCode: [''],
         city: ['']
      })    
   }); 
  }

  submitForm() {
   console.log('form data '+this.testForm.value);
  }

}
