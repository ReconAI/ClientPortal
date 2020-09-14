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

export const transformEndpointWithApplyStatus = (
  url: string,
  status: boolean,
  userId: number,
  fs: FiltersService
) => {
  if (!status) {
    return url;
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

export interface SensorClientInterface {
  id: number;
  serial: number;
  lat: string;
  lng: string;
}

export interface SensorServerInterface {
  id: number;
  serial: number;
  gps_lat: string;
  gps_long: string;
}

export const transformSensorFromServer = (
  sensor: SensorServerInterface
): SensorClientInterface => ({
  id: sensor.id,
  serial: sensor.serial,
  lat: sensor.gps_lat,
  lng: sensor.gps_long,
});

export interface SensorsClientInterface {
  sensors: SensorClientInterface[];
}

export const transformSensorsFromServer = (
  response: PaginationResponseServerInterface<SensorServerInterface>
): PaginationResponseClientInterface<SensorClientInterface> => ({
  meta: {
    count: response.count,
    currentPage: response.current,
    pageSize: response.page_size,
  },
  list: response.results.map((sensor) => transformSensorFromServer(sensor)),
});
