import { TestBed } from '@angular/core/testing';

import { ArriveeMomentService } from './arrivee-moment.service';

describe('ArriveeMomentService', () => {
  let service: ArriveeMomentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArriveeMomentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
