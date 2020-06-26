import { ActivationInterface } from './../../constants/types/activation';
import { Router } from '@angular/router';
import {
  setPreSignUpLoadingStatusAction,
  setActivationLoadingStatusAction,
} from './../loaders/loaders.actions';
import { Action, Store } from '@ngrx/store';
import {
  transformPreSignUpUserForm,
  transformErrorPreSignUp,
} from './signUp.server.helpers';
import {
  SignUpActionTypes,
  preSignUpUserSucceededAction,
  preSignUpUserErrorAction,
  setPreSignUpInfoAction,
  activationSucceededAction,
  activationErrorAction,
} from './signUp.actions';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, Observable } from 'rxjs';
import {
  map,
  catchError,
  switchMap,
  finalize,
  tap,
  delay,
} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AppState } from '../reducers';

@Injectable()
export class SignUpEffects {
  constructor(
    private actions$: Actions,
    private httpClient: HttpClient,
    private store: Store<AppState>,
    private router: Router
  ) {}

  preSignUp$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(SignUpActionTypes.PRE_SIGN_UP_USER_REQUESTED),
      tap(() => {
        this.store.dispatch(
          setPreSignUpLoadingStatusAction({
            status: true,
          })
        );
      }),
      switchMap((user) =>
        this.httpClient
          .post('/authApi/pre-signup', transformPreSignUpUserForm(user))
          .pipe(
            // check type
            map(() => {
              this.store.dispatch(setPreSignUpInfoAction(user));
              return preSignUpUserSucceededAction();
            }),
            tap(() => {
              this.router.navigate(['/registration']);
            }),
            catchError((error) => {
              return of(
                preSignUpUserErrorAction(transformErrorPreSignUp(error))
              );
            }),
            finalize(() => {
              this.store.dispatch(
                setPreSignUpLoadingStatusAction({
                  status: false,
                })
              );
            })
          )
      )
    )
  );

  activateUser$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(SignUpActionTypes.ACTIVATION_REQUESTED),
      switchMap((activation: ActivationInterface) =>
        this.httpClient.post('/authApi/activate', activation).pipe(
          // check type
          map(() => activationSucceededAction()),
          catchError((error) => {
            return of(activationErrorAction());
          })
        )
      )
    )
  );
}
