import { TestBed } from '@angular/core/testing';

import { CompanyApplication } from './company-application';

describe('CompanyApplication', () => {
  let service: CompanyApplication;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyApplication);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
