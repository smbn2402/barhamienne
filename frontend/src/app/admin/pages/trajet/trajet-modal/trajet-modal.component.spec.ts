import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrajetModalComponent } from './trajet-modal.component';

describe('TrajetModalComponent', () => {
  let component: TrajetModalComponent;
  let fixture: ComponentFixture<TrajetModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrajetModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrajetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
