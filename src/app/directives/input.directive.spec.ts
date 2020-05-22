import { InputDirective } from './input.directive';
import { ElementRef, Component, DebugElement } from '@angular/core';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';


@Component({
  template:'<input type="number" *appInput="true"/>'
})
 
class DummyComponent {

}
describe('InputDirective', () => {
  let component: DummyComponent;
  let fixture: ComponentFixture<DummyComponent>;
  let directive: DebugElement;
  // beforeEach(async(()=>{
  //   console.log('first before each');
  //   TestBed.configureTestingModule({
  //     declarations: [InputDirective,DummyComponent]
  //   }).compileComponents();
  // }));
  beforeEach(()=>{
    console.log('second before each');
    TestBed.configureTestingModule({
      declarations: [InputDirective,DummyComponent]
    });
    fixture = TestBed.createComponent(DummyComponent);
    component =  fixture.componentInstance;
   // directive =  fixture.debugElement.query(By.css('input'));
    fixture.detectChanges();
  });
  it('should create an instance', () => {
    directive =  fixture.debugElement.query(By.css('input'));
    directive.triggerEventHandler('keypress',['$event']);
    fixture.detectChanges();
    expect(directive.nativeElement.type).toBe('number');
  });
});
