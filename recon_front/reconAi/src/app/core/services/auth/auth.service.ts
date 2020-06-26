import { UserRolesPriorities } from './../../../constants/types/user';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store/reducers';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // TO DO Remove
  cachedUserRolePriority: UserRolesPriorities;

  constructor(private store: Store<AppState>) {}

}
