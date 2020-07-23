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
  invoicingTooltip = 'Your organization is not approved for that payment method';
  constructor() {}

  ngOnInit(): void {}
}
