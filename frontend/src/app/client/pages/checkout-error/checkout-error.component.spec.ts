import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutErrorComponent } from './checkout-error.component';

describe('CheckoutErrorComponent', () => {
  let component: CheckoutErrorComponent;
  let fixture: ComponentFixture<CheckoutErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutErrorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
