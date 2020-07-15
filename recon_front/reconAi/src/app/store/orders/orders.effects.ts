import {
  CategoriesServerResponseInterface,
  transformCategoriesFromServer,
} from './orders.server.helpers';
import { Router } from '@angular/router';
import { Action, Store, select } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, Observable } from 'rxjs';
import { map, catchError, switchMap, tap, finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AppState } from '../reducers';
import {
  OrdersActionTypes,
  loadCategoriesSucceededAction,
  loadCategoriesErrorAction,
} from './orders.actions';
import { setCategoriesListLoadingStatusAction } from '../loaders';

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
        this.httpClient
          .get<CategoriesServerResponseInterface>(`/order-api/categories?page=${1}`)
          .pipe(
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
}
