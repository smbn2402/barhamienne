import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaravaneCalendarComponent } from './caravane-calendar.component';

describe('CaravaneCalendarComponent', () => {
  let component: CaravaneCalendarComponent;
  let fixture: ComponentFixture<CaravaneCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaravaneCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaravaneCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
