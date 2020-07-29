import { updateBasketAmountAction } from './../../../store/user/user.actions';
import { Store } from '@ngrx/store';
import {
  BasketLocalStorageInterface,
  DecryptedBasketInterface,
  DecryptedLineBasketInterface,
} from './../../constants/basket';
import { LocalStorageService } from './../localStorage/local-storage.service';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppState } from 'app/store/reducers';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  constructor(
    private localStorageService: LocalStorageService,
    private snackBar: MatSnackBar,
    // basket service controls basket amount of user slice
    private store: Store<AppState>
  ) {}

  initBasketAmount = (userId: number) => {
    const basket = this.localStorageService.getBasketValue() || '';
    if (!basket[userId]) {
      this.store.dispatch(
        updateBasketAmountAction({
          amount: 0,
        })
      );
    }

    this.store.dispatch(
      updateBasketAmountAction({
        amount: this.countDevicesInLine(basket[userId]),
      })
    );
  };

  decrypt = (): DecryptedBasketInterface => {
    const basket = this.localStorageService.getBasketValue() || '';
    return Object.keys(basket).reduce(
      (res, userId) => ({ ...res, [userId]: this.decryptLine(basket[userId]) }),
      {}
    );
  };

  basketOfUser = (userId: number): DecryptedLineBasketInterface => {
    return this.decrypt()[userId];
  };

  private countDevicesInLine = (line = ''): number => {
    let amount = 0;
    let startAmount = line.indexOf('/');
    let rest = line;
    let endAmount = 0;
    while (startAmount !== -1) {
      rest = rest.slice(startAmount + 1);
      endAmount = rest.indexOf(',');
      amount += +rest.slice(0, endAmount);
      startAmount = rest.indexOf('/');
    }
    return amount;
  };

  deleteDeviceOfUser = (deviceId: number, userId: number): void => {
    const basket = this.localStorageService.getBasketValue() || {};
    const newLine = this.deleteDeviceInUserLine(deviceId, basket[userId] || '');
    const newBasket: BasketLocalStorageInterface = {
      ...basket,
      [userId]: newLine,
    };
    if (this.localStorageService.setBasketValue(newBasket)) {
      this.openSnackBar('Item has been removed');
      this.store.dispatch(
        updateBasketAmountAction({
          amount: this.countDevicesInLine(newLine),
        })
      );
    } else {
      this.openSnackBar('Item has not been removed', false);
    }
  };

  private deleteDeviceInUserLine = (deviceId: number, line: string): string => {
    let template = `${deviceId}/`;

    if (line.startsWith(template)) {
      const sliceToRemove = line.slice(0, line.indexOf(','));
      return line.slice(sliceToRemove.length + 1) || '';
    }

    template = `,${template}`;
    const startSliceIndex = line.indexOf(template) + 1;

    if (startSliceIndex > 0) {
      const endIndexSliceToRemove =
        startSliceIndex + line.slice(startSliceIndex).indexOf(',');

      const beforeSlice = line.slice(0, startSliceIndex);
      const afterSlice =
        endIndexSliceToRemove + 1 < line.length
          ? line.slice(endIndexSliceToRemove + 1)
          : '';

      return beforeSlice + afterSlice;
    }

    return line;
  };

  // template:
  // [userId]: 'deviceId/amount,device2Id/amount2,'
  decryptLine = (line: string): DecryptedLineBasketInterface => {
    return line.split(',').reduce((res, device) => {
      const [deviceId, amount] = device.split('/');
      return (
        (device && {
          ...res,
          [deviceId]: amount,
        }) ||
        res
      );
    }, {});
  };

  deleteDevicesOfUser = (userId: number): void => {
    const basket = this.localStorageService.getBasketValue() || {};
    const newBasket: BasketLocalStorageInterface = {
      ...basket,
      [userId]: '',
    };
    this.localStorageService.setBasketValue(newBasket);
    this.store.dispatch(
      updateBasketAmountAction({
        amount: 0,
      })
    );
  };

  openSnackBar(text: string, isSuccess = true) {
    this.snackBar.open(text, null, {
      duration: 3 * 1000,
      panelClass: ['recon-snackbar', isSuccess && 'success-snackbar'],
    });
  }

  private incrementDeviceInLine(
    deviceId: number,
    line = '',
    addAmount = 1
  ): string {
    let template = `${deviceId}/`;
    // it's handled separately, because there isn't ',' at start
    if (line?.startsWith(template)) {
      const endIndex = line.indexOf(',');
      const amount = line.slice(template.length, endIndex);

      return (
        line.slice(0, template.length - 1) +
        '/' +
        (+amount + addAmount).toString() +
        ',' +
        line.slice(endIndex + 1)
      );
    }

    template = ',' + template;
    const indexStartSlice = line.indexOf(template);
    // if there's this device
    if (indexStartSlice > -1) {
      let currentSlice = line.slice(indexStartSlice + 1);
      const indexEndCurrentSlice = currentSlice.indexOf(',');
      currentSlice = currentSlice.slice(0, indexEndCurrentSlice);
      const indexStartAmount = currentSlice.indexOf('/');
      const amount = currentSlice.slice(
        indexStartAmount + 1,
        currentSlice.length
      );
      const beforeSlice = line.slice(0, indexStartSlice + 1);
      const endSliceGlobally = indexStartSlice + indexEndCurrentSlice;
      // because .slice works [].length + i
      const afterSlice =
        endSliceGlobally >= line.length - 2
          ? ''
          : line.slice(endSliceGlobally + 2);

      return (
        beforeSlice +
        deviceId +
        '/' +
        (+amount + addAmount).toString() +
        ',' +
        afterSlice
      );
    }

    // if there isn't
    return line.length
      ? line + `${deviceId}/${addAmount},`
      : `${deviceId}/${addAmount},`;
  }

  addToBasket(deviceId: number, userId: number, amount = 1): void {
    const basket = this.localStorageService.getBasketValue() || {};
    const newLine = this.incrementDeviceInLine(
      deviceId,
      basket[userId] || '',
      amount
    );
    const newBasket: BasketLocalStorageInterface = {
      ...basket,
      [userId]: newLine,
    };
    if (this.localStorageService.setBasketValue(newBasket)) {
      this.openSnackBar('Item has been added');
      this.store.dispatch(
        updateBasketAmountAction({
          amount: this.countDevicesInLine(newLine),
        })
      );
    } else {
      this.openSnackBar('Item has not been added', false);
    }
  }
}
