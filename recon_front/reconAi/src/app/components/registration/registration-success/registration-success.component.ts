import {
  selectSignUpDaysLeft,
  selectSignUpType,
} from './../../../store/signUp/signUp.selectors';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AppState } from 'app/store/reducers';
import {
  resetSignUpAction,
  setIsSuccessSignUpOpenableStatusAction,
} from 'app/store/signUp';
import { INVITATION_SIGN_UP } from 'app/constants/signUp';

@Component({
  selector: 'recon-registration-success',
  templateUrl: './registration-success.component.html',
  styleUrls: ['./registration-success.component.less'],
})
export class RegistrationSuccessComponent implements OnInit, OnDestroy {
  readonly INVITATION_TYPE = INVITATION_SIGN_UP;

  constructor(private store: Store<AppState>, private router: Router) {}

  daysLeft$: Observable<number> = this.store.pipe(select(selectSignUpDaysLeft));
  type$: Observable<string> = this.store.pipe(select(selectSignUpType));

  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.store.dispatch(
      setIsSuccessSignUpOpenableStatusAction({
        status: false,
      })
    );
  }

  goOrderClick(): void {
    this.router.navigate(['/orders']);
  }
}
