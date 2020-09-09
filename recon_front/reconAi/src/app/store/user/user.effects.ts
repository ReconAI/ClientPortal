import { FiltersService } from './../../core/services/filters/filters.service';
import { selectCurrentUserProfileId } from 'app/store/user/user.selectors';
import { BasketService } from './../../core/services/basket/basket.service';
import { UserRolesPriorities } from './../../constants/types/user';
import { getUserPriorityByRole } from './../../core/helpers/priorities';
import {
  selectCurrentUserName,
  selectCurrentUserProfileInvoicing,
} from './user.selectors';
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
  setAttachCardLoadingStatusAction,
  setUserCardsLoadingStatusAction,
  setDetachCardLoadingStatusAction,
  setNewFeatureRequestLoadingStatusAction,
  setDefaultPaymentMethodLoadingStatusAction,
  setChangePasswordLoadingStatusAction,
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
  AttachCardRequestClientInterface,
  transformAttachCardRequestToServer,
  transformCardListFromServer,
  DeleteUserCardRequestInterface,
  transformDetachCardRequestToServer,
  NewRequestFeatureClientInterface,
  transformNewRequestToServer,
  SetDefaultPaymentMethodClientInterface,
  transformSetDefaultPaymentToServer,
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
  attachCardSucceededAction,
  attachCardErrorAction,
  loadUserCardsRequestedAction,
  loadUserCardsSucceededAction,
  loadUserCardsErrorAction,
  deleteUserCardSucceededAction,
  deleteUserCardErrorAction,
  newRequestFeatureSucceededAction,
  newRequestFeatureErrorAction,
  setDefaultPaymentMethodSucceededAction,
  setDefaultPaymentMethodErrorAction,
  changePasswordSucceededAction,
  changePasswordErrorAction,
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
  mergeMap,
} from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AppState } from '../reducers';
import {
  ServerUserInterface,
  UserProfileFormInterface,
  signUpRelationsFormAnsServerFields,
} from 'app/constants/types';
import { CardServerInterface } from 'app/constants/types/card';
import { loadCategoriesRequestedAction } from '../orders';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private httpClient: HttpClient,
    private store: Store<AppState>,
    private router: Router,
    private localStorageService: LocalStorageService,
    private basketService: BasketService,
    private filtersService: FiltersService
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
          map((user) => {
            if (
              getUserPriorityByRole(user?.group?.name) >=
              UserRolesPriorities.DEVELOPER_ROLE
            ) {
              this.store.dispatch(loadUserCardsRequestedAction());
            }
            this.basketService.initBasketAmount(+user.id);
            return loadCurrentUserSucceededAction(transformUserResponse(user));
          }),
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
      withLatestFrom(this.store.pipe(select(selectCurrentUserProfileId))),
      switchMap(([_, userId]) =>
        this.httpClient.put('/api/logout', {}).pipe(
          map(() => {
            this.localStorageService.removeAuthToken();
            return logoutUserSucceededAction();
          }),
          tap(() => {
            this.basketService.deleteDevicesOfUser(+userId);
            this.filtersService.resetUserFilters(+userId);
            this.store.dispatch(resetCurrentUserAction());
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
      withLatestFrom(
        this.store.pipe(select(selectCurrentUserName)),
        this.store.pipe(select(selectCurrentUserProfileInvoicing))
      ),
      switchMap(([user, username, invoicing]) => {
        // it's used to get invoicing info for current client
        const finalUser = { ...{ invoicing }, ...user };
        return this.httpClient
          .put(
            '/api/profile',
            transformUpdateCurrentUserToServer(finalUser, username)
          )
          .pipe(
            map(() => {
              this.store.dispatch(resetUpdateCurrentUserErrorAction());
              return updateCurrentUserSucceededAction(finalUser);
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

  // loading status is set in stripe service
  attachCard$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<AttachCardRequestClientInterface & Action>(
        UserActionTypes.ATTACH_CARD_REQUESTED
      ),
      switchMap((card) => {
        return this.httpClient
          .post<void>('/api/cards', transformAttachCardRequestToServer(card))
          .pipe(
            map(() => attachCardSucceededAction()),
            tap(() => {
              this.store.dispatch(loadUserCardsRequestedAction());
            }),
            catchError((error) =>
              of(
                attachCardErrorAction(generalTransformFormErrorToString(error))
              )
            ),
            finalize(() => {
              this.store.dispatch(
                setAttachCardLoadingStatusAction({
                  status: false,
                })
              );
            })
          );
      })
    )
  );

  loadCards$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Action>(UserActionTypes.LOAD_USER_CARDS_REQUESTED),
      tap(() => {
        this.store.dispatch(
          setUserCardsLoadingStatusAction({
            status: true,
          })
        );
      }),
      switchMap(() => {
        return this.httpClient.get<CardServerInterface[]>('/api/cards').pipe(
          map((cards) =>
            loadUserCardsSucceededAction(transformCardListFromServer(cards))
          ),
          catchError((error) => of(loadUserCardsErrorAction())),
          finalize(() => {
            this.store.dispatch(
              setUserCardsLoadingStatusAction({
                status: false,
              })
            );
          })
        );
      })
    )
  );

  deleteCard$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Action & DeleteUserCardRequestInterface>(
        UserActionTypes.DELETE_USER_CARD_REQUESTED
      ),
      tap(() => {
        this.store.dispatch(
          setDetachCardLoadingStatusAction({
            status: true,
          })
        );
      }),
      switchMap((id) =>
        this.httpClient
          .request<void>('delete', `/api/cards`, {
            body: transformDetachCardRequestToServer(id),
          })
          .pipe(
            map(() => deleteUserCardSucceededAction()),
            tap(() => {
              this.store.dispatch(loadUserCardsRequestedAction());
            }),
            catchError((error) => of(deleteUserCardErrorAction())),
            finalize(() => {
              this.store.dispatch(
                setDetachCardLoadingStatusAction({
                  status: false,
                })
              );
            })
          )
      )
    )
  );

  // move it later
  newRequestFeature$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Action & NewRequestFeatureClientInterface>(
        UserActionTypes.NEW_REQUEST_FEATURE_REQUESTED
      ),
      tap(() => {
        this.store.dispatch(
          setNewFeatureRequestLoadingStatusAction({
            status: true,
          })
        );
      }),
      mergeMap(
        async (newRequestFeature) =>
          await transformNewRequestToServer(newRequestFeature)
      ),
      switchMap((formedFeature) =>
        this.httpClient.post<void>('/api/new-features', formedFeature).pipe(
          map(() => newRequestFeatureSucceededAction()),
          tap(() => {
            this.router.navigate(['/']);
          }),
          catchError((error) =>
            of(
              newRequestFeatureErrorAction(
                generalTransformFormErrorToString(error)
              )
            )
          ),
          finalize(() => {
            this.store.dispatch(
              setNewFeatureRequestLoadingStatusAction({
                status: false,
              })
            );
          })
        )
      )
    )
  );

  setDefaultPaymentMethod$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<SetDefaultPaymentMethodClientInterface & Action>(
        UserActionTypes.SET_DEFAULT_PAYMENT_METHOD_REQUESTED
      ),
      tap(() => {
        this.store.dispatch(
          setDefaultPaymentMethodLoadingStatusAction({
            status: true,
          })
        );
      }),
      switchMap((paymentMethod) =>
        this.httpClient
          .put<void>(
            '/api/payment-methods',
            transformSetDefaultPaymentToServer(paymentMethod)
          )
          .pipe(
            map(() => setDefaultPaymentMethodSucceededAction(paymentMethod)),
            catchError((error) => of(setDefaultPaymentMethodErrorAction())),
            finalize(() => {
              this.store.dispatch(
                setDefaultPaymentMethodLoadingStatusAction({
                  status: false,
                })
              );
            })
          )
      )
    )
  );

  changePassword$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Action>(UserActionTypes.CHANGE_PASSWORD_REQUESTED),
      tap(() => {
        this.store.dispatch(
          setChangePasswordLoadingStatusAction({
            status: true,
          })
        );
      }),
      switchMap(() =>
        this.httpClient.get<void>('/api/change-password').pipe(
          map(() => changePasswordSucceededAction()),
          catchError((error) => of(changePasswordErrorAction())),
          finalize(() => {
            this.store.dispatch(
              setChangePasswordLoadingStatusAction({
                status: false,
              })
            );
          })
        )
      )
    )
  );
}
