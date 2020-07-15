import { CategoryInterface } from './../../orders/constants/types/category';
import {
  CategoriesServerResponseInterface,
  transformCategoriesFromServer,
  CategoriesClientInterface,
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
  updateCategoriesSucceededAction,
  updateCategoriesErrorAction,
} from './orders.actions';
import {
  setCategoriesListLoadingStatusAction,
  setUpdateCategoriesListLoadingStatusAction,
} from '../loaders';

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
          .post<CategoryInterface[]>('/order-api/categories', categories)
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
}
