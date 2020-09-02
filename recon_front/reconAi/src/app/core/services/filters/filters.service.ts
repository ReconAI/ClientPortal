import { Store } from '@ngrx/store';
import {
  SetFiltersValueInterface,
  FilterTypes,
  FilterWithValueInterface,
  RangeValueInterface,
  InputCheckboxInterface,
  TwoInputsCheckboxInterface,
  TwoInputsInterface,
} from './../../constants/filters';
import { LocalStorageService } from './../localStorage/local-storage.service';
import { Injectable } from '@angular/core';
import { FilterItemInterface } from 'app/reporting/constants/types/filters';
import { AppState } from 'app/store/reducers';
import moment from 'moment';
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

  public resetUserFilters(userId: number): void {
    const oldFilters = this.localStorageService.getFiltersValue();
    this.localStorageService.setFiltersValue({
      ...(oldFilters || {}),
      [userId]: [],
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
    const formatDate = 'YY-MM-DD HH:mm:ss';
    const start = moment((value as RangeValueInterface).start).format(
      formatDate
    );
    const end = moment((value as RangeValueInterface).end).format(formatDate);
    return `${start};${end}`;
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
    return `${typedValue.left};${typedValue.right}`;
  };

  private transformTwoInputsFilterValue = ({
    value,
  }: FilterItemInterface): string => {
    const typedValue = value as TwoInputsInterface;
    return `${typedValue.left};${typedValue.right}`;
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
    }
    return `${field}=${value}`;
  };

  public transformValuesForUserFromLocalStorage(userId: number): string {
    const userFilters = this.getUserFilters(userId);

    const result = userFilters.reduce(
      (res, current) => `${res}&${this.transformFilterField(current)}`,
      ''
    );
    return result.slice(1);
  }
}
