import { TestBed } from '@angular/core/testing';

import { HttpReqFormatInterceptor } from './http-req-format.interceptor';

describe('HttpReqFormatInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HttpReqFormatInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: HttpReqFormatInterceptor = TestBed.inject(HttpReqFormatInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
