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
  // {
  //   path: 'categories',
  //   data: {
  //     title: 'Categories',
  //   },
  //   component: UpdateDeviceListComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersRoutingModule {}
