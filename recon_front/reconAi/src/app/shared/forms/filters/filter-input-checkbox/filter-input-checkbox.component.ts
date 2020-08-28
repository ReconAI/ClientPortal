import { NgControl, ControlValueAccessor } from '@angular/forms';
import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  Self,
  Optional,
} from '@angular/core';

export interface FilterInputPropsInterface {
  inputValue: string;
  checked: boolean;
}

@Component({
  selector: 'recon-filter-input-checkbox',
  templateUrl: './filter-input-checkbox.component.html',
  styleUrls: ['./filter-input-checkbox.component.less'],
})
export class FilterInputCheckboxComponent
  implements OnInit, ControlValueAccessor {
  @Input() label = '';
  @Input() checkboxLabel = '';
  @Input() placeholder = 'Search...';
  @Input() disabled = false;
  @Output() changeVal = new EventEmitter<FilterInputPropsInterface>();
  @Output() blurVal = new EventEmitter<FilterInputPropsInterface>();

  inputValue = '';
  checked = false;

  constructor(@Optional() @Self() public controlDir: NgControl) {
    controlDir.valueAccessor = this;
  }

  onChange = (value: FilterInputPropsInterface) => {};
  onTouched = () => {};

  writeValue({ inputValue, checked }: FilterInputPropsInterface) {
    this.inputValue = inputValue;
    this.checked = checked;

    // this.onChange({ inputValue, checked });
    // this.changeVal.emit({ inputValue, checked });
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

  changeValues(): void {
    this.onChange({
      inputValue: this.inputValue,
      checked: this.checked,
    });
    this.changeVal.emit({
      inputValue: this.inputValue,
      checked: this.checked,
    });
  }

  blurValue(): void {
    this.onTouched();
    this.blurVal.emit({
      inputValue: this.inputValue,
      checked: this.checked,
    });
  }

  ngOnInit(): void {}
}
