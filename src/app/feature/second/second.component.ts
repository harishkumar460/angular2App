import { Component, OnInit, ContentChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-second',
  templateUrl: './second.component.html',
  styleUrls: ['./second.component.less']
})
export class SecondComponent implements OnInit {

  constructor() { }
  @ContentChild('contentSection') contentSec : ElementRef; 
   ngOnInit() {
   }
  ngAfterContentInit() {
   console.log('content is '+this.contentSec); 
  }
  checkChildMethod() {
    console.log('child method invoked from parent');
  }

}
