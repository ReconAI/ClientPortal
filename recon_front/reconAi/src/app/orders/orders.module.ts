import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { OrderItemComponent } from './orders-list/order-item/order-item.component';

@NgModule({
  declarations: [OrdersListComponent, OrderItemComponent],
  imports: [
    CommonModule,
    MaterialModule,
    OrdersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class OrdersModule {}
