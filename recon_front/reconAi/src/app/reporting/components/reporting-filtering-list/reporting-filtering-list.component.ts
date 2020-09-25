import { exportRelevantDataSucceededAction } from './../../../store/reporting/reporting.actions';
import { ofType } from '@ngrx/effects';
import { Observable, Subscription } from 'rxjs';
import { RelevantDataExportFormat } from './../../../constants/types/relevant-data';
import { SetGpsDialogContainer } from './../set-gps-dialog/set-gps-dialog.container';
import { PaginationRequestInterface } from './../../../constants/types/requests';
import { Store, ActionsSubject, Action } from '@ngrx/store';
import { OnlineStreamingComponent } from './../online-streaming/online-streaming.component';
import { TAMPERE_COORDINATES } from './../../../constants/globalVariables/globalVariables';
import { Router, ActivatedRoute } from '@angular/router';
import {
  generateMapMarker,
  generateDefaultMap,
} from './../../../core/helpers/markers';
import { CrudTableColumn } from 'app/shared/types';
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
import { ExportRelevantDataSuccessDialogComponent } from '../export-relevant-data-success-dialog/export-relevant-data-success-dialog.component';
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
    private cdr: ChangeDetectorRef,
    private actionsSubject: ActionsSubject,
    private activatedRoute: ActivatedRoute
  ) {}

  @ViewChild('cadTagTemplate') cadTagTemplate: TemplateRef<
    ReportingFilteringDeviceClientInterface
  >;
  @ViewChild('sensorIdColumnTemplate')
  sensorIdColumnTemplate: TemplateRef<ReportingFilteringDeviceClientInterface>;

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

  @Input() currentDeviceLat = 0;
  @Input() currentDeviceLng = 0;

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

  deviceId: number;

  readonly tooltipForDisabledBuildButton =
    'To use this feature, please apply Vehicle registration plate filter';

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
    this.layers = this.devices
      .filter((device) => device.lat && device.lng)
      .map((device, index) =>
        generateMapMarker(
          {
            lat: +device.lat,
            lng: +device.lng,
          },
          {
            isHighlighted: index === this.selectedIndex,
            zIndex: index === this.selectedIndex ? 1000 : 500,
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

    if (this.isDevice) {
      this.deviceId = +this.activatedRoute.snapshot.paramMap.get('id');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.routePoints) {
      this.formWayPoints();
    }

    if (changes.heatMapData) {
      this.formHeatMapData();
    }

    if (changes.currentDeviceLat || changes.currentDeviceLng) {
      this.generateLayersFromDevices();
    }
  }

  ngOnDestroy(): void {
    this.openSuccessDialogSubscription$?.unsubscribe();
  }

  ngAfterViewInit() {
    this.columns = [
      {
        header: 'ID',
        id: 'id',
        width: '65px',
      },
      {
        header: 'Time stamp',
        id: 'timestamp',
        width: '150px',
      },

      {
        header: 'Project name',
        id: 'project',
        width: '100px',
      },
      {
        header: 'Object Type',
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
        header: 'Event/Object class',
        id: 'objectClass',
        width: '100px',
      },
      {
        header: 'Vehicle registration plate',
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
        header: 'Road weather condition',
        id: 'roadWeather',
        width: '100px',
      },
      {
        header: 'Tagged data',
        id: 'taggedData',
        width: '100px',
      },
      {
        header: 'Is tagged data',
        id: 'isTaggedData',
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
      this.columns.splice(
        2,
        0,
        ...[
          {
            header: 'GPS Latitude',
            id: 'lat',
            width: '100px',
          },
          {
            header: 'GPS Longitude',
            id: 'lng',
            width: '100px',
          },
          {
            header: 'Sensor ID',
            width: '55px',
            id: 'sensorId',
            cellTemplate: this.sensorIdColumnTemplate,
          },
        ]
      );
      this.columns = [...this.columns];
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
    this.dialog.open(SetGpsDialogContainer, {
      width: '600px',
      data: {
        lat: this.currentDeviceLat,
        lng: this.currentDeviceLng,
        id: this.deviceId,
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
