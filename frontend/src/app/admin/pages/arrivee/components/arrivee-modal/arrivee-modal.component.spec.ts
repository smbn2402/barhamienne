import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArriveeModalComponent } from './arrivee-modal.component';

describe('ArriveeModalComponent', () => {
  let component: ArriveeModalComponent;
  let fixture: ComponentFixture<ArriveeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArriveeModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArriveeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
