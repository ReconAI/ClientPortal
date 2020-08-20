import { ReconSelectOption } from 'app/shared/types';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import moment from 'moment';
@Component({
  selector: 'recon-reporting-filter',
  templateUrl: './reporting-filter.component.html',
  styleUrls: ['./reporting-filter.component.less'],
})
export class ReportingFilterComponent implements OnInit {
  filtersForm: FormGroup;

  // order is important, it's related to the order of html file
  filtersList = [
    {
      label: 'And / Or',
      value: true,
    },
    {
      label: 'Sensor ID',
      value: '',
    },
    {
      label: 'Time Stamp',
      value: {
        start: moment(),
        end: moment(),
      },
    },
    {
      label: 'Project name',
      value: {
        valueInput: '',
        checked: false,
      },
    },
    {
      label: 'Edge Node name',
      value: {
        valueInput: '',
        checked: false,
      },
    },
    {
      label: 'Event/Object',
      value: '',
    },
    {
      label: 'Location XYZ, mm',
      value: {
        left: '',
        middle: '',
        right: '',
        checked: false,
      },
    },
    {
      label: 'Orient theta',
      value: {
        valueInput: '',
        checked: false,
      },
    },
    {
      label: 'Orient phi',
      value: {
        valueInput: '',
        checked: false,
      },
    },
    {
      label: 'Traffic flow',
      value: '',
    },
    {
      label: 'Vehicle classification',
      value: '',
    },
    {
      label: 'Pedestrian transit method classification',
      value: '',
    },
    {
      label: 'Ambient temperature, C',
      value: {
        left: '',
        right: '',
      },
    },
    {
      label: 'Road temperature, C',
      value: {
        left: '',
        right: '',
      },
    },
    {
      label: 'Tagged data',
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

  ngOnInit(): void {
    this.filtersForm = this.fb.group({
      filters: this.fb.array([
        ...this.filtersList.map((filter) =>
          this.fb.group({
            selected: false,
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
    // const control = this.filtersForm.get(`${i}.selected`);
    const control = this.filtersForm.get(`filters.${i}.selected`);
    control.setValue(!control.value);
  }

  get jsonForm(): string {
    return JSON.stringify(this.filtersForm.value);
  }
}
