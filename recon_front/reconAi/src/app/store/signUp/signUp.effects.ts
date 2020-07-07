import { generalTransformFormErrorToObject } from './../../core/helpers/generalFormsErrorsTransformation';
import { UserProfileFormInterface } from './../../constants/types/user';
import { ActivationInterface } from './../../constants/types/activation';
import { Router } from '@angular/router';
import {
  setPreSignUpLoadingStatusAction,
  setActivationLoadingStatusAction,
  setSignUpLoadingStatusAction,
} from './../loaders/loaders.actions';
import { Action, Store } from '@ngrx/store';
import {
  transformPreSignUpUserForm,
  transformSignUpFormToRequest,
  signUpRelationsFormAnsServerFields,
} from './signUp.server.helpers';
import {
  SignUpActionTypes,
  preSignUpUserSucceededAction,
  preSignUpUserErrorAction,
  signUpUserErrorAction,
  setPreSignUpInfoAction,
  activationSucceededAction,
  activationErrorAction,
  signUpUserSucceededAction,
  setIsSuccessSignUpOpenableStatusAction,
  resetSignUpAction,
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
  withLatestFrom,
} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AppState } from '../reducers';
import { generalTransformFormErrorToString } from 'app/core/helpers/generalFormsErrorsTransformation';

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
              this.router.navigate(['/registration']);
              return preSignUpUserSucceededAction();
            }),
            catchError((error) => {
              return of(
                preSignUpUserErrorAction(
                  generalTransformFormErrorToString(error)
                )
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
        this.httpClient.put('/authApi/activate', activation).pipe(
          // check type
          map(() => activationSucceededAction()),
          catchError((error) => {
            return of(activationErrorAction());
          })
        )
      )
    )
  );

  signUpUser$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(SignUpActionTypes.SIGN_UP_USER_REQUESTED),
      tap(() => {
        this.store.dispatch(
          setSignUpLoadingStatusAction({
            status: true,
          })
        );
      }),
      withLatestFrom(this.store),
      switchMap(([user, store]) => {
        const { password1, password2, username } = store.signUp;
        return this.httpClient
          .post(
            '/authApi/signup',
            transformSignUpFormToRequest({
              ...(user as UserProfileFormInterface),
              password1,
              password2,
              username,
            })
          )
          .pipe(
            // check type
            // clean the reducer state out
            map(() => signUpUserSucceededAction()),
            tap(() => {
              this.store.dispatch(resetSignUpAction());
              this.store.dispatch(
                setIsSuccessSignUpOpenableStatusAction({
                  status: true,
                })
              );
              this.router.navigate(['/registration/success']);
            }),
            catchError((error) => {
              return of(
                signUpUserErrorAction(
                  generalTransformFormErrorToObject(
                    error,
                    signUpRelationsFormAnsServerFields
                  )
                )
              );
            }),
            finalize(() => {
              this.store.dispatch(
                setSignUpLoadingStatusAction({
                  status: false,
                })
              );
            })
          );
      })
    )
  );
}
