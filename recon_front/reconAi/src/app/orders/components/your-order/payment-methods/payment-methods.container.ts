import { map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { PaymentMethodsComponentInterface } from 'app/constants/types/card';
import { AppState } from 'app/store/reducers';
import { Observable } from 'rxjs';
import { selectUserCards } from 'app/store/user/user.selectors';
import { selectUserCardsLoadingStatus } from 'app/store/loaders/loaders.selectors';

@Component({
  selector: 'recon-payment-methods-container',
  templateUrl: './payment-methods.container.html',
})
export class PaymentMethodsContainer implements OnInit {
  constructor(private store: Store<AppState>) {}
  possiblePayments$: Observable<
    PaymentMethodsComponentInterface[]
  > = this.store.pipe(
    select(selectUserCards),
    map((cards) =>
      cards.map((card) => ({
        label: `**** **** **** ${card.last4}`,
        value: card.id,
      }))
    ),
    map((cards) => [
      { label: 'Invoicing account', value: 'invoicing_account' },
      ...cards,
    ])
  );

  @Output() selectPayment$ = new EventEmitter<string>();

  loadingStatus$: Observable<boolean> = this.store.pipe(
    select(selectUserCardsLoadingStatus)
  );

  selectPayment(value: string): void {
    this.selectPayment$.emit(value);
  }

  ngOnInit(): void {}
}
