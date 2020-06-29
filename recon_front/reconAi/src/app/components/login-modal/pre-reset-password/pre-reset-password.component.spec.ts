import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreResetPasswordComponent } from './pre-reset-password.component';

describe('PreResetPasswordComponent', () => {
  let component: PreResetPasswordComponent;
  let fixture: ComponentFixture<PreResetPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreResetPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
