import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AppState } from 'app/store/reducers';
import { resetSignUpAction } from 'app/store/signUp';

@Component({
  selector: 'recon-registration-success',
  templateUrl: './registration-success.component.html',
  styleUrls: ['./registration-success.component.less'],
})
export class RegistrationSuccessComponent implements OnInit, OnDestroy {
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.store.dispatch(resetSignUpAction());
  }
}
