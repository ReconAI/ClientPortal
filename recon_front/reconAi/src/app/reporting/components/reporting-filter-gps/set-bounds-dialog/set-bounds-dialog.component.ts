import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, NgZone, EventEmitter } from '@angular/core';
import {
  rectangle,
  LatLngBounds,
  featureGroup,
  FeatureGroup,
  DrawEvents,
} from 'leaflet';

import { TAMPERE_COORDINATES } from 'app/constants/globalVariables/globalVariables';
import { generateDefaultMap } from 'app/core/helpers/markers';

export interface GpsFormClientInterface {
  topLeft: {
    lat: string;
    lng: string;
  };
  bottomRight: {
    lat: string;
    lng: string;
  };
}

interface ReactiveFormValidationErrors {
  [key: string]: boolean;
}

@Component({
  selector: 'recon-set-bounds-dialog',
  templateUrl: './set-bounds-dialog.component.html',
  styleUrls: ['./set-bounds-dialog.component.less'],
})
export class SetBoundsDialogComponent implements OnInit {
  options = null;
  center = null;
  fitBounds: any = null;
  editableLayers: FeatureGroup = featureGroup();
  rectangleForm: FormGroup;
  readonly numberPattern = '^[-]?[0-9]+[.]?[0-9]*$';

  sendGps = new EventEmitter<GpsFormClientInterface>();

  readonly drawOptions = {
    position: 'topright',
    draw: {
      rectangle: true,
      circlemarker: false,
      marker: false,
      polygon: false,
      polyline: false,
      circle: false,
    },
    edit: {
      featureGroup: this.editableLayers,
      remove: false,
    },
  };

  checkRectangleLatLngsValidStatus(
    group: FormGroup
  ): ReactiveFormValidationErrors {
    const topLeftLat = group?.get('topLeft.lat')?.value;
    const topLeftLatTouched = group?.get('topLeft.lat')?.touched;
    const topLeftLng = group?.get('topLeft.lng')?.value;
    const topLeftLngTouched = group?.get('topLeft.lng')?.touched;
    const bottomRightLat = group?.get('bottomRight.lat')?.value;
    const bottomRightLatTouched = group?.get('bottomRight.lat')?.touched;
    const bottomRightLng = group?.get('bottomRight.lng')?.value;
    const bottomRightLngTouched = group?.get('bottomRight.lng')?.touched;

    if (
      topLeftLatTouched &&
      bottomRightLatTouched &&
      +topLeftLat < +bottomRightLat
    ) {
      return { lat: true };
    }

    if (
      bottomRightLngTouched &&
      topLeftLngTouched &&
      +bottomRightLng < +topLeftLng
    ) {
      return { lng: true };
    }

    return null;
  }

  constructor(private zone: NgZone, private fb: FormBuilder) {}

  onDrawCreated({ layer }: DrawEvents.Created): void {
    this.addLayerToForm(layer);
  }

  addLayerToForm(layer): void {
    this.zone.run(() => {
      this.editableLayers.clearLayers();
      this.editableLayers.addLayer(layer);
      const [latLngs] = layer.getLatLngs();

      this.rectangleForm.patchValue({
        topLeft: latLngs[1],
        bottomRight: latLngs[3],
      });

      this.fitBounds = layer.getBounds();
    });
  }

  onDrawEdited({ layers }: DrawEvents.Edited) {
    this.zone.run(() => {
      layers.eachLayer((layer) => {
        this.addLayerToForm(layer);
      });
    });
  }

  isValidStatus(control: string): boolean {
    return (
      this.rectangleForm.get(control).valid ||
      !this.rectangleForm.get(control).touched
    );
  }

  get jV(): string {
    return JSON.stringify(this.rectangleForm.value);
  }

  addToLayersFromForm(): void {
    this.zone.run(() => {
      // work around with types
      this.editableLayers.clearLayers();

      if (this.rectangleForm.valid) {
        const createdRectangle = rectangle(
          // bottom-left, top-right as input
          new LatLngBounds(
            [
              this.rectangleForm.value.bottomRight.lat,
              this.rectangleForm.value.topLeft.lng,
            ],
            [
              this.rectangleForm.value.topLeft.lat,
              this.rectangleForm.value.bottomRight.lng,
            ]
          )
        );
        this.editableLayers.addLayer(createdRectangle as any);

        this.fitBounds = createdRectangle.getBounds();
      }
    });
  }

  ngOnInit(): void {
    this.center = TAMPERE_COORDINATES;
    this.options = generateDefaultMap(this.center);
    this.rectangleForm = this.fb.group(
      {
        topLeft: this.fb.group({
          lat: [
            '',
            Validators.compose([
              Validators.required,
              Validators.pattern(this.numberPattern),
            ]),
          ],
          lng: this.fb.control(
            '',
            Validators.compose([
              Validators.required,
              Validators.pattern(this.numberPattern),
            ])
          ),
        }),
        bottomRight: this.fb.group({
          lat: this.fb.control(
            '',
            Validators.compose([
              Validators.required,
              Validators.pattern(this.numberPattern),
            ])
          ),
          lng: this.fb.control(
            '',
            Validators.compose([
              Validators.required,
              Validators.pattern(this.numberPattern),
            ])
          ),
        }),
      },
      { validators: this.checkRectangleLatLngsValidStatus }
    );
  }

  onSave(): void {
    this.sendGps.emit(this.rectangleForm.value);
  }
}
