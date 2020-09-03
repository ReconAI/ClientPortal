import { NgControl } from '@angular/forms';
import {
  Component,
  OnInit,
  Optional,
  Self,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

export interface FilterTwoInputsCheckboxInterface {
  left: string;
  right: string;
  checked: boolean;
}

@Component({
  selector: 'recon-filter-two-inputs-checkbox',
  templateUrl: './filter-two-inputs-checkbox.component.html',
  styleUrls: ['./filter-two-inputs-checkbox.component.less'],
})
export class FilterTwoInputsCheckboxComponent implements OnInit {
  constructor(@Optional() @Self() public controlDir: NgControl) {
    controlDir.valueAccessor = this;
  }

  left = '';
  right = '';
  checked = false;
  @Input() disabled = false;
  @Output() changeVal = new EventEmitter<FilterTwoInputsCheckboxInterface>();
  @Output() blurVal = new EventEmitter<FilterTwoInputsCheckboxInterface>();

  @Input() leftPlaceholder = 'From';
  @Input() rightPlaceholder = 'To';

  @Input() leftLabel = '';
  @Input() rightLabel = '';
  @Input() checkboxLabel = '';

  @Input() label = '';

  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: FilterTwoInputsCheckboxInterface) {
    this.left = value.left;
    this.right = value.right;
    this.checked = !!value.checked;

    // this.onChange(this.checked);
    // this.changeVal.emit(this.checked);
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  changeValue(): void {
    const newValue = {
      left: this.left,
      right: this.right,
      checked: this.checked,
    };

    this.onChange(newValue);
    this.changeVal.emit(newValue);
  }

  blurValue(): void {
    this.onTouched();
    this.blurVal.emit({
      left: this.left,
      right: this.right,
      checked: this.checked,
    });
  }

  ngOnInit(): void {}
}
