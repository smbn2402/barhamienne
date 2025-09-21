import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaravaneStatsComponent } from './caravane-stats.component';

describe('CaravaneStatsComponent', () => {
  let component: CaravaneStatsComponent;
  let fixture: ComponentFixture<CaravaneStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaravaneStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaravaneStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
