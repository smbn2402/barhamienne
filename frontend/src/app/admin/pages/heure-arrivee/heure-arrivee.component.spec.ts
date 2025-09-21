import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeureArriveeComponent } from './heure-arrivee.component';

describe('HeureArriveeComponent', () => {
  let component: HeureArriveeComponent;
  let fixture: ComponentFixture<HeureArriveeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeureArriveeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeureArriveeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
