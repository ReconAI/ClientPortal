import { CommonModule } from '@angular/common';
import { MaterialModule } from './../material/material.module';
import { NgModule } from '@angular/core';
import { FormInputComponent } from './forms/form-input/form-input.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [FormInputComponent],
  imports: [MaterialModule, ReactiveFormsModule, FormsModule, CommonModule], // check work around
  exports: [FormInputComponent],
  providers: [],
})
export class SharedModule {}
