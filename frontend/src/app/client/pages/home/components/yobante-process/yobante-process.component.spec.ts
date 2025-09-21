import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YobanteProcessComponent } from './yobante-process.component';

describe('YobanteProcessComponent', () => {
  let component: YobanteProcessComponent;
  let fixture: ComponentFixture<YobanteProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YobanteProcessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YobanteProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
