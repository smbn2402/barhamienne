import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArriveeComponent } from './arrivee.component';

describe('ArriveeComponent', () => {
  let component: ArriveeComponent;
  let fixture: ComponentFixture<ArriveeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArriveeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArriveeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
