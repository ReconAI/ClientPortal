import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'recon-reporting-filter',
  templateUrl: './reporting-filter.component.html',
  styleUrls: ['./reporting-filter.component.less'],
})
export class ReportingFilterComponent implements OnInit {
  isOr = false;
  filtersForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.filtersForm = this.fb.group({
      filters: this.fb.array([
        this.fb.control({
          selected: true,
        }),
      ]),
    });
  }
}
