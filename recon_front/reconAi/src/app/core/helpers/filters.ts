import {
  InputCheckboxInterface,
  TwoInputsCheckboxInterface,
  TwoInputsInterface,
  MapRectangleFilterInterface,
} from './../constants/filters';
import { FilterTypes } from 'app/core/constants/filters';
import { FilterItemInterface } from 'app/reporting/constants/types/filters';
import { exportRelevantDataRequestedAction } from 'app/store/reporting';

export const isValueOfFilterValidForServer = (
  { type, selected, value }: FilterItemInterface,
  checkSelectedStatus = true
): boolean => {
  if (checkSelectedStatus && !selected) {
    return false;
  }

  // range is always set
  if (
    type === FilterTypes.CHECKBOX ||
    type === FilterTypes.RANGE ||
    type === FilterTypes.SLIDER
  ) {
    return true;
  }

  if (type === FilterTypes.INPUT || type === FilterTypes.SELECT) {
    return !!value;
  }

  if (type === FilterTypes.INPUT_CHECKBOX) {
    return !!(value as InputCheckboxInterface).inputValue;
  }

  if (type === FilterTypes.TWO_INPUTS_CHECKBOX) {
    return !!(
      (value as TwoInputsCheckboxInterface).left ||
      (value as TwoInputsCheckboxInterface).right
    );
  }

  if (type === FilterTypes.TWO_INPUTS) {
    return !!(
      (value as TwoInputsInterface).left || (value as TwoInputsInterface).right
    );
  }

  if (type === FilterTypes.MAP_RECTANGLE) {
    return !!(
      (value as MapRectangleFilterInterface)?.topLeft?.lat ||
      (value as MapRectangleFilterInterface)?.topLeft?.lng ||
      (value as MapRectangleFilterInterface)?.bottomRight?.lat ||
      (value as MapRectangleFilterInterface)?.bottomRight?.lng
    );
  }

  if (type === FilterTypes.MULTIPLE_SELECT) {
    return !!(value as string)?.length;
  }

  return false;
};
