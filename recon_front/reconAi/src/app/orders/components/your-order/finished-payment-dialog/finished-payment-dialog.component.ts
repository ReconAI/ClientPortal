import { Router } from '@angular/router';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BasketPaymentSucceededInterface } from 'app/store/orders/orders.server.helpers';

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
export class FinishedPaymentDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: FinishedPaymentDialogDataInterface,
    private router: Router
  ) {}

  ngOnInit(): void {}

  navigateToOrderPortal(): void {
    if (this.data.succeeded) {
      this.router.navigate(['orders']);
    }
  }
}
