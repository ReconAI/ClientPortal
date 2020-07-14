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

@NgModule({
  declarations: [
    FormInputComponent,
    PaginationComponent,
    CrudTableComponent,
    UserProfileComponent,
    FormSelectComponent,
    FormFileWithListComponent,
  ],
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    CoreModule,
  ], // check work around
  exports: [
    FormInputComponent,
    CrudTableComponent,
    UserProfileComponent,
    FormSelectComponent,
    FormFileWithListComponent,
  ], // remove pagination
  providers: [],
})
export class SharedModule {}
