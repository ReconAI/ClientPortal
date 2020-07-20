import {
  updateDeviceListMetaAction,
  resetDeviceListMetaAction,
} from './../../../../store/orders/orders.actions';
import { map } from 'rxjs/operators';
import { selectDeviceListLoadingStatus } from './../../../../store/loaders/loaders.selectors';
import {
  CREATED_DT_DESC,
  ALL_CATEGORIES_ID_FOR_DEVICE,
} from './../../../constants/requests';
import { Observable } from 'rxjs';
import {
  selectOrderCategoriesList,
  selectDevices,
  selectDevicesMetaTotalCount,
  selectDevicesMetaCurrentPage,
  selectDevicesMetaPageSize,
  selectDevicesMetaCategoryId,
  selectDevicesMetaOrdering,
} from './../../../../store/orders/orders.selectors';
import {
  loadCategoriesRequestedAction,
  loadDeviceListRequestedAction,
} from 'app/store/orders';
import { Store, select } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from 'app/store/reducers';
import { CategoryInterface, DeviceFormInterface } from 'app/orders/constants';
import {
  DeviceListItemClientInterface,
  PaginatedDeviceListRequestInterface,
} from 'app/store/orders/orders.server.helpers';

@Component({
  selector: 'recon-device-list-container',
  templateUrl: './device-list.container.html',
})
export class DeviceListContainer implements OnInit, OnDestroy {
  constructor(private store: Store<AppState>) {}
  loadingStatus$: Observable<boolean> = this.store.pipe(
    select(selectDeviceListLoadingStatus)
  );
  // add category with -1 to get devices of all categories
  categories$: Observable<CategoryInterface[]> = this.store.pipe(
    select(selectOrderCategoriesList),
    map((categories) => [
      { id: ALL_CATEGORIES_ID_FOR_DEVICE, name: 'All' },
      ...categories,
    ])
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
  ordering$: Observable<string> = this.store.pipe(
    select(selectDevicesMetaOrdering)
  );

  loadDevices(pagination: PaginatedDeviceListRequestInterface = null): void {
    this.store.dispatch(updateDeviceListMetaAction(pagination));
    this.store.dispatch(loadDeviceListRequestedAction());
  }

  ngOnInit(): void {
    this.store.dispatch(loadCategoriesRequestedAction());
    this.loadDevices();
  }

  ngOnDestroy(): void {
    this.store.dispatch(resetDeviceListMetaAction());
  }
}
