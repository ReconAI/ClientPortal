import { selectUserCardsLoadingStatus } from './../../../store/loaders/loaders.selectors';
import { selectUserCards } from './../../../store/user/user.selectors';
import { CardClientInterface } from './../../../constants/types/card';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { AppState } from 'app/store/reducers';
import { deleteUserCardRequestedAction } from 'app/store/user';

@Component({
  selector: 'recon-card-views-container',
  templateUrl: './card-views.container.html',
})
export class CardViewsContainer implements OnInit {
  constructor(private store: Store<AppState>) {}

  cards$: Observable<CardClientInterface[]> = this.store.pipe(
    select(selectUserCards)
  );

  loadingStatus$: Observable<boolean> = this.store.pipe(
    select(selectUserCardsLoadingStatus)
  );

  deleteCard(id: string) {
    this.store.dispatch(
      deleteUserCardRequestedAction({
        id,
      })
    );
  }

  ngOnInit(): void {}
}
