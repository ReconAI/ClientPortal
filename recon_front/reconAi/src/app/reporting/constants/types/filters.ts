import { MapRectangleFilterInterface } from './../../../core/constants/filters';
import {
  FilterTypes,
  RangeValueInterface,
  InputCheckboxInterface,
  ThreeInputsInterface,
  TwoInputsInterface,
  TwoInputsCheckboxInterface,
} from 'app/core/constants/filters';

export interface FilterItemInterface {
  selected?: boolean;
  label?: string;
  id: string;
  type: FilterTypes;
  value:
    | boolean
    | string
    | RangeValueInterface
    | InputCheckboxInterface
    | ThreeInputsInterface
    | TwoInputsInterface
    | TwoInputsCheckboxInterface
    | MapRectangleFilterInterface;
}

export interface OptionServerInterface {
  value: string;
  short_description: string;
}
