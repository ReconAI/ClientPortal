import { ReconSelectOption } from 'app/shared/types';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import moment from 'moment';
import { FilterTypes } from 'app/core/constants/filters';
import { FilterItemInterface } from 'app/reporting/constants/types/filters';
@Component({
  selector: 'recon-reporting-filter',
  templateUrl: './reporting-filter.component.html',
  styleUrls: ['./reporting-filter.component.less'],
})
export class ReportingFilterComponent implements OnInit {
  filtersForm: FormGroup;
  @Input() initializedFilters: FilterItemInterface[] = [];
  @Output() changeFilters = new EventEmitter<FilterItemInterface[]>();

  // order is important, it's related to the order of html file
  filtersList: FilterItemInterface[] = [
    {
      label: 'And / Or',
      id: 'and_or',
      type: FilterTypes.SLIDER,
      value: true,
    },
    {
      label: 'Sensor ID',
      id: 'id',
      type: FilterTypes.INPUT,
      value: '',
    },
    {
      label: 'Time Stamp',
      id: 'timestamp',
      type: FilterTypes.RANGE,
      value: {
        start: moment(),
        end: moment(),
      },
    },
    {
      label: 'Project name',
      id: 'project',
      type: FilterTypes.INPUT_CHECKBOX,
      value: {
        valueInput: '',
        checked: false,
      },
    },
    {
      label: 'Edge Node name',
      id: 'edge_node_name',
      type: FilterTypes.INPUT_CHECKBOX,
      value: {
        valueInput: '',
        checked: false,
      },
    },
    {
      label: 'Event/Object',
      id: 'event_object',
      type: FilterTypes.INPUT,
      value: '',
    },
    {
      label: 'Location XYZ, mm',
      id: 'location',
      type: FilterTypes.THREE_INPUTS,
      value: {
        left: '',
        middle: '',
        right: '',
        checked: false,
      },
    },
    {
      label: 'Orient theta',
      id: 'orient_theta',
      type: FilterTypes.INPUT_CHECKBOX,
      value: {
        valueInput: '',
        checked: false,
      },
    },
    {
      label: 'Orient phi',
      id: 'orient_phi',
      type: FilterTypes.INPUT_CHECKBOX,
      value: {
        valueInput: '',
        checked: false,
      },
    },
    {
      label: 'Traffic flow',
      id: 'traffic_flow',
      type: FilterTypes.SELECT,
      value: '',
    },
    {
      label: 'Vehicle classification',
      id: 'stopped_vehicles_detection',
      type: FilterTypes.SELECT,
      value: '',
    },
    {
      label: 'Pedestrian transit method classification',
      id: 'pedestrian',
      type: FilterTypes.SELECT,
      value: '',
    },
    {
      label: 'Ambient temperature, C',
      id: 'ambient_weather',
      type: FilterTypes.TWO_INPUTS,
      value: {
        left: '',
        right: '',
      },
    },
    {
      label: 'Road temperature, C',
      id: 'road_weather',
      type: FilterTypes.TWO_INPUTS,
      value: {
        left: '',
        right: '',
      },
    },
    {
      label: 'Tagged data',
      id: 'tagged_data',
      type: FilterTypes.CHECKBOX,
      value: false,
    },
  ];

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

  vehicleOptions: ReconSelectOption[] = [
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

  initFilters(): void {
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
    this.initFilters();

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

  isSelectedAtIndex(i: number): void {
    const control = this.filtersForm.get(`filters.${i}.selected`);
    return control.value;
  }

  toggleSelectValueWithIndex(i: number): void {
    const control = this.filtersForm.get(`filters.${i}.selected`);
    control.setValue(!control.value);
  }

  changeValue() {
    this.changeFilters.emit(this.filtersForm.value.filters);
  }
}
