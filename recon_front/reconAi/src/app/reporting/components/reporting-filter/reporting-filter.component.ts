import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'recon-reporting-filter',
  templateUrl: './reporting-filter.component.html',
  styleUrls: ['./reporting-filter.component.less']
})
export class ReportingFilterComponent implements OnInit {
  isOr = false;

  constructor() { }

  ngOnInit(): void {
  }


}
