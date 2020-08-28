import { filter } from 'rxjs/operators';
import { FiltersService } from './../../../core/services/filters/filters.service';
import { FilterItemInterface } from 'app/reporting/constants/types/filters';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from 'app/store/reducers';
import { selectCurrentUserProfileId } from 'app/store/user/user.selectors';
import { selectUserFilters } from 'app/store/reporting/reporting.selectors';
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

  filters$: Observable<FilterItemInterface[]> = this.store.pipe(
    select(selectUserFilters)
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
    this.filtersService.initUserFilters(this.userId);
  }

  ngOnDestroy() {
    this.currentUserIdSubscription$.unsubscribe();
  }
}
