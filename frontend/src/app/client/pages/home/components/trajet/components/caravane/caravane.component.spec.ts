import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaravaneComponent } from './caravane.component';

describe('CaravaneComponent', () => {
  let component: CaravaneComponent;
  let fixture: ComponentFixture<CaravaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaravaneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaravaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
