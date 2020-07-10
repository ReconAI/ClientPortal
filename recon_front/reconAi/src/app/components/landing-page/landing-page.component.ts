import { setAppTitleAction } from './../../store/app/app.actions';
import { selectAppTitle } from './../../store/app/app.selectors';
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
  // from components, effects
  titleChangesSubscription$: Subscription;
  // from routing
  titleChangesFromRouting$: Subscription;

  constructor(
    // to get current url
    private location: Location,
    private store: Store<AppState>,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  globalLoadingStatusSubscription$: Subscription;
  isGlobalLoading: boolean;
  globalLoadingStatus$ = this.store.pipe(select(selectGlobalLoadingStatus));

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
    this.titleChangesSubscription$ = this.store
      .pipe(select(selectAppTitle))
      .subscribe((title: string) => {
        this.title = title;
      });

    this.titleChangesFromRouting$ = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        let page = this?.activatedRoute?.snapshot?.firstChild;
        let title = this?.activatedRoute?.snapshot?.firstChild?.data.title;
        while (page.firstChild) {
          page = page?.firstChild;
          if (page?.data?.title) {
            title = page?.data?.title;
          }
        }
        if (title) {
          this.store.dispatch(setAppTitleAction({ title }));
        }
      });
  }

  ngOnDestroy(): void {
    this.titleChangesFromRouting$.unsubscribe();
    this.titleChangesSubscription$.unsubscribe();
    this.globalLoadingStatusSubscription$.unsubscribe();
  }
}
