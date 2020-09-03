import { OrderLastItemComponent } from './orders/order-last-item/order-last-item.component';

import { CoreModule } from './../core/core.module';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './../material/material.module';
import { NgModule } from '@angular/core';
import { FormInputComponent } from './forms/form-input/form-input.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PaginationComponent } from './tables/pagination/pagination.component';
import { CrudTableComponent } from './tables/crud-table/crud-table.component';
import { UserProfileComponent } from './forms/user-profile/user-profile.component';
import { FormSelectComponent } from './forms/form-select/form-select.component';
import { FormFileWithListComponent } from './forms/form-file-with-list/form-file-with-list.component';
import { FormChipsComponent } from './forms/form-chips/form-chips.component';
import { FormCheckboxComponent } from './forms/form-checkbox/form-checkbox.component';
import { OrderItemComponent } from './orders/order-item/order-item.component';
import { DeliveryInformationComponent } from './orders/delivery-information/delivery-information.component';
import { FormSliderComponent } from './forms/form-slider/form-slider.component';
import { FormRangePickerComponent } from './forms/form-range-picker/form-range-picker.component';
import { FilterInputComponent } from './forms/filters/filter-input/filter-input.component';
import { FilterInputCheckboxComponent } from './forms/filters/filter-input-checkbox/filter-input-checkbox.component';
import { FilterThreeInputsComponent } from './forms/filters/filter-three-inputs/filter-three-inputs.component';
import { FilterSelectComponent } from './forms/filters/filter-select/filter-select.component';
import { FilterTwoInputsComponent } from './forms/filters/filter-two-inputs/filter-two-inputs.component';
import { FilterTwoInputsCheckboxComponent } from './forms/filters/filter-two-inputs-checkbox/filter-two-inputs-checkbox.component';
@NgModule({
  declarations: [
    FormInputComponent,
    PaginationComponent,
    CrudTableComponent,
    UserProfileComponent,
    FormSelectComponent,
    FormFileWithListComponent,
    FormChipsComponent,
    FormCheckboxComponent,
    OrderItemComponent,
    OrderLastItemComponent,
    DeliveryInformationComponent,
    FormSliderComponent,
    FormRangePickerComponent,
    FilterInputComponent,
    FilterInputCheckboxComponent,
    FilterThreeInputsComponent,
    FilterSelectComponent,
    FilterTwoInputsComponent,
    FilterTwoInputsCheckboxComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    CoreModule,
  ],
  exports: [
    FormInputComponent,
    CrudTableComponent,
    UserProfileComponent,
    FormSelectComponent,
    FormFileWithListComponent,
    FormChipsComponent,
    PaginationComponent,
    FormCheckboxComponent,
    OrderItemComponent,
    DeliveryInformationComponent,
    FormSliderComponent,
    FormRangePickerComponent,
    OrderLastItemComponent,
    FilterInputComponent,
    FilterInputCheckboxComponent,
    FilterThreeInputsComponent,
    FilterSelectComponent,
    FilterTwoInputsComponent,
    FilterTwoInputsCheckboxComponent,
  ],
  providers: [],
})
export class SharedModule {}
