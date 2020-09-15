import { SensorClientInterface } from './../../../constants/types/sensors';
import {
  selectSensorListMetaCurrentPage,
  selectSensorListMetaCount,
  selectSensorListMetaPageSize,
  selectSensorList,
} from './../../../store/devices/devices.selectors';
import { Observable } from 'rxjs';
import { AppState } from './../../../store/reducers/index';
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { selectSensorListLoadingStatus } from 'app/store/loaders/loaders.selectors';
import { loadSensorsListRequestedAction } from 'app/store/devices';

@Component({
  selector: 'recon-sensors-list-container',
  templateUrl: './sensors-list.container.html',
})
export class SensorsListContainer implements OnInit {
  constructor(private store: Store<AppState>) {}

  sensorsList$: Observable<SensorClientInterface[]> = this.store.pipe(
    select(selectSensorList)
  );

  currentPage$: Observable<number> = this.store.pipe(
    select(selectSensorListMetaCurrentPage)
  );

  count$: Observable<number> = this.store.pipe(
    select(selectSensorListMetaCount)
  );
  pageSize$: Observable<number> = this.store.pipe(
    select(selectSensorListMetaPageSize)
  );

  loadingStatus$: Observable<boolean> = this.store.pipe(
    select(selectSensorListLoadingStatus)
  );

  loadDevices(page: number): void {
    this.store.dispatch(loadSensorsListRequestedAction({ page }));
  }

  ngOnInit(): void {
    this.loadDevices(1);
  }
}
