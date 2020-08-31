import { loadReportingDeviceListRequestedAction } from 'app/store/reporting';
import { selectReportingDeviceListMetaCurrentPage } from './reporting.selectors';
import {
  ReportingActionTypes,
  loadReportingDeviceListSucceededAction,
  loadReportingDeviceListErrorAction,
  LoadReportingDevicePayloadInterface,
  loadReportingDeviceErrorAction,
  loadReportingDeviceSucceededAction,
  setGpsSucceededAction,
  setGpsErrorAction,
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
} from './reporting.server.helpers';
import { updateBreadcrumbByIdAction, setAppTitleAction } from '../app';
import { generalTransformFormErrorToObject } from 'app/core/helpers/generalFormsErrorsTransformation';

@Injectable()
export class ReportingEffects {
  constructor(
    private actions$: Actions,
    private httpClient: HttpClient,
    private store: Store<AppState>,
    private router: Router
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
      switchMap(({ page }) =>
        this.httpClient
          .get<
            PaginationResponseServerInterface<ReportingDeviceServerInterface>
          >(`/api/relevant-data?page=${page}`)
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
      switchMap(({ id, page }) =>
        this.httpClient
          .get<
            PaginationResponseServerInterface<ReportingDeviceServerInterface>
          >(`/api/sensors/${id}/relevant-data?page=${page}`)
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
}
