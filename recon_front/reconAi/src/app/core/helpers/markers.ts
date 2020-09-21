import { TAMPERE_COORDINATES } from './../../constants/globalVariables/globalVariables';
import { marker, icon, tileLayer } from 'leaflet';

export interface LatLngInterface {
  lat: number;
  lng: number;
}

export type MapMarkerTypes = 'event_object' | 'device';

export interface MarkerParamsInterface {
  zIndex?: number;
  clickHandler?: (params: any) => any;
  isHighlighted?: boolean;
  popupText?: string;
  markerType?: MapMarkerTypes;
}

const defaultParams: MarkerParamsInterface = {
  zIndex: 0,
  clickHandler: null,
  isHighlighted: false,
  popupText: null,
  markerType: 'event_object',
};

export const generateDefaultMap = (center) => ({
  layers: [
    // tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    tileLayer(
      // 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 18,
        minZoom: 3,
        id: 'main-map',
        attribution:
          'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
      }
    ),
  ],
  zoom: 10,
  center: center || TAMPERE_COORDINATES,
});

const chooseMarkerByTypeAndHighlightStatus = (
  isHighlighted: boolean,
  markerType: MapMarkerTypes
): string => {
  if (markerType === 'event_object') {
    return isHighlighted
      ? 'assets/map/event_object_icon_highlighted.svg'
      : 'assets/map/event_object_icon_black.svg';
  }

  if (markerType === 'device') {
    return isHighlighted
      ? 'assets/map/recon-marker-highlighted.svg'
      : 'assets/map/recon-marker.svg';
  }

  return '';
};

export const generateMapMarker = (
  latLng: LatLngInterface,
  {
    isHighlighted,
    zIndex,
    clickHandler,
    popupText,
    markerType,
  }: MarkerParamsInterface = defaultParams
) => {
  const finalMarker = marker([latLng.lat, latLng.lng], {
    icon: icon({
      iconSize: [40, 40],
      iconAnchor: [13, 41],
      iconUrl: chooseMarkerByTypeAndHighlightStatus(
        isHighlighted,
        markerType || 'event_object'
      ),
    }),
  });

  if (zIndex) {
    finalMarker.setZIndexOffset(zIndex);
  }

  if (clickHandler) {
    finalMarker.on('click', clickHandler);
  }
  if (popupText) {
    finalMarker.bindTooltip(popupText);
  }

  return finalMarker;
};
