import { FormServerErrorInterface } from 'app/constants/types/requests';
import { selectCreateManufacturerLoadingStatus } from './../../../../../store/loaders/loaders.selectors';
import {
  createManufacturerRequestedAction,
  resetCreateManufacturerErrorAction,
} from './../../../../../store/orders/orders.actions';
import { MatDialogRef } from '@angular/material/dialog';
import { ofType } from '@ngrx/effects';
import {
  selectOrderCategoriesList,
  selectCreateManufacturerError,
} from './../../../../../store/orders/orders.selectors';
import { Observable, Subscription } from 'rxjs';
import { Store, select, ActionsSubject } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from 'app/store/reducers';
import { CategoryInterface, ManufacturerInterface } from 'app/orders/constants';
import { createManufacturerSucceededAction } from 'app/store/orders';

@Component({
  selector: 'recon-create-manufacture-container',
  templateUrl: './create-manufacture.container.html',
})
export class CreateManufactureContainer implements OnInit, OnDestroy {
  constructor(
    private store: Store<AppState>,
    private actionsSubject: ActionsSubject,
    private dialogRef: MatDialogRef<CreateManufactureContainer>
  ) {}
  closeModalSubscription$: Subscription;

  closeModal$ = this.actionsSubject.pipe(
    ofType(createManufacturerSucceededAction)
  );

  validationError$: Observable<FormServerErrorInterface> = this.store.pipe(
    select(selectCreateManufacturerError)
  );

  loadingStatus$ = this.store.pipe(
    select(selectCreateManufacturerLoadingStatus)
  );

  // they're already initialized from create device window
  categories$: Observable<CategoryInterface[]> = this.store.pipe(
    select(selectOrderCategoriesList)
  );

  ngOnInit(): void {
    this.closeModalSubscription$ = this.closeModal$.subscribe(() => {
      this.dialogRef.close();
    });
  }

  createManufacturer(manufacturer: ManufacturerInterface) {
    this.store.dispatch(
      createManufacturerRequestedAction({
        manufacturer,
      })
    );
  }

  ngOnDestroy(): void {
    this.store.dispatch(resetCreateManufacturerErrorAction());
    this.closeModalSubscription$.unsubscribe();
  }
}
