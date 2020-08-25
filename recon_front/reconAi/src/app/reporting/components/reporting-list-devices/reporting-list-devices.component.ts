import { PaginationRequestInterface } from './../../../constants/types/requests';
import { Store } from '@ngrx/store';
import { OnlineStreamingComponent } from './../reporting-list-devices/online-streaming/online-streaming.component';
import { TAMPERE_COORDINATES } from './../../../constants/globalVariables/globalVariables';
import { Router } from '@angular/router';
import {
  generateMapMarker,
  generateDefaultMap,
} from './../../../core/helpers/markers';
import { CrudTableColumn } from 'app/shared/types';
import { SetGpsDialogComponent } from './../set-gps-dialog/set-gps-dialog.component';
import {
  Component,
  OnInit,
  Input,
  NgZone,
  EventEmitter,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { tileLayer, latLng, marker, polygon, circle, icon } from 'leaflet';

import moment from 'moment';
import { LatLngInterface } from 'app/core/helpers/markers';
import { ReportingDeviceClientInterface } from 'app/store/reporting/reporting.server.helpers';
import { AppState } from 'app/store/reducers';
@Component({
  selector: 'recon-reporting-list-devices',
  templateUrl: './reporting-list-devices.component.html',
  styleUrls: ['./reporting-list-devices.component.less'],
})
export class ReportingListDevicesComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private zone: NgZone,
    // remove!!!
    private store: Store<AppState>
  ) {}

  @Input() isDevice = false;
  @Input() currentPage = 1;
  @Input() count = 1;
  @Input() pageSize = 1;
  @Input() devices: ReportingDeviceClientInterface[] = [];
  @Output() loadDevices$ = new EventEmitter<number>();

  center = null;
  selectedIndex = null;
  options = null;
  layers = [];
  columns: CrudTableColumn[] = [
    {
      header: 'Time stamp',
      id: 'timestamp',
      width: '150px',
    },
    {
      header: 'Latitude',
      id: 'lat',
      width: '100px',
    },
    {
      header: 'Longitude',
      id: 'lng',
      width: '100px',
    },
    {
      header: 'Project name',
      id: 'projectName',
      render: ({ project }: ReportingDeviceClientInterface): string =>
        project?.name,
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
      id: 'plateNumber',
      width: '100px',
    },
    {
      header: 'Traffic flow',
      id: 'trafficFlow',
      width: '400px',
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
      id: 'ambientWeather',
      width: '100px',
    },
    {
      header: 'Road weather condition surveillance',
      id: 'roadWeather',
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

  setSelectedDevice(device: ReportingDeviceClientInterface): void {
    this.selectedIndex = this.devices.findIndex(({ id }) => id === device?.id);

    if (this.selectedIndex > -1) {
      this.generateLayersFromDevices();

      this.setCenter({
        lat: +device.lat,
        lng: +device.lng,
      });
    } else {
      this.setCenter({
        lat: TAMPERE_COORDINATES.lat,
        lng: TAMPERE_COORDINATES.lng,
      });
    }
  }

  navigateToDevice(device: ReportingDeviceClientInterface): void {
    if (!this.isDevice) {
      this.router.navigate(['reporting', device.id]);
    }
  }

  openStreaming(): void {
    this.dialog.open(OnlineStreamingComponent);
  }

  setCenter({ lat, lng }: LatLngInterface): void {
    this.center = latLng(lat, lng);
  }

  generateLayersFromDevices(): void {
    this.layers = this.devices.map((device, index) =>
      generateMapMarker(
        {
          lat: +device.lat,
          lng: +device.lng,
        },
        {
          isHighlighted: index === this.selectedIndex,
          zIndex: index === this.selectedIndex ? 1000 : 500,
          clickHandler: !this.isDevice
            ? () => {
                this.zone.run(() => this.navigateToDevice(device));
              }
            : () => {},
          popupText: !this.isDevice ? 'Click to navigate to device page' : '',
        }
      )
    );
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

    this.setSelectedDevice(this.devices[0]);
    this.options = generateDefaultMap(this.center);
  }

  openDialog(): void {
    const selectedDevice = this.devices[this.selectedIndex];
    this.dialog.open(SetGpsDialogComponent, {
      width: '600px',
      data: {
        lat: selectedDevice.lat,
        lng: selectedDevice.lng,
      },
    });
  }

  loadDevices(page: number): void {
    if (!this.isDevice) {
      this.loadDevices$.emit(page);
    }
  }
}
