import { selectDeviceLoadingStatus } from './../../../../store/loaders/loaders.selectors';
import { Observable } from 'rxjs';
import { loadDeviceRequestedAction } from './../../../../store/orders/orders.actions';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'recon-device-card-container',
  templateUrl: './device-card.container.html',
})
export class DeviceCardContainer implements OnInit {
  id: number;
  constructor(
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute
  ) {}

  name$: Observable<string> = this.store.pipe(select(selectDeviceName));
  description$: Observable<string> = this.store.pipe(
    select(selectDeviceDescription)
  );
  salesPrice$: Observable<string> = this.store.pipe(
    select(selectDeviceSalesPrice)
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

  loadingDeviceStatus$: Observable<boolean> = this.store.pipe(
    select(selectDeviceLoadingStatus)
  );

  isExist$: Observable<boolean> = this.store.pipe(
    select(selectDoesExistDevice)
  );

  ngOnInit(): void {
    this.id = +this.activatedRoute.snapshot.paramMap.get('id');
    this.store.dispatch(
      loadDeviceRequestedAction({
        id: this.id,
      })
    );
  }
}
