import { selectCreateDeviceLoadingStatus } from './../../../../store/loaders/loaders.selectors';
import {
  loadManufacturerListRequestedAction,
  createDeviceRequestedAction,
  resetCreateDeviceErrorAction,
  resetAllCategoriesAction,
} from './../../../../store/orders/orders.actions';
import { ManufacturerInterface } from './../../../constants/types/manufacturers';
import {
  selectOrderCategoriesList,
  selectManufacturerList,
  selectCreateDeviceError,
} from './../../../../store/orders/orders.selectors';
import { Observable } from 'rxjs';
import { loadAllCategoriesRequestedAction } from 'app/store/orders';
import { Store, select } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from 'app/store/reducers';
import { CategoryInterface, DeviceFormInterface } from 'app/orders/constants';
import { FormServerErrorInterface } from 'app/constants/types/requests';

@Component({
  selector: 'recon-create-device-container',
  templateUrl: './create-device.container.html',
})
export class CreateDeviceContainer implements OnInit, OnDestroy {
  constructor(private store: Store<AppState>) {}

  creationStatus$: Observable<boolean> = this.store.pipe(
    select(selectCreateDeviceLoadingStatus)
  );
  validationError$: Observable<FormServerErrorInterface> = this.store.pipe(
    select(selectCreateDeviceError)
  );
  categories$: Observable<CategoryInterface[]> = this.store.pipe(
    select(selectOrderCategoriesList)
  );
  manufacturers$: Observable<ManufacturerInterface[]> = this.store.pipe(
    select(selectManufacturerList)
  );

  ngOnInit(): void {
    this.store.dispatch(loadManufacturerListRequestedAction());
    this.store.dispatch(loadAllCategoriesRequestedAction());
  }

  ngOnDestroy(): void {
    this.store.dispatch(resetAllCategoriesAction());
    this.store.dispatch(resetCreateDeviceErrorAction());
  }

  sendDevice(device: DeviceFormInterface): void {
    this.store.dispatch(createDeviceRequestedAction({ device }));
  }
}
