import { filter } from 'rxjs/operators';
import { setUserFiltersAction } from './../../../store/reporting/reporting.actions';
import { Store } from '@ngrx/store';
import {
  SetFiltersValueInterface,
  FilterTypes,
  FilterWithValueInterface,
} from './../../constants/filters';
import { LocalStorageService } from './../localStorage/local-storage.service';
import { Injectable } from '@angular/core';
import { FilterItemInterface } from 'app/reporting/constants/types/filters';
import { AppState } from 'app/store/reducers';

@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  constructor(
    private localStorageService: LocalStorageService,
    private store: Store<AppState>
  ) {}

  public setValueToLocalStorage({
    userId,
    filters,
  }: SetFiltersValueInterface): void {
    const oldFilters = this.localStorageService.getFiltersValue();
    const newFilters = {
      ...(oldFilters || {}),
      [userId]: filters.filter(({ selected }) => selected),
    };

    this.localStorageService.setFiltersValue(newFilters);
  }

  public getUserFilters(userId: number): FilterItemInterface[] {
    const filters = this.localStorageService.getFiltersValue();
    return (filters && filters[userId]) || [];
  }

  public initUserFilters(userId: number): void {
    const filters = this.getUserFilters(userId);

    this.store.dispatch(
      setUserFiltersAction({
        filters,
      })
    );
  }

  public resetUserFilters(userId: number): void {
    const oldFilters = this.localStorageService.getFiltersValue();
    this.localStorageService.setFiltersValue({
      ...(oldFilters || {}),
      [userId]: [],
    });
  }

  // private transformSimpleFilterValue = (
  //   { value }: FilterItemInterface
  // ): string | boolean => value as string | boolean;

  // private transformValue = (
  //   filter: FilterItemInterface
  // ): FilterWithValueInterface => {
  //   let value = null;
  //   switch (filter.type) {
  //     case FilterTypes.SLIDER:
  //       value = this.transformSimpleFilterValue(filter);
  //       break;
  //     case FilterTypes.CHECKBOX:
  //       value = this.transformSimpleFilterValue(filter);
  //       break;
  //     case FilterTypes.INPUT:

  //   }
  // };
}
