import { exportRelevantDataSucceededAction } from './../../../store/reporting/reporting.actions';
import { ofType } from '@ngrx/effects';
import { Observable, Subscription } from 'rxjs';
import { RelevantDataExportFormat } from './../../../constants/types/relevant-data';
import { SetGpsDialogContainer } from './../set-gps-dialog/set-gps-dialog.container';
import { PaginationRequestInterface } from './../../../constants/types/requests';
import { Store, ActionsSubject, Action } from '@ngrx/store';
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
  ViewChild,
  TemplateRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { latLng, Map } from 'leaflet';

import * as L from 'leaflet';
import 'leaflet.heat/dist/leaflet-heat.js';
import 'leaflet-routing-machine';

import { LatLngInterface } from 'app/core/helpers/markers';
import {
  ReportingFilteringDeviceClientInterface,
  HeatMapPointClientInterface,
} from 'app/store/reporting/reporting.server.helpers';
import { ExportRelevantDataPayloadInterface } from 'app/store/reporting';
import { ExportRelevantDataSuccessDialogComponent } from '../reporting-list-devices/export-relevant-data-success-dialog/export-relevant-data-success-dialog.component';
@Component({
  selector: 'recon-reporting-filtering-list',
  templateUrl: './reporting-filtering-list.component.html',
  styleUrls: ['./reporting-filtering-list.component.less'],
})
export class ReportingFilteringListComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private actionsSubject: ActionsSubject
  ) {}

  @ViewChild('taggedDataTemplate') taggedDataTemplate: TemplateRef<
    ReportingFilteringDeviceClientInterface
  >;
  @ViewChild('cadTagTemplate') cadTagTemplate: TemplateRef<
    ReportingFilteringDeviceClientInterface
  >;

  @Input() isDevice = false;
  @Input() currentPage = 1;
  @Input() count = 1;
  @Input() pageSize = 1;
  @Input() devices: ReportingFilteringDeviceClientInterface[] = [];
  @Input() heatMapData: HeatMapPointClientInterface[] = [];

  @Input() routePoints: LatLngInterface[] = [];

  @Input() isExporting = false;
  @Input() heatMapLoading = false;
  @Input() isPlatNumberApplied = false;
  @Input() buildingLoading = false;

  @Output() loadDevices$ = new EventEmitter<number>();
  @Output() exportRelevantData$ = new EventEmitter<RelevantDataExportFormat>();
  @Output() buildRoute$ = new EventEmitter<void>();
  @Output() loadHeatMapData$ = new EventEmitter<void>();
  @Output() resetMapData$ = new EventEmitter<void>();

  center = null;
  selectedIndex = null;
  options = null;
  layers = [];

  columns: CrudTableColumn[] = [];
  isHeatMap = false;

  map: Map;
  routingControl: L.Routing.Control;
  heatLayer: any;

  readonly tooltipForDisabledBuildButton =
    'To use this feature, please apply License plate filter';

  openSuccessDialog$: Observable<Action> = this.actionsSubject.pipe(
    ofType(exportRelevantDataSucceededAction)
  );
  openSuccessDialogSubscription$: Subscription;

  setSelectedDevice(device: ReportingFilteringDeviceClientInterface): void {
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

  navigateToDevice(device: ReportingFilteringDeviceClientInterface): void {
    if (!this.isDevice) {
      this.router.navigate(['reporting', device.sensorId]);
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
    this.setSelectedDevice(this.devices[0]);
    this.options = generateDefaultMap(this.center);
    this.openSuccessDialogSubscription$ = this.openSuccessDialog$.subscribe(
      () => {
        this.dialog.open(ExportRelevantDataSuccessDialogComponent, {
          width: '460px',
          height: '210px',
        });
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.routePoints) {
      this.formWayPoints();
    }

    if (changes.heatMapData) {
      this.formHeatMapData();
    }
  }

  ngOnDestroy(): void {
    this.openSuccessDialogSubscription$?.unsubscribe();
  }

  ngAfterViewInit() {
    this.columns = [
      {
        header: 'Time stamp',
        id: 'timestamp',
        width: '150px',
      },
      {
        header: 'Sensor GPS Latitude',
        id: 'lat',
        width: '100px',
      },
      {
        header: 'Sensor GPS Longitude',
        id: 'lng',
        width: '100px',
      },
      {
        header: 'Project name',
        id: 'project',
        width: '100px',
      },
      {
        header: 'Object Class',
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
        header: 'License plate number',
        id: 'plateNumber',
        width: '100px',
      },
      {
        header: 'Directions statistics',
        id: 'directionsStatistics',
        width: '100px',
      },
      {
        header: 'Number of directions',
        id: 'numberOfDirections',
        width: '100px',
      },
      {
        header: 'Number of objects',
        id: 'numberOfObjects',
        width: '100px',
      },
      {
        header: 'Observation start',
        id: 'observationStartDT',
        width: '150px',
      },
      {
        header: 'Observation end',
        id: 'observationEndDT',
        width: '150px',
      },
      {
        header: 'Pedestrian Flow Number Of Objects',
        id: 'pedestrianFlowNumberOfObjects',
        width: '100px',
      },
      {
        header: 'Pedestrian Flow Transit Method',
        id: 'pedestrianFlowTransitMethod',
        width: '100px',
      },
      {
        header: 'Road temperature',
        id: 'roadTemperature',
        width: '100px',
      },
      {
        header: 'Ambient temperature',
        id: 'ambientTemperature',
        width: '100px',
      },
      {
        header: 'Vehicle classification',
        id: 'vehicle',
        width: '100px',
      },
      {
        header: 'Ambient weather condition',
        id: 'ambientWeather',
        width: '100px',
      },
      {
        header: 'Road weather',
        id: 'roadWeather',
        width: '100px',
      },

      {
        header: 'Tagged data',
        id: 'taggedData',
        width: '100px',
        cellTemplate: this.taggedDataTemplate,
      },
      {
        header: 'Vehicle registration plate',
        id: 'plate',
        width: '100px',
      },
      {
        header: 'CAD file tag',
        id: 'fileTag',
        width: '100px',
        cellTemplate: this.cadTagTemplate,
      },
    ];

    if (!this.isDevice) {
      this.columns = [
        {
          header: 'Sensor ID',
          id: 'sensorId',
          width: '100px',
        },
        ...this.columns,
      ];
    }
    // to run one more round of change detection
    this.cdr.detectChanges();
  }

  formWayPoints(): void {
    this.routingControl?.setWaypoints(
      this.routePoints?.map((point) => latLng(point.lat, point.lng))
    );
  }

  formHeatMapData(): void {
    const points = [];
    this.heatMapData.forEach((point) => {
      for (let i = 0; i < point.amount; i++) {
        points.push([+point.lat + 0.0001 * i, +point.lng + 0.0001 * i, 1]);
      }
    });
    this.heatLayer?.setLatLngs(points);
  }

  openDialog(): void {
    const selectedDevice = this.devices[this.selectedIndex];
    this.dialog.open(SetGpsDialogContainer, {
      width: '600px',
      data: {
        lat: selectedDevice.lat,
        lng: selectedDevice.lng,
        id: selectedDevice.id,
      },
    });
  }

  loadDevices(page: number): void {
    this.loadDevices$.emit(page);
  }

  goToUrl(url: string): void {
    window.open(url, '_blank');
  }

  onClickExportType(exportType: RelevantDataExportFormat): void {
    this.exportRelevantData$.emit(exportType);
  }

  buildRoute(): void {
    this.buildRoute$.emit();
  }

  onMapReady(map: Map) {
    this.map = map;

    this.routingControl = (L as any).Routing.control({
      addWaypoints: false,
      routeWhileDragging: false,
      draggableWaypoints: false,
      createMarker: () => null,
    }).addTo(this.map);

    this.formWayPoints();

    this.heatLayer = (L as any)
      .heatLayer([], {
        blur: 15,
        minOpacity: 0.4,
        radius: 30,
        gradient: { 0.3: 'blue', 0.65: 'lime', 0.9: 'red' },
      })
      .addTo(this.map);
  }

  loadHeatMapData(): void {
    if (this.isHeatMap) {
      this.loadHeatMapData$.emit();
    } else {
      this.resetMapData$.emit();
    }
  }
}