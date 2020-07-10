import { AppTitleActionInterface, setAppTitleAction } from './app.actions';
import { createReducer, on, Action } from '@ngrx/store';

export interface AppSliceState {
  title: string;
}

const initialState: AppSliceState = {
  title: 'Recon',
};

const setAppTitleReducer = (
  state: AppSliceState,
  { title }: Action & AppTitleActionInterface
): AppSliceState => ({ ...state, title });

const loadersReducer = createReducer(
  initialState,
  on(setAppTitleAction, setAppTitleReducer)
);

export function reducer(state: AppSliceState | undefined, action: Action) {
  return loadersReducer(state, action);
}
