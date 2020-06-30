import { ResetPasswordPageComponent } from './components/reset-password-page/reset-password-page.component';
import { ActivationComponent } from './components/activation/activation/activation.component';
import { RegistrationSuccessComponent } from './components/registration/registration-success/registration-success.component';
import { NotAuthGuard } from './core/guards/not-auth-guard/not-auth.guard';
import { RegistrationComponent } from './components/registration/registration/registration.component';
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
    data: {
      title: 'Registration',
    },
    children: [
      {
        path: '',
        // TO DO
        // CHECK GUARD RIGHT AFTER USER SIGNED UP
        canActivate: [NotAuthGuard],
        component: RegistrationComponent,
      },
      {
        path: 'success',
        // TO DO
        // CHECK GUARD RIGHT AFTER USER SIGNED UP
        component: RegistrationSuccessComponent,
      },
    ],
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
