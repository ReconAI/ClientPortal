import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'recon-create-device',
  templateUrl: './create-device.component.html',
  styleUrls: ['./create-device.component.less'],
})
export class CreateDeviceComponent implements OnInit {
  deviceForm: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.deviceForm = this.fb.group({
      name: ['', Validators.required],
      manufacture: ['', Validators.required],
      image: this.fb.array([]),
      product: ['', Validators.required],
      description: ['', Validators.required],
      buyingPrice: ['', Validators.required],
      salesPrice: ['', Validators.required],
    });
  }

  get jsonValue(): string {
    return JSON.stringify(this.deviceForm.value);
  }
}
