import { addUserSucceededAction } from './../../../../store/users/users.actions';
import { ofType } from '@ngrx/effects';
import { MatDialogRef } from '@angular/material/dialog';
import { selectAddUserError } from './../../../../store/users/users.selectors';
import { selectAddUserLoadingStatus } from './../../../../store/loaders/loaders.selectors';
import { Observable, Subscription } from 'rxjs';
import { Store, select, ActionsSubject } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AddUserInterface } from 'app/users/constants';
import { AppState } from 'app/store/reducers';
import { addUserRequestedAction } from 'app/store/users';

@Component({
  selector: 'recon-add-user-dialog-container',
  templateUrl: './add-user-dialog.container.html',
})
export class AddUserDialogContainer implements OnInit, OnDestroy {
  subscriptionToClose$: Subscription;

  constructor(
    private store: Store<AppState>,
    private actionsSubject: ActionsSubject,
    private dialogRef: MatDialogRef<AddUserDialogContainer>
  ) {}

  loadingStatus$: Observable<boolean> = this.store.pipe(
    select(selectAddUserLoadingStatus)
  );

  closeModal$ = this.actionsSubject.pipe(ofType(addUserSucceededAction));

  errorStatus$: Observable<string> = this.store.pipe(
    select(selectAddUserError)
  );

  ngOnInit(): void {
    this.subscriptionToClose$ = this.closeModal$.subscribe(() => {
      this.dialogRef.close();
    });
  }

  ngOnDestroy(): void {
    this.subscriptionToClose$?.unsubscribe();
  }

  submitAddUser(user: AddUserInterface): void {
    this.store.dispatch(addUserRequestedAction(user));
  }
}
