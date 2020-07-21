import { DeviceCardContainer } from './components/devices/device-card/device-card.container';
import { UpdateDeviceContainer } from './components/devices/update-device/update-device.container';
import { AuthRoleGuard } from './../core/guards/auth-role-guard/auth-role.guard';
import {
  SUPER_ADMIN_ROLE,
  UserRolesPriorities,
} from './../constants/types/user';
import { CreateDeviceContainer } from './components/devices/create-device/create-device.container';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UpdateCategoryListContainer } from './components/update-category-list/update-category-list.container';
import { DeviceListContainer } from './components/devices/device-list/device-list.container';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Categories',
      backgroundWithoutUnion: true,
    },
    component: DeviceListContainer,
  },
  {
    path: 'create-device',
    data: {
      title: 'Create device',
      expectedRolePriority: UserRolesPriorities.SUPER_ADMIN_ROLE,
    },
    canActivate: [AuthRoleGuard],
    component: CreateDeviceContainer,
  },
  {
    path: 'categories',
    data: {
      title: 'Categories',
      expectedRolePriority: UserRolesPriorities.SUPER_ADMIN_ROLE,
    },
    canActivate: [AuthRoleGuard],
    component: UpdateCategoryListContainer,
  },
  {
    path: 'update-device/:id',
    data: {
      title: 'Update device',
      expectedRolePriority: UserRolesPriorities.SUPER_ADMIN_ROLE,
    },
    canActivate: [AuthRoleGuard],
    component: UpdateDeviceContainer,
  },
  {
    path: ':id',
    data: {
      title: ' ',
      backgroundWithoutUnion: true,
    },
    component: DeviceCardContainer,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersRoutingModule {}
