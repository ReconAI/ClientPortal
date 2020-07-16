import {
  SUPER_ADMIN_ROLE,
  UserRolesPriorities,
} from './../constants/types/user';
import { CreateDeviceContainer } from './components/devices/create-device/create-device.container';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UpdateCategoryListContainer } from './components/update-category-list/update-category-list.container';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Categories',
      backgroundWithoutUnion: true,
    },
    component: OrdersListComponent,
  },
  {
    path: 'create-device',
    data: {
      title: 'Create device',
      expectedRolePriority: UserRolesPriorities.SUPER_ADMIN_ROLE,
    },
    component: CreateDeviceContainer,
  },
  {
    path: 'categories',
    data: {
      title: 'Categories',
      expectedRolePriority: UserRolesPriorities.SUPER_ADMIN_ROLE,
    },
    component: UpdateCategoryListContainer,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersRoutingModule {}
