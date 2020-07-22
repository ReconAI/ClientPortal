import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  stripe: any;
  apiKey = 'pk_test_HlgfbLYwgsv8TpEqvMnIrD7t00pF9QFP65';

  constructor() {
    this.stripe = Stripe(this.apiKey);
  }

  createPaymentMethod(...args) {
    return this.stripe.createPaymentMethod(...args);
  }

  async createPaymentCardMethod(card) {
    const { paymentMethod, error } = await this.stripe.createPaymentMethod(
      'card',
      card
    );

    if (paymentMethod) {
      console.log(paymentMethod, 'PM');
    }

    if (error) {
      console.error(error);
    }
  }

  elements() {
    return this.stripe.elements();
  }
}
