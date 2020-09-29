import { generalTransformationObjectErrorsForComponent } from './../../../core/helpers/generalFormsErrorsTransformation';
import { FormServerErrorInterface } from './../../../constants/types/requests';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TAMPERE_COORDINATES } from './../../../constants/globalVariables/globalVariables';
import {
  LatLngInterface,
  generateDefaultMap,
} from './../../../core/helpers/markers';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReconSelectOption } from './../../../shared/types/recon-select';
import {
  Component,
  OnInit,
  Inject,
  Input,
  Output,
  EventEmitter,
  NgZone,
} from '@angular/core';
import { latLng, Layer } from 'leaflet';
import { generateMapMarker } from 'app/core/helpers/markers';

@Component({
  selector: 'recon-set-gps-dialog',
  templateUrl: './set-gps-dialog.component.html',
  styleUrls: ['./set-gps-dialog.component.less'],
})
export class SetGpsDialogComponent implements OnInit {
  @Input() lat: number = TAMPERE_COORDINATES.lat;
  @Input() lng: number = TAMPERE_COORDINATES.lng;
  @Input() loadingStatus = false;
  @Input() errors: FormServerErrorInterface = null;
  @Output() sendGps = new EventEmitter<LatLngInterface>();
  coordinate: FormGroup;
  readonly numberPattern = '^[-]?[0-9]+[.]?[0-9]*$';

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: LatLngInterface,
    private ngZone: NgZone
  ) {}

  center = null;
  options = null;
  layers: Layer[];

  ngOnInit(): void {
    this.coordinate = this.fb.group({
      longitude: [
        this.lng || '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.numberPattern),
        ]),
      ],
      latitude: [
        this.lat || '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.numberPattern),
        ]),
      ],
    });

    this.center = latLng(this.lat, this.lng) || TAMPERE_COORDINATES;

    this.layers = [
      generateMapMarker(
        {
          lat: this.data.lat,
          lng: this.data.lng,
        },
        {
          markerType: 'device',
        }
      ),
    ];

    this.options = generateDefaultMap(this.center);
  }

  get validationErrors(): string {
    return generalTransformationObjectErrorsForComponent(this.errors);
  }

  setCenter({ lat, lng }: LatLngInterface): void {
    this.center = latLng(lat, lng);
  }

  mapClick(props): void {
    this.coordinate.setValue({
      longitude: props.latlng.lng,
      latitude: props.latlng.lat,
    });

    this.layers = [
      generateMapMarker(
        {
          lat: props.latlng.lat,
          lng: props.latlng.lng,
        },
        {
          markerType: 'device',
        }
      ),
    ];
  }

  inputCoordinates(): void {
    const isLatValid = this.coordinate.get('latitude').valid;
    const isLngValid = this.coordinate.get('longitude').valid;

    if (isLatValid && isLngValid) {
      const newMarkerCoordinates = {
        lat: this.coordinate.value.latitude,
        lng: this.coordinate.value.longitude,
      };
      this.layers = [
        generateMapMarker(newMarkerCoordinates, {
          markerType: 'device',
        }),
      ];
      this.setCenter(newMarkerCoordinates);
    } else {
      this.layers = [];
    }
  }

  isValidInput(controlName: string): boolean {
    const control = this.coordinate.get(controlName);
    return !!(control.touched && control.errors);
  }

  onSend(): void {
    this.sendGps.emit({
      lat: this.coordinate?.value?.latitude,
      lng: this.coordinate?.value?.longitude,
    });
  }
}
