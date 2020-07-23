import { ofType } from '@ngrx/effects';
import { selectDetachCardLoadingStatus } from './../../../../store/loaders/loaders.selectors';
import { Observable, Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store, select, ActionsSubject, Action } from '@ngrx/store';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { AppState } from 'app/store/reducers';
import {
  deleteUserCardRequestedAction,
  deleteUserCardSucceededAction,
} from 'app/store/user';

interface DeleteDialogData {
  last4: string;
  id: string;
}

@Component({
  selector: 'recon-delete-card-dialog',
  templateUrl: './delete-card-dialog.component.html',
  styleUrls: ['./delete-card-dialog.component.less'],
})
export class DeleteCardDialogComponent implements OnInit, OnDestroy {
  constructor(
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA)
    public data: DeleteDialogData,
    private actionsSubject: ActionsSubject,
    private matDialogRef: MatDialogRef<DeleteCardDialogComponent>
  ) {}

  closeModalSubscription$: Subscription;

  loadingStatus$: Observable<boolean> = this.store.pipe(
    select(selectDetachCardLoadingStatus)
  );

  closeModal$: Observable<Action> = this.actionsSubject.pipe(
    ofType(deleteUserCardSucceededAction)
  );

  ngOnInit(): void {
    this.closeModalSubscription$ = this.closeModal$.subscribe(() => {
      this.matDialogRef.close();
    });
  }

  ngOnDestroy(): void {
    this.closeModalSubscription$.unsubscribe();
  }

  deleteCard() {
    this.store.dispatch(
      deleteUserCardRequestedAction({
        id: this.data.id,
      })
    );
  }
}
