import { loadBasketOverviewRequestedAction } from './../../../../store/orders/orders.actions';
import { Router } from '@angular/router';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store/reducers';

export interface FinishedPaymentDialogDataInterface {
  id?: string;
  succeeded: boolean;
  message: string;
}

@Component({
  selector: 'recon-finished-payment-dialog',
  templateUrl: './finished-payment-dialog.component.html',
  styleUrls: ['./finished-payment-dialog.component.less'],
})
export class FinishedPaymentDialogComponent implements OnInit, OnDestroy {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: FinishedPaymentDialogDataInterface,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {}

  navigateToOrderPortal(): void {
    if (this.data.succeeded) {
      this.router.navigate(['orders']);
    }
  }

  ngOnDestroy(): void {
    if (this.data.succeeded) {
      this.store.dispatch(loadBasketOverviewRequestedAction());
    }
  }
}
