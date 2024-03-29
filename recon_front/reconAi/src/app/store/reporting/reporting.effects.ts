import { SensorServerInterface } from './../../constants/types/sensors';
import { setAdditionalSensorInfoLoadingStatusAction } from './../loaders/loaders.actions';
import { OptionServerInterface } from './../../reporting/constants/types/filters';
import { FiltersService } from './../../core/services/filters/filters.service';
import {
  selectApplyFiltersStatus,
  selectEventObjectList,
  selectRoadWeatherConditionList,
  selectVehicleTypeList,
  selectReportingFilteringList,
  selectReportingSelectedDeviceList,
  selectPedestrianFlowList,
  selectFilteredSingularDeviceFilters,
} from './reporting.selectors';
import {
  ReportingActionTypes,
  loadReportingFilteringListSucceededAction,
  loadReportingFilteringListErrorAction,
  LoadReportingDevicePayloadInterface,
  loadReportingDeviceErrorAction,
  loadReportingDeviceSucceededAction,
  setGpsSucceededAction,
  setGpsErrorAction,
  eventObjectListSucceededAction,
  eventObjectListErrorAction,
  projectNameListSucceededAction,
  projectNameListErrorAction,
  roadWeatherConditionListSucceededAction,
  roadWeatherConditionListErrorAction,
  vehicleTypeListSucceededAction,
  vehicleTypeListErrorAction,
  ExportRelevantDataPayloadInterface,
  exportRelevantDataSucceededAction,
  exportRelevantDataErrorAction,
  buildVehicleRouteSucceededAction,
  buildVehicleRouteErrorAction,
  heatMapDataSucceededAction,
  heatMapDataErrorAction,
  HeatMapDataRequestedActionInterface,
  plateNumberListSucceededAction,
  plateNumberListErrorAction,
  pedestrianFlowListSucceededAction,
  pedestrianFlowListErrorAction,
  loadAdditionalSensorInfoSucceededAction,
  loadAdditionalSensorInfoErrorAction,
  loadAdditionalSensorInfoRequestedAction,
} from './reporting.actions';
import {
  PaginationRequestInterface,
  PaginationResponseServerInterface,
} from 'app/constants/types/requests';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppState } from '../reducers';
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
  setReportingFilteringListLoadingStatusAction,
  setReportingDeviceLoadingStatusAction,
  setGpsLoadingStatusAction,
  setExportRelevantLoadingStatusAction,
  setBuildingRouteLoadingStatusAction,
  setHeatMapDataLoadingStatusAction,
} from '../loaders';

import {
  ReportingFilteringDeviceServerInterface,
  transformReportingPaginatedDeviceListFromServer,
  SetGpsRequestInterface,
  transformSetGpsToServer,
  setGpsErrorFieldRelations,
  transformEndpointWithApplyStatus,
  transformOptionsFromServer,
  AutocompleteNameServerInterface,
  LatLngServerInterface,
  transformBuildingRouteFromServer,
  transformUrlWithDevicesToLoadHeatMapData,
  transformHeatMapDataFromServer,
  HeatMapPointServerInterface,
  SensorClientRequestedActionInterface,
  transformSensorClientFromServer,
  filteringErrorFieldRelations,
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

  loadReportingFilteringList$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Action & PaginationRequestInterface>(
        ReportingActionTypes.LOAD_REPORTING_FILTERING_LIST_REQUESTED
      ),
      tap(() => {
        this.store.dispatch(
          setReportingFilteringListLoadingStatusAction({
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
            PaginationResponseServerInterface<
              ReportingFilteringDeviceServerInterface
            >
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
              loadReportingFilteringListSucceededAction(
                transformReportingPaginatedDeviceListFromServer(devices)
              )
            ),
            catchError((error) =>
              of(
                loadReportingFilteringListErrorAction(
                  generalTransformFormErrorToObject(
                    error,
                    filteringErrorFieldRelations
                  )
                )
              )
            ),
            finalize(() => {
              this.store.dispatch(
                setReportingFilteringListLoadingStatusAction({
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
        this.store.pipe(select(selectCurrentUserProfileId)),
        this.store.pipe(select(selectFilteredSingularDeviceFilters))
      ),
      switchMap(([{ id, page }, applyFiltersStatus, userId, filteredFilters]) =>
        this.httpClient
          .get<
            PaginationResponseServerInterface<
              ReportingFilteringDeviceServerInterface
            >
          >(
            transformEndpointWithApplyStatus(
              `/api/sensors/${id}/relevant-data?page=${page}`,
              applyFiltersStatus,
              +userId,
              this.filtersService,
              filteredFilters
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
            catchError((error) =>
              of(
                loadReportingDeviceErrorAction(
                  generalTransformFormErrorToObject(
                    error,
                    filteringErrorFieldRelations
                  )
                )
              )
            ),
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
      switchMap((req) =>
        this.httpClient
          .put<void>(
            `/api/sensors/${req?.gps?.id}/set-gps`,
            transformSetGpsToServer(req)
          )
          .pipe(
            map(() => setGpsSucceededAction()),
            tap(() => {
              this.store.dispatch(
                loadAdditionalSensorInfoRequestedAction({ id: req?.gps?.id })
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

  exportRelevantDataFormat$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Action & ExportRelevantDataPayloadInterface>(
        ReportingActionTypes.EXPORT_RELEVANT_DATA_REQUESTED
      ),
      tap(() => {
        this.store.dispatch(
          setExportRelevantLoadingStatusAction({
            status: true,
          })
        );
      }),
      withLatestFrom(
        this.store.pipe(select(selectApplyFiltersStatus)),
        this.store.pipe(select(selectCurrentUserProfileId))
      ),
      switchMap(([{ format }, applyFiltersStatus, userId]) => {
        return this.httpClient
          .get<void>(
            transformEndpointWithApplyStatus(
              `/api/relevant-data/export/${format}?`,
              applyFiltersStatus,
              +userId,
              this.filtersService
            )
          )
          .pipe(
            map(() => exportRelevantDataSucceededAction()),
            catchError((error) => of(exportRelevantDataErrorAction())),
            finalize(() => {
              this.store.dispatch(
                setExportRelevantLoadingStatusAction({
                  status: false,
                })
              );
            })
          );
      })
    )
  );

  buildVehicleRoute$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Action>(ReportingActionTypes.BUILD_VEHICLE_ROUTE_REQUESTED),
      tap(() => {
        this.store.dispatch(
          setBuildingRouteLoadingStatusAction({
            status: true,
          })
        );
      }),
      withLatestFrom(
        this.store.pipe(select(selectApplyFiltersStatus)),
        this.store.pipe(select(selectCurrentUserProfileId))
      ),
      switchMap(([_, status, userId]) => {
        const plateNumber = this.filtersService.getUserFilter(
          'license_plate_number',
          +userId
        )?.value as string;

        return this.httpClient
          .get<LatLngServerInterface[]>(
            transformEndpointWithApplyStatus(
              `/api/relevant-data/route/${plateNumber}?`,
              status,
              +userId,
              this.filtersService
            )
          )
          .pipe(
            map((points) =>
              buildVehicleRouteSucceededAction(
                transformBuildingRouteFromServer(points)
              )
            ),
            catchError((error) => of(buildVehicleRouteErrorAction())),
            finalize(() => {
              this.store.dispatch(
                setBuildingRouteLoadingStatusAction({
                  status: false,
                })
              );
            })
          );
      })
    )
  );

  loadHeatMapData$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Action & HeatMapDataRequestedActionInterface>(
        ReportingActionTypes.HEAT_MAP_DATA_REQUESTED
      ),
      tap(() => {
        this.store.dispatch(
          setHeatMapDataLoadingStatusAction({
            status: true,
          })
        );
      }),
      withLatestFrom(
        this.store.pipe(select(selectReportingFilteringList)),
        this.store.pipe(select(selectReportingSelectedDeviceList))
      ),
      switchMap(([{ isForDevice }, devices, selectedDeviceSensors]) => {
        return this.httpClient
          .get<HeatMapPointServerInterface[]>(
            transformUrlWithDevicesToLoadHeatMapData(
              `/api/relevant-data/heat-map?`,
              (isForDevice ? selectedDeviceSensors : devices) || []
            )
          )
          .pipe(
            map((points) =>
              heatMapDataSucceededAction(transformHeatMapDataFromServer(points))
            ),
            catchError((error) => of(heatMapDataErrorAction())),
            finalize(() => {
              this.store.dispatch(
                setHeatMapDataLoadingStatusAction({
                  status: false,
                })
              );
            })
          );
      })
    )
  );

  loadPlateNumberList$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Action & AutocompleteNameServerInterface>(
        ReportingActionTypes.PLATE_NUMBER_LIST_REQUESTED
      ),
      debounceTime(150),
      switchMap(({ name }) => {
        return this.httpClient
          .get<string[]>(
            `/api/relevant-data/license-plates?license_plate=${name}`
          )
          .pipe(
            map((response) =>
              plateNumberListSucceededAction({
                names: response,
              })
            ),
            catchError((error) => of(plateNumberListErrorAction()))
          );
      })
    )
  );

  pedestrianFlowList$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Action>(ReportingActionTypes.PEDESTRIAN_FLOW_LIST_REQUESTED),
      withLatestFrom(this.store.pipe(select(selectPedestrianFlowList))),
      switchMap(([_, pedestrianFlowList]) => {
        // cache data
        if (pedestrianFlowList?.length) {
          return of(
            pedestrianFlowListSucceededAction({ options: pedestrianFlowList })
          );
        }

        return this.httpClient
          .get<OptionServerInterface[]>(
            `/api/relevant-data/pedestrian-transit-methods`
          )
          .pipe(
            map((response) =>
              pedestrianFlowListSucceededAction(
                transformOptionsFromServer(response)
              )
            ),
            catchError((error) => of(pedestrianFlowListErrorAction()))
          );
      })
    )
  );

  loadAdditionalSensorInfo$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Action & SensorClientRequestedActionInterface>(
        ReportingActionTypes.LOAD_ADDITIONAL_SENSOR_INFO_REQUESTED
      ),
      tap(() => {
        this.store.dispatch(
          setAdditionalSensorInfoLoadingStatusAction({
            status: true,
          })
        );
      }),
      switchMap(({ id }) =>
        this.httpClient.get<SensorServerInterface>(`/api/sensors/${id}`).pipe(
          map((sensor) =>
            loadAdditionalSensorInfoSucceededAction(
              transformSensorClientFromServer(sensor)
            )
          ),
          catchError((error) => of(loadAdditionalSensorInfoErrorAction())),
          finalize(() => {
            this.store.dispatch(
              setAdditionalSensorInfoLoadingStatusAction({
                status: false,
              })
            );
          })
        )
      )
    )
  );
}
