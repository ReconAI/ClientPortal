import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SensorsListContainer } from './components/sensors-list/sensors-list.container';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Devices',
    },
    component: SensorsListContainer,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DevicesRoutingModule {}
