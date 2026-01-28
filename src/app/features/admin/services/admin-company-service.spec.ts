
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';

import { AdminCompanyService } from './admin-company-service';

describe('AdminCompanyService', () => {
  let service: AdminCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ],});
    service = TestBed.inject(AdminCompanyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
