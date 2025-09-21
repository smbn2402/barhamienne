import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YobanteComponent } from './yobante.component';

describe('YobanteComponent', () => {
  let component: YobanteComponent;
  let fixture: ComponentFixture<YobanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YobanteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YobanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
