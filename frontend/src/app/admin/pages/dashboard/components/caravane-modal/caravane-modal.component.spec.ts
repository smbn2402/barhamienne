import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaravaneModalComponent } from './caravane-modal.component';

describe('CaravaneModalComponent', () => {
  let component: CaravaneModalComponent;
  let fixture: ComponentFixture<CaravaneModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaravaneModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaravaneModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
