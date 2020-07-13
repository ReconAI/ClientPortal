import { CreateDeviceComponent } from './components/devices/create-device/create-device.component';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
    },
    component: CreateDeviceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersRoutingModule {}
