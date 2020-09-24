import { FilterItemInterface } from 'app/reporting/constants/types/filters';
import {
  SensorClientInterface,
  SensorServerInterface,
  transformSensorFromServer,
} from './../../constants/types/sensors';
import { LatLngInterface } from 'app/core/helpers/markers';
import { ReconSelectOption } from 'app/shared/types';
import { OptionServerInterface } from './../../reporting/constants/types/filters';
import { FiltersService } from './../../core/services/filters/filters.service';
import {
  PaginationResponseServerInterface,
  PaginationResponseClientInterface,
} from './../../constants/types/requests';

import moment from 'moment';

export interface TrafficFlowServerInterface {
  DirectionsStatistics: string;
  NumberOfDirections: string;
  NumberOfObjects: string;
  ObservationEndDT: string;
  ObservationStartDT: string;
}

export interface TrafficFlowClientInterface {
  directionsStatistics: string;
  numberOfDirections: string;
  numberOfObjects: string;
  observationEndDT: string;
  observationStartDT: string;
}

export interface ReportingFilteringDeviceServerInterface {
  sensor_id: number;
  id: number;
  sensor_GPS_lat: string;
  sensor_GPS_long: string;
  location_x: string;
  location_y: string;
  location_z: string;
  orient_theta: string;
  orient_phi: string;
  timestamp: string;
  project_name: string;
  ecosystem_name: string;
  event_object: string;
  object_class: string;
  license_plate_number: string;
  traffic_flow: TrafficFlowServerInterface;
  ambient_weather: string;
  road_weather: string;
  stopped_vehicles_detection: string;
  vehicle_classification: string;
  tagged_data: string;
  license_plate_location: string;
  face_location: string;
  cad_file_tag: string;
  pedestrian_flow_number_of_objects: string;
  pedestrian_flow_transit_method: string;
  road_temperature: number;
  ambient_temperature: number;
  is_tagged_data: boolean;
}

export interface ReportingFilteringDeviceClientInterface {
  id: number;
  sensorId: number;
  lat: string;
  lng: string;
  locationX: string;
  locationY: string;
  locationZ: string;
  theta: string;
  phi: string;
  timestamp: string;
  project: string;
  ecosystemName: string;
  isEvent: string;
  objectClass: string;
  plateNumber: string;
  ambientWeather: string;
  roadWeather: string;
  vehicle: string;
  taggedData: string;
  plate: string;
  face: string;
  fileTag: string;
  directionsStatistics: string;
  numberOfDirections: string;
  numberOfObjects: string;
  observationStartDT: string;
  observationEndDT: string;
  pedestrianFlowNumberOfObjects: string;
  pedestrianFlowTransitMethod: string;
  roadTemperature: number;
  ambientTemperature: number;
  isTaggedData: boolean;
}

export interface SetSelectedReportingFilteringDeviceClientInterface {
  device: ReportingFilteringDeviceClientInterface;
}
export const transformReportingDeviceFromServer = (
  device: ReportingFilteringDeviceServerInterface
): ReportingFilteringDeviceClientInterface => ({
  id: device.id,
  sensorId: device.sensor_id,
  lat: device.sensor_GPS_lat,
  lng: device.sensor_GPS_long,
  locationX: device.location_x,
  locationY: device.location_y,
  locationZ: device.location_z,
  theta: device.orient_theta,
  phi: device.orient_phi,
  timestamp: moment(device.timestamp).format('YYYY-MM-DD, HH:mm'),
  project: device.project_name,
  ecosystemName: device.ecosystem_name,
  isEvent: device.event_object,
  objectClass: device.object_class,
  plateNumber: device.license_plate_number,
  ambientWeather: device.ambient_weather,
  roadWeather: device.road_weather,
  vehicle: device.vehicle_classification,
  taggedData: device.tagged_data,
  plate: device.license_plate_location,
  face: device.face_location,
  fileTag: device.cad_file_tag,
  directionsStatistics: device?.traffic_flow?.DirectionsStatistics,
  numberOfDirections: device?.traffic_flow?.NumberOfDirections,
  numberOfObjects: device?.traffic_flow?.NumberOfObjects,
  observationStartDT: moment(device?.traffic_flow?.ObservationStartDT).format(
    'YYYY-MM-DD, HH:mm'
  ),
  observationEndDT: moment(device?.traffic_flow?.ObservationEndDT).format(
    'YYYY-MM-DD, HH:mm'
  ),
  pedestrianFlowNumberOfObjects: device?.pedestrian_flow_number_of_objects,
  pedestrianFlowTransitMethod: device?.pedestrian_flow_transit_method,
  roadTemperature: device?.road_temperature,
  ambientTemperature: device?.ambient_temperature,
  isTaggedData: device.is_tagged_data,
});

export const transformReportingDeviceCardFromServer = (
  device: ReportingFilteringDeviceServerInterface
): SetSelectedReportingFilteringDeviceClientInterface => ({
  device: transformReportingDeviceFromServer(device),
});

export const transformReportingPaginatedDeviceListFromServer = (
  response: PaginationResponseServerInterface<
    ReportingFilteringDeviceServerInterface
  >
): PaginationResponseClientInterface<
  ReportingFilteringDeviceClientInterface
> => ({
  meta: {
    count: response.count,
    currentPage: response.current,
    pageSize: response.page_size,
  },
  list: response.results.map((device) =>
    transformReportingDeviceFromServer(device)
  ),
});

export interface SetGpsRequestInterface {
  gps: {
    id: number;
    lat: number;
    lng: number;
  };
}

export interface LatLngServerInterface {
  lat: number;
  long: number;
}

export const transformSetGpsToServer = ({
  gps,
}: SetGpsRequestInterface): LatLngServerInterface => ({
  lat: gps?.lat,
  long: gps?.lng,
});

export const setGpsErrorFieldRelations = {
  lat: 'LAT',
  long: 'LNG',
};

export const filteringErrorFieldRelations = {
  logical_and: 'Or / And',
  sensor_id: 'Sensor ID',
  timestamp: 'Time Stamp',
  gps: 'Event/Object GPS',
  project_name: 'Project name',
  object_class: 'Event/Object class',
  orient_theta: 'Orient theta',
  orient_phi: 'Orient phi',
  vehicle_type: 'Vehicle classification',
  pedestrian_transit_method: 'Pedestrian transit method classification',
  road_weather_condition: 'Road weather condition',
  license_plate_number: 'Vehicle registration plate',
  ambient_temperature: 'Ambient temperature, C',
  road_temperature: 'Road temperature, C',
  is_tagged: 'Is tagged data',
  event_object: 'Object Type',
};

// this method transform filters from array to string
// from either local storage by default or argument filters
export const transformEndpointWithApplyStatus = (
  url: string,
  status: boolean,
  userId: number,
  fs: FiltersService,
  filters?: FilterItemInterface[]
) => {
  if (!status) {
    return url;
  }

  if (filters) {
    return `${url}&${fs.transformFiltersToString(filters)}`;
  }

  return `${url}&${fs.transformValuesForUserFromLocalStorage(userId)}`;
};

export const transformReportingOptionFromServer = (
  option: OptionServerInterface
): ReconSelectOption => ({
  value: option.value,
  label: option.short_description,
});

export interface OptionsPayloadInterface {
  options: ReconSelectOption[];
}

export const transformOptionsFromServer = (
  options: OptionServerInterface[]
): OptionsPayloadInterface => ({
  options: options.map((option) => transformReportingOptionFromServer(option)),
});

export interface AutocompleteNameServerInterface {
  name: string;
}

export interface AutocompleteNameClientInterface {
  names: string[];
}

export interface BuildRouteClientInterface {
  points: LatLngInterface[];
}

export const transformBuildingRouteFromServer = (
  points: LatLngServerInterface[]
): BuildRouteClientInterface => ({
  points: points.map(({ lat, long }) => ({ lat, lng: long })),
});

export interface HeatMapPointServerInterface {
  sensor_GPS_lat: number;
  sensor_GPS_long: number;
  number_of_objects: number;
}

export interface HeatMapPointClientInterface {
  lat: number;
  lng: number;
  amount: number;
}

export interface HeatMapDataClientInterface {
  points: HeatMapPointClientInterface[];
}

export const transformHeatMapPointFromServer = (
  point: HeatMapPointServerInterface
): HeatMapPointClientInterface => ({
  lat: point.sensor_GPS_lat,
  lng: point.sensor_GPS_long,
  amount: point.number_of_objects,
});

export const transformHeatMapDataFromServer = (
  points: HeatMapPointServerInterface[]
): HeatMapDataClientInterface => ({
  points: points.map((point) => transformHeatMapPointFromServer(point)),
});

export const transformUrlWithDevicesToLoadHeatMapData = (
  url: string,
  devices: ReportingFilteringDeviceClientInterface[]
): string =>
  devices?.reduce((res, current) => `${res}&id=${current.id}`, url) || url;
export interface SensorsClientInterface {
  sensors: SensorClientInterface[];
}
export interface SensorClientRequestedActionInterface {
  id: number;
}
export interface SensorClientActionInterface {
  sensor: SensorClientInterface;
}

export const transformSensorClientFromServer = (
  sensor: SensorServerInterface
): SensorClientActionInterface => ({
  sensor: transformSensorFromServer(sensor),
});
