import { TestBed } from '@angular/core/testing';

import { DepartService } from './depart.service';

describe('DepartService', () => {
  let service: DepartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
