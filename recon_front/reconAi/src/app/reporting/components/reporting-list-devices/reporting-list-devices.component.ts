import { SetGpsDialogComponent } from './../set-gps-dialog/set-gps-dialog.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { tileLayer, latLng, marker, polygon, circle, icon } from 'leaflet';

@Component({
  selector: 'recon-reporting-list-devices',
  templateUrl: './reporting-list-devices.component.html',
  styleUrls: ['./reporting-list-devices.component.less'],
})
export class ReportingListDevicesComponent implements OnInit {
  constructor(private dialog: MatDialog) {}
  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '...',
      }),
    ],
    zoom: 7,
    center: latLng(46.879966, -121.726909),
  };

  // layers = [icon([46.95, -122], { iconUrl: '' })];
  layers = [0, 0.5, 0.7, 1, 2, 3, 4].map((i) =>
    marker([46.879966 + i * 2, -121.726909 - i * 2], {
      icon: icon({
        iconSize: [40, 40],
        iconAnchor: [13, 41],
        iconUrl: 'assets/map/recon-marker.svg',
      }),
    })
  );

  ngOnInit(): void {}

  openDialog(): void {
    this.dialog.open(SetGpsDialogComponent, {
      width: '430px',
    });
  }
}
