import { TestBed } from '@angular/core/testing';

import { HandleStringService } from './handle-string.service';

describe('HandleStringService', () => {
  let service: HandleStringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HandleStringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
