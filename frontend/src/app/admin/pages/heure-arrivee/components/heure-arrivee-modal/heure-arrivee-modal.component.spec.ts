import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeureArriveeModalComponent } from './heure-arrivee-modal.component';

describe('HeureArriveeModalComponent', () => {
  let component: HeureArriveeModalComponent;
  let fixture: ComponentFixture<HeureArriveeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeureArriveeModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeureArriveeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
