import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReconSelectOption } from './../../../shared/types/recon-select';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'recon-set-gps-dialog',
  templateUrl: './set-gps-dialog.component.html',
  styleUrls: ['./set-gps-dialog.component.less'],
})
export class SetGpsDialogComponent implements OnInit {
  waysToSet: ReconSelectOption[] = [
    {
      label: 'Set on the map',
      value: 'map',
    },
    {
      label: 'Enter gps coordinates',
      value: 'enter',
    },
  ];
  wayToSet = this.waysToSet[0].value;
  coordinate: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.coordinate = this.fb.group({
      longitude: ['', Validators.required],
      latitude: ['', Validators.required],
    });
  }
}
