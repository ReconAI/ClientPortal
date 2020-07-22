import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'recon-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.less'],
})
export class PaymentMethodsComponent implements OnInit {
  @Input() possiblePayments = [
    {
      title: 'Invoicing account',
      value: 'invoicing_account',
    },
    {
      title: 'Credit card **** **** **** 3321',
      value: '3321',
    },
    {
      title: 'Credit card **** **** **** 5234',
      value: '5234',
    },
    {
      title: 'Credit card **** **** **** 4125',
      value: '4125',
    },
  ];
  paymentMethod = 1;
  constructor() {}

  ngOnInit(): void {}
}
