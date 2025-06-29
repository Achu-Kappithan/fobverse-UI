import { TestBed } from '@angular/core/testing';

import { AuthCompanyService } from './auth.company.service';

describe('AuthCompanyService', () => {
  let service: AuthCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthCompanyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
