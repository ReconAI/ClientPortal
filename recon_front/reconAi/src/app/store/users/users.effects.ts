import { tap, switchMap } from 'rxjs/operators';
import { UsersActionTypes } from './users.actions';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { setUserListLoadingStatusAction } from '../loaders';

@Injectable()
export class UsersEffects {
  constructor(private actions$: Actions) {}

  // loadUsersList$: Observable<Action> = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(UsersActionTypes.LOAD_USERS_LIST_REQUESTED),
  //     tap(() => {
  //       this.store.dispatch(
  //         setUserListLoadingStatusAction({
  //           status: true,
  //         })
  //       );
  //     }),
  //     switchMap(() =>
  //       this.httpClient.get<UserResponse>('/authApi/profile').pipe(
  //         map((user) =>
  //           loadCurrentUserSucceededAction(transformUserResponse(user))
  //         ),
  //         catchError((error) => of(loadCurrentUserErrorAction())),
  //         finalize(() => {
  //           this.store.dispatch(
  //             setUserListLoadingStatusAction({
  //               status: false,
  //             })
  //           );
  //         })
  //       )
  //     )
  //   )
  // );
}
