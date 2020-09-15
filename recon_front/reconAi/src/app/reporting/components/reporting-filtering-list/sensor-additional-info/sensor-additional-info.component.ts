import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'recon-sensor-additional-info',
  templateUrl: './sensor-additional-info.component.html',
  styleUrls: ['./sensor-additional-info.component.less'],
})
export class SensorAdditionalInfoComponent implements OnInit {
  @Input() serial = 0;
  @Input() lat = 0;
  @Input() lng = 0;
  @Input() loading = true;

  constructor() {}

  ngOnInit(): void {}
}
