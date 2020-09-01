import {
  PaginationResponseServerInterface,
  PaginationResponseClientInterface,
} from './../../constants/types/requests';

import moment from 'moment';

export interface ReportingDeviceProjectInterface {
  id: number;
  name: string;
}

export interface ReportingDeviceServerInterface {
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
  project: ReportingDeviceProjectInterface;
  ecosystem_name: string;
  event_object: string;
  object_class: string;
  license_plate_number: string;
  traffic_flow: string;
  ambient_weather: string;
  road_weather: string;
  stopped_vehicles_detection: string;
  tagged_data: string;
  license_plate_location: string;
  face_location: string;
  cad_file_tag: string;
}

export interface ReportingDeviceClientInterface {
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
  project: ReportingDeviceProjectInterface;
  ecosystemName: string;
  isEvent: string;
  objectClass: string;
  plateNumber: string;
  trafficFlow: string;
  ambientWeather: string;
  roadWeather: string;
  vehicle: string;
  taggedData: string;
  plate: string;
  face: string;
  fileTag: string;
}

export interface SetSelectedReportingDeviceClientInterface {
  device: ReportingDeviceClientInterface;
}
export const transformReportingDeviceFromServer = (
  device: ReportingDeviceServerInterface
): ReportingDeviceClientInterface => ({
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
  project: device.project,
  ecosystemName: device.ecosystem_name,
  isEvent: device.event_object,
  objectClass: device.event_object,
  plateNumber: device.license_plate_number,
  trafficFlow: device.traffic_flow,
  ambientWeather: device.ambient_weather,
  roadWeather: device.road_weather,
  vehicle: device.stopped_vehicles_detection,
  taggedData: device.tagged_data,
  plate: device.license_plate_location,
  face: device.face_location,
  fileTag: device.cad_file_tag,
});

export const transformReportingDeviceCardFromServer = (
  device: ReportingDeviceServerInterface
): SetSelectedReportingDeviceClientInterface => ({
  device: transformReportingDeviceFromServer(device),
});

export const transformReportingPaginatedDeviceListFromServer = (
  response: PaginationResponseServerInterface<ReportingDeviceServerInterface>
): PaginationResponseClientInterface<ReportingDeviceClientInterface> => ({
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

export interface SetGpsRequestServerInterface {
  lat: number;
  long: number;
}

export const transformSetGpsToServer = ({
  gps,
}: SetGpsRequestInterface): SetGpsRequestServerInterface => ({
  lat: gps?.lat,
  long: gps?.lng,
});

export const setGpsErrorFieldRelations = {
  lat: 'LAT',
  long: 'LNG',
};
