import { UserContainer } from './components/user/user.container';
import { ManagementContainer } from './components/management/management.container';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'User management',
      hideBreadcrumb: true,
    },
    component: ManagementContainer,
  },
  {
    path: ':id',
    data: {
      breadcrumbTitle: '...',
      breadcrumbId: '%user-id',
      showBreadcrumbs: true,
    },
    component: UserContainer,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
