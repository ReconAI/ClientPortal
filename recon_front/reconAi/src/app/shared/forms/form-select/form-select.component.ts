import { ReconSelectOption } from './../../types/recon-select';
import {
  Component,
  OnInit,
  Optional,
  Self,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'recon-form-select',
  templateUrl: './form-select.component.html',
  styleUrls: ['./form-select.component.less'],
})
export class FormSelectComponent implements ControlValueAccessor, OnInit {
  constructor(@Optional() @Self() public controlDir: NgControl) {
    controlDir.valueAccessor = this;
  }

  selectedOption: ReconSelectOption;
  uniqueId: string;
  @Input() label = '';
  @Input() options: ReconSelectOption[] = [];
  @Input() placeholder = '';
  @Input() errorMessages: { [key: string]: string } = {};
  @Input() disabled = false;
  @Input() showRequiredSymbol = false;

  @Output() changeVal = new EventEmitter<any>();
  isOpen = false;
  isActive = false;
  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: string) {
    this.selectedOption = this.options.find(
      (option) => option?.value?.toString() === value?.toString()
    );

    this.onChange(this.selectedOption?.value || '');
    this.changeVal.emit(this.selectedOption?.value || '');
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

  get hasErrors() {
    return (
      this.controlDir.control &&
      this.controlDir.control.touched &&
      this.controlDir.control.errors
    );
  }

  optionClick(option: ReconSelectOption) {
    this.selectedOption = option;
    this.onChange(this.selectedOption.value);
    this.isActive = false;
  }

  headerClick() {
    this.isActive = true;
  }

  handleClickOutside() {
    this.isActive = false;
  }

  get headerLabel(): string {
    return (
      this.selectedOption?.label?.toString() ||
      this.placeholder ||
      'Choose an option'
    );
  }

  ngOnInit(): void {
    this.uniqueId = uuid();
  }
}
