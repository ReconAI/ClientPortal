import { selectUserCardsLoadingStatus } from './../../../store/loaders/loaders.selectors';
import { map } from 'rxjs/operators';
import { selectUserCards } from './../../../store/user/user.selectors';
import { Store, select } from '@ngrx/store';
import { Component, OnInit, Input } from '@angular/core';
import { PaymentMethodsComponentInterface } from 'app/constants/types/card';
import { AppState } from 'app/store/reducers';
import { Observable } from 'rxjs';

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

  loadingStatus$: Observable<boolean> = this.store.pipe(
    select(selectUserCardsLoadingStatus)
  );

  ngOnInit(): void {}
}
