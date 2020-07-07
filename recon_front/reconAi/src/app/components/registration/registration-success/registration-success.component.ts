import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AppState } from 'app/store/reducers';
import {
  resetSignUpAction,
  setIsSuccessSignUpOpenableStatusAction,
} from 'app/store/signUp';

@Component({
  selector: 'recon-registration-success',
  templateUrl: './registration-success.component.html',
  styleUrls: ['./registration-success.component.less'],
})
export class RegistrationSuccessComponent implements OnInit, OnDestroy {
  constructor(private store: Store<AppState>, private router: Router) {}

  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.store.dispatch(
      setIsSuccessSignUpOpenableStatusAction({
        status: false,
      })
    );
  }

  goOrderClick(): void {
    this.router.navigate(['/']);
  }
}
