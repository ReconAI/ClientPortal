import { LoadersState } from './../loaders/loaders.reducer';
import { UserState } from './../user/user.reducer';
import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '@env';
import { storeLogger } from 'ngrx-store-logger';

import * as user from '../user';
import * as loaders from '../loaders';
import * as signUp from '../signUp';
import * as users from '../users';
import * as app from '../app';

import { SignUpState } from '../signUp';
import { UsersState } from '../users';
import { AppSliceState } from '../app';

// NgRx logger from https://github.com/btroncone/ngrx-store-logger
export function logger(reducer: ActionReducer<AppState>): any {
  return storeLogger()(reducer);
}

export interface AppState {
  user: UserState;
  loaders: LoadersState;
  signUp: SignUpState;
  users: UsersState;
  app: AppSliceState;
}

export const reducers: ActionReducerMap<AppState> = {
  user: user.reducer,
  loaders: loaders.reducer,
  signUp: signUp.reducer,
  users: users.reducer,
  app: app.reducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? [logger]
  : [];
