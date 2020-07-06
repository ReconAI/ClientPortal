import { createReducer, on, Action } from '@ngrx/store';

export interface UsersState {
  list: number[];
}

export const initialState: UsersState = {
  list: [],
};

const signUpReducer = createReducer(
  initialState,
);

export function reducer(state: UsersState | undefined, action: Action) {
  return signUpReducer(state, action);
}
