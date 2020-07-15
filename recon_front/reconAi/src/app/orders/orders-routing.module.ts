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
    path: 'categories',
    data: {
      title: 'Categories',
    },
    component: UpdateCategoryListContainer,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersRoutingModule {}
