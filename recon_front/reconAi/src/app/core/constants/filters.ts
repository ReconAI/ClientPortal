import { FilterItemInterface } from './../../reporting/constants/types/filters';
export interface FilterWithValueInterface {
  [key: string]:
    | boolean
    | string
    | RangeValueInterface
    | InputCheckboxInterface
    | ThreeInputsInterface
    | TwoInputsInterface;
}

export interface SetFiltersValueInterface {
  userId: number;
  filters: FilterItemInterface[];
}

export interface FilterLocalStorageInterface {
  [key: number]: FilterItemInterface[];
}

export enum FilterTypes {
  SLIDER = 'slider',
  INPUT = 'input',
  RANGE = 'range',
  INPUT_CHECKBOX = 'input checkbox',
  THREE_INPUTS = 'three inputs',
  SELECT = 'select',
  TWO_INPUTS = 'two inputs',
  CHECKBOX = 'checkbox',
}

export interface RangeValueInterface {
  start: moment.Moment;
  end: moment.Moment;
}

export interface InputCheckboxInterface {
  valueInput: string;
  checked: boolean;
}

export interface ThreeInputsInterface {
  left: string;
  middle: string;
  right: string;
  checked: boolean;
}

export interface TwoInputsInterface {
  left: string;
  right: string;
}
