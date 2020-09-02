import { OptionServerInterface } from './../../reporting/constants/types/filters';
import { FiltersService } from './../../core/services/filters/filters.service';
import { loadReportingDeviceListRequestedAction } from 'app/store/reporting';
import {
  selectReportingDeviceListMetaCurrentPage,
  selectApplyFiltersStatus,
  selectEventObjectList,
  selectRoadWeatherConditionList,
  selectVehicleTypeList,
} from './reporting.selectors';
import {
  ReportingActionTypes,
  loadReportingDeviceListSucceededAction,
  loadReportingDeviceListErrorAction,
  LoadReportingDevicePayloadInterface,
  loadReportingDeviceErrorAction,
  loadReportingDeviceSucceededAction,
  setGpsSucceededAction,
  setGpsErrorAction,
  eventObjectListSucceededAction,
  eventObjectListErrorAction,
  projectNameListSucceededAction,
  projectNameListErrorAction,
  roadWeatherConditionListRequestedAction,
  roadWeatherConditionListSucceededAction,
  roadWeatherConditionListErrorAction,
  vehicleTypeListSucceededAction,
  vehicleTypeListErrorAction,
} from './reporting.actions';
import {
  PaginationRequestInterface,
  PaginationResponseServerInterface,
} from 'app/constants/types/requests';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppState } from '../reducers';
import { ServerUserInterface } from 'app/constants/types';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, Action, select } from '@ngrx/store';
import {
  tap,
  switchMap,
  map,
  catchError,
  finalize,
  withLatestFrom,
  debounceTime,
} from 'rxjs/operators';
import {
  setReportingDeviceListLoadingStatusAction,
  setReportingDeviceLoadingStatusAction,
  setGpsLoadingStatusAction,
} from '../loaders';
import {
  ReportingDeviceServerInterface,
  transformReportingPaginatedDeviceListFromServer,
  transformReportingDeviceFromServer,
  transformReportingDeviceCardFromServer,
  SetGpsRequestInterface,
  transformSetGpsToServer,
  setGpsErrorFieldRelations,
  transformEndpointWithApplyStatus,
  transformOptionsFromServer,
  AutocompleteNameServerInterface,
} from './reporting.server.helpers';
import { updateBreadcrumbByIdAction, setAppTitleAction } from '../app';
import { generalTransformFormErrorToObject } from 'app/core/helpers/generalFormsErrorsTransformation';
import { selectCurrentUserProfileId } from '../user/user.selectors';

@Injectable()
export class ReportingEffects {
  constructor(
    private actions$: Actions,
    private httpClient: HttpClient,
    private store: Store<AppState>,
    private filtersService: FiltersService
  ) {}

  loadReportingDeviceList$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Action & PaginationRequestInterface>(
        ReportingActionTypes.LOAD_REPORTING_DEVICE_LIST_REQUESTED
      ),
      tap(() => {
        this.store.dispatch(
          setReportingDeviceListLoadingStatusAction({
            status: true,
          })
        );
      }),
      withLatestFrom(
        this.store.pipe(select(selectApplyFiltersStatus)),
        this.store.pipe(select(selectCurrentUserProfileId))
      ),
      switchMap(([{ page }, applyFiltersStatus, userId]) =>
        this.httpClient
          .get<
            PaginationResponseServerInterface<ReportingDeviceServerInterface>
          >(
            transformEndpointWithApplyStatus(
              `/api/relevant-data?page=${page}`,
              applyFiltersStatus,
              +userId,
              this.filtersService
            )
          )
          .pipe(
            map((devices) =>
              loadReportingDeviceListSucceededAction(
                transformReportingPaginatedDeviceListFromServer(devices)
              )
            ),
            catchError((error) => of(loadReportingDeviceListErrorAction())),
            finalize(() => {
              this.store.dispatch(
                setReportingDeviceListLoadingStatusAction({
                  status: false,
                })
              );
            })
          )
      )
    )
  );

  loadReportingDevice$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Action & LoadReportingDevicePayloadInterface>(
        ReportingActionTypes.LOAD_REPORTING_DEVICE_REQUESTED
      ),
      tap(() => {
        this.store.dispatch(
          setReportingDeviceLoadingStatusAction({
            status: true,
          })
        );
      }),
      withLatestFrom(
        this.store.pipe(select(selectApplyFiltersStatus)),
        this.store.pipe(select(selectCurrentUserProfileId))
      ),
      switchMap(([{ id, page }, applyFiltersStatus, userId]) =>
        this.httpClient
          .get<
            PaginationResponseServerInterface<ReportingDeviceServerInterface>
          >(
            transformEndpointWithApplyStatus(
              `/api/sensors/${id}/relevant-data?page=${page}`,
              applyFiltersStatus,
              +userId,
              this.filtersService
            )
          )
          .pipe(
            map((devices) =>
              loadReportingDeviceSucceededAction(
                transformReportingPaginatedDeviceListFromServer(devices)
              )
            ),
            tap(() => {
              const label = `Singular device data: ${id}`;
              this.store.dispatch(
                updateBreadcrumbByIdAction({
                  update: {
                    oldId: '%reporting-device-id',
                    newLabel: label,
                    newUrl: `reporting/${id}`,
                  },
                })
              );

              this.store.dispatch(
                setAppTitleAction({
                  title: `Singular device data: ${id}`,
                })
              );
            }),
            catchError(() => of(loadReportingDeviceErrorAction())),
            finalize(() => {
              this.store.dispatch(
                setReportingDeviceLoadingStatusAction({
                  status: false,
                })
              );
            })
          )
      )
    )
  );

  setGpsRequested$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Action & SetGpsRequestInterface>(
        ReportingActionTypes.SET_GPS_REQUESTED
      ),
      tap(() => {
        this.store.dispatch(
          setGpsLoadingStatusAction({
            status: true,
          })
        );
      }),
      withLatestFrom(
        this.store.pipe(select(selectReportingDeviceListMetaCurrentPage))
      ),
      switchMap(([req, page]) =>
        this.httpClient
          .put<void>(
            `/api/relevant-data/${req?.gps?.id}/gps`,
            transformSetGpsToServer(req)
          )
          .pipe(
            map(() => setGpsSucceededAction()),
            tap(() => {
              this.store.dispatch(
                loadReportingDeviceListRequestedAction({
                  page,
                })
              );
            }),
            catchError((error) =>
              of(
                setGpsErrorAction(
                  generalTransformFormErrorToObject(
                    error,
                    setGpsErrorFieldRelations
                  )
                )
              )
            ),
            finalize(() => {
              this.store.dispatch(
                setGpsLoadingStatusAction({
                  status: false,
                })
              );
            })
          )
      )
    )
  );

  loadEventObjectList$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Action>(ReportingActionTypes.EVENT_OBJECT_LIST_REQUESTED),
      withLatestFrom(this.store.pipe(select(selectEventObjectList))),
      switchMap(([_, eventObjects]) => {
        // cache data
        if (eventObjects && eventObjects.length) {
          return of(eventObjectListSucceededAction({ options: eventObjects }));
        }

        return this.httpClient
          .get<OptionServerInterface[]>(`/api/relevant-data/event-objects`)
          .pipe(
            map((response) =>
              eventObjectListSucceededAction(
                transformOptionsFromServer(response)
              )
            ),
            catchError((error) => of(eventObjectListErrorAction()))
          );
      })
    )
  );

  loadProjectNameList$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Action & AutocompleteNameServerInterface>(
        ReportingActionTypes.PROJECT_NAME_LIST_REQUESTED
      ),
      debounceTime(150),
      switchMap(({ name }) => {
        return this.httpClient
          .get<string[]>(`/api/relevant-data/projects?name=${name}`)
          .pipe(
            map((response) =>
              projectNameListSucceededAction({
                names: response,
              })
            ),
            catchError((error) => of(projectNameListErrorAction()))
          );
      })
    )
  );

  roadWeatherConditionList$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Action>(
        ReportingActionTypes.ROAD_WEATHER_CONDITION_LIST_REQUESTED
      ),
      withLatestFrom(this.store.pipe(select(selectRoadWeatherConditionList))),
      switchMap(([_, roadWeatherConditions]) => {
        // cache data
        if (roadWeatherConditions && roadWeatherConditions.length) {
          return of(
            roadWeatherConditionListSucceededAction({
              options: roadWeatherConditions,
            })
          );
        }

        return this.httpClient
          .get<OptionServerInterface[]>(
            `/api/relevant-data/road-weather-conditions`
          )
          .pipe(
            map((response) =>
              roadWeatherConditionListSucceededAction(
                transformOptionsFromServer(response)
              )
            ),
            catchError((error) => of(roadWeatherConditionListErrorAction()))
          );
      })
    )
  );

  vehicleTypeList$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Action>(ReportingActionTypes.VEHICLE_TYPE_LIST_REQUESTED),
      withLatestFrom(this.store.pipe(select(selectVehicleTypeList))),
      switchMap(([_, vehicleTypes]) => {
        if (vehicleTypes && vehicleTypes.length) {
          return of(
            vehicleTypeListSucceededAction({
              options: vehicleTypes,
            })
          );
        }

        return this.httpClient
          .get<OptionServerInterface[]>(`/api/relevant-data/vehicle-types`)
          .pipe(
            map((response) =>
              vehicleTypeListSucceededAction(
                transformOptionsFromServer(response)
              )
            ),
            catchError((error) => of(vehicleTypeListErrorAction()))
          );
      })
    )
  );
}
