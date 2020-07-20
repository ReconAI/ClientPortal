import { selectDeviceListLoadingStatus } from './../../../../store/loaders/loaders.selectors';
import { CREATED_DT_DESC } from './../../../constants/requests';
import { Observable } from 'rxjs';
import {
  selectOrderCategoriesList,
  selectDevices,
  selectDevicesMetaTotalCount,
  selectDevicesMetaCurrentPage,
  selectDevicesMetaPageSize,
} from './../../../../store/orders/orders.selectors';
import {
  loadCategoriesRequestedAction,
  loadDeviceListRequestedAction,
} from 'app/store/orders';
import { Store, select } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { AppState } from 'app/store/reducers';
import { CategoryInterface, DeviceFormInterface } from 'app/orders/constants';
import { DeviceListItemClientInterface } from 'app/store/orders/orders.server.helpers';

@Component({
  selector: 'recon-device-list-container',
  templateUrl: './device-list.container.html',
})
export class DeviceListContainer implements OnInit {
  constructor(private store: Store<AppState>) {}
  loadingStatus$: Observable<boolean> = this.store.pipe(
    select(selectDeviceListLoadingStatus)
  );
  categories$: Observable<CategoryInterface[]> = this.store.pipe(
    select(selectOrderCategoriesList)
  );
  devices$: Observable<DeviceListItemClientInterface[]> = this.store.pipe(
    select(selectDevices)
  );
  totalCount$: Observable<number> = this.store.pipe(
    select(selectDevicesMetaTotalCount)
  );
  currentPage$: Observable<number> = this.store.pipe(
    select(selectDevicesMetaCurrentPage)
  );
  pageSize$: Observable<number> = this.store.pipe(
    select(selectDevicesMetaPageSize)
  );

  loadDevices({
    page = 1,
    categoryId = 0,
    ordering = CREATED_DT_DESC,
  } = {}): void {
    this.store.dispatch(
      loadDeviceListRequestedAction({ page, ordering, categoryId })
    );
  }

  ngOnInit(): void {
    this.store.dispatch(loadCategoriesRequestedAction());
    this.loadDevices();
  }
}
