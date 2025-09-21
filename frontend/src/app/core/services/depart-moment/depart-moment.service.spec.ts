import { TestBed } from '@angular/core/testing';

import { DepartMomentService } from './depart-moment.service';

describe('DepartMomentService', () => {
  let service: DepartMomentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepartMomentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
