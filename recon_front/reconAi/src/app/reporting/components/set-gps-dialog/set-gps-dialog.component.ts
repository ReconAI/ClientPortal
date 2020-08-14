import { TAMPERE_COORDINATES } from './../../../constants/globalVariables/globalVariables';
import { LatLngInterface } from './../../../core/helpers/markers';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReconSelectOption } from './../../../shared/types/recon-select';
import { Component, OnInit } from '@angular/core';
import { tileLayer, latLng, marker, icon, Marker, Icon, Layer } from 'leaflet';
import { generateMapMarker } from 'app/core/helpers/markers';

@Component({
  selector: 'recon-set-gps-dialog',
  templateUrl: './set-gps-dialog.component.html',
  styleUrls: ['./set-gps-dialog.component.less'],
})
export class SetGpsDialogComponent implements OnInit {
  coordinate: FormGroup;
  readonly numberPattern = '^[-]?[0-9]+[.]?[0-9]*$';

  constructor(private fb: FormBuilder) {}

  center = TAMPERE_COORDINATES;
  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '...',
      }),
    ],
    id: 'second-map',
    zoom: 10,
    center: this.center,
  };

  layers: Layer[];

  ngOnInit(): void {
    this.coordinate = this.fb.group({
      longitude: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.numberPattern),
        ]),
      ],
      latitude: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.numberPattern),
        ]),
      ],
    });
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
