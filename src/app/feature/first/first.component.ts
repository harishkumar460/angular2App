import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-first',
  templateUrl: './first.component.html',
  styleUrls: ['./first.component.less']
})
export class FirstComponent implements OnInit {
  testForm: FormGroup;
  optionsList: Array<any>;
  constructor(private formBuilder: FormBuilder,
    private router: Router, private commonService: CommonService) { 
    this.createForm();
    this.optionsList = this.commonService.getOptionsList();
  }
  
  ngOnInit() {
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
