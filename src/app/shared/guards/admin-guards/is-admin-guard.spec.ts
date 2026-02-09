
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { isAdminGuard } from './is-admin-guard';


describe('isAdminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => isAdminGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ],});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
