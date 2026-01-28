
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';

import { CompanyApplication } from './company-application';

describe('CompanyApplication', () => {
  let service: CompanyApplication;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ],});
    service = TestBed.inject(CompanyApplication);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
