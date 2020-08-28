import { FilterItemInterface } from 'app/reporting/constants/types/filters';
import { MetaClientInterface } from './../../constants/types/requests';
import { ReportingDeviceClientInterface } from './reporting.server.helpers';
import { createSelector } from '@ngrx/store';
import { AppState } from '../reducers';
import { ReportingState } from './reporting.reducer';

export const selectReporting = (state: AppState): ReportingState =>
  state.reporting;

export const selectReportingDeviceList = createSelector(
  selectReporting,
  (reporting: ReportingState): ReportingDeviceClientInterface[] =>
    reporting.list
);

export const selectReportingDeviceListMeta = createSelector(
  selectReporting,
  (reporting: ReportingState): MetaClientInterface => reporting.meta
);

export const selectReportingDeviceListMetaCurrentPage = createSelector(
  selectReportingDeviceListMeta,
  (meta: MetaClientInterface): number => meta.currentPage
);

export const selectReportingDeviceListMetaCount = createSelector(
  selectReportingDeviceListMeta,
  (meta: MetaClientInterface): number => meta.count
);

export const selectReportingDeviceListMetaPageSize = createSelector(
  selectReportingDeviceListMeta,
  (meta: MetaClientInterface): number => meta.pageSize
);

export const selectReportingSelectedDevice = createSelector(
  selectReporting,
  (reporting: ReportingState): ReportingDeviceClientInterface =>
    reporting?.selectedDevice || null
);

export const selectUserFilters = createSelector(
  selectReporting,
  (reporting: ReportingState): FilterItemInterface[] => reporting?.filters || []
);
