
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';

import { AdminCandidate } from './admin-candidate';

describe('AdminCandidate', () => {
  let service: AdminCandidate;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ],});
    service = TestBed.inject(AdminCandidate);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
