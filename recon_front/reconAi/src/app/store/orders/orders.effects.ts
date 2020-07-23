import {
  setManagementDeviceLoadingStatusAction,
  setUpdateDeviceLoadingStatusAction,
  setDeviceLoadingStatusAction,
  setAllCategoriesListLoadingStatusAction,
} from './../loaders/loaders.actions';
import { generalTransformFormErrorToObject } from './../../core/helpers/generalFormsErrorsTransformation';
import { CategoryInterface } from './../../orders/constants/types/category';
import {
  transformCategoriesFromServer,
  CategoriesClientInterface,
  CreateManufacturerRequestClientInterface,
  manufacturerFormFieldLabels,
  transformManufactureListFromServer,
  ManufacturerServerInterface,
  transformCreateManufacturerRequestToServer,
  CreateDeviceRequestClientInterface,
  transformCreateDeviceRequestToServer,
  deviceFormFieldLabels,
  transformLoadedDevicesFromServer,
  handlePaginationParamsForDeviceList,
  IdDeviceRequestInterface,
  DeviceListItemServerInterface,
  transformDeviceFromServer,
  transformUpdateDeviceRequestToServer,
} from './orders.server.helpers';
import { Router } from '@angular/router';
import { Action, Store, select } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, Observable } from 'rxjs';
import {
  map,
  catchError,
  switchMap,
  tap,
  finalize,
  mergeMap,
  withLatestFrom,
} from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppState } from '../reducers';
import {
  OrdersActionTypes,
  loadCategoriesSucceededAction,
  loadCategoriesErrorAction,
  updateCategoriesSucceededAction,
  updateCategoriesErrorAction,
  createManufacturerSucceededAction,
  createManufacturerErrorAction,
  loadManufacturerListSucceededAction,
  loadManufacturerListErrorAction,
  loadManufacturerListRequestedAction,
  createDeviceSucceededAction,
  createDeviceErrorAction,
  loadDeviceListSucceededAction,
  loadDeviceListErrorAction,
  deleteDeviceSucceededAction,
  deleteDeviceErrorAction,
  loadDeviceListRequestedAction,
  updateDeviceListMetaAction,
  loadManagementDeviceSucceededAction,
  loadManagementDeviceErrorAction,
  updateDeviceSucceededAction,
  updateDeviceErrorAction,
  loadDeviceErrorAction,
  loadDeviceSucceededAction,
  loadAllCategoriesSucceededAction,
  loadAllCategoriesErrorAction,
} from './orders.actions';
import {
  setCategoriesListLoadingStatusAction,
  setUpdateCategoriesListLoadingStatusAction,
  setCreateManufacturerLoadingStatusAction,
  setManufacturerListLoadingStatusAction,
  setCreateDeviceLoadingStatusAction,
  setDeviceListLoadingStatusAction,
  setDeleteDeviceLoadingStatusAction,
} from '../loaders';
import {
  PaginationRequestInterface,
  PaginationResponseServerInterface,
} from 'app/constants/types/requests';
import {
  DeviceFormInterface,
  DeviceServerInterface,
  DeviceListServerResponseInterface,
} from 'app/orders/constants';
import { transformUsersListResponseFromServer } from '../users/users.server.helpers';
import { calculatePageAfterDelete } from 'app/core/helpers';
import {
  selectDevices,
  selectDevicesMetaCurrentPage,
  selectDevicesMeta,
  selectDeviceImages,
  selectDeviceId,
} from './orders.selectors';

@Injectable()
export class OrdersEffects {
  constructor(
    private actions$: Actions,
    private httpClient: HttpClient,
    private store: Store<AppState>,
    private router: Router
  ) {}

  loadCategories$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Action>(OrdersActionTypes.LOAD_CATEGORIES_REQUESTED),
      tap(() => {
        this.store.dispatch(
          setCategoriesListLoadingStatusAction({
            status: true,
          })
        );
      }),
      switchMap(() =>
        this.httpClient.get<CategoryInterface[]>('/order-api/categories').pipe(
          map((categories) =>
            loadCategoriesSucceededAction(
              transformCategoriesFromServer(categories)
            )
          ),
          catchError((error) => {
            return of(loadCategoriesErrorAction());
          }),
          finalize(() => {
            this.store.dispatch(
              setCategoriesListLoadingStatusAction({
                status: false,
              })
            );
          })
        )
      )
    )
  );

  loadAllCategories$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Action>(OrdersActionTypes.LOAD_ALL_CATEGORIES_REQUESTED),
      tap(() => {
        this.store.dispatch(
          setAllCategoriesListLoadingStatusAction({
            status: true,
          })
        );
      }),
      switchMap(() =>
        this.httpClient
          .get<CategoryInterface[]>('/order-api/management/categories')
          .pipe(
            map((categories) =>
              loadAllCategoriesSucceededAction(
                transformCategoriesFromServer(categories)
              )
            ),
            catchError((error) => {
              return of(loadAllCategoriesErrorAction());
            }),
            finalize(() => {
              this.store.dispatch(
                setAllCategoriesListLoadingStatusAction({
                  status: false,
                })
              );
            })
          )
      )
    )
  );

  updateCategories$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Action & CategoriesClientInterface>(
        OrdersActionTypes.UPDATE_CATEGORIES_REQUESTED
      ),
      tap(() => {
        this.store.dispatch(
          setUpdateCategoriesListLoadingStatusAction({
            status: true,
          })
        );
      }),
      switchMap((categories) =>
        this.httpClient
          .post<CategoryInterface[]>(
            '/order-api/management/categories',
            categories
          )
          .pipe(
            map((updatedCategories) =>
              updateCategoriesSucceededAction(
                transformCategoriesFromServer(updatedCategories)
              )
            ),
            catchError((error) => {
              return of(updateCategoriesErrorAction());
            }),
            finalize(() => {
              this.store.dispatch(
                setUpdateCategoriesListLoadingStatusAction({
                  status: false,
                })
              );
            })
          )
      )
    )
  );

  createManufacturer$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Action & CreateManufacturerRequestClientInterface>(
        OrdersActionTypes.CREATE_MANUFACTURER_REQUESTED
      ),
      tap(() => {
        this.store.dispatch(
          setCreateManufacturerLoadingStatusAction({
            status: true,
          })
        );
      }),
      switchMap(({ manufacturer }) =>
        this.httpClient
          .post<void>(
            '/order-api/management/manufacturers',
            transformCreateManufacturerRequestToServer(manufacturer)
          )
          .pipe(
            map(() => createManufacturerSucceededAction()),
            tap(() => {
              this.store.dispatch(loadManufacturerListRequestedAction());
            }),
            catchError((error) =>
              of(
                createManufacturerErrorAction(
                  generalTransformFormErrorToObject(
                    error,
                    manufacturerFormFieldLabels
                  )
                )
              )
            ),
            finalize(() => {
              this.store.dispatch(
                setCreateManufacturerLoadingStatusAction({
                  status: false,
                })
              );
            })
          )
      )
    )
  );

  loadManufacturers$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Action>(OrdersActionTypes.LOAD_MANUFACTURER_LIST_REQUESTED),
      tap(() => {
        this.store.dispatch(
          setManufacturerListLoadingStatusAction({
            status: true,
          })
        );
      }),
      switchMap(() =>
        this.httpClient
          .get<ManufacturerServerInterface[]>(
            '/order-api/management/manufacturers'
          )
          .pipe(
            map((manufacturers) =>
              loadManufacturerListSucceededAction(
                transformManufactureListFromServer(manufacturers)
              )
            ),
            catchError((error) => of(loadManufacturerListErrorAction())),
            finalize(() => {
              this.store.dispatch(
                setManufacturerListLoadingStatusAction({
                  status: false,
                })
              );
            })
          )
      )
    )
  );

  createDevice$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Action & CreateDeviceRequestClientInterface>(
        OrdersActionTypes.CREATE_DEVICE_REQUESTED
      ),
      tap(() => {
        this.store.dispatch(
          setCreateDeviceLoadingStatusAction({
            status: true,
          })
        );
      }),
      // to form to base64 in async way
      mergeMap(
        async ({ device }) => await transformCreateDeviceRequestToServer(device)
      ),
      switchMap((formedDevice) => {
        return this.httpClient
          .post<void>('/order-api/management/devices', formedDevice)
          .pipe(
            map(() => createDeviceSucceededAction()),
            tap(() => {
              this.router.navigate(['/orders']);
            }),
            catchError((error) =>
              of(
                createDeviceErrorAction(
                  generalTransformFormErrorToObject(
                    error,
                    deviceFormFieldLabels
                  )
                )
              )
            ),
            finalize(() => {
              this.store.dispatch(
                setCreateDeviceLoadingStatusAction({
                  status: false,
                })
              );
            })
          );
      })
    )
  );

  loadDeviceList$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Action>(OrdersActionTypes.LOAD_DEVICE_LIST_REQUESTED),
      tap(() => {
        this.store.dispatch(
          setDeviceListLoadingStatusAction({
            status: true,
          })
        );
      }),
      withLatestFrom(this.store.pipe(select(selectDevicesMeta))),
      switchMap(([_, pagination]) => {
        return this.httpClient
          .get<
            PaginationResponseServerInterface<DeviceListServerResponseInterface>
          >(
            `/order-api/devices?${handlePaginationParamsForDeviceList(
              pagination
            )}`
          )
          .pipe(
            map((response) =>
              loadDeviceListSucceededAction(
                transformLoadedDevicesFromServer(response)
              )
            ),
            catchError((error) => of(loadDeviceListErrorAction())),
            finalize(() => {
              this.store.dispatch(
                setDeviceListLoadingStatusAction({
                  status: false,
                })
              );
            })
          );
      })
    )
  );

  deleteDevice$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Action & IdDeviceRequestInterface>(
        OrdersActionTypes.DELETE_DEVICE_REQUESTED
      ),
      tap(() => {
        this.store.dispatch(
          setDeleteDeviceLoadingStatusAction({
            status: true,
          })
        );
      }),
      withLatestFrom(
        this.store.pipe(select(selectDevices)),
        this.store.pipe(select(selectDevicesMetaCurrentPage))
      ),
      switchMap(([{ id }, devices, currentPage]) => {
        return this.httpClient
          .delete<void>(`/order-api/management/devices/${id}`)
          .pipe(
            map(() => deleteDeviceSucceededAction()),
            tap(() => {
              this.store.dispatch(
                updateDeviceListMetaAction({
                  pagination: {
                    currentPage: calculatePageAfterDelete(
                      currentPage,
                      devices.length
                    ),
                  },
                })
              );
              this.store.dispatch(loadDeviceListRequestedAction());
            }),
            catchError(() => of(deleteDeviceErrorAction())),
            finalize(() => {
              this.store.dispatch(
                setDeleteDeviceLoadingStatusAction({
                  status: false,
                })
              );
            })
          );
      })
    )
  );

  loadManagementDevice$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Action & IdDeviceRequestInterface>(
        OrdersActionTypes.LOAD_MANAGEMENT_DEVICE_REQUESTED
      ),
      tap(() => {
        this.store.dispatch(
          setManagementDeviceLoadingStatusAction({
            status: true,
          })
        );
      }),
      switchMap(({ id }) => {
        return this.httpClient
          .get<DeviceListItemServerInterface>(
            `/order-api/management/devices/${id}`
          )
          .pipe(
            map((device) =>
              loadManagementDeviceSucceededAction(
                transformDeviceFromServer(device)
              )
            ),
            catchError(() => of(loadManagementDeviceErrorAction())),
            finalize(() => {
              this.store.dispatch(
                setManagementDeviceLoadingStatusAction({
                  status: false,
                })
              );
            })
          );
      })
    )
  );

  updateDevice$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Action & CreateDeviceRequestClientInterface>(
        OrdersActionTypes.UPDATE_DEVICE_REQUESTED
      ),
      tap(() => {
        this.store.dispatch(
          setUpdateDeviceLoadingStatusAction({
            status: true,
          })
        );
      }),
      withLatestFrom(this.store.pipe(select(selectDeviceImages))),
      // to form to base64 in async way
      mergeMap(
        async ([{ device }, oldImages]) =>
          await transformUpdateDeviceRequestToServer(device, oldImages)
      ),
      withLatestFrom(this.store.pipe(select(selectDeviceId))),
      switchMap(([formedDevice, id]) => {
        return this.httpClient
          .put<void>(`/order-api/management/devices/${id}`, formedDevice)
          .pipe(
            map(() => updateDeviceSucceededAction()),
            tap(() => {
              this.router.navigate(['/orders']);
            }),
            catchError((error) =>
              of(
                updateDeviceErrorAction(
                  generalTransformFormErrorToObject(
                    error,
                    deviceFormFieldLabels
                  )
                )
              )
            ),
            finalize(() => {
              this.store.dispatch(
                setUpdateDeviceLoadingStatusAction({
                  status: false,
                })
              );
            })
          );
      })
    )
  );

  loadDevice$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Action & IdDeviceRequestInterface>(
        OrdersActionTypes.LOAD_DEVICE_REQUESTED
      ),
      tap(() => {
        this.store.dispatch(
          setDeviceLoadingStatusAction({
            status: true,
          })
        );
      }),
      switchMap(({ id }) => {
        return this.httpClient
          .get<DeviceListItemServerInterface>(`/order-api/devices/${id}`)
          .pipe(
            map((device) =>
              loadDeviceSucceededAction(transformDeviceFromServer(device))
            ),
            catchError(() => of(loadDeviceErrorAction())),
            finalize(() => {
              this.store.dispatch(
                setDeviceLoadingStatusAction({
                  status: false,
                })
              );
            })
          );
      })
    )
  );
}
