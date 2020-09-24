import { FilterItemInterface } from './../../reporting/constants/types/filters';
export interface FilterWithValueInterface {
  [key: string]:
    | boolean
    | string
    | string[]
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
  TWO_INPUTS_CHECKBOX = 'two inputs checkbox',
  MAP_RECTANGLE = 'map rectangle',
  MULTIPLE_SELECT = 'multiple select',
}

export interface RangeValueInterface {
  start: moment.Moment;
  end: moment.Moment;
}

export interface InputCheckboxInterface {
  inputValue: string;
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

export interface TwoInputsCheckboxInterface {
  left: string;
  right: string;
  checked: boolean;
}

export interface MapRectangleFilterInterface {
  topLeft: {
    lat: string;
    lng: string;
  };
  bottomRight: {
    lat: string;
    lng: string;
  };
}
