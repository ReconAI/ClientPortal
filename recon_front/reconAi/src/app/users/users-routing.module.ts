import { UserComponent } from './components/user/user.component';
import { ManagementContainer } from './components/management/management.container';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'management',
    component: ManagementContainer,
  },
  {
    path: ':id',
    component: UserComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
