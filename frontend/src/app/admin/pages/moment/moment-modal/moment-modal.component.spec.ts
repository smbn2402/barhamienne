import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MomentModalComponent } from './moment-modal.component';

describe('MomentModalComponent', () => {
  let component: MomentModalComponent;
  let fixture: ComponentFixture<MomentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MomentModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MomentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
