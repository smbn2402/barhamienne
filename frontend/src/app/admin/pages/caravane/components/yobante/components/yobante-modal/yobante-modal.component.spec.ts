import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YobanteModalComponent } from './yobante-modal.component';

describe('YobanteModalComponent', () => {
  let component: YobanteModalComponent;
  let fixture: ComponentFixture<YobanteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YobanteModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YobanteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
