import { Directive, ElementRef, HostListener, HostBinding, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appInput]'
})
export class InputDirective {

  constructor(
    private templateRef: TemplateRef<any>, private viewContainerRef: ViewContainerRef) { 
    console.log('directive init');
  }
  @Input() set appInput(val) {
    console.log('input value '+val);
    if (val) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
    else {
      this.viewContainerRef.clear();
    }
  }
 // @Input() test: string;
  @HostListener('keypress',['$event'])
  onKeyPress(event){
   console.log('event '+event);
   //return event.preventDefault(); // to restrict input
  }
  //@HostBinding('type') modelOptions;

  ngOnInit() {
  //  this.modelOptions = 'text';
    //console.log('model options '+this.modelOptions);
    //console.log('test param '+this.test);
  }

}
