import { IsPossibleToBuyGuard } from './core/guards/is-possible-to-buy/is-possible-to-buy.guard';
import { PurchaseCardContainer } from './components/purchases/purchase-card/purchase-card.container';
import { CurrentUserProfileContainer } from './components/current-user-profile/current-user-profile.container';
import { UserRolesPriorities } from './constants/types/user';
import { InvitationUserContainer } from './components/invitation-user/invitation-user.container';

import { SuccessSignUpGuard } from './core/guards/successSignUp/success-sign-up.guard';
import { NewFeatureContainer } from './components/new-feature/new-feature.container';
import { RegistrationGuard } from './core/guards/registration/registration.guard';
import { ResetPasswordPageComponent } from './components/reset-password-page/reset-password-page.component';
import { ActivationComponent } from './components/activation/activation/activation.component';
import { RegistrationSuccessComponent } from './components/registration/registration-success/registration-success.component';
import { NotAuthGuard } from './core/guards/not-auth-guard/not-auth.guard';
import { RegistrationContainer } from './components/registration/registration/registration.container';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AuthRoleGuard } from './core/guards/auth-role-guard/auth-role.guard';
import { PurchasesListContainer } from './components/purchases/purchases-list/purchases-list.container';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/reporting',
    pathMatch: 'full',
  },
  {
    path: 'reporting',
    canActivate: [AuthRoleGuard],
    data: {
      breadcrumbTitle: 'Reporting',
    },
    loadChildren: () =>
      import('./reporting/reporting.module').then((m) => m.ReportingModule),
  },
  {
    path: 'users',
    canActivate: [AuthRoleGuard],
    data: {
      title: 'User management',
      expectedRolePriority: UserRolesPriorities.DEVELOPER_ROLE,
    },
    loadChildren: () =>
      import('./users/users.module').then((m) => m.UsersModule),
  },
  {
    path: 'orders',
    data: {
      breadcrumbTitle: 'Order portal',
    },
    loadChildren: () =>
      import('./orders/orders.module').then((m) => m.OrdersModule),
  },
  {
    path: 'registration',
    canActivateChild: [NotAuthGuard],
    data: {
      title: 'Organization registration',
    },
    children: [
      {
        path: '',
        canActivate: [RegistrationGuard],
        component: RegistrationContainer,
      },
      {
        path: 'success',
        canActivate: [SuccessSignUpGuard],
        component: RegistrationSuccessComponent,
      },
    ],
  },
  {
    path: 'profile',
    canActivate: [AuthRoleGuard],
    component: CurrentUserProfileContainer,
    data: {
      title: 'Profile',
    },
  },
  {
    path: 'invoice',
    canActivateChild: [IsPossibleToBuyGuard],
    data: {
      title: 'Invoice history',
      breadcrumbTitle: 'History',
    },
    children: [
      {
        path: '',
        data: {
          hideBreadcrumb: true,
        },
        component: PurchasesListContainer,
      },
      {
        path: ':id',
        component: PurchaseCardContainer,
        data: {
          title: ' ',
          breadcrumbTitle: '...',
          breadcrumbId: '%purchase-id',
          showBreadcrumbs: true,
        },
      },
    ],
  },
  {
    path: 'new-feature',
    // canActivate: [AuthRoleGuard],
    data: {
      title: 'Request new feature',
    },
    component: NewFeatureContainer,
  },
  {
    path: 'activate/:uidb/:token',
    component: ActivationComponent,
  },
  {
    path: 'reset/:uidb/:token',
    component: ResetPasswordPageComponent,
  },
  {
    path: 'invite/:uidb/:token',
    component: InvitationUserContainer,
  },
  {
    path: 'orders',
    loadChildren: () =>
      import('./orders/orders.module').then((m) => m.OrdersModule),
  },
  {
    path: 'devices',
    loadChildren: () =>
      import('./devices/devices.module').then((m) => m.DevicesModule),
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    data: {
      title: '  ',
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes /* { enableTracing: true } */)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
