import { latLng } from 'leaflet';
export const VAT = 0;
export const FEE = +$ENV.FEE !== 0 ? +$ENV.FEE || 29.9 : 0;
export const TAMPERE_COORDINATES = latLng(61.5, 23.766667);
