export interface CardServerInterface {
  id: string;
  card: {
    brand: string;
    exp_month: number;
    exp_year: number;
    last4: string;
  };
}

export interface CardClientInterface {
  id: string;
  brand: string;
  expired: string;
  last4: string;
}

export interface PaymentMethodsComponentInterface {
  value: string;
  label: string;
}
