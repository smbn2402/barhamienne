import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeureDepartComponent } from './heure-depart.component';

describe('HeureDepartComponent', () => {
  let component: HeureDepartComponent;
  let fixture: ComponentFixture<HeureDepartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeureDepartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeureDepartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
