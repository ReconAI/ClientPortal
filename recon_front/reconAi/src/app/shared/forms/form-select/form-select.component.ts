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
  @Input() options: ReconSelectOption[] = [
    {
      value: 1,
      label: '1',
    },
    {
      value: 2,
      label: '2',
    },
    {
      value: 3,
      label: '3',
    },
    {
      value: 4,
      label: '4',
    },
    {
      value: 5,
      label: '5',
    },
    {
      value: 6,
      label: '6',
    },
  ];
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
      (option) => option?.value === value
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
