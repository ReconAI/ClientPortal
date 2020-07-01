import { selectUserRolePriority } from './../../../store/user/user.selectors';
import {
  UserRolesPriorities,
  DEFAULT_USER_ROLE_PRIORITY,
} from './../../../constants/types/user';
import {
  Directive,
  Input,
  ViewContainerRef,
  OnInit,
  OnDestroy,
  TemplateRef,
} from '@angular/core';
import { AppState } from 'app/store/reducers';
import { Store, select } from '@ngrx/store';
import { map, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

/**
 * STRUCTURAL DIRECTIVE.
 * It checks elements and removes them if the current user role priority is less than required one.
 * @param reconCheckUserRolePriority required role priority
 */
@Directive({
  selector: '[reconCheckUserRolePriority]',
})
export class CheckUserRolePriorityDirective implements OnInit, OnDestroy {
  @Input()
  reconCheckUserRolePriority: UserRolesPriorities = DEFAULT_USER_ROLE_PRIORITY;
  rolePrioritySubscription$: Subscription;

  constructor(
    private store: Store<AppState>,
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<any>
  ) {}

  ngOnInit() {
    this.applyPermission();
  }

  ngOnDestroy() {
    this.rolePrioritySubscription$.unsubscribe();
  }

  private applyPermission(): void {
    this.rolePrioritySubscription$ = this.store
      .pipe(select(selectUserRolePriority))
      .subscribe((currentUserPriority) => {
        if (currentUserPriority >= this.reconCheckUserRolePriority) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      });
  }
}
