import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeureDepartModalComponent } from './heure-depart-modal.component';

describe('HeureDepartModalComponent', () => {
  let component: HeureDepartModalComponent;
  let fixture: ComponentFixture<HeureDepartModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeureDepartModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeureDepartModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
