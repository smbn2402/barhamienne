import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateFormatComponent } from './date-format.component';

describe('DateFormatComponent', () => {
  let component: DateFormatComponent;
  let fixture: ComponentFixture<DateFormatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateFormatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
