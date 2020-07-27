import {
  BasketLocalStorageInterface,
  DecryptedBasketInterface,
  DecryptedLineBasketInterface,
} from './../../constants/basket';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { LocalStorageService } from './../localStorage/local-storage.service';
import { Injectable } from '@angular/core';
import { AppState } from 'app/store/reducers';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  constructor(private localStorageService: LocalStorageService) {}

  decrypt = (): DecryptedBasketInterface => {
    const basket = this.localStorageService.getBasketValue() || '';
    return Object.keys(basket).reduce(
      (res, userId) => ({ ...res, [userId]: this.decryptLine(basket[userId]) }),
      {}
    );
  }

  // template:
  // [userId]: 'deviceId/amount,device2Id/amount2,'
  decryptLine = (line: string): DecryptedLineBasketInterface => {
    return line.split(',').reduce((res, device) => {
      const [deviceId, amount] = device.split('/');
      return {
        ...res,
        [deviceId]: amount,
      };
    }, {});
  }

  incrementDeviceInLine(deviceId: number, line = ''): string {
    let template = `${deviceId}/`;
    // it's handled separately, because there isn't ',' at start
    if (line?.startsWith(template)) {
      const endIndex = line.indexOf(',');
      const amount = line.slice(template.length, endIndex);

      return (
        line.slice(0, template.length - 1) +
        '/' +
        (+amount + 1).toString() +
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
        (+amount + 1).toString() +
        ',' +
        afterSlice
      );
    }

    // if there isn't
    return line.length ? line + `${deviceId}/${1},` : `${deviceId}/${1},`;
  }

  addToBasket(deviceId: number, userId: number) {
    const basket = this.localStorageService.getBasketValue() || {};
    const newLine = this.incrementDeviceInLine(deviceId, basket[userId] || '');
    const newBasket: BasketLocalStorageInterface = {
      ...basket,
      [userId]: newLine,
    };
    this.localStorageService.setBasketValue(newBasket);
  }
}
