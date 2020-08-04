import {
  AppTitleActionInterface,
  setAppTitleAction,
  SetBreadCrumbsActionInterface,
  setBreadcrumbsAction,
  UpdateBreadcrumbByIdActionInterface,
  updateBreadcrumbByIdAction,
  InsertBreadcrumbAtIndexActionInterface,
  insertBreadcrumbAtIndexAction,
  SetBreadcrumbsVisibilityActionInterface,
  setBreadcrumbsVisibilityAction,
} from './app.actions';
import { createReducer, on, Action } from '@ngrx/store';
import { BreadcrumbInterface } from 'app/constants/routes';

export interface AppSliceState {
  title: string;
  breadcrumbs: BreadcrumbInterface[];
  breadcrumbsVisibility: boolean;
}

const initialState: AppSliceState = {
  title: 'Recon',
  breadcrumbs: [],
  breadcrumbsVisibility: false,
};

const setAppTitleReducer = (
  state: AppSliceState,
  { title }: Action & AppTitleActionInterface
): AppSliceState => ({ ...state, title });

const setBreadcrumbsReducer = (
  state: AppSliceState,
  { breadcrumbs }: Action & SetBreadCrumbsActionInterface
): AppSliceState => ({ ...state, breadcrumbs });

const updateBreadcrumbByIdReducer = (
  state: AppSliceState,
  { update }: Action & UpdateBreadcrumbByIdActionInterface
): AppSliceState => {
  const oldBreadcrumbIndex = state.breadcrumbs.findIndex(
    ({ id }) => id === update.oldId
  );
  if (oldBreadcrumbIndex === -1) {
    return state;
  }

  const newBreadcrumbs = [...state.breadcrumbs];
  newBreadcrumbs.splice(oldBreadcrumbIndex, 1, {
    ...state.breadcrumbs[oldBreadcrumbIndex],
    label: update.newLabel,
    url: update.newUrl,
  });
  return { ...state, breadcrumbs: newBreadcrumbs };
};

const insertBreadcrumbAtIndexReducer = (
  state: AppSliceState,
  { insert }: Action & InsertBreadcrumbAtIndexActionInterface
): AppSliceState => {
  if (state.breadcrumbs.length < insert.index) {
    return state;
  }

  const newBreadcrumb = {
    url: insert.url,
    label: insert.label,
    id: insert.id || '',
    queryParams: insert.queryParams || null,
  };

  if (state.breadcrumbs.length === insert.index) {
    return {
      ...state,
      breadcrumbs: [...state.breadcrumbs, newBreadcrumb],
    };
  }

  const newBreadcrumbs = [...state.breadcrumbs];
  newBreadcrumbs.splice(insert.index, 0, newBreadcrumb);

  return {
    ...state,
    breadcrumbs: newBreadcrumbs,
  };
};

const setBreadcrumbsVisibilityReducer = (
  state: AppSliceState,
  { visibility }: Action & SetBreadcrumbsVisibilityActionInterface
): AppSliceState => ({ ...state, breadcrumbsVisibility: visibility });

const loadersReducer = createReducer(
  initialState,
  on(setAppTitleAction, setAppTitleReducer),
  on(setBreadcrumbsAction, setBreadcrumbsReducer),
  on(updateBreadcrumbByIdAction, updateBreadcrumbByIdReducer),
  on(insertBreadcrumbAtIndexAction, insertBreadcrumbAtIndexReducer),
  on(setBreadcrumbsVisibilityAction, setBreadcrumbsVisibilityReducer)
);

export function reducer(state: AppSliceState | undefined, action: Action) {
  return loadersReducer(state, action);
}
