import { Component, OnInit } from '@angular/core';

enum SelectedTab {
  DEVICES = 0,
  FILTERING = 1,
}

@Component({
  selector: 'recon-report-portal-main',
  templateUrl: './report-portal-main.component.html',
  styleUrls: ['./report-portal-main.component.less'],
})
export class ReportPortalMainComponent implements OnInit {
  selectedTab = SelectedTab.DEVICES;
  constructor() {}
  ngOnInit(): void {}
}
