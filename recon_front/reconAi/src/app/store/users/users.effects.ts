import { generalTransformFormErrorToString } from 'app/core/helpers/generalFormsErrorsTransformation';
import {
  UsersListResponseInterface,
  transformUsersListResponseFromServer,
  UsersListRequestInterface,
  UserProfileRequestInterface,
  transformUserProfileResponseFromServer,
  ServerUserProfileInterface,
  calculatePageAfterDelete,
  transformAddUserToServer,
} from './users.server.helpers';
import {
  UsersActionTypes,
  loadUsersListSucceededAction,
  loadUsersListErrorAction,
  loadUserProfileSucceededAction,
  loadUserProfileErrorAction,
  deleteUserSucceededAction,
  deleteUserErrorAction,
  loadUsersListRequestedAction,
  addUserSucceededAction,
  addUserErrorAction,
} from './users.actions';
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
  withLatestFrom,
} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AppState } from '../reducers';
import {
  setUserListLoadingStatusAction,
  setUserProfileLoadingStatusAction,
  setDeleteUserLoadingStatusAction,
  setAddUserLoadingStatusAction,
} from '../loaders';
import { selectUsersList, selectUsersMetaCurrentPage } from './users.selectors';
import { AddUserInterface } from 'app/users/constants';

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

  loadUserProfile$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Action & UserProfileRequestInterface>(
        UsersActionTypes.LOAD_USER_PROFILE_REQUESTED
      ),
      tap(() => {
        this.store.dispatch(
          setUserProfileLoadingStatusAction({
            status: true,
          })
        );
      }),
      switchMap(({ id }) =>
        this.httpClient
          .get<ServerUserProfileInterface>(`/api/users/${id}`)
          .pipe(
            map((user) =>
              loadUserProfileSucceededAction(
                transformUserProfileResponseFromServer(user)
              )
            ),
            catchError((error) => {
              return of(loadUserProfileErrorAction());
            }),
            finalize(() => {
              this.store.dispatch(
                setUserProfileLoadingStatusAction({
                  status: false,
                })
              );
            })
          )
      )
    )
  );

  deleteUser$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Action & UserProfileRequestInterface>(
        UsersActionTypes.DELETE_USER_REQUESTED
      ),
      tap(() => {
        this.store.dispatch(
          setDeleteUserLoadingStatusAction({
            status: true,
          })
        );
      }),
      withLatestFrom(
        this.store.pipe(select(selectUsersList)),
        this.store.pipe(select(selectUsersMetaCurrentPage))
      ),
      switchMap(([{ id }, users, currentPage]) =>
        this.httpClient.delete(`/api/users/${id}`).pipe(
          map(() => {
            this.store.dispatch(
              loadUsersListRequestedAction({
                page: calculatePageAfterDelete(currentPage, users.length),
              })
            );
            return deleteUserSucceededAction();
          }),
          catchError((error) => {
            return of(deleteUserErrorAction());
          }),
          finalize(() => {
            this.store.dispatch(
              setDeleteUserLoadingStatusAction({
                status: false,
              })
            );
          })
        )
      )
    )
  );

  addUser$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Action & AddUserInterface>(UsersActionTypes.ADD_USER_REQUESTED),
      tap(() => {
        this.store.dispatch(
          setAddUserLoadingStatusAction({
            status: true,
          })
        );
      }),
      switchMap((user) =>
        this.httpClient.post('/api/users', transformAddUserToServer(user)).pipe(
          map(() => addUserSucceededAction()),
          catchError((error) => {
            return of(
              addUserErrorAction(generalTransformFormErrorToString(error))
            );
          }),
          finalize(() => {
            this.store.dispatch(
              setAddUserLoadingStatusAction({
                status: false,
              })
            );
          })
        )
      )
    )
  );
}
