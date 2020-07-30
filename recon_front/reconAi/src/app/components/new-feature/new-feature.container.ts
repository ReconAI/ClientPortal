import { newRequestFeatureRequestedAction } from './../../store/user/user.actions';
import { selectNewRequestFeatureError } from './../../store/user/user.selectors';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from 'app/store/reducers';
import { selectNewRequestFeatureLoadingStatus } from 'app/store/loaders/loaders.selectors';
import { NewRequestFeatureClientInterface } from 'app/store/user/user.server.helpers';

@Component({
  selector: 'recon-new-feature-container',
  templateUrl: './new-feature.container.html',
})
export class NewFeatureContainer implements OnInit {
  constructor(private store: Store<AppState>) {}

  loadingStatus$: Observable<boolean> = this.store.pipe(
    select(selectNewRequestFeatureLoadingStatus)
  );

  validationError$: Observable<string> = this.store.pipe(
    select(selectNewRequestFeatureError)
  );

  ngOnInit(): void {}

  postRequest(value: NewRequestFeatureClientInterface): void {
    this.store.dispatch(newRequestFeatureRequestedAction(value));
  }
}
