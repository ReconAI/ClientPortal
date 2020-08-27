import {
  FilterTypes,
  RangeValueInterface,
  InputCheckboxInterface,
  ThreeInputsInterface,
  TwoInputsInterface,
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
    | TwoInputsInterface;
}
