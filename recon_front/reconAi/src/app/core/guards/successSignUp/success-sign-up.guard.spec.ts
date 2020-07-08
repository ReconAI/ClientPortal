import { TestBed } from '@angular/core/testing';

import { SuccessSignUpGuard } from './success-sign-up.guard';

describe('SuccessSignUpGuard', () => {
  let guard: SuccessSignUpGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SuccessSignUpGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
