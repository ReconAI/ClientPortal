import { generalTransformationObjectErrorsForComponent } from './../../../../../core/helpers/generalFormsErrorsTransformation';
import { FormServerErrorInterface } from 'app/constants/types/requests';
import { ManufacturerInterface } from './../../../../constants/types/manufacturers';
import { CategoryInterface } from 'app/orders/constants';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
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

  @Input() allCategories: CategoryInterface[] = [];
  @Input() loadingStatus = false;
  @Input() validationError: FormServerErrorInterface = null;
  @Output() sendManufacturer$ = new EventEmitter<ManufacturerInterface>();
  categoryControl = new FormControl();

  @ViewChild('categoryInput') categoryInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  removeCategory(index: number) {
    this.categories.removeAt(index);
  }

  get categories(): FormArray {
    return this.manufactureForm.get('categories') as FormArray;
  }

  get validationErrors(): string {
    return generalTransformationObjectErrorsForComponent(this.validationError);
  }

  selected(event: MatAutocompleteSelectedEvent, trigger): void {
    this.categories.push(
      this.fb.group({ name: event.option.viewValue, id: event.option.value })
    );
    this.categoryInput.nativeElement.value = '';
    this.categoryControl.setValue(null);
    trigger.openPanel();
  }

  get filteredCategories(): CategoryInterface[] {
    const selectedCategories = this.categories.value.map(
      (category: CategoryInterface) => category.name.toLowerCase()
    );
    const inputValue =
      this?.categoryInput?.nativeElement?.value.toLowerCase() || '';
    return this.allCategories.filter(({ name }: CategoryInterface) => {
      const lowerCasedCategory = name.toLowerCase();

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
      categories: this.fb.array([], Validators.required),
    });
  }

  sendManufacturer() {
    this.sendManufacturer$.emit(this.manufactureForm.value);
  }
}
