import {
  attachCardRequestedAction,
  attachCardErrorAction,
} from './../../../store/user/user.actions';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { AppState } from 'app/store/reducers';
import { setAttachCardLoadingStatusAction } from 'app/store/loaders';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  stripe: any;
  apiKey = 'pk_test_HlgfbLYwgsv8TpEqvMnIrD7t00pF9QFP65';

  constructor(private store: Store<AppState>) {
    this.stripe = Stripe(this.apiKey);
  }

  createPaymentMethod(...args) {
    return this.stripe.createPaymentMethod(...args);
  }

  async createPaymentCardMethod(card) {
    this.store.dispatch(
      setAttachCardLoadingStatusAction({
        status: true,
      })
    );

    const { paymentMethod, error } = await this.stripe.createPaymentMethod(
      'card',
      card
    );

    if (paymentMethod) {
      this.store.dispatch(
        attachCardRequestedAction({
          method: {
            paymentMethod: paymentMethod.id,
          },
        })
      );
    }

    if (error) {
      // it's used when we're not going to be at effects
      this.store.dispatch(
        setAttachCardLoadingStatusAction({
          status: false,
        })
      );

      this.store.dispatch(attachCardErrorAction());
    }
  }

  elements() {
    return this.stripe.elements();
  }
}
