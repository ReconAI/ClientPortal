import { FilterItemInterface } from './../../../reporting/constants/types/filters';
import { selectCurrentUserProfileId } from 'app/store/user/user.selectors';
import { selectUserProfileId } from './../../../store/users/users.selectors';
import { map, withLatestFrom } from 'rxjs/operators';
import { selectApplyFiltersStatus } from './../../../store/reporting/reporting.selectors';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import {
  SetFiltersValueInterface,
  FilterTypes,
  RangeValueInterface,
  InputCheckboxInterface,
  TwoInputsCheckboxInterface,
  TwoInputsInterface,
  MapRectangleFilterInterface,
} from './../../constants/filters';
import { LocalStorageService } from './../localStorage/local-storage.service';
import { Injectable } from '@angular/core';
import { AppState } from 'app/store/reducers';
import moment from 'moment';
import { isValueOfFilterValidForServer } from 'app/core/helpers/filters';
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
      [userId]: filters.filter((filter) =>
        isValueOfFilterValidForServer(filter)
      ),
    };

    this.localStorageService.setFiltersValue(newFilters);
  }

  public getUserFilters(userId: number): FilterItemInterface[] {
    const filters = this.localStorageService.getFiltersValue();
    return (filters && filters[userId]) || [];
  }

  public getUserFilter(filterId: string, userId: number): FilterItemInterface {
    const filters = this.getUserFilters(userId);

    return filters && filters?.find(({ id }) => id === filterId);
  }

  public resetUserFilters(userId: number): void {
    const oldFilters = this.localStorageService.getFiltersValue();
    this.localStorageService.setFiltersValue({
      ...(oldFilters || {}),
      [userId]: [],
    });
  }

  public removeOneFilterForUser(userId: number, filterId: string): void {
    const oldFilters = this.localStorageService.getFiltersValue();
    this.localStorageService.setFiltersValue({
      ...(oldFilters || {}),
      [userId]: (oldFilters[userId] || []).filter(({ id }) => id !== filterId),
    });
  }

  private transformSimpleFilterValue = ({
    value,
  }: FilterItemInterface): string => {
    if (typeof value === 'boolean') {
      const strValue = value.toString();
      return strValue.charAt(0).toUpperCase() + strValue.slice(1);
    }
    return value.toString();
  };

  private transformTimestampFilterValue = ({
    value,
  }: FilterItemInterface): string => {
    const formatDate = 'YYYY-MM-DD HH:mm:ss';
    const start = moment
      .utc((value as RangeValueInterface).start)
      .format(formatDate);
    const end = moment
      .utc((value as RangeValueInterface).end)
      .format(formatDate);
    return `${start}|${end}`;
  };

  private transformInputCheckboxFilterValue = ({
    value,
  }: FilterItemInterface): string => {
    return (value as InputCheckboxInterface).inputValue;
  };

  private transformTwoInputsCheckboxFilterValue = ({
    value,
  }: FilterItemInterface): string => {
    const typedValue = value as TwoInputsCheckboxInterface;
    return `${typedValue.left}|${typedValue.right}`;
  };

  private transformTwoInputsFilterValue = ({
    value,
  }: FilterItemInterface): string => {
    const typedValue = value as TwoInputsInterface;
    return `${typedValue.left}|${typedValue.right}`;
  };

  private transformMapRectangleFilterValue = ({
    value,
  }: FilterItemInterface): string => {
    const typedValue = value as MapRectangleFilterInterface;
    return `${typedValue.topLeft.lat}|${typedValue.topLeft.lng}|${typedValue.bottomRight.lat}|${typedValue.bottomRight.lng}`;
  };

  private transformMultipleSelectFilterValue = ({
    value,
  }: FilterItemInterface): string => {
    const typedValue = value as string[];
    return typedValue?.join('|') || '';
  };

  private transformFilterField = (filter: FilterItemInterface): string => {
    let value = null;
    let field = filter.id;
    switch (filter.type) {
      case FilterTypes.SLIDER:
        value = this.transformSimpleFilterValue(filter);
        break;
      case FilterTypes.CHECKBOX:
        value = this.transformSimpleFilterValue(filter);
        break;
      case FilterTypes.INPUT:
        value = this.transformSimpleFilterValue(filter);
        break;
      case FilterTypes.SELECT:
        value = this.transformSimpleFilterValue(filter);
        break;
      case FilterTypes.RANGE:
        value = this.transformTimestampFilterValue(filter);
        break;
      case FilterTypes.INPUT_CHECKBOX:
        value = this.transformInputCheckboxFilterValue(filter);
        field =
          ((filter.value as InputCheckboxInterface).checked ? '-' : '') + field;
        break;
      case FilterTypes.TWO_INPUTS_CHECKBOX:
        value = this.transformTwoInputsCheckboxFilterValue(filter);
        field =
          ((filter.value as TwoInputsCheckboxInterface).checked ? '-' : '') +
          field;
        break;
      case FilterTypes.TWO_INPUTS:
        value = this.transformTwoInputsFilterValue(filter);
        break;
      case FilterTypes.MAP_RECTANGLE:
        value = this.transformMapRectangleFilterValue(filter);
        break;
      case FilterTypes.MULTIPLE_SELECT:
        value = this.transformMultipleSelectFilterValue(filter);
        break;
    }
    return `${field}=${value}`;
  };

  public transformFiltersToString(filters: FilterItemInterface[]): string {
    const result = filters.reduce(
      (res, current) => `${res}&${this.transformFilterField(current)}`,
      ''
    );
    return result.slice(1);
  }

  public transformValuesForUserFromLocalStorage(userId: number): string {
    const userFilters = this.getUserFilters(userId);

    const result = userFilters.reduce(
      (res, current) => `${res}&${this.transformFilterField(current)}`,
      ''
    );
    return result.slice(1);
  }

  public isFilterAppliedForCurrentUser(filterId: string): Observable<boolean> {
    return this.store.pipe(
      // this.store.pipe(select())
      select(selectApplyFiltersStatus),
      withLatestFrom(this.store.pipe(select(selectCurrentUserProfileId))),
      map(([status, userId]) => {
        return !!status && !!this.getUserFilter(filterId, +userId);
      })
    );
  }
}
