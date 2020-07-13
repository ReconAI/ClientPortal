import { selectDeleteUserLoadingStatus } from './../../../../store/loaders/loaders.selectors';
import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store, select } from '@ngrx/store';
import { DeleteUserDialogInterface } from './../../../constants/types/user';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  deleteUserSucceededAction,
  deleteUserRequestedAction,
} from 'app/store/users';
import { AppState } from 'app/store/reducers';

@Component({
  selector: 'recon-delete-user-dialog-container',
  templateUrl: './delete-user-dialog.container.html',
})
export class DeleteUserDialogContainer implements OnInit, OnDestroy {
  id: string;
  name: string;
  subscriptionToClose$: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DeleteUserDialogInterface,
    private dialogRef: MatDialogRef<DeleteUserDialogContainer>,
    private actionsSubject: ActionsSubject,
    private store: Store<AppState>
  ) {
    this.id = data.id;
    this.name = data.name;
  }

  closeModal$ = this.actionsSubject.pipe(ofType(deleteUserSucceededAction));
  loadingStatus$ = this.store.pipe(select(selectDeleteUserLoadingStatus));

  ngOnInit(): void {
    this.subscriptionToClose$ = this.closeModal$.subscribe(() => {
      this.dialogRef.close();
    });
  }

  deleteClick(): void {
    this.store.dispatch(
      deleteUserRequestedAction({
        id: this.id,
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptionToClose$.unsubscribe();
  }
}
