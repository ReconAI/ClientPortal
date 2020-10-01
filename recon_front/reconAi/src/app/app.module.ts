import { DevicesEffects } from './store/devices/devices.effects';
import { ReportingEffects } from './store/reporting/reporting.effects';
import { PurchasesListContainer } from './components/purchases/purchases-list/purchases-list.container';
import { CreateCardDialogContainer } from './components/card/create-card/create-card-dialog/create-card-dialog.container';
import { BasketContainer } from './components/landing-page/header/basket/basket.container';
import { OrdersEffects } from './store/orders/orders.effects';
import { CurrentUserProfileContainer } from './components/current-user-profile/current-user-profile.container';
import { InvitationUserContainer } from './components/invitation-user/invitation-user.container';
import { UsersEffects } from './store/users/users.effects';
import { HttpSuccessInterceptor } from './core/interceptors/http-success/http-success.interceptor';
import { RegistrationSuccessHumanComponent } from './components/registration/registration-success/registration-success-human.component';
import { SignUpEffects } from './store/signUp/signUp.effects';
import { HttpReqFormatInterceptor } from './core/interceptors/http-req-format/http-req-format.interceptor';
import { SignInFormContainer } from './components/login-modal/sign-in-form/sign-in-form.container';
import { HeadersInterceptor } from './core/interceptors/headers/headers.interceptor';
import { UserEffects } from './store/user/user.effects';
import { HttpErrorInterceptor } from './core/interceptors/http-error.interceptor';
import { UserMenuContainer } from './components/landing-page/header/user-menu/user-menu.container';
import { CoreModule } from './core/core.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedModule } from './shared/shared.module';
import { MaterialModule } from './material/material.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './store/reducers';
import { environment } from '@env';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { HeaderComponent } from './components/landing-page/header/header.component';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserMenuComponent } from './components/landing-page/header/user-menu/user-menu.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { LoginModalComponent } from './components/login-modal/login-modal.component';
import { SignInFormComponent } from './components/login-modal/sign-in-form/sign-in-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SignUpFormContainer } from './components/login-modal/sign-in-form/sign-up-form.container';
import { RegistrationContainer } from './components/registration/registration/registration.container';
import { RegistrationSuccessComponent } from './components/registration/registration-success/registration-success.component';
import { ActivationComponent } from './components/activation/activation/activation.component';
import { PreResetPasswordComponent } from './components/login-modal/pre-reset-password/pre-reset-password.component';
import { PreResetPasswordContainer } from './components/login-modal/pre-reset-password/pre-reset-password.container';
import { ResetPasswordPageComponent } from './components/reset-password-page/reset-password-page.component';
import { ResetPasswordModalComponent } from './components/reset-password-page/reset-password-modal/reset-password-modal.component';
import { ResetPasswordModalContainer } from './components/reset-password-page/reset-password-modal/reset-password-modal.container';
import { NewFeatureComponent } from './components/new-feature/new-feature.component';
import { NewFeatureContainer } from './components/new-feature/new-feature.container';
import { InvitationUserComponent } from './components/invitation-user/invitation-user.component';
import { CurrentUserProfileComponent } from './components/current-user-profile/current-user-profile.component';
import { FooterComponent } from './components/landing-page/footer/footer.component';
import { BasketComponent } from './components/landing-page/header/basket/basket.component';
import { CreateCardComponent } from './components/card/create-card/create-card.component';
import { CreateCardDialogComponent } from './components/card/create-card/create-card-dialog/create-card-dialog.component';
import { PaymentMethodsComponent } from './components/current-user-profile/payment-methods/payment-methods.component';
import { CardViewComponent } from './components/card/card-view/card-view.component';
import { CardViewsContainer } from './components/current-user-profile/card-views/card-views.container';
import { PaymentMethodsContainer } from './components/current-user-profile/payment-methods/payment-methods.container';
import { DeleteCardDialogComponent } from './components/card/card-view/delete-card-dialog/delete-card-dialog.component';
import { PurchasesListComponent } from './components/purchases/purchases-list/purchases-list.component';
import { PurchasesEffects } from './store/purchases/purchases.effects';
import { PurchaseCardContainer } from './components/purchases/purchase-card/purchase-card.container';
import { BreadcrumbsComponent } from './components/landing-page/breadcrumbs/breadcrumbs.component';
import { BreadcrumbsContainer } from './components/landing-page/breadcrumbs/breadcrumbs.container';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { UnauthorizedPageComponent } from './components/unauthorized-page/unauthorized-page.component';
import { AuthorizationRedirectComponent } from './authorization-redirect/authorization-redirect.component';
import { DownloadPurchasePdfComponent } from './components/purchases/purchase-card/download-purchase-pdf/download-purchase-pdf.component';
@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    HeaderComponent,
    PageNotFoundComponent,
    UserMenuComponent,
    UserMenuContainer,
    LoginModalComponent,
    SignInFormComponent,
    SignInFormContainer,
    SignUpFormContainer,
    RegistrationContainer,
    RegistrationSuccessComponent,
    RegistrationSuccessHumanComponent,
    ActivationComponent,
    PreResetPasswordComponent,
    PreResetPasswordContainer,
    ResetPasswordPageComponent,
    ResetPasswordModalComponent,
    ResetPasswordModalContainer,
    NewFeatureComponent,
    NewFeatureContainer,
    InvitationUserComponent,
    InvitationUserContainer,
    CurrentUserProfileComponent,
    CurrentUserProfileContainer,
    FooterComponent,
    BasketComponent,
    BasketContainer,
    CreateCardComponent,
    CreateCardDialogComponent,
    CreateCardDialogContainer,
    PaymentMethodsComponent,
    PaymentMethodsContainer,
    CardViewComponent,
    CardViewsContainer,
    DeleteCardDialogComponent,
    PurchasesListComponent,
    PurchasesListContainer,
    PurchaseCardContainer,
    BreadcrumbsComponent,
    BreadcrumbsContainer,
    UnauthorizedPageComponent,
    AuthorizationRedirectComponent,
    DownloadPurchasePdfComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    CoreModule,
    SharedModule, // remove later
    StoreRouterConnectingModule.forRoot(),
    EffectsModule.forRoot([
      UserEffects,
      SignUpEffects,
      UsersEffects,
      OrdersEffects,
      PurchasesEffects,
      ReportingEffects,
      DevicesEffects,
    ]),
    LeafletModule,
  ],
  exports: [MatDatepickerModule],
  providers: [
    // token and headers
    { provide: HTTP_INTERCEPTORS, useClass: HeadersInterceptor, multi: true },
    // show errors
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    // get data from data field of response
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpReqFormatInterceptor,
      multi: true,
    },
    // order is important!
    // show green success snackbars
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpSuccessInterceptor,
      multi: true,
    },
    // for modals
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
