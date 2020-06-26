import { generalTransformFormError } from './../../core/helpers/generalFormsErrorsTransformation';
import {
  setLoginLoadingStatusAction,
  setCurrentUserLoadingStatusAction,
  setLogoutLoadingStatusAction,
  setPreSignUpLoadingStatusAction,
  setResetPasswordLoadingStatusAction,
  setPreResetPasswordLoadingStatusAction,
} from './../loaders/loaders.actions';
import { LocalStorageService } from './../../core/services/localStorage/local-storage.service';
import { Action, Store } from '@ngrx/store';
import {
  UserResponse,
  transformUserResponse,
  ServerLoginUserResponseInterface,
  transformLoginUserForm,
  transformErrorsToDisplay,
  PreResetPasswordRequestInterface,
} from './user.server.helpers';
import {
  UserActionTypes,
  loadCurrentUserSucceededAction,
  loadCurrentUserRequestedAction,
  loadCurrentUserErrorAction,
  loginUserSucceededAction,
  loginUserErrorAction,
  logoutUserErrorAction,
  logoutUserSucceededAction,
  resetCurrentUserAction,
  resetLoginUserErrorAction,
  resetPasswordSucceededAction,
  resetPasswordErrorAction,
  preResetPasswordSucceededAction,
  preResetResetPasswordErrorAction,
  preResetPasswordErrorAction,
} from './user.actions';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, Observable } from 'rxjs';
import {
  map,
  catchError,
  switchMap,
  finalize,
  tap,
  filter,
} from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AppState } from '../reducers';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private httpClient: HttpClient,
    private store: Store<AppState>,
    private localStorageService: LocalStorageService
  ) {}

  loadCurrentUser$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActionTypes.LOAD_CURRENT_USER_REQUESTED),
      tap(() => {
        this.store.dispatch(
          setCurrentUserLoadingStatusAction({
            status: true,
          })
        );
      }),
      switchMap(() =>
        this.httpClient.get<UserResponse>('/authApi/profile').pipe(
          map((user) =>
            loadCurrentUserSucceededAction(transformUserResponse(user))
          ),
          catchError((error) => of(loadCurrentUserErrorAction())),
          finalize(() => {
            this.store.dispatch(
              setCurrentUserLoadingStatusAction({
                status: false,
              })
            );
          })
        )
      )
    )
  );

  loginUser$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActionTypes.LOGIN_USER_REQUESTED),
      tap(() => {
        this.store.dispatch(
          setLoginLoadingStatusAction({
            status: true,
          })
        );
      }),
      switchMap((data) =>
        this.httpClient
          .post<ServerLoginUserResponseInterface>(
            '/authApi/api-token-auth',
            transformLoginUserForm(data)
          )
          .pipe(
            map((response) => {
              this.localStorageService.setAuthToken(response.token);
              this.store.dispatch(loadCurrentUserRequestedAction());
              // we don't need the string below because component's destroying
              // this.store.dispatch(resetLoginUserErrorAction());
              return loginUserSucceededAction();
            }),
            catchError((error: HttpErrorResponse) => {
              return of(loginUserErrorAction(transformErrorsToDisplay(error)));
            }),
            finalize(() => {
              this.store.dispatch(
                setLoginLoadingStatusAction({
                  status: false,
                })
              );
            })
          )
      )
    )
  );

  logoutUser$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActionTypes.LOGOUT_USER_REQUESTED),
      tap(() => {
        this.store.dispatch(
          setLogoutLoadingStatusAction({
            status: true,
          })
        );
      }),
      switchMap(() =>
        this.httpClient.get('/authApi/logout').pipe(
          map(() => {
            this.localStorageService.removeAuthToken();
            this.store.dispatch(resetCurrentUserAction());
            return logoutUserSucceededAction();
          }),
          catchError((error) => of(logoutUserErrorAction())),
          finalize(() => {
            this.store.dispatch(
              setLogoutLoadingStatusAction({
                status: false,
              })
            );
          })
        )
      )
    )
  );

  preResetPassword$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActionTypes.PRE_RESET_PASSWORD_REQUESTED),
      tap(() => {
        this.store.dispatch(
          setPreResetPasswordLoadingStatusAction({
            status: true,
          })
        );
      }),
      switchMap((email: PreResetPasswordRequestInterface) =>
        this.httpClient.post('/authApi/reset-password', email).pipe(
          map(() => {
            return preResetPasswordSucceededAction();
          }),
          catchError((error) =>
            of(preResetPasswordErrorAction(generalTransformFormError(error)))
          ),
          finalize(() => {
            this.store.dispatch(
              setPreResetPasswordLoadingStatusAction({
                status: false,
              })
            );
          })
        )
      )
    )
  );

  // isn't checked yet
  resetPassword$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActionTypes.RESET_PASSWORD_REQUESTED),
      tap(() => {
        this.store.dispatch(
          setResetPasswordLoadingStatusAction({
            status: true,
          })
        );
      }),
      switchMap(() =>
        this.httpClient.get('/authApi/reset-password').pipe(
          map(() => {
            return resetPasswordSucceededAction();
          }),
          catchError((error) => of(resetPasswordErrorAction())),
          finalize(() => {
            this.store.dispatch(
              setResetPasswordLoadingStatusAction({
                status: false,
              })
            );
          })
        )
      )
    )
  );

  // preResetPassword$: Observable<Action> = createEffect()
}
