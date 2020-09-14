import { selectAdditionalSensorInfoLoadingStatus } from './../../../../store/loaders/loaders.selectors';
import {
  selectReportingSensorAdditionalInfo,
  selectReportingSensorAdditionalInfoSerial,
  selectReportingSensorAdditionalInfoLat,
  selectReportingSensorAdditionalInfoLng,
} from './../../../../store/reporting/reporting.selectors';
import { Observable } from 'rxjs';
import { AppState } from 'app/store/reducers';
import { Component, OnInit, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { loadAdditionalSensorInfoRequestedAction } from 'app/store/reporting';

@Component({
  selector: 'recon-sensor-additional-info-container',
  templateUrl: './sensor-additional-info.container.html',
})
export class SensorAdditionalInfoContainer implements OnInit {
  @Input() id: number;
  constructor(private store: Store<AppState>) {}

  serial$: Observable<number> = this.store.pipe(
    select(selectReportingSensorAdditionalInfoSerial)
  );

  lat$: Observable<number> = this.store.pipe(
    select(selectReportingSensorAdditionalInfoLat)
  );

  lng$: Observable<number> = this.store.pipe(
    select(selectReportingSensorAdditionalInfoLng)
  );

  loadingStatus$: Observable<boolean> = this.store.pipe(
    select(selectAdditionalSensorInfoLoadingStatus)
  );

  ngOnInit(): void {
    this.store.dispatch(
      loadAdditionalSensorInfoRequestedAction({
        id: this.id,
      })
    );
  }
}
