import { Router } from '@angular/router';
import { generalTransformationObjectErrorsForComponent } from './../../../../core/helpers/generalFormsErrorsTransformation';
import { ManufacturerInterface } from './../../../constants/types/manufacturers';
import { CreateManufactureContainer } from './create-manufacture/create-manufacture.container';
import { CategoryInterface } from './../../../constants/types/category';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ReconSelectOption } from 'app/shared/types';
import {
  DeviceFormInterface,
  ServerImageInterface,
} from 'app/orders/constants';
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

  @Input() name: string;
  @Input() manufacturerId: number;
  @Input() product: string;
  @Input() description: string;
  @Input() buyingPrice: string;
  @Input() salesPrice: string;
  @Input() seoTags: string[];
  @Input() seoTitle: string;
  @Input() seoDescription: string;
  @Input() categoryId: number;
  @Input() images: ServerImageInterface[];
  deviceForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.deviceForm = this.fb.group({
      name: [this?.name || '', Validators.required],
      manufacturer: [this?.manufacturerId || '', Validators.required],
      images: this.fb.array(
        this?.images?.map((img) => ({
          name: img?.path?.slice(img.path.lastIndexOf('/') + 1),
          id: img.id,
          path: img?.path,
        })) || []
      ),
      product: [this?.product || '', Validators.required],
      description: [this?.description || '', Validators.required],
      buyingPrice: [this?.buyingPrice || '', Validators.required],
      salesPrice: [this?.salesPrice || '', Validators.required],
      seoTags: this.fb.array(
        this?.seoTags?.map((text) => this.fb.control(text)) || [],
        Validators.required
      ),
      seoTitle: [this?.seoTitle || '', Validators.required],
      seoDescription: [this?.seoDescription || '', Validators.required],
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

  cancelClick(): void {
    this.router.navigate(['/orders']);
  }
}
