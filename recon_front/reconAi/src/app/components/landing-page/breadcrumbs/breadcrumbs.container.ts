import {
  selectBreadcrumbs,
  selectBreadcrumbsVisibility,
} from './../../../store/app/app.selectors';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AppState } from 'app/store/reducers';
import { Store, select } from '@ngrx/store';
import { BreadcrumbInterface } from 'app/constants/routes';

@Component({
  selector: 'recon-breadcrumbs-container',
  templateUrl: './breadcrumbs.container.html',
})
export class BreadcrumbsContainer implements OnInit {
  constructor(private store: Store<AppState>) {}

  breadcrumbs$: Observable<BreadcrumbInterface[]> = this.store.pipe(
    select(selectBreadcrumbs)
  );

  visibility$: Observable<boolean> = this.store.pipe(
    select(selectBreadcrumbsVisibility)
  );

  ngOnInit(): void {}
}
