import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'recon-reporting-device',
  templateUrl: './reporting-device.component.html',
  styleUrls: ['./reporting-device.component.less'],
})
export class ReportingDeviceComponent implements OnInit {
  @Input() id: number;

  constructor() {}

  ngOnInit(): void {}
}
