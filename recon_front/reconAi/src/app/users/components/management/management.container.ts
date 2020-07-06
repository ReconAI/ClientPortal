import { selectUsersListLoadingStatus } from './../../../store/loaders/loaders.selectors';
import { Observable } from 'rxjs';
import {
  selectUsersList,
  selectUsersMetaPageSize,
  selectUsersMetaTotalCount,
  selectUsersMetaCurrentPage,
} from './../../../store/users/users.selectors';
import { loadUsersListRequestedAction } from './../../../store/users/users.actions';
import { Store, select } from '@ngrx/store';
import { UserInterface } from './../../constants/types/user';
import { Component, OnInit, Input } from '@angular/core';
import { AppState } from 'app/store/reducers';

@Component({
  selector: 'recon-management-container',
  templateUrl: './management.container.html',
})
export class ManagementContainer implements OnInit {
  constructor(private store: Store<AppState>) {}
  users$: Observable<UserInterface[]> = this.store.pipe(
    select(selectUsersList)
  );

  pageSize$: Observable<number> = this.store.pipe(
    select(selectUsersMetaPageSize)
  );

  totalCount$: Observable<number> = this.store.pipe(
    select(selectUsersMetaTotalCount)
  );

  loadUsers(page = 1): void {
    this.store.dispatch(loadUsersListRequestedAction({ page }));
  }

  ngOnInit(): void {
    this.loadUsers();
  }
}
