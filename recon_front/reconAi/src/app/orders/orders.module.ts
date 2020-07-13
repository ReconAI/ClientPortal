import { CoreModule } from './../core/core.module';
import { SharedModule } from './../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { OrderItemComponent } from './orders-list/order-item/order-item.component';
import { CreateDeviceComponent } from './components/devices/create-device/create-device.component';

@NgModule({
  declarations: [
    OrdersListComponent,
    OrderItemComponent,
    CreateDeviceComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    OrdersRoutingModule,
    CoreModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class OrdersModule {}
