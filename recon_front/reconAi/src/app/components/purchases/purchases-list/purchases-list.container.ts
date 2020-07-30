import {
  selectPurchaseListMetaCurrentPage,
  selectPurchaseListMetaCount,
  selectPurchaseListMetaPageSize,
  selectPurchaseList,
} from './../../../store/purchases/purchases.selectors';
import { Observable } from 'rxjs';
import { loadPurchaseListRequestedAction } from './../../../store/purchases/purchases.actions';
import { Component, OnInit } from '@angular/core';
import { AppState } from 'app/store/reducers';
import { Store, select } from '@ngrx/store';
import { PurchaseClientInterface } from 'app/constants/types/purchase';

@Component({
  selector: 'recon-purchases-list-container',
  templateUrl: './purchases-list.container.html',
})
export class PurchasesListContainer implements OnInit {
  constructor(private store: Store<AppState>) {}

  purchases$: Observable<PurchaseClientInterface[]> = this.store.pipe(
    select(selectPurchaseList)
  );
  currentPage$: Observable<number> = this.store.pipe(
    select(selectPurchaseListMetaCurrentPage)
  );
  totalCount$: Observable<number> = this.store.pipe(
    select(selectPurchaseListMetaCount)
  );
  pageSize$: Observable<number> = this.store.pipe(
    select(selectPurchaseListMetaPageSize)
  );

  loadPurchases(page = 1): void {
    this.store.dispatch(loadPurchaseListRequestedAction({ page }));
  }

  ngOnInit(): void {
    this.loadPurchases();
  }
}
