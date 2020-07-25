import { UpdateDeviceContainer } from './components/devices/update-device/update-device.container';
import { CreateManufactureContainer } from './components/devices/create-device/create-manufacture/create-manufacture.container';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreModule } from './../core/core.module';
import { SharedModule } from './../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { CreateDeviceComponent } from './components/devices/create-device/create-device.component';
import { CreateManufactureComponent } from './components/devices/create-device/create-manufacture/create-manufacture.component';
import { UpdateCategoryListComponent } from './components/update-category-list/update-category-list.component';
import { UpdateCategoryListContainer } from './components/update-category-list/update-category-list.container';
import { CreateDeviceContainer } from './components/devices/create-device/create-device.container';
import { DeviceListComponent } from './components/devices/device-list/device-list.component';
import { DeviceItemComponent } from './components/devices/device-item/device-item.component';
import { DeviceListContainer } from './components/devices/device-list/device-list.container';
import { DeleteDeviceDialogComponent } from './components/devices/device-item/delete-device-dialog/delete-device-dialog.component';
import { DeviceCardComponent } from './components/devices/device-card/device-card.component';
import { DeviceCardContainer } from './components/devices/device-card/device-card.container';
import { ImageLeftCardBlockComponent } from './components/devices/device-card/image-left-card-block/image-left-card-block.component';
import { RightInfoPartBlockComponent } from './components/devices/device-card/right-info-part-block/right-info-part-block.component';
import { YourOrderComponent } from './components/your-order/your-order.component';
import { OrderItemComponent } from './components/your-order/order-item/order-item.component';
import { OrderLastItemComponent } from './components/your-order/order-last-item/order-last-item.component';
import { DeliveryInformationComponent } from './components/your-order/delivery-information/delivery-information.component';

@NgModule({
  declarations: [
    CreateDeviceComponent,
    CreateDeviceContainer,
    CreateManufactureComponent,
    CreateManufactureContainer,
    UpdateCategoryListComponent,
    UpdateCategoryListContainer,
    DeviceListComponent,
    DeviceListContainer,
    DeviceItemComponent,
    DeleteDeviceDialogComponent,
    UpdateDeviceContainer,
    DeviceCardComponent,
    DeviceCardContainer,
    ImageLeftCardBlockComponent,
    RightInfoPartBlockComponent,
    YourOrderComponent,
    OrderItemComponent,
    OrderLastItemComponent,
    DeliveryInformationComponent,
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
  providers: [
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} },
  ],
})
export class OrdersModule {}
