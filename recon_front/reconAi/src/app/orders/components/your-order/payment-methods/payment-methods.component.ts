import { Observable } from 'rxjs';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PaymentMethodsComponentInterface } from 'app/constants/types/card';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'recon-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.less'],
})
export class PaymentMethodsComponent implements OnInit {
  @Input() possiblePayments: PaymentMethodsComponentInterface[] = [];
  @Input() defaultCardId: string = null;

  @Output() selectPayment$ = new EventEmitter<string>();

  paymentMethod = '';
  invoicingTooltip =
    'Your organization is not approved for that payment method';
  creditCardTooltip =
    'You have no credit cards attached. You must first add at least 1 card to your profile';
  constructor() {}

  ngOnInit(): void {
    this.paymentMethod = this.defaultCardId;
  }

  selectPayment({ value }: MatRadioChange): void {
    this.selectPayment$.emit(value);
  }
}
