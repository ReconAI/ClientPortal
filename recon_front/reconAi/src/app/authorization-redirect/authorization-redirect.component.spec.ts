import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizationRedirectComponent } from './authorization-redirect.component';

describe('AuthorizationRedirectComponent', () => {
  let component: AuthorizationRedirectComponent;
  let fixture: ComponentFixture<AuthorizationRedirectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorizationRedirectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizationRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
