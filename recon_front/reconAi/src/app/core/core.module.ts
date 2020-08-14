import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CheckUserRolePriorityDirective } from './directives/checkUserRolePriority/check-user-role-priority.directive';
import { InputAutoFocusDirective } from './directives/inputAutoFocus/input-auto-focus.directive';
import { ClickOutsideDirective } from './directives/click-outside/click-outside.directive';
import { DoubleClickDirective } from './directives/double-click/double-click.directive';

@NgModule({
  declarations: [
    CheckUserRolePriorityDirective,
    InputAutoFocusDirective,
    ClickOutsideDirective,
    DoubleClickDirective,
  ],
  imports: [CommonModule, HttpClientModule],
  exports: [
    CheckUserRolePriorityDirective,
    InputAutoFocusDirective,
    ClickOutsideDirective,
    DoubleClickDirective,
  ],
})
export class CoreModule {}
