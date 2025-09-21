import { TestBed } from '@angular/core/testing';

import { YobanteService } from './yobante.service';

describe('YobanteService', () => {
  let service: YobanteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YobanteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
