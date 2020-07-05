import { CommonModule } from '@angular/common';
import { MaterialModule } from './../material/material.module';
import { NgModule } from '@angular/core';
import { FormInputComponent } from './forms/form-input/form-input.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PaginationComponent } from './tables/pagination/pagination.component';
import { CrudTableComponent } from './tables/crud-table/crud-table.component';

@NgModule({
  declarations: [FormInputComponent, PaginationComponent, CrudTableComponent],
  imports: [MaterialModule, ReactiveFormsModule, FormsModule, CommonModule], // check work around
  exports: [FormInputComponent, CrudTableComponent], // remove pagination
  providers: [],
})
export class SharedModule {}
