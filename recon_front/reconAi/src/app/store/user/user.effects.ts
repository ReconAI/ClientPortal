import { selectCurrentUserName } from './user.selectors';
import { Router } from '@angular/router';
import { ResetPasswordWithMetaInterface } from 'app/constants/types/resetPassword';
import {
  generalTransformFormErrorToString,
  generalTransformFormErrorToObject,
} from './../../core/helpers/generalFormsErrorsTransformation';
import {
  setLoginLoadingStatusAction,
  setCurrentUserLoadingStatusAction,
  setLogoutLoadingStatusAction,
  setPreSignUpLoadingStatusAction,
  setResetPasswordLoadingStatusAction,
  setPreResetPasswordLoadingStatusAction,
  setUpdateCurrentUserLoadingStatusAction,
} from './../loaders/loaders.actions';
import { LocalStorageService } from './../../core/services/localStorage/local-storage.service';
import { Action, Store, select } from '@ngrx/store';
import {
  transformUserResponse,
  ServerLoginUserResponseInterface,
  transformLoginUserForm,
  PreResetPasswordRequestInterface,
  transformResetPasswordFormToRequest,
  transformUpdateCurrentUserToServer,
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
  updateCurrentUserSucceededAction,
  resetUpdateCurrentUserErrorAction,
  updateCurrentUserErrorAction,
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
  withLatestFrom,
} from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AppState } from '../reducers';
import {
  ServerUserInterface,
  UserProfileFormInterface,
  signUpRelationsFormAnsServerFields,
} from 'app/constants/types';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private httpClient: HttpClient,
    private store: Store<AppState>,
    private router: Router,
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
        this.httpClient.get<ServerUserInterface>('/api/profile').pipe(
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
            '/api/api-token-auth',
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
            tap(() => {
              this.router.navigate(['/']);
            }),
            catchError((error: HttpErrorResponse) => {
              return of(
                loginUserErrorAction(generalTransformFormErrorToString(error))
              );
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
        this.httpClient.put('/api/logout', {}).pipe(
          map(() => {
            this.localStorageService.removeAuthToken();
            this.store.dispatch(resetCurrentUserAction());
            return logoutUserSucceededAction();
          }),
          tap(() => {
            this.router.navigate(['/']);
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
        this.httpClient.post('/api/reset-password', email).pipe(
          map(() => {
            // check if we need it
            this.store.dispatch(preResetResetPasswordErrorAction());
            return preResetPasswordSucceededAction();
          }),
          catchError((error) =>
            of(
              preResetPasswordErrorAction(
                generalTransformFormErrorToString(error)
              )
            )
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
      switchMap((credentials: ResetPasswordWithMetaInterface) => {
        return this.httpClient
          .put('/api/reset', transformResetPasswordFormToRequest(credentials))
          .pipe(
            map(() => {
              return resetPasswordSucceededAction();
            }),
            catchError((error) =>
              of(
                resetPasswordErrorAction(
                  generalTransformFormErrorToString(error)
                )
              )
            ),
            finalize(() => {
              this.store.dispatch(
                setResetPasswordLoadingStatusAction({
                  status: false,
                })
              );
            })
          );
      })
    )
  );

  updateCurrentUser$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<UserProfileFormInterface & Action>(
        UserActionTypes.UPDATE_CURRENT_USER_REQUESTED
      ),
      tap(() => {
        this.store.dispatch(
          setUpdateCurrentUserLoadingStatusAction({
            status: true,
          })
        );
      }),
      withLatestFrom(this.store.pipe(select(selectCurrentUserName))),
      switchMap(([user, username]) => {
        console.log(user, 'EFFECT');
        return this.httpClient
          .put(
            '/api/profile',
            transformUpdateCurrentUserToServer(user, username)
          )
          .pipe(
            map(() => {
              this.store.dispatch(resetUpdateCurrentUserErrorAction());
              return updateCurrentUserSucceededAction(user);
            }),
            catchError((error) =>
              of(
                updateCurrentUserErrorAction(
                  generalTransformFormErrorToObject(
                    error,
                    signUpRelationsFormAnsServerFields
                  )
                )
              )
            ),
            finalize(() => {
              this.store.dispatch(
                setUpdateCurrentUserLoadingStatusAction({
                  status: false,
                })
              );
            })
          );
      })
    )
  );
}
