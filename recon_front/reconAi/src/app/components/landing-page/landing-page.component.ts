import {
  setAppTitleAction,
  setBreadcrumbsAction,
  setBreadcrumbsVisibilityAction,
} from './../../store/app/app.actions';
import {
  selectAppTitle,
  selectBreadcrumbsVisibility,
} from './../../store/app/app.selectors';
import { checkWhetherMatchesRouteWithoutProfileInit } from './../../core/helpers/withoutProfileInit';
import {
  selectCurrentUserLoadingStatus,
  selectGlobalLoadingStatus,
} from './../../store/loaders/loaders.selectors';
import { loadCurrentUserRequestedAction } from './../../store/user/user.actions';
import { AppState } from './../../store/reducers/index';
import { Component, OnInit, OnDestroy, Inject, Renderer2 } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, tap } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { Location, DOCUMENT } from '@angular/common';
import { BreadcrumbInterface } from 'app/constants/routes';

@Component({
  selector: 'recon-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.less'],
})
export class LandingPageComponent implements OnInit, OnDestroy {
  constructor(
    // to get current url
    private location: Location,
    private store: Store<AppState>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document
  ) {}

  title = '';
  breadcrumbsVisibility = false;
  // from components, effects
  titleChangesSubscription$: Subscription;
  // from routing
  changesFromRouting$: Subscription;

  globalLoadingStatusSubscription$: Subscription;
  isGlobalLoading: boolean;
  globalLoadingStatus$ = this.store.pipe(select(selectGlobalLoadingStatus));
  visibilityBreadcrumbsSubscription$: Subscription;

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

    this.visibilityBreadcrumbsSubscription$ = this.store
      .pipe(select(selectBreadcrumbsVisibility))
      .subscribe((visibility) => {
        this.breadcrumbsVisibility = visibility;
      });

    // refactor
    this.changesFromRouting$ = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const breadcrumbs: BreadcrumbInterface[] = [];
        let page = this?.activatedRoute?.snapshot?.firstChild;
        let title = page?.data.title;
        let url = page?.routeConfig.path || '';

        if (
          !page.data?.hideBreadcrumb &&
          (page?.data?.breadcrumbTitle || title)
        ) {
          breadcrumbs.push({
            url,
            label: page.data.breadcrumbTitle || title,
            id: page?.data?.breadcrumbId || '',
          });
        }

        let backgroundWithoutUnion = false;

        while (page.firstChild) {
          page = page?.firstChild;
          url += '/' + page.routeConfig.path;
          if (page?.data?.title) {
            title = page?.data?.title;
          }
          if (
            !page.data?.hideBreadcrumb &&
            (page?.data?.breadcrumbTitle || title)
          ) {
            breadcrumbs.push({
              url,
              label: page.data.breadcrumbTitle || title,
              id: page?.data?.breadcrumbId || '',
            });
          }
        }

        if (title) {
          this.store.dispatch(setAppTitleAction({ title }));
        }

        this.store.dispatch(setBreadcrumbsAction({ breadcrumbs }));
        this.store.dispatch(
          setBreadcrumbsVisibilityAction({
            visibility: !!page?.data?.showBreadcrumbs,
          })
        );
        backgroundWithoutUnion = page?.data?.backgroundWithoutUnion;
        this.updateBodyClass(backgroundWithoutUnion);
      });
  }

  private updateBodyClass(backgroundWithoutUnion?: boolean) {
    this.renderer.removeClass(this.document?.body, 'body-with-union');
    if (!backgroundWithoutUnion) {
      this.renderer.addClass(this.document?.body, 'body-with-union');
    }
  }

  ngOnDestroy(): void {
    this.changesFromRouting$.unsubscribe();
    this.titleChangesSubscription$.unsubscribe();
    this.globalLoadingStatusSubscription$.unsubscribe();
    this.visibilityBreadcrumbsSubscription$.unsubscribe();
  }
}
