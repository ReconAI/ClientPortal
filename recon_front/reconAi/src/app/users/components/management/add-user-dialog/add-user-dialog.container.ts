import { selectAddUserError } from './../../../../store/users/users.selectors';
import { selectAddUserLoadingStatus } from './../../../../store/loaders/loaders.selectors';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { AddUserInterface } from 'app/users/constants';
import { AppState } from 'app/store/reducers';
import { addUserRequestedAction } from 'app/store/users';

@Component({
  selector: 'recon-add-user-dialog-container',
  templateUrl: './add-user-dialog.container.html',
})
export class AddUserDialogContainer implements OnInit {
  constructor(private store: Store<AppState>) {}
  loadingStatus$: Observable<boolean> = this.store.pipe(
    select(selectAddUserLoadingStatus)
  );

  errorStatus$: Observable<string> = this.store.pipe(
    select(selectAddUserError)
  );

  ngOnInit(): void {}

  submitAddUser(user: AddUserInterface): void {
    this.store.dispatch(addUserRequestedAction(user));
  }
}
