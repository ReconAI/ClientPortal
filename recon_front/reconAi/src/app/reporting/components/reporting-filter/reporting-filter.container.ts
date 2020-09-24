import { ActivatedRoute } from '@angular/router';
import {
  selectRoadWeatherConditionList,
  selectPlateNumberList,
  selectPedestrianFlowList,
  selectSingularDeviceFilters,
  selectApplyFiltersStatus,
  selectFilterListError,
  selectFilterSingularDeviceError,
} from './../../../store/reporting/reporting.selectors';
import { loadReportingFilteringListRequestedAction } from 'app/store/reporting';
import {
  setApplyFiltersStatusAction,
  eventObjectListRequestedAction,
  projectNameListRequestedAction,
  projectNameListSucceededAction,
  vehicleTypeListRequestedAction,
  roadWeatherConditionListRequestedAction,
  loadReportingDeviceRequestedAction,
  buildVehicleRouteSucceededAction,
  plateNumberListRequestedAction,
  pedestrianFlowListRequestedAction,
  plateNumberListSucceededAction,
  setSingularDeviceFiltersAction,
  resetReportingFilteringListErrorAction,
  resetReportingDeviceErrorAction,
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
import { FormServerErrorInterface } from 'app/constants/types/requests';

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
  pedestrianFlow$: Observable<ReconSelectOption[]> = this.store.pipe(
    select(selectPedestrianFlowList)
  );
  projectNames$: Observable<string[]> = this.store.pipe(
    select(selectProjectNameList)
  );

  plateNumbers$: Observable<string[]> = this.store.pipe(
    select(selectPlateNumberList)
  );

  singularDeviceFilters$: Observable<FilterItemInterface[]> = this.store.pipe(
    select(selectSingularDeviceFilters)
  );

  isFiltersApplied$: Observable<boolean> = this.store.pipe(
    select(selectApplyFiltersStatus)
  );

  filterListError$: Observable<FormServerErrorInterface> = this.store.pipe(
    select(selectFilterListError)
  );

  filterSingularDeviceError$: Observable<
    FormServerErrorInterface
  > = this.store.pipe(select(selectFilterSingularDeviceError));

  changeFilters(filters: FilterItemInterface[]): void {
    if (!this.isDevice) {
      this.filtersService.setValueToLocalStorage({
        userId: this.userId,
        filters,
      });
    } else {
      this.store.dispatch(setSingularDeviceFiltersAction({ filters }));
    }
  }

  ngOnInit(): void {
    this.currentUserIdSubscription$ = this.currentUserId$.subscribe(
      (userId: string) => {
        this.userId = +userId;
      }
    );
    this.deviceId = +this.activatedRoute.snapshot.paramMap.get('id');
    this.filters$ = of(this.filtersService.getUserFilters(this.userId));
    this.store.dispatch(eventObjectListRequestedAction());
    this.store.dispatch(roadWeatherConditionListRequestedAction());
    this.store.dispatch(vehicleTypeListRequestedAction());
    this.store.dispatch(pedestrianFlowListRequestedAction());
  }

  loadData(): void {
    if (this.isDevice) {
      this.store.dispatch(
        loadReportingDeviceRequestedAction({ page: 1, id: this.deviceId })
      );
    } else {
      this.store.dispatch(
        loadReportingFilteringListRequestedAction({ page: 1 })
      );
    }
  }

  applyFilters(): void {
    this.resetErrors();

    this.store.dispatch(
      setApplyFiltersStatusAction({
        status: true,
      })
    );
    if (!this.isDevice) {
      this.store.dispatch(buildVehicleRouteSucceededAction({ points: [] }));
    }
    this.loadData();
  }

  resetFilters(): void {
    this.store.dispatch(
      setApplyFiltersStatusAction({
        status: false,
      })
    );

    this.resetErrors();

    this.loadData();
    this.store.dispatch(projectNameListSucceededAction({ names: [] }));
    this.store.dispatch(plateNumberListSucceededAction({ names: [] }));
    this.store.dispatch(buildVehicleRouteSucceededAction({ points: [] }));
  }

  resetErrors(): void {
    if (!this.isDevice) {
      this.store.dispatch(resetReportingFilteringListErrorAction());
    } else {
      this.store.dispatch(resetReportingDeviceErrorAction());
    }
  }

  ngOnDestroy() {
    this.currentUserIdSubscription$.unsubscribe();
    this.resetErrors();
  }

  changeWithAutocomplete({ value, index }: AutocompleteChangesInterface): void {
    if (index === 4) {
      this.store.dispatch(
        projectNameListRequestedAction({
          name: value,
        })
      );
    }

    if (index === 11) {
      this.store.dispatch(
        plateNumberListRequestedAction({
          name: value,
        })
      );
    }
  }
}
