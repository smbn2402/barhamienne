import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationStatsComponent } from './reservation-stats.component';

describe('ReservationStatsComponent', () => {
  let component: ReservationStatsComponent;
  let fixture: ComponentFixture<ReservationStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
