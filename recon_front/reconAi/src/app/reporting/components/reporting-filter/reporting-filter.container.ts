import { loadReportingDeviceListRequestedAction } from 'app/store/reporting';
import {
  setApplyFiltersStatusAction,
  eventObjectListRequestedAction,
  projectNameListRequestedAction,
  projectNameListSucceededAction,
  vehicleTypeListRequestedAction,
} from './../../../store/reporting/reporting.actions';
import { FiltersService } from './../../../core/services/filters/filters.service';
import { FilterItemInterface } from 'app/reporting/constants/types/filters';
import { Observable, Subscription, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from 'app/store/reducers';
import { selectCurrentUserProfileId } from 'app/store/user/user.selectors';
import { ReconSelectOption } from 'app/shared/types';
import {
  selectEventObjectList,
  selectProjectNameList,
} from 'app/store/reporting/reporting.selectors';
import { AutocompleteChangesInterface } from './reporting-filter.component';

@Component({
  selector: 'recon-reporting-filter-container',
  templateUrl: './reporting-filter.container.html',
})
export class ReportingFilterContainer implements OnInit, OnDestroy {
  constructor(
    private store: Store<AppState>,
    private filtersService: FiltersService
  ) {}

  userId: number;

  currentUserIdSubscription$: Subscription;
  currentUserId$: Observable<string> = this.store.pipe(
    select(selectCurrentUserProfileId)
  );

  filters$: Observable<FilterItemInterface[]>;
  eventObjects$: Observable<ReconSelectOption[]> = this.store.pipe(
    select(selectEventObjectList)
  );
  projectNames$: Observable<string[]> = this.store.pipe(
    select(selectProjectNameList)
  );

  changeFilters(filters: FilterItemInterface[]): void {
    this.filtersService.setValueToLocalStorage({
      userId: this.userId,
      filters,
    });
  }

  ngOnInit(): void {
    this.currentUserIdSubscription$ = this.currentUserId$.subscribe(
      (userId: string) => {
        this.userId = +userId;
      }
    );

    this.filters$ = of(this.filtersService.getUserFilters(this.userId));
    this.store.dispatch(eventObjectListRequestedAction());
    this.store.dispatch(vehicleTypeListRequestedAction());
  }

  applyFilters(): void {
    this.store.dispatch(
      setApplyFiltersStatusAction({
        status: true,
      })
    );
    this.store.dispatch(loadReportingDeviceListRequestedAction({ page: 1 }));
  }

  resetFilters(): void {
    this.store.dispatch(
      setApplyFiltersStatusAction({
        status: false,
      })
    );
    this.store.dispatch(loadReportingDeviceListRequestedAction({ page: 1 }));
    this.store.dispatch(projectNameListSucceededAction({ names: [] }));
  }

  ngOnDestroy() {
    this.currentUserIdSubscription$.unsubscribe();
  }

  changeWithAutocomplete({ value, index }: AutocompleteChangesInterface): void {
    if (index === 3) {
      this.store.dispatch(
        projectNameListRequestedAction({
          name: value,
        })
      );
    }
  }
}
