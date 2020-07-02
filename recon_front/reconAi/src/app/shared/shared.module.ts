import { CommonModule } from '@angular/common';
import { MaterialModule } from './../material/material.module';
import { NgModule } from '@angular/core';
import { FormInputComponent } from './forms/form-input/form-input.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PaginationComponent } from './tables/pagination/pagination.component';

@NgModule({
  declarations: [FormInputComponent, PaginationComponent],
  imports: [MaterialModule, ReactiveFormsModule, FormsModule, CommonModule], // check work around
  exports: [FormInputComponent],
  providers: [],
})
export class SharedModule {}