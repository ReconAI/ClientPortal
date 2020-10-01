import {
  setAppTitleAction,
  updateBreadcrumbByIdAction,
} from './../app/app.actions';
import { generalTransformPaginationFromServer } from './../../core/helpers/request';
import {
  PurchaseClientInterface,
  PurchaseServerInterface,
  PurchaseCardServerInterface,
} from 'app/constants/types/purchase';
import {
  PaginationResponseServerInterface,
  PaginationRequestInterface,
} from 'app/constants/types/requests';
import {
  setPurchaseListLoadingStatusAction,
  setPurchaseLoadingStatusAction,
  setPurchasePdfLoadingStatusAction,
} from './../loaders/loaders.actions';
import {
  PurchaseActionTypes,
  loadPurchaseListSucceededAction,
  loadPurchaseListErrorAction,
  loadPurchaseSucceededAction,
  loadPurchaseErrorAction,
  LoadPurchasePdfRequestInterface,
  loadPurchasePdfSucceededAction,
  loadPurchasePdfErrorAction,
} from './purchases.actions';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppState } from '../reducers';
import { ServerUserInterface } from 'app/constants/types';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { tap, switchMap, map, catchError, finalize } from 'rxjs/operators';
import {
  PurchaseRequestInterface,
  transformPurchaseFromServer,
  transformPurchaseListFromServer,
} from './purchases.server.helpers';

import { saveAs } from 'file-saver';
@Injectable()
export class PurchasesEffects {
  constructor(
    private actions$: Actions,
    private httpClient: HttpClient,
    private store: Store<AppState>,
    private router: Router
  ) {}

  loadPurchaseList$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Action & PaginationRequestInterface>(
        PurchaseActionTypes.LOAD_PURCHASE_LIST_REQUESTED
      ),
      tap(() => {
        this.store.dispatch(
          setPurchaseListLoadingStatusAction({
            status: true,
          })
        );
      }),
      switchMap(({ page }) =>
        this.httpClient
          .get<PaginationResponseServerInterface<PurchaseServerInterface>>(
            `/api/orders?page=${page}`
          )
          .pipe(
            map((purchases) =>
              loadPurchaseListSucceededAction(
                transformPurchaseListFromServer(
                  generalTransformPaginationFromServer(purchases)
                )
              )
            ),
            catchError((error) => of(loadPurchaseListErrorAction())),
            finalize(() => {
              this.store.dispatch(
                setPurchaseListLoadingStatusAction({
                  status: false,
                })
              );
            })
          )
      )
    )
  );

  loadPurchase$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Action & PurchaseRequestInterface>(
        PurchaseActionTypes.LOAD_PURCHASE_REQUESTED
      ),
      tap(() => {
        this.store.dispatch(
          setPurchaseLoadingStatusAction({
            status: true,
          })
        );
      }),
      switchMap(({ id }) =>
        this.httpClient
          .get<PurchaseCardServerInterface[]>(`/api/orders/${id}`)
          .pipe(
            map((purchases) =>
              loadPurchaseSucceededAction(
                transformPurchaseFromServer(purchases)
              )
            ),
            tap(() => {
              this.store.dispatch(
                updateBreadcrumbByIdAction({
                  update: {
                    oldId: '%purchase-id',
                    newLabel: `Order ID: ${id}`,
                    newUrl: `invoice/${id}`,
                  },
                })
              );
              this.store.dispatch(
                setAppTitleAction({ title: `Order ID: ${id}` })
              );
            }),
            catchError((error) => of(loadPurchaseErrorAction())),
            finalize(() => {
              this.store.dispatch(
                setPurchaseLoadingStatusAction({
                  status: false,
                })
              );
            })
          )
      )
    )
  );

  loadPurchasePdf$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Action & LoadPurchasePdfRequestInterface>(
        PurchaseActionTypes.LOAD_PURCHASE_PDF_REQUESTED
      ),
      tap(() => {
        this.store.dispatch(
          setPurchasePdfLoadingStatusAction({
            status: true,
          })
        );
      }),
      switchMap(({ id }) =>
        this.httpClient
          .get<Blob>(`/api/orders/${id}/download`, {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': 'attachment; filename=order.pdf',
            },
            // work around
            responseType: 'blob' as 'json',
          })
          .pipe(
            map((response) => {
              const blob = new Blob([response], { type: 'application/pdf' });
              const filename = `order-${id}.pdf`;
              saveAs(blob, filename);

              return loadPurchasePdfSucceededAction();
            }),
            catchError((error) => of(loadPurchasePdfErrorAction())),
            finalize(() => {
              this.store.dispatch(
                setPurchasePdfLoadingStatusAction({
                  status: false,
                })
              );
            })
          )
      )
    )
  );
}
