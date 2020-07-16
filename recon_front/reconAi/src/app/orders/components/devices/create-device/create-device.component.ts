import { CreateManufactureContainer } from './create-manufacture/create-manufacture.container';
import { CategoryInterface } from './../../../constants/types/category';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'recon-create-device',
  templateUrl: './create-device.component.html',
  styleUrls: ['./create-device.component.less'],
})
export class CreateDeviceComponent implements OnInit {
  @Input() allCategories: CategoryInterface[];
  deviceForm: FormGroup;
  constructor(private fb: FormBuilder, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.deviceForm = this.fb.group({
      name: ['', Validators.required],
      manufacture: ['', Validators.required],
      image: this.fb.array([]),
      product: ['', Validators.required],
      description: ['', Validators.required],
      buyingPrice: ['', Validators.required],
      salesPrice: ['', Validators.required],
      seoTags: this.fb.array([]),
      seoTitle: ['', Validators.required],
      seoDescription: ['', Validators.required],
      category: ['', Validators.required],
    });
  }

  openCreateManufactureDialog(): void {
    this.dialog.open(CreateManufactureContainer, {
      width: '470px',
      height: '650px',
    });
  }

  get jsonValue(): string {
    return JSON.stringify(this.deviceForm.value);
  }
}
