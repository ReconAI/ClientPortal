import { checkWhetherMatchesRouteWithoutProfileInit } from './../../core/helpers/withoutProfileInit';
import {
  selectCurrentUserLoadingStatus,
  selectGlobalLoadingStatus,
} from './../../store/loaders/loaders.selectors';
import { loadCurrentUserRequestedAction } from './../../store/user/user.actions';
import { AppState } from './../../store/reducers/index';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, tap } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'recon-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.less'],
})
export class LandingPageComponent implements OnInit, OnDestroy {
  title = '';

  constructor(
    // to get current url
    private location: Location,
    private store: Store<AppState>,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  globalLoadingStatusSubscription$: Subscription;
  isGlobalLoading: boolean;
  globalLoadingStatus$ = this.store.pipe(
    select(selectGlobalLoadingStatus),
  );

  ngOnInit(): void {
    // check if we have to call GET /profile
    if (!checkWhetherMatchesRouteWithoutProfileInit(this.location.path())) {
      this.store.dispatch(loadCurrentUserRequestedAction());
    }



    this.globalLoadingStatusSubscription$ = this.globalLoadingStatus$.subscribe(
      (status: boolean) => {
        this.isGlobalLoading = status;
      }
    );
    // change the title of landing page
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.title =
          this?.activatedRoute?.snapshot?.firstChild?.data.title || '';
      });
  }

  ngOnDestroy(): void {
    this.globalLoadingStatusSubscription$.unsubscribe();
  }
}
