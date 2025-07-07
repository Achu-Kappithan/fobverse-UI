import { TestBed } from '@angular/core/testing';

import { AdminCandidate } from './admin-candidate';

describe('AdminCandidate', () => {
  let service: AdminCandidate;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminCandidate);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
