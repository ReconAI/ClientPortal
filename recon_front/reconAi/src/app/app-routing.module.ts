import { NewFeatureContainer } from './components/new-feature/new-feature.container';
import { NewFeatureComponent } from './components/new-feature/new-feature.component';
import { RegistrationGuard } from './core/guards/registration/registration.guard';
import { ResetPasswordPageComponent } from './components/reset-password-page/reset-password-page.component';
import { ActivationComponent } from './components/activation/activation/activation.component';
import { RegistrationSuccessComponent } from './components/registration/registration-success/registration-success.component';
import { NotAuthGuard } from './core/guards/not-auth-guard/not-auth.guard';
import { RegistrationContainer } from './components/registration/registration/registration.container';
import { AuthGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: 'catalog',
    canActivate: [AuthGuard],
    data: {
      title: 'Catalog',
    },
    loadChildren: () =>
      import('./catalog/catalog.module').then((m) => m.CatalogModule),
  },
  {
    path: 'registration',
    canActivate: [NotAuthGuard],
    data: {
      title: 'Registration',
    },
    children: [
      {
        path: '',
        canActivate: [RegistrationGuard],
        // TO DO
        // CHECK GUARD RIGHT AFTER USER SIGNED UP
        component: RegistrationContainer,
      },
      {
        path: 'success',
        canActivate: [RegistrationGuard],
        // TO DO
        // CHECK GUARD RIGHT AFTER USER SIGNED UP
        component: RegistrationSuccessComponent,
      },
    ],
  },
  {
    path: 'new-feature',
    // canActivate: [AuthGuard],
    data: {
      title: 'Request new feature',
    },
    component: NewFeatureContainer
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
    path: '**',
    component: PageNotFoundComponent,
    data: {
      title: 'Not found',
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes /* { enableTracing: true } */)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
