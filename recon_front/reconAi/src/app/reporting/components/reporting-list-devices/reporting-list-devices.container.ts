import {
  updateBreadcrumbByIdAction,
  setAppTitleAction,
} from './../../../store/app/app.actions';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store/reducers';

@Component({
  selector: 'recon-reporting-list-devices-container',
  templateUrl: './reporting-list-devices.container.html',
})
export class ReportingListDevicesContainer implements OnInit {
  id: number;
  constructor(
    private activateRoute: ActivatedRoute,
    private store: Store<AppState>
  ) {}

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
