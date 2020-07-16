import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';

@Component({
  selector: 'recon-create-manufacture',
  templateUrl: './create-manufacture.component.html',
  styleUrls: ['./create-manufacture.component.less'],
})
export class CreateManufactureComponent implements OnInit {
  manufactureForm: FormGroup;
  constructor(private fb: FormBuilder) {}

  allCategories: string[] = ['d', 'g', 'h', 'r'];
  categoryControl = new FormControl();

  @ViewChild('categoryInput') categoryInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  removeCategory(index: number) {
    this.categories.removeAt(index);
  }

  get categories(): FormArray {
    return this.manufactureForm.get('categories') as FormArray;
  }

  selected(event: MatAutocompleteSelectedEvent, trigger): void {
    this.categories.push(this.fb.control(event.option.viewValue));
    this.categoryInput.nativeElement.value = '';
    this.categoryControl.setValue(null);
    trigger.openPanel();
  }

  get filteredCategories(): string[] {
    const selectedCategories = this.categories.value.map((category: string) =>
      category.toLowerCase()
    );
    const inputValue =
      this?.categoryInput?.nativeElement?.value.toLowerCase() || '';
    return this.allCategories.filter((category: string) => {
      const lowerCasedCategory = category.toLowerCase();

      return (
        lowerCasedCategory.indexOf(inputValue) >= 0 &&
        selectedCategories.indexOf(lowerCasedCategory) < 0
      );
    });
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
      categories: this.fb.array([]),
    });
  }

  sendManufacturer() {
    console.log(this.manufactureForm.value, 'VALUE');
  }
}
