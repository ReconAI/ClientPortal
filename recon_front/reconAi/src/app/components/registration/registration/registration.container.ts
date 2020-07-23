import { selectSignUpError } from './../../../store/signUp/signUp.selectors';
import { selectSignUpLoadingStatus } from './../../../store/loaders/loaders.selectors';
import { Store, select } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { AppState } from 'app/store/reducers';
import { UserProfileFormInterface } from 'app/constants/types';
import { signUpUserRequestedAction } from 'app/store/signUp';

@Component({
  selector: 'recon-registration',
  templateUrl: './registration.container.html',
  styleUrls: ['./registration.container.less'],
})
export class RegistrationContainer implements OnInit {
  constructor(private store: Store<AppState>) {}
  isLoading$ = this.store.pipe(select(selectSignUpLoadingStatus));
  errors$ = this.store.pipe(select(selectSignUpError));
  ngOnInit(): void {}

  signUpUser(user: UserProfileFormInterface): void {
    this.store.dispatch(signUpUserRequestedAction(user));
  }
}
