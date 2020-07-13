import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CheckUserRolePriorityDirective } from './directives/checkUserRolePriority/check-user-role-priority.directive';
import { InputAutoFocusDirective } from './directives/inputAutoFocus/input-auto-focus.directive';

@NgModule({
  declarations: [
    CheckUserRolePriorityDirective,
    InputAutoFocusDirective,
  ],
  imports: [CommonModule, HttpClientModule],
  exports: [
    CheckUserRolePriorityDirective,
    InputAutoFocusDirective,
  ],
})
export class CoreModule {}
