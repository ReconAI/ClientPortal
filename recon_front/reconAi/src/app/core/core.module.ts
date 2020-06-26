import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CheckUserRolePriorityDirective } from './directives/checkUserRolePriority/check-user-role-priority.directive';
import { LoadingMatButtonDirective } from './directives/loadingMatButton/loading-mat-button.directive';

@NgModule({
  declarations: [CheckUserRolePriorityDirective, LoadingMatButtonDirective],
  imports: [CommonModule, HttpClientModule],
  exports: [CheckUserRolePriorityDirective, LoadingMatButtonDirective],
})
export class CoreModule {}
