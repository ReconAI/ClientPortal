import { selectCurrentUserProfileId } from 'app/store/user/user.selectors';
import { UserRolesPriorities } from 'app/constants/types';
import { SUPER_ADMIN_ROLE } from './../../../../constants/types/user';
import { selectUserRolePriority } from './../../../../store/user/user.selectors';
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
import { Observable, Subscription } from 'rxjs';
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
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'recon-device-list-container',
  templateUrl: './device-list.container.html',
})
export class DeviceListContainer implements OnInit, OnDestroy {
  constructor(
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute
  ) {}
  categoryName = 'All';
  categories: CategoryInterface[] = [];
  categoriesSubscription$: Subscription;
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
  userId$: Observable<string> = this.store.pipe(
    select(selectCurrentUserProfileId)
  );

  isSuperAdmin$: Observable<boolean> = this.store.pipe(
    select(selectUserRolePriority),
    map((priority) => priority === UserRolesPriorities.SUPER_ADMIN_ROLE)
  );

  loadDevices(pagination: PaginatedDeviceListRequestInterface = null): void {
    const defaultCategory = this.categories.find(
      ({ name }) => name === this.categoryName
    );
    this.store.dispatch(
      updateDeviceListMetaAction({
        pagination: {
          categoryId: defaultCategory?.id || -1,
          ...(pagination?.pagination || {}),
        },
      })
    );
    this.store.dispatch(loadDeviceListRequestedAction());
  }

  ngOnInit(): void {
    this.store.dispatch(loadCategoriesRequestedAction());

    this.categoriesSubscription$ = this.categories$.subscribe((categories) => {
      this.categories = categories;
    });
    this.categoryName = this.activatedRoute.snapshot.queryParamMap.get(
      'category'
    );

    this.loadDevices();
  }

  ngOnDestroy(): void {
    this.store.dispatch(resetDeviceListMetaAction());
  }
}
