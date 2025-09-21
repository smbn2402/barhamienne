import { TestBed } from '@angular/core/testing';

import { ArriveeService } from './arrivee.service';

describe('ArriveeService', () => {
  let service: ArriveeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArriveeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
