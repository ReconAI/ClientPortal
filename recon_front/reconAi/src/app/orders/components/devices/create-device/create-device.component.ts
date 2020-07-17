import { generalTransformationObjectErrorsForComponent } from './../../../../core/helpers/generalFormsErrorsTransformation';
import { ManufacturerInterface } from './../../../constants/types/manufacturers';
import { CreateManufactureContainer } from './create-manufacture/create-manufacture.container';
import { CategoryInterface } from './../../../constants/types/category';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ReconSelectOption } from 'app/shared/types';
import { DeviceFormInterface } from 'app/orders/constants';
import { FormServerErrorInterface } from 'app/constants/types/requests';

@Component({
  selector: 'recon-create-device',
  templateUrl: './create-device.component.html',
  styleUrls: ['./create-device.component.less'],
})
export class CreateDeviceComponent implements OnInit {
  @Input() allCategories: CategoryInterface[];
  @Input() manufacturers: ManufacturerInterface[] = [];
  @Input() loading = false;
  @Input() validationError: FormServerErrorInterface = null;
  @Output() sendDevice$ = new EventEmitter<DeviceFormInterface>();
  deviceForm: FormGroup;

  constructor(private fb: FormBuilder, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.deviceForm = this.fb.group({
      name: ['', Validators.required],
      manufacturer: ['', Validators.required],
      images: this.fb.array([]),
      product: ['', Validators.required],
      description: ['', Validators.required],
      buyingPrice: ['', Validators.required],
      salesPrice: ['', Validators.required],
      seoTags: this.fb.array([], Validators.required),
      seoTitle: ['', Validators.required],
      seoDescription: ['', Validators.required],
      category: ['', Validators.required],
    });
  }

  get manufactureOptions(): ReconSelectOption[] {
    return this.manufacturers.map((manufacturer) => ({
      label: manufacturer.name,
      value: manufacturer.id,
    }));
  }

  openCreateManufactureDialog(): void {
    this.dialog.open(CreateManufactureContainer, {
      width: '470px',
      height: '650px',
    });
  }

  get categoryOptions(): ReconSelectOption[] {
    return this.allCategories.map((category) => ({
      label: category.name,
      value: category.id,
    }));
  }

  get formedValidationError(): string {
    return generalTransformationObjectErrorsForComponent(this.validationError);
  }

  sendDevice(): void {
    this.sendDevice$.emit(this.deviceForm.value);
  }
}
