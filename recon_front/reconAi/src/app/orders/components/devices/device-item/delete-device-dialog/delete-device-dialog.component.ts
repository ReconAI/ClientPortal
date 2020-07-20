import { ofType } from '@ngrx/effects';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store, ActionsSubject, Action, select } from '@ngrx/store';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { AppState } from 'app/store/reducers';
import { Subscription, Observable } from 'rxjs';
import {
  deleteDeviceSucceededAction,
  deleteDeviceRequestedAction,
} from 'app/store/orders';
import { selectDeleteDeviceLoadingStatus } from 'app/store/loaders/loaders.selectors';
import { DeleteDeviceRequestInterface } from 'app/store/orders/orders.server.helpers';

@Component({
  selector: 'recon-delete-device-dialog',
  templateUrl: './delete-device-dialog.component.html',
  styleUrls: ['./delete-device-dialog.component.less'],
})
export class DeleteDeviceDialogComponent implements OnInit, OnDestroy {
  constructor(
    private store: Store<AppState>,
    private dialogRef: MatDialogRef<DeleteDeviceDialogComponent>,
    private actionsSubject: ActionsSubject,
    @Inject(MAT_DIALOG_DATA) public device: DeleteDeviceRequestInterface
  ) {}

  closeModalSubscription$: Subscription;
  closeModal$: Observable<Action> = this.actionsSubject.pipe(
    ofType(deleteDeviceSucceededAction)
  );

  loadingStatus$: Observable<boolean> = this.store.pipe(
    select(selectDeleteDeviceLoadingStatus)
  );

  deleteDevice(): void {
    this.store.dispatch(deleteDeviceRequestedAction(this.device));
  }

  ngOnInit(): void {
    this.closeModalSubscription$ = this.closeModal$.subscribe(() => {
      this.dialogRef.close();
    });
  }
  ngOnDestroy(): void {
    this.closeModalSubscription$.unsubscribe();
  }
}
