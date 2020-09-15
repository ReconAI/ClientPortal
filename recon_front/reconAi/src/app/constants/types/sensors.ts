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
