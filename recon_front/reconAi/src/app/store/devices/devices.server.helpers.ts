import { PaginationResponseClientInterface, PaginationResponseServerInterface } from 'app/constants/types/requests';
import {
  SensorClientInterface,
  SensorServerInterface,
  transformSensorFromServer,
} from './../../constants/types/sensors';

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
