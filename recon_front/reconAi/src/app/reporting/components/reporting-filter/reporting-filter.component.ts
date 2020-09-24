import { generalTransformationObjectErrorsForComponent } from './../../../core/helpers/generalFormsErrorsTransformation';
import { ReconSelectOption } from 'app/shared/types';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import moment from 'moment';
import { FilterTypes } from 'app/core/constants/filters';
import { FilterItemInterface } from 'app/reporting/constants/types/filters';
import { DEFAULT_FILTER_ARRAY } from 'app/reporting/constants/filters';
import { FormServerErrorInterface } from 'app/constants/types/requests';

export interface AutocompleteChangesInterface {
  value: string;
  index: number;
}
@Component({
  selector: 'recon-reporting-filter',
  templateUrl: './reporting-filter.component.html',
  styleUrls: ['./reporting-filter.component.less'],
})
export class ReportingFilterComponent implements OnInit {
  filtersForm: FormGroup;
  @Input() initializedFilters: FilterItemInterface[] = [];
  @Input() eventObjects: ReconSelectOption[] = [];
  @Input() vehicleTypes: ReconSelectOption[] = [];
  @Input() pedestrianFlow: ReconSelectOption[] = [];
  @Input() roadWeatherConditions: ReconSelectOption[] = [];
  @Input() projectNames: string[] = [];
  @Input() plateNumbers: string[] = [];
  @Input() isDevice = false;
  @Input() isFiltersApplied = false;

  @Input() filterListError: FormServerErrorInterface = null;
  @Input() filterSingularDeviceError: FormServerErrorInterface = null;

  @Output() changeFilters = new EventEmitter<FilterItemInterface[]>();
  @Output() applyFilters = new EventEmitter();
  @Output() resetFilters = new EventEmitter();
  @Output() changeAutocompleteFields = new EventEmitter<
    AutocompleteChangesInterface
  >();

  // order is important, it's related to the order of html file
  filtersList: FilterItemInterface[] = JSON.parse(
    JSON.stringify(DEFAULT_FILTER_ARRAY)
  );
  objectTypeList: ReconSelectOption[] = [
    {
      label: 'Event',
      value: 'event',
    },
    {
      label: 'Object',
      value: 'object',
    },
  ];
  constructor(private fb: FormBuilder) {}

  initFiltersFromLocalStorage(): void {
    this.initializedFilters.forEach((filter) => {
      this.filtersList.splice(
        this.filtersList.findIndex(({ id }) => id === filter.id),
        1,
        filter
      );
    });

    this.filtersList = [...this.filtersList];
  }

  ngOnInit(): void {
    this.initFiltersFromLocalStorage();
    this.initDefaultFilterArray();
  }

  initDefaultFilterArray(): void {
    this.filtersForm = this.fb.group({
      filters: this.fb.array([
        ...this.filtersList.map((filter, i) =>
          this.fb.group({
            ...filter,
            value: Array.isArray(filter.value) ? [filter.value] : filter.value, // [value, Validators...]
            selected: i === 0 || !!filter.selected,
          })
        ),
      ]),
    });
  }

  isSelectedAtIndex(i: number): boolean {
    const control = this.filtersForm.get(`filters.${i}.selected`);
    return control.value;
  }

  isDisabledFilter(i: number): boolean {
    return (i === 1 || i === 3) && this.isDevice;
  }

  toggleSelectValueWithIndex(i: number): void {
    const control = this.filtersForm.get(`filters.${i}.selected`);
    control.setValue(!control.value);
    this.changeValue();
  }

  setSelectValueWithIndex(i: number, value: boolean): void {
    const control = this.filtersForm.get(`filters.${i}.selected`);
    control.setValue(value);
    this.changeValue();
  }

  changeValue() {
    this.changeFilters.emit(this.filtersForm.value.filters);
  }

  clickResetFilters() {
    this.filtersList = JSON.parse(JSON.stringify(DEFAULT_FILTER_ARRAY));
    this.initDefaultFilterArray();
    this.changeFilters.emit([DEFAULT_FILTER_ARRAY[0]]);
    this.resetFilters.emit();
  }

  clickApply(): void {
    this.applyFilters.emit();
  }

  changeWithAutocomplete(value: string, index: number): void {
    this.changeAutocompleteFields.emit({
      value,
      index,
    });
  }

  get validationErrors(): string {
    return generalTransformationObjectErrorsForComponent(
      this.isDevice ? this.filterSingularDeviceError : this.filterListError
    );
  }
}
