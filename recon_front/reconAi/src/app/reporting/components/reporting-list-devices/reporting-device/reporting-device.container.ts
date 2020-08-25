import { selectReportingDeviceLoadingStatus } from './../../../../store/loaders/loaders.selectors';
import { ReportingDeviceClientInterface } from './../../../../store/reporting/reporting.server.helpers';
import { Store, select } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AppState } from 'app/store/reducers';
import { selectReportingSelectedDevice } from 'app/store/reporting/reporting.selectors';
import { updateBreadcrumbByIdAction } from 'app/store/app';
import { loadReportingDeviceRequestedAction } from 'app/store/reporting';

@Component({
  selector: 'recon-reporting-device-container',
  templateUrl: './reporting-device.container.html',
})
export class ReportingDeviceContainer implements OnInit {
  id: number;

  constructor(
    private activateRoute: ActivatedRoute,
    private store: Store<AppState>
  ) {}

  loadingStatus$: Observable<boolean> = this.store.pipe(
    select(selectReportingDeviceLoadingStatus)
  );

  selectedDevice$: Observable<ReportingDeviceClientInterface> = this.store.pipe(
    select(selectReportingSelectedDevice)
  );

  ngOnInit(): void {
    this.id = +this.activateRoute.snapshot.paramMap.get('id');

    this.store.dispatch(loadReportingDeviceRequestedAction({ id: this.id }));
  }
}
