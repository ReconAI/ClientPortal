import { FilterTypes } from './../../core/constants/filters';
import { FilterItemInterface } from './types/filters';
export const DEFAULT_FILTER_ARRAY: FilterItemInterface[] = [
  {
    label: 'Or / And',
    id: 'logical_and',
    type: FilterTypes.SLIDER,
    value: true,
  },
  {
    label: 'Sensor ID',
    id: 'sensor_id',
    type: FilterTypes.INPUT,
    value: '',
  },
  {
    label: 'Time Stamp',
    id: 'timestamp',
    type: FilterTypes.RANGE,
    value: {
      start: null,
      end: null,
    },
  },
  {
    label: 'Project name',
    id: 'project_name',
    type: FilterTypes.INPUT_CHECKBOX,
    value: {
      inputValue: '',
      checked: false,
    },
  },
  {
    label: 'Event/Object',
    id: 'event_object',
    type: FilterTypes.SELECT,
    value: '',
  },
  {
    label: 'Location XYZ, mm',
    id: 'location',
    type: FilterTypes.THREE_INPUTS,
    value: {
      left: '',
      middle: '',
      right: '',
      checked: false,
    },
  },
  {
    label: 'Orient theta',
    id: 'orient_theta',
    type: FilterTypes.TWO_INPUTS_CHECKBOX,
    value: {
      left: '',
      right: '',
      checked: false,
    },
  },
  {
    label: 'Orient phi',
    id: 'orient_phi',
    type: FilterTypes.TWO_INPUTS_CHECKBOX,
    value: {
      left: '',
      right: '',
      checked: false,
    },
  },
  {
    label: 'Traffic flow',
    id: 'traffic_flow',
    type: FilterTypes.SELECT,
    value: '',
  },
  {
    label: 'Vehicle classification',
    id: 'stopped_vehicles_detection',
    type: FilterTypes.SELECT,
    value: '',
  },
  {
    label: 'Pedestrian transit method classification',
    id: 'pedestrian',
    type: FilterTypes.SELECT,
    value: '',
  },
  {
    label: 'Ambient temperature, C',
    id: 'ambient_weather',
    type: FilterTypes.TWO_INPUTS,
    value: {
      left: '',
      right: '',
    },
  },
  {
    label: 'Road temperature, C',
    id: 'road_weather',
    type: FilterTypes.TWO_INPUTS,
    value: {
      left: '',
      right: '',
    },
  },
  {
    label: 'Tagged data',
    id: 'tagged_data',
    type: FilterTypes.CHECKBOX,
    value: false,
  },
];
