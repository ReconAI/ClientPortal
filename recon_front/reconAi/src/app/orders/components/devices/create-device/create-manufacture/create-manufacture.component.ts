import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'recon-create-manufacture',
  templateUrl: './create-manufacture.component.html',
  styleUrls: ['./create-manufacture.component.less'],
})
export class CreateManufactureComponent implements OnInit {
  manufactureForm: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.manufactureForm = this.fb.group({
      name: ['', Validators.required],
      vat: ['', Validators.required],
      contactPerson: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      orderEmail: ['', Validators.required],
      supportEmail: ['', Validators.required],
      // supportEmail: ['', Validators.required],
    });
  }
}
