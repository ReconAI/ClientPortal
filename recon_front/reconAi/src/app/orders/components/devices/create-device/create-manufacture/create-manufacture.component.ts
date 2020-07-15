import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'recon-create-manufacture',
  templateUrl: './create-manufacture.component.html',
  styleUrls: ['./create-manufacture.component.less'],
})
export class CreateManufactureComponent implements OnInit {
  manufactureForm: FormGroup;
  constructor(private fb: FormBuilder) {}

  selectedCategories: string[] = ['a', 'b', 'c'];
  allCategories: string[] = ['d', 'g', 'h', 'r'];
  @ViewChild('categoryInput') categoryInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our category
    if ((value || '').trim()) {
      this.selectedCategories.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = ' ';
    }
    // this.categoryCtrl.setValue(null);
  }

  remove(category: string): void {
    const index = this.selectedCategories.indexOf(category);

    if (index >= 0) {
      this.selectedCategories.splice(index, 1);
    }
  }

  optionClick(event) {
    console.log(event, 'EVENT');
    event.stopPropagation();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedCategories.push(event.option.viewValue);
    this.categoryInput.nativeElement.value = '';
    // this.categoryCtrl.setValue(null);
  }

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
