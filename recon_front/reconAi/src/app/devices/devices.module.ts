import { CoreModule } from './../core/core.module';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MaterialModule } from './../material/material.module';
import { SharedModule } from './../shared/shared.module';
import { SensorsListContainer } from './components/sensors-list/sensors-list.container';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DevicesRoutingModule } from './devices-routing.module';
import { SensorsListComponent } from './components/sensors-list/sensors-list.component';

@NgModule({
  declarations: [SensorsListComponent, SensorsListContainer],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    DevicesRoutingModule,
    LeafletModule,
    LeafletDrawModule,
    CoreModule,
  ],
})
export class DevicesModule {}
