import { TestBed } from '@angular/core/testing';

import { AdminCompanyService } from './admin-company-service';

describe('AdminCompanyService', () => {
  let service: AdminCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminCompanyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
