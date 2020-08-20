import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TAMPERE_COORDINATES } from './../../../constants/globalVariables/globalVariables';
import { LatLngInterface } from './../../../core/helpers/markers';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReconSelectOption } from './../../../shared/types/recon-select';
import { Component, OnInit, Inject } from '@angular/core';
import { tileLayer, latLng, Layer } from 'leaflet';
import { generateMapMarker } from 'app/core/helpers/markers';

@Component({
  selector: 'recon-set-gps-dialog',
  templateUrl: './set-gps-dialog.component.html',
  styleUrls: ['./set-gps-dialog.component.less'],
})
export class SetGpsDialogComponent implements OnInit {
  coordinate: FormGroup;
  readonly numberPattern = '^[-]?[0-9]+[.]?[0-9]*$';

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: LatLngInterface
  ) {}

  center = null;
  // move to general
  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }),
    ],
    id: 'second-map',
    zoom: 10,
    center: null,
  };

  layers: Layer[];

  ngOnInit(): void {
    this.coordinate = this.fb.group({
      longitude: [
        this.data.lng || '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.numberPattern),
        ]),
      ],
      latitude: [
        this.data.lat || '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.numberPattern),
        ]),
      ],
    });

    this.center =
      (this.data && latLng(this.data.lat, this.data.lng)) ||
      TAMPERE_COORDINATES;

    if (this.data) {
      this.layers = [
        generateMapMarker({
          lat: this.data.lat,
          lng: this.data.lng,
        }),
      ];
    }

    this.options = {
      ...this.options,
      center: this.center,
    };
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
      generateMapMarker({
        lat: props.latlng.lat,
        lng: props.latlng.lng,
      }),
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
      this.layers = [generateMapMarker(newMarkerCoordinates)];
      this.setCenter(newMarkerCoordinates);
    } else {
      this.layers = [];
    }
  }

  isValidInput(controlName: string): boolean {
    const control = this.coordinate.get(controlName);
    return !!(control.touched && control.errors);
  }
}
