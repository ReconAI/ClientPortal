import {
  selectSignUpTrialEndDate,
  selectSignUpType,
} from './../../../store/signUp/signUp.selectors';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AppState } from 'app/store/reducers';
import {
  resetSignUpAction,
  setIsSuccessSignUpOpenableStatusAction,
} from 'app/store/signUp';
import { INVITATION_SIGN_UP } from 'app/constants/signUp';
import moment from 'moment';
@Component({
  selector: 'recon-registration-success',
  templateUrl: './registration-success.component.html',
  styleUrls: ['./registration-success.component.less'],
})
export class RegistrationSuccessComponent implements OnInit, OnDestroy {
  readonly INVITATION_TYPE = INVITATION_SIGN_UP;
  trialEndDate: string;

  constructor(private store: Store<AppState>, private router: Router) {}

  trialEndDate$: Observable<string> = this.store.pipe(
    select(selectSignUpTrialEndDate)
  );
  trialEndDateSubscription$: Subscription;
  type$: Observable<string> = this.store.pipe(select(selectSignUpType));

  ngOnInit(): void {
    this.trialEndDateSubscription$ = this.trialEndDate$.subscribe(
      (trialEnd) => {
        this.trialEndDate = trialEnd;
      }
    );
  }

  ngOnDestroy(): void {
    // TO DO:
    // check if we need reset
    // this.store.dispatch(resetSignUpAction());
    this.store.dispatch(
      setIsSuccessSignUpOpenableStatusAction({
        status: false,
      })
    );

    this.trialEndDateSubscription$.unsubscribe();
  }

  goOrderClick(): void {
    this.router.navigate(['/orders']);
  }
}
