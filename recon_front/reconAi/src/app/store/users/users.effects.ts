import { setAppTitleAction } from './../app/app.actions';
import { UserProfileFormInterface } from './../../constants/types/user';
import { generalTransformFormErrorToObject } from './../../core/helpers/generalFormsErrorsTransformation';
import {
  ServerUserInterface,
  CredentialsRequestInterface,
  UserProfileFormUserInterface,
  signUpRelationsFormAnsServerFields,
} from 'app/constants/types';
import { ActivationInterface } from './../../constants/types/activation';
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
  transformInviteSignUpUserToServer,
  transformActivateUserToClient,
  transformUpdateUserToServer,
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
  inviteUserSucceededAction,
  inviteUserErrorAction,
  inviteUserActivationSucceededAction,
  invitationSignUpSucceededAction,
  invitationSignUpErrorAction,
  updateUserSucceeded,
  updateUserError,
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
  setInviteUserLoadingStatusAction,
  setInviteSignUpUserLoadingStatusAction,
  setUpdateUserLoadingStatusAction,
} from '../loaders';
import {
  selectUsersList,
  selectUsersMetaCurrentPage,
  selectInvitedActivation,
  selectUserProfileId,
} from './users.selectors';
import { AddUserInterface } from 'app/users/constants';
import { transformUserResponse } from '../user/user.server.helpers';

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
            tap((user) => {
              this.store.dispatch(
                setAppTitleAction({
                  title: `Profile ${user.user?.firstName || ''} ${
                    user.user?.lastName || ''
                  }`,
                })
              );
            }),
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
      withLatestFrom(this.store.pipe(select(selectUsersMetaCurrentPage))),
      switchMap(([user, currentPage]) =>
        this.httpClient.post('/api/users', transformAddUserToServer(user)).pipe(
          map(() => {
            this.store.dispatch(
              loadUsersListRequestedAction({
                page: currentPage,
              })
            );
            return addUserSucceededAction();
          }),
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

  activate$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Action & ActivationInterface>(
        UsersActionTypes.INVITE_USER_REQUESTED
      ),
      tap(() => {
        this.store.dispatch(
          setInviteUserLoadingStatusAction({
            status: true,
          })
        );
      }),
      switchMap((activation) =>
        this.httpClient
          .post<ServerUserInterface>('/api/users/invitations', activation)
          .pipe(
            map((user) => {
              this.store.dispatch(
                inviteUserActivationSucceededAction(activation)
              );
              let roleName = user?.group?.name || 'user';
              roleName = roleName.charAt(0).toUpperCase() + roleName.slice(1);
              this.store.dispatch(
                setAppTitleAction({
                  title: `${roleName}'s registration`,
                })
              );
              return inviteUserSucceededAction(
                transformActivateUserToClient(user)
              );
            }),
            catchError((error) => {
              this.router.navigate(['/']);
              return of(inviteUserErrorAction());
            }),
            finalize(() => {
              this.store.dispatch(
                setInviteUserLoadingStatusAction({
                  status: false,
                })
              );
            })
          )
      )
    )
  );

  signUpActivation$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Action & UserProfileFormInterface>(
        UsersActionTypes.INVITATION_SIGN_UP_REQUESTED
      ),
      tap(() => {
        this.store.dispatch(
          setInviteSignUpUserLoadingStatusAction({
            status: true,
          })
        );
      }),
      withLatestFrom(this.store.pipe(select(selectInvitedActivation))),
      switchMap(([user, activation]) =>
        this.httpClient
          .patch(
            `/api/users/invitations`,
            transformInviteSignUpUserToServer(user, activation)
          )
          .pipe(
            map(() => invitationSignUpSucceededAction()),
            tap(() => {
              this.router.navigate(['/']);
            }),
            catchError((error) =>
              of(
                invitationSignUpErrorAction(
                  generalTransformFormErrorToObject(
                    error,
                    signUpRelationsFormAnsServerFields
                  )
                )
              )
            ),
            finalize(() => {
              this.store.dispatch(
                setInviteSignUpUserLoadingStatusAction({
                  status: false,
                })
              );
            })
          )
      )
    )
  );

  update$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Action & UserProfileFormUserInterface>(
        UsersActionTypes.UPDATE_USER_REQUESTED
      ),
      tap(() => {
        this.store.dispatch(
          setUpdateUserLoadingStatusAction({
            status: true,
          })
        );
      }),
      withLatestFrom(this.store.pipe(select(selectUserProfileId))),
      switchMap(([user, id]) =>
        this.httpClient
          .put(`/api/users/${id}`, transformUpdateUserToServer(user))
          .pipe(
            map(() => updateUserSucceeded()),
            catchError((error) => of(updateUserError())),
            finalize(() => {
              this.store.dispatch(
                setUpdateUserLoadingStatusAction({
                  status: false,
                })
              );
            })
          )
      )
    )
  );
}
