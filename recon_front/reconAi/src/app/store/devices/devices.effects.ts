import { SensorServerInterface } from './../../constants/types/sensors';
import { setSensorListLoadingStatusAction } from './../loaders/loaders.actions';

import {
  PaginationRequestInterface,
  PaginationResponseServerInterface,
} from 'app/constants/types/requests';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppState } from '../reducers';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { tap, switchMap, map, catchError, finalize } from 'rxjs/operators';

import {
  DevicesActionsTypes,
  loadSensorsListErrorAction,
  loadSensorsListSucceededAction,
} from './devices.actions';
import { transformSensorsFromServer } from './devices.server.helpers';

@Injectable()
export class DevicesEffects {
  constructor(
    private actions$: Actions,
    private httpClient: HttpClient,
    private store: Store<AppState>
  ) {}

  loadSensorsList$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Action & PaginationRequestInterface>(
        DevicesActionsTypes.LOAD_SENSORS_LIST_REQUESTED
      ),
      tap(() => {
        this.store.dispatch(
          // change name
          setSensorListLoadingStatusAction({
            status: true,
          })
        );
      }),
      switchMap(({ page }) =>
        this.httpClient
          .get<PaginationResponseServerInterface<SensorServerInterface>>(
            `/api/sensors?page=${page}`
          )
          .pipe(
            map((sensors) =>
              loadSensorsListSucceededAction(
                transformSensorsFromServer(sensors)
              )
            ),
            catchError((error) => of(loadSensorsListErrorAction())),
            finalize(() => {
              this.store.dispatch(
                setSensorListLoadingStatusAction({
                  status: false,
                })
              );
            })
          )
      )
    )
  );
}
