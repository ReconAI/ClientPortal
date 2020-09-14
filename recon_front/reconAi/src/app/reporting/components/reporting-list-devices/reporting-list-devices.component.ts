import { Router } from '@angular/router';
import { generateMapMarker } from './../../../core/helpers/markers';
import { TAMPERE_COORDINATES } from 'app/constants/globalVariables/globalVariables';
import { LatLngInterface, generateDefaultMap } from 'app/core/helpers/markers';
import { latLng } from 'leaflet';
import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  NgZone,
} from '@angular/core';
import {
  SensorClientInterface,
  ReportingFilteringDeviceClientInterface,
} from 'app/store/reporting/reporting.server.helpers';

@Component({
  selector: 'recon-reporting-list-devices',
  templateUrl: './reporting-list-devices.component.html',
  styleUrls: ['./reporting-list-devices.component.less'],
})
export class ReportingListDevicesComponent implements OnInit {
  @Input() currentPage = 1;
  @Input() count = 1;
  @Input() pageSize = 1;
  @Input() sensors: SensorClientInterface[] = [];
  @Output() loadSensors$ = new EventEmitter<number>();

  center = null;
  selectedIndex = null;
  options = null;
  layers = [];

  readonly columns = [
    {
      header: 'Device serial',
      id: 'serial',
    },
    {
      header: 'Device GPS Latitude',
      id: 'lat',
    },
    {
      header: 'Device GPS Longitude',
      id: 'lng',
    },
  ];

  constructor(private zone: NgZone, private router: Router) {}

  loadDevices(page: number): void {
    this.loadSensors$.emit(page);
  }
  ngOnInit(): void {
    this.setSelectedDevice(this.sensors[0]);
    this.options = generateDefaultMap(this.center);
  }

  setCenter({ lat, lng }: LatLngInterface): void {
    this.center = latLng(lat, lng);
  }

  setSelectedDevice(device: SensorClientInterface): void {
    this.selectedIndex = this.sensors.findIndex(({ id }) => id === device?.id);

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

  generateLayersFromDevices(): void {
    this.layers = this.sensors.map((device, index) =>
      generateMapMarker(
        {
          lat: +device.lat,
          lng: +device.lng,
        },
        {
          isHighlighted: index === this.selectedIndex,
          zIndex: index === this.selectedIndex ? 1000 : 500,
          clickHandler: () => {
            this.zone.run(() => this.navigateToDevice(device));
          },
          popupText: 'Click to navigate to device page',
        }
      )
    );
  }

  navigateToDevice(device: SensorClientInterface): void {
    this.router.navigate(['reporting', device.id]);
  }
}
