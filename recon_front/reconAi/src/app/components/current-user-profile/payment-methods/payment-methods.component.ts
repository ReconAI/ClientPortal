import { Component, OnInit, Input } from '@angular/core';
import { PaymentMethodsComponentInterface } from 'app/constants/types/card';

@Component({
  selector: 'recon-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.less'],
})
export class PaymentMethodsComponent implements OnInit {
  @Input() possiblePayments: PaymentMethodsComponentInterface[] = [];
  paymentMethod = '';
  constructor() {}

  ngOnInit(): void {
    this.paymentMethod = this.possiblePayments?.length
      ? this.possiblePayments[0]?.value
      : '';
  }
}
