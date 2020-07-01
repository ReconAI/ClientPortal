import {
  preSignUpUserRequestedAction,
  resetPreSignUpUserErrorAction,
} from './../../../store/signUp/signUp.actions';
import { selectPreSignUpLoadingStatus } from './../../../store/loaders/loaders.selectors';
import { Observable } from 'rxjs';
import { PreSignUpInterface } from './../../../store/signUp/signUp.server.helpers';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from 'app/store/reducers';
import { Store, select } from '@ngrx/store';
import { selectPreSignUpError } from 'app/store/signUp/signUp.selectors';

@Component({
  selector: 'recon-sign-up-form-container',
  templateUrl: './sign-up-form.container.html',
})
export class SignUpFormContainer implements OnInit, OnDestroy {
  constructor(private store: Store<AppState>) {}

  loadingStatus$: Observable<boolean> = this.store.pipe(
    select(selectPreSignUpLoadingStatus)
  );

  preSignUpError$: Observable<string> = this.store.pipe(
    select(selectPreSignUpError)
  );

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.store.dispatch(resetPreSignUpUserErrorAction());
  }

  clickSubmit(user: PreSignUpInterface): void {
    this.store.dispatch(preSignUpUserRequestedAction(user));
  }
}
