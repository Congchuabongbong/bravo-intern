import { TestBed } from '@angular/core/testing';

import { DestroyServiceService } from './destroy-service.service';

describe('DestroyServiceService', () => {
  let service: DestroyServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DestroyServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
