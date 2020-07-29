import {
  selectCurrentUserProfileId,
  selectIsUserAbleToBuy,
} from './../../../../store/user/user.selectors';
import { BasketService } from './../../../../core/services/basket/basket.service';
import {
  selectDeviceCategory,
  selectDeviceSalesWithVatPrice,
} from './../../../../store/orders/orders.selectors';
import { selectDeviceLoadingStatus } from './../../../../store/loaders/loaders.selectors';
import { Observable, Subscription } from 'rxjs';
import { loadDeviceRequestedAction } from './../../../../store/orders/orders.actions';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from 'app/store/reducers';
import {
  selectDeviceName,
  selectDeviceDescription,
  selectDeviceSalesPrice,
  selectDeviceProduct,
  selectDeviceSeoTitle,
  selectDeviceSeoTags,
  selectDeviceSeoDescription,
  selectDeviceImages,
  selectDoesExistDevice,
  selectDeviceManufacturer,
} from 'app/store/orders/orders.selectors';
import { ServerImageInterface } from 'app/orders/constants';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'recon-device-card-container',
  templateUrl: './device-card.container.html',
})
export class DeviceCardContainer implements OnInit, OnDestroy {
  id: number;
  userId: number;
  constructor(
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private basketService: BasketService
  ) {}

  userIdSubscription$: Subscription;
  name$: Observable<string> = this.store.pipe(select(selectDeviceName));
  description$: Observable<string> = this.store.pipe(
    select(selectDeviceDescription)
  );
  salesPrice$: Observable<string> = this.store.pipe(
    select(selectDeviceSalesPrice)
  );
  salesPriceWithVat$: Observable<string> = this.store.pipe(
    select(selectDeviceSalesWithVatPrice)
  );
  product$: Observable<string> = this.store.pipe(select(selectDeviceProduct));
  seoTitle$: Observable<string> = this.store.pipe(select(selectDeviceSeoTitle));
  seoTags$: Observable<string> = this.store.pipe(
    select(selectDeviceSeoTags)
  ) as Observable<string>;
  seoDescription$: Observable<string> = this.store.pipe(
    select(selectDeviceSeoDescription)
  );
  images$: Observable<ServerImageInterface[]> = this.store.pipe(
    select(selectDeviceImages)
  );
  manufacturer$: Observable<string> = this.store.pipe(
    select(selectDeviceManufacturer)
  );
  category$: Observable<string> = this.store.pipe(select(selectDeviceCategory));

  loadingDeviceStatus$: Observable<boolean> = this.store.pipe(
    select(selectDeviceLoadingStatus)
  );

  isExist$: Observable<boolean> = this.store.pipe(
    select(selectDoesExistDevice)
  );
  userId$: Observable<string> = this.store.pipe(
    select(selectCurrentUserProfileId),
    tap((userId) => {
      this.userId = +userId;
    })
  );
  isAbleToBuy$: Observable<boolean> = this.store.pipe(
    select(selectIsUserAbleToBuy)
  );

  ngOnInit(): void {
    this.id = +this.activatedRoute.snapshot.paramMap.get('id');
    this.store.dispatch(
      loadDeviceRequestedAction({
        id: this.id,
      })
    );
    this.userIdSubscription$ = this.userId$.subscribe();
  }

  ngOnDestroy(): void {
    this.userIdSubscription$.unsubscribe();
  }
  addToBasket(amount: number): void {
    this.basketService.addToBasket(this.id, this.userId, amount);
  }
}
