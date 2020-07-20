import { FormServerErrorInterface } from 'app/constants/types/requests';
import {
  selectManagementDeviceLoadingStatus,
  selectManufacturerListLoadingStatus,
  selectUpdateDeviceLoadingStatus,
} from './../../../../store/loaders/loaders.selectors';
import {
  selectManufacturerList,
  selectOrderCategoriesList,
  selectDeviceName,
  selectDeviceDescription,
  selectDeviceManufacturerId,
  selectDeviceBuyingPrice,
  selectDeviceSalesPrice,
  selectDeviceProduct,
  selectDeviceSeoTitle,
  selectDeviceSeoTags,
  selectDeviceSeoDescription,
  selectDeviceImages,
  selectUpdateDeviceError,
  selectDoesExistDevice,
} from './../../../../store/orders/orders.selectors';
import {
  ManufacturerInterface,
  CategoryInterface,
  ServerImageInterface,
} from 'app/orders/constants';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {
  loadManagementDeviceRequestedAction,
  loadManufacturerListRequestedAction,
  loadCategoriesRequestedAction,
  updateDeviceRequestedAction,
  resetUpdateDeviceErrorAction,
} from './../../../../store/orders/orders.actions';
import { Store, select } from '@ngrx/store';
import { AppState } from 'app/store/reducers';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'recon-update-device-container',
  templateUrl: './update-device.container.html',
})
export class UpdateDeviceContainer implements OnInit, OnDestroy {
  id: number;
  constructor(
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute
  ) {}

  categories$: Observable<CategoryInterface[]> = this.store.pipe(
    select(selectOrderCategoriesList)
  );

  manufacturers$: Observable<ManufacturerInterface[]> = this.store.pipe(
    select(selectManufacturerList)
  );

  validationError$: Observable<FormServerErrorInterface> = this.store.pipe(
    select(selectUpdateDeviceError)
  );

  name$: Observable<string> = this.store.pipe(select(selectDeviceName));
  manufacturerId$: Observable<number> = this.store.pipe(
    select(selectDeviceManufacturerId)
  );
  description$: Observable<string> = this.store.pipe(
    select(selectDeviceDescription)
  );
  buyingPrice$: Observable<string> = this.store.pipe(
    select(selectDeviceBuyingPrice)
  );
  salesPrice$: Observable<string> = this.store.pipe(
    select(selectDeviceSalesPrice)
  );
  product$: Observable<string> = this.store.pipe(select(selectDeviceProduct));
  seoTitle$: Observable<string> = this.store.pipe(select(selectDeviceSeoTitle));
  seoTags$: Observable<string[]> = this.store.pipe(select(selectDeviceSeoTags));
  seoDescription$: Observable<string> = this.store.pipe(
    select(selectDeviceSeoDescription)
  );
  images$: Observable<ServerImageInterface[]> = this.store.pipe(
    select(selectDeviceImages)
  );

  loadingDeviceStatus$: Observable<boolean> = this.store.pipe(
    select(selectManagementDeviceLoadingStatus)
  );

  loadingManufacturerListStatus$: Observable<boolean> = this.store.pipe(
    select(selectManufacturerListLoadingStatus)
  );

  isExist$: Observable<boolean> = this.store.pipe(
    select(selectDoesExistDevice)
  );

  isUpdating$: Observable<boolean> = this.store.pipe(
    select(selectUpdateDeviceLoadingStatus)
  );

  ngOnInit(): void {
    this.id = +this.activatedRoute.snapshot.paramMap.get('id');
    this.store.dispatch(loadManufacturerListRequestedAction());
    this.store.dispatch(loadCategoriesRequestedAction());
    this.store.dispatch(loadManagementDeviceRequestedAction({ id: this.id }));
  }

  ngOnDestroy(): void {
    this.store.dispatch(resetUpdateDeviceErrorAction());
  }

  sendDevice(device): void {
    this.store.dispatch(updateDeviceRequestedAction({ device }));
  }
}
