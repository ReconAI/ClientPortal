import { CrudTableColumn } from './../../../shared/types/crud-table';
import { SensorClientInterface } from './../../../constants/types/sensors';
import { generateMapMarker } from 'app/core/helpers/markers';
import { TAMPERE_COORDINATES } from './../../../constants/globalVariables/globalVariables';
import { latLng } from 'leaflet';
import {
  generateDefaultMap,
  LatLngInterface,
} from './../../../core/helpers/markers';
import { Router } from '@angular/router';
import {
  Component,
  Input,
  OnInit,
  EventEmitter,
  Output,
  NgZone,
  AfterViewInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'recon-sensors-list',
  templateUrl: './sensors-list.component.html',
  styleUrls: ['./sensors-list.component.less'],
})
export class SensorsListComponent implements OnInit, AfterViewInit {
  @Input() currentPage = 1;
  @Input() count = 1;
  @Input() pageSize = 1;
  @Input() sensors: SensorClientInterface[] = [];

  @Output() loadSensors$ = new EventEmitter<number>();

  @ViewChild('firstColumnActionsTemplate')
  firstColumnActionsTemplate: TemplateRef<SensorClientInterface>;

  center = null;
  selectedIndex = null;
  options = null;
  layers = [];

  columns: CrudTableColumn[] = [];

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

  ngAfterViewInit(): void {
    this.columns = [
      {
        header: '',
        id: 'actions',
        cellTemplate: this.firstColumnActionsTemplate,
      },
      {
        header: 'Device ID',
        id: 'id',
      },
      {
        header: 'Device serial',
        id: 'serial',
      },
      {
        header: 'Device name',
        id: 'name',
      },
      {
        header: 'Project name',
        id: 'projectName',
      },
      {
        header: 'Edge node ID',
        id: 'edgeNodeId',
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
  }

  navigateToDevice(device: SensorClientInterface): void {
    this.router.navigate(['reporting', device.id]);
  }
}
