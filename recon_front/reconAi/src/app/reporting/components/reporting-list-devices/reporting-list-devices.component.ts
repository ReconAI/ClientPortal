import { TAMPERE_COORDINATES } from './../../../constants/globalVariables/globalVariables';
import { Router } from '@angular/router';
import { generateMapMarker } from './../../../core/helpers/markers';
import { CrudTableColumn } from 'app/shared/types';
import { SetGpsDialogComponent } from './../set-gps-dialog/set-gps-dialog.component';
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { tileLayer, latLng, marker, polygon, circle, icon } from 'leaflet';

import moment from 'moment';
import { LatLngInterface } from 'app/core/helpers/markers';
@Component({
  selector: 'recon-reporting-list-devices',
  templateUrl: './reporting-list-devices.component.html',
  styleUrls: ['./reporting-list-devices.component.less'],
})
export class ReportingListDevicesComponent implements OnInit {
  constructor(private dialog: MatDialog, private router: Router) {}
  @Input() isDevice = false;
  center = latLng(48.879966, -123.726909);

  selectedIndex = null;

  // move to general functions
  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        minZoom: 3,
        id: 'main-map',
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }),
    ],
    zoom: 10,
    center: this.center,
  };

  // TODO:
  // general method for creation
  layers = [];
  columns: CrudTableColumn[] = [
    {
      header: 'Time stamp',
      id: 'createdDT',
      width: '150px',
    },
    {
      header: 'Latitude',
      id: 'latitude',
      render: (device) => device.gps[0],
      width: '100px',
    },
    {
      header: 'Longitude',
      id: 'longitude',
      render: (device) => device.gps[1],
      width: '100px',
    },
    {
      header: 'Project name',
      id: 'projectName',
      width: '100px',
    },
    {
      header: 'Edge Node name',
      id: 'nodeName',
      width: '100px',
    },
    {
      header: 'Event/Object',
      id: 'isEvent',
      width: '100px',
    },
    {
      header: 'Location X',
      id: 'locationX',
      width: '100px',
    },
    {
      header: 'Location Y',
      id: 'locationY',
      width: '100px',
    },
    {
      header: 'Location Z',
      id: 'locationZ',
      width: '100px',
    },
    {
      header: 'Orient theta',
      id: 'theta',
      width: '100px',
    },
    {
      header: 'Orient phi',
      id: 'phi',
      width: '100px',
    },
    {
      header: 'Object class',
      id: 'objectClass',
      width: '100px',
    },
    {
      header: 'License plat number',
      id: 'platNumber',
      width: '100px',
    },
    {
      header: 'Traffic flow',
      id: 'trafficFlow',
      width: '100px',
    },
    {
      header: 'Vehicle classification',
      id: 'vehicle',
      width: '100px',
    },
    {
      header: 'Pedestrian flow',
      id: 'pedestrianFlow',
      width: '100px',
    },
    {
      header: 'Ambient weather condition',
      id: 'weatherCondition',
      width: '100px',
    },
    {
      header: 'Road weather condition surveillance',
      id: 'roadWeatherConditionSurveillance',
      width: '100px',
    },
    {
      header: 'Tagged data',
      id: 'taggedData',
      width: '100px',
    },
    {
      header: 'License plate',
      id: 'plate',
      width: '100px',
    },
    {
      header: 'Face',
      id: 'face',
      width: '100px',
    },
    {
      header: 'CAD file tag',
      id: 'fileTag',
      width: '100px',
    },
  ];

  devices = [1, 2, 3, 4, 5, 6].map((i) => ({
    id: i,
    createdDT: moment(),
    gps: [46.879966 + i * 2, -121.726909 - i * 2],
    projectName: i,
    nodeName: i,
    isEvent: i % 2,
    locationX: i,
    locationY: i,
    locationZ: i,
    theta: i,
    phi: i,
    objectClass: i,
    platNumber: i,
    trafficFlow: i,
    vehicle: i,
    pedestrianFlow: i,
    weatherCondition: i,
    roadWeatherConditionSurveillance: i,
    taggedData: i,
    plate: i,
    face: i,
    fileTag: i,
  }));

  clickRow(device): void {
    this.selectedIndex = this.devices.findIndex(({ id }) => id === device.id);
    this.layers = [1, 2, 3, 4, 5, 6].map((i, index) =>
      generateMapMarker(
        {
          lat: 46.879966 + i * 2,
          lng: -121.726909 - i * 2,
        },
        {
          isHighlighted: index === this.selectedIndex,
          zIndex: index === this.selectedIndex ? 1000 : 500,
          clickHandler: !this.isDevice
            ? () => {
                this.router.navigate(['reporting', i]);
              }
            : () => {},
          popupText: !this.isDevice ? 'Click to navigate to device page' : '',
        }
      )
    );

    this.setCenter({
      lat: device.gps[0],
      lng: device.gps[1],
    });
  }

  navigateToDevice(device): void {
    if (!this.isDevice) {
      this.router.navigate(['reporting', device.id]);
    }
  }

  setCenter({ lat, lng }: LatLngInterface): void {
    this.center = latLng(lat, lng);
  }

  ngOnInit(): void {
    if (!this.isDevice) {
      this.columns = [
        {
          header: 'Sensor ID',
          id: 'id',
          width: '100px',
        },
        ...this.columns,
      ];
    }

    this.layers = [1, 2, 3, 4, 5, 6].map((i) =>
      generateMapMarker(
        {
          lat: 46.879966 + i * 2,
          lng: -121.726909 - i * 2,
        },
        {
          clickHandler: !this.isDevice
            ? () => {
                this.router.navigate(['reporting', i]);
              }
            : () => {},
          popupText: !this.isDevice ? 'Click to navigate to device page' : '',
        }
      )
    );

    this.setCenter({
      lat: this.devices[0].gps[0],
      lng: this.devices[0].gps[1],
    });
  }

  openDialog(): void {
    this.dialog.open(SetGpsDialogComponent, {
      width: '600px',
    });
  }
}
