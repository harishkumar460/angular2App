import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDailyExpensesComponent } from './view-daily-expenses.component';

describe('ViewDailyExpensesComponent', () => {
  let component: ViewDailyExpensesComponent;
  let fixture: ComponentFixture<ViewDailyExpensesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDailyExpensesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDailyExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
