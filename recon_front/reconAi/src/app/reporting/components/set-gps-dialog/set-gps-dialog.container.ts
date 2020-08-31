import { FormServerErrorInterface } from './../../../constants/types/requests';
import { selectSetGpsLoadingStatus } from './../../../store/loaders/loaders.selectors';
import {
  setGpsRequestedAction,
  resetSetGpsErrorAction,
} from './../../../store/reporting/reporting.actions';
import { ofType } from '@ngrx/effects';
import { Observable, Subscription } from 'rxjs';
import { ActionsSubject, Store, Action, select } from '@ngrx/store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LatLngInterface } from './../../../core/helpers/markers';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { AppState } from 'app/store/reducers';
import { setGpsSucceededAction } from 'app/store/reporting';
import { selectSetGpsError } from 'app/store/reporting/reporting.selectors';

export interface SetGpsDataInterface extends LatLngInterface {
  id: number;
}

@Component({
  selector: 'recon-set-gps-dialog-container',
  templateUrl: './set-gps-dialog.container.html',
})
export class SetGpsDialogContainer implements OnInit, OnDestroy {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: SetGpsDataInterface,
    private dialog: MatDialogRef<SetGpsDialogContainer>,
    private actionsSubject: ActionsSubject,
    private store: Store<AppState>
  ) {}

  closeDialog$: Observable<Action> = this.actionsSubject.pipe(
    ofType(setGpsSucceededAction)
  );
  closeDialogSubscription$: Subscription;

  loadingStatus$: Observable<boolean> = this.store.pipe(
    select(selectSetGpsLoadingStatus)
  );
  error$: Observable<FormServerErrorInterface> = this.store.pipe(
    select(selectSetGpsError)
  );

  sendGps(gps: LatLngInterface): void {
    this.store.dispatch(
      setGpsRequestedAction({
        gps: {
          id: this.data.id,
          lat: gps.lat,
          lng: gps.lng,
        },
      })
    );
  }

  ngOnInit(): void {
    this.closeDialogSubscription$ = this.closeDialog$.subscribe(() => {
      this.dialog.close();
    });
  }

  ngOnDestroy(): void {
    this.closeDialogSubscription$.unsubscribe();
    this.store.dispatch(resetSetGpsErrorAction());
  }
}
