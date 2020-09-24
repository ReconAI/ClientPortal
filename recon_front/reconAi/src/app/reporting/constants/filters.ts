import { FilterTypes } from './../../core/constants/filters';
import { FilterItemInterface } from './types/filters';
import moment from 'moment';

export const DEFAULT_FILTER_ARRAY: FilterItemInterface[] = [
  {
    label: 'Or / And',
    id: 'logical_and',
    type: FilterTypes.SLIDER,
    value: true,
    selected: true,
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
      start: moment(),
      end: moment(),
    },
  },
  {
    label: 'Sensor GPS',
    id: 'gps',
    type: FilterTypes.MAP_RECTANGLE,
    value: {
      topLeft: {
        lat: '',
        lng: '',
      },
      bottomRight: {
        lat: '',
        lng: '',
      },
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
    label: 'Event/Object class',
    id: 'object_class',
    type: FilterTypes.MULTIPLE_SELECT,
    value: [],
  },
  // {
  //   label: 'Location XYZ, mm',
  //   id: 'location',
  //   type: FilterTypes.THREE_INPUTS,
  //   value: {
  //     left: '',
  //     middle: '',
  //     right: '',
  //     checked: false,
  //   },
  // },
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
  // {
  //   label: 'Traffic flow',
  //   id: 'traffic_flow',
  //   type: FilterTypes.SELECT,
  //   value: '',
  // },
  {
    label: 'Vehicle classification',
    id: 'vehicle_type',
    type: FilterTypes.SELECT,
    value: '',
  },
  {
    label: 'Pedestrian transit method classification',
    id: 'pedestrian_transit_method',
    type: FilterTypes.SELECT,
    value: '',
  },
  {
    label: 'Road weather condition',
    id: 'road_weather_condition',
    type: FilterTypes.SELECT,
    value: '',
  },
  {
    label: 'Vehicle registration plate',
    id: 'license_plate_number',
    type: FilterTypes.INPUT,
    value: '',
  },
  {
    label: 'Ambient temperature, C',
    id: 'ambient_temperature',
    type: FilterTypes.TWO_INPUTS,
    value: {
      left: '',
      right: '',
    },
  },
  {
    label: 'Road temperature, C',
    id: 'road_temperature',
    type: FilterTypes.TWO_INPUTS,
    value: {
      left: '',
      right: '',
    },
  },
  {
    label: 'Is tagged data',
    id: 'is_tagged',
    type: FilterTypes.CHECKBOX,
    value: false,
  },
  {
    label: 'Object Type',
    id: 'event_object',
    type: FilterTypes.SELECT,
    value: '',
  },
];
