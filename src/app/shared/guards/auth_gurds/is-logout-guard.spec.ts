import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { isLogoutGuard } from './is-logout-guard';

describe('isLogoutGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => isLogoutGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
