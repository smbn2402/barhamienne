import { TestBed } from '@angular/core/testing';

import { CaravaneService } from './caravane.service';

describe('CaravaneService', () => {
  let service: CaravaneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaravaneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
