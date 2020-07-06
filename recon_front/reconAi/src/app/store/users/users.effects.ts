import {
  UsersListResponseInterface,
  transformUsersListResponseFromServer,
  UsersListRequestInterface,
} from './users.server.helpers';
import {
  UsersActionTypes,
  loadUsersListSucceededAction,
  loadUsersListErrorAction,
} from './users.actions';
import { Router } from '@angular/router';
import { Action, Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, Observable } from 'rxjs';
import { map, catchError, switchMap, tap, finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AppState } from '../reducers';
import { setUserListLoadingStatusAction } from '../loaders';

@Injectable()
export class UsersEffects {
  constructor(
    private actions$: Actions,
    private httpClient: HttpClient,
    private store: Store<AppState>,
    private router: Router
  ) {}

  loadUsersList$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Action & UsersListRequestInterface>(
        UsersActionTypes.LOAD_USERS_LIST_REQUESTED
      ),
      tap(() => {
        this.store.dispatch(
          setUserListLoadingStatusAction({
            status: true,
          })
        );
      }),
      switchMap(({ page }) =>
        this.httpClient
          .get<UsersListResponseInterface>(`/api/users?page=${page}`)
          .pipe(
            map((users) =>
              loadUsersListSucceededAction(
                transformUsersListResponseFromServer(users)
              )
            ),
            catchError((error) => {
              return of(loadUsersListErrorAction());
            }),
            finalize(() => {
              this.store.dispatch(
                setUserListLoadingStatusAction({
                  status: false,
                })
              );
            })
          )
      )
    )
  );
}
