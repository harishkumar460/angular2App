import { Component, ViewChild, ViewContainerRef,AfterViewInit, ComponentFactoryResolver, ComponentRef, ContentChild, ElementRef } from '@angular/core';
import { FirstComponent } from './feature/first/first.component';
import { CommonService } from './services/common.service';
import { SecondComponent } from './feature/second/second.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements AfterViewInit{
  title = 'demoApp';
  dynamicComponent: FirstComponent;
  constructor(private componentFactoryResolver: ComponentFactoryResolver,
    private commonService: CommonService,
    private router: Router){}
  //@ViewChild('componentContainer', { read: ViewContainerRef }) componentContainer : ViewContainerRef;
  //@ViewChild('secondComponent') secondComponent : SecondComponent;
  ngAfterViewInit() {
    // const componentFactory = this.componentFactoryResolver.resolveComponentFactory(FirstComponent);
    // let componentRef = this.componentContainer.createComponent(componentFactory);
    // this.dynamicComponent = componentRef.instance;
  }

  ngOnInit() {
   this.commonService.getApi(); 
  }

  checkParent() {
   // this.secondComponent.checkChildMethod();
    this.router.navigate(['submodule']).then(navRes=> {
      console.log('navigation '+navRes);
  });
 }
}
