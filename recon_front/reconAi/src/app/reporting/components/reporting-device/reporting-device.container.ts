import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'recon-reporting-device-container',
  templateUrl: './reporting-device.container.html',
})
export class ReportingDeviceContainer implements OnInit {
  id: number;
  constructor(private activateRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = +this.activateRoute.snapshot.paramMap.get('id');
  }
}
