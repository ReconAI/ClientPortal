import { TestBed } from '@angular/core/testing';

import { IsPossibleToBuyGuard } from './is-possible-to-buy.guard';

describe('IsPossibleToBuyGuard', () => {
  let guard: IsPossibleToBuyGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsPossibleToBuyGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
