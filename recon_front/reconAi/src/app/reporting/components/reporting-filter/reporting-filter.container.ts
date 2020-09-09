import { ActivatedRoute } from '@angular/router';
import { selectRoadWeatherConditionList } from './../../../store/reporting/reporting.selectors';
import { loadReportingDeviceListRequestedAction } from 'app/store/reporting';
import {
  setApplyFiltersStatusAction,
  eventObjectListRequestedAction,
  projectNameListRequestedAction,
  projectNameListSucceededAction,
  vehicleTypeListRequestedAction,
  roadWeatherConditionListRequestedAction,
  loadReportingDeviceRequestedAction,
  buildVehicleRouteSucceededAction,
} from './../../../store/reporting/reporting.actions';
import { FiltersService } from './../../../core/services/filters/filters.service';
import { FilterItemInterface } from 'app/reporting/constants/types/filters';
import { Observable, Subscription, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AppState } from 'app/store/reducers';
import { selectCurrentUserProfileId } from 'app/store/user/user.selectors';
import { ReconSelectOption } from 'app/shared/types';
import {
  selectEventObjectList,
  selectProjectNameList,
  selectVehicleTypeList,
} from 'app/store/reporting/reporting.selectors';
import { AutocompleteChangesInterface } from './reporting-filter.component';

@Component({
  selector: 'recon-reporting-filter-container',
  templateUrl: './reporting-filter.container.html',
})
export class ReportingFilterContainer implements OnInit, OnDestroy {
  constructor(
    private store: Store<AppState>,
    private filtersService: FiltersService,
    private activatedRoute: ActivatedRoute
  ) {}
  deviceId: number;
  @Input() isDevice = false;
  userId: number;

  currentUserIdSubscription$: Subscription;
  currentUserId$: Observable<string> = this.store.pipe(
    select(selectCurrentUserProfileId)
  );

  filters$: Observable<FilterItemInterface[]>;
  eventObjects$: Observable<ReconSelectOption[]> = this.store.pipe(
    select(selectEventObjectList)
  );
  vehicleTypes$: Observable<ReconSelectOption[]> = this.store.pipe(
    select(selectVehicleTypeList)
  );
  roadWeatherConditions$: Observable<ReconSelectOption[]> = this.store.pipe(
    select(selectRoadWeatherConditionList)
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
    this.deviceId = +this.activatedRoute.snapshot.paramMap.get('id');

    if (this.isDevice) {
      this.filtersService.removeOneFilterForUser(this.userId, 'sensor_id');
    }

    this.filters$ = of(this.filtersService.getUserFilters(this.userId));
    this.store.dispatch(eventObjectListRequestedAction());
    this.store.dispatch(roadWeatherConditionListRequestedAction());
    this.store.dispatch(vehicleTypeListRequestedAction());
  }

  loadData(): void {
    if (this.isDevice) {
      this.store.dispatch(
        loadReportingDeviceRequestedAction({ page: 1, id: this.deviceId })
      );
    } else {
      this.store.dispatch(loadReportingDeviceListRequestedAction({ page: 1 }));
    }
  }

  applyFilters(): void {
    this.store.dispatch(
      setApplyFiltersStatusAction({
        status: true,
      })
    );
    this.loadData();
  }

  resetFilters(): void {
    this.store.dispatch(
      setApplyFiltersStatusAction({
        status: false,
      })
    );

    this.loadData();
    this.store.dispatch(projectNameListSucceededAction({ names: [] }));
    this.store.dispatch(buildVehicleRouteSucceededAction({ points: [] }));
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
