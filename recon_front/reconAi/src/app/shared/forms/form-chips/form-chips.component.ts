import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';

@Component({
  selector: 'recon-form-chips',
  templateUrl: './form-chips.component.html',
  styleUrls: ['./form-chips.component.less'],
})
export class FormChipsComponent implements OnInit {
  @Input() parentForm: FormGroup;
  @Input() field: string;
  @Input() placeholder = '';
  @Input() label = '';
  @Input() showRequiredSymbol = false;
  touched = false;
  focused = false;
  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {}

  addChip(text: string): void {
    if (text) {
      this.chips.push(this.fb.control(text));
    }
  }

  get validationStatus(): boolean {
    return !this.touched || this.chips.valid;
  }

  get chips(): FormArray {
    return this.parentForm.get(this.field) as FormArray;
  }

  removeChip(index: number): void {
    this.chips.removeAt(index);
  }
}
