export interface BasketLocalStorageInterface {
  [key: number]: string;
}

export interface DecryptedLineBasketInterface {
  [key: number]: number;
}

export interface DecryptedBasketInterface {
  [key: number]: {
    [key: number]: number;
  };
}
