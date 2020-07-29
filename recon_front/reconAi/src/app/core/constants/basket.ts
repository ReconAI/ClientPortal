export interface BasketLocalStorageInterface {
  [key: number]: string;
}

export interface DecryptedLineBasketInterface {
  [key: number]: string;
}

export interface DecryptedBasketInterface {
  [key: number]: {
    [key: number]: string;
  };
}
