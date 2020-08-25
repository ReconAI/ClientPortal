import { setAppTitleAction } from './../../../../store/app/app.actions';
import { ReportingDeviceClientInterface } from './../../../../store/reporting/reporting.server.helpers';
import { Store, select } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AppState } from 'app/store/reducers';
import { selectReportingSelectedDevice } from 'app/store/reporting/reporting.selectors';
import { updateBreadcrumbByIdAction } from 'app/store/app';

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

  selectedDevice$: Observable<ReportingDeviceClientInterface> = this.store.pipe(
    select(selectReportingSelectedDevice)
  );

  ngOnInit(): void {
    this.id = +this.activateRoute.snapshot.paramMap.get('id');

    if (this.id) {
      const label = `Singular device data: ${this.id}`;
      this.store.dispatch(
        updateBreadcrumbByIdAction({
          update: {
            oldId: '%reporting-device-id',
            newLabel: label,
            newUrl: `reporting/${this.id}`,
          },
        })
      );

      setTimeout(
        () =>
          this.store.dispatch(
            setAppTitleAction({
              title: `Singular device data: ${this.id}`,
            })
          ),
        0
      );
    }
  }
}
