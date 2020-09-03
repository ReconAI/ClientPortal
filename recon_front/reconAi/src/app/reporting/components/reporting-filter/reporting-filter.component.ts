import { ReconSelectOption } from 'app/shared/types';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import moment from 'moment';
import { FilterTypes } from 'app/core/constants/filters';
import { FilterItemInterface } from 'app/reporting/constants/types/filters';
import { DEFAULT_FILTER_ARRAY } from 'app/reporting/constants/filters';

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
  @Input() roadWeatherConditions: ReconSelectOption[] = [];
  @Input() projectNames: string[] = [];
  @Input() isDevice = false;

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
  trafficFlowOptions: ReconSelectOption[] = [
    {
      label: 'First',
      value: 1,
    },
    {
      label: 'Second',
      value: 2,
    },
    {
      label: 'Third',
      value: 3,
    },
  ];

  pedestrianOptions: ReconSelectOption[] = [
    {
      label: 'First',
      value: 1,
    },
    {
      label: 'Second',
      value: 2,
    },
    {
      label: 'Third',
      value: 3,
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
            selected: i === 0 || !!filter.selected,
            ...filter,
          })
        ),
      ]),
    });
  }

  isSelectedAtIndex(i: number): boolean {
    const control = this.filtersForm.get(`filters.${i}.selected`);
    return control.value;
  }

  isDisabledSensorId(i: number): boolean {
    return i === 1 && this.isDevice;
  }

  toggleSelectValueWithIndex(i: number): void {
    const control = this.filtersForm.get(`filters.${i}.selected`);
    control.setValue(!control.value);
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
}
