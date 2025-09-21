import { TestBed } from '@angular/core/testing';

import { SmsLogService } from './sms-log.service';

describe('SmsLogService', () => {
  let service: SmsLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmsLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
