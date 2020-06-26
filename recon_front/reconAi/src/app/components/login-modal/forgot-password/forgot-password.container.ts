import { selectPreResetPasswordError } from './../../../store/user/user.selectors';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { PreResetPasswordRequestInterface } from 'app/store/user/user.server.helpers';
import { AppState } from 'app/store/reducers';
import { preResetPasswordRequestedAction } from 'app/store/user';

@Component({
  selector: 'recon-forgot-password-container',
  templateUrl: './forgot-password.container.html',
})
export class ForgotPasswordContainer implements OnInit {
  preResetError$: Observable<string> = this.store.pipe(
    select(selectPreResetPasswordError)
  );
  constructor(private store: Store<AppState>) {}
  ngOnInit(): void {}

  sendEmail(data: PreResetPasswordRequestInterface): void {
    this.store.dispatch(preResetPasswordRequestedAction(data));
  }
}
