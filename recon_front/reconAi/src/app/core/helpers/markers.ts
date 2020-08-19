import { marker, icon } from 'leaflet';

export interface LatLngInterface {
  lat: number;
  lng: number;
}

export interface MarkerParamsInterface {
  zIndex?: number;
  clickHandler?: (params: any) => any;
  isHighlighted?: boolean;
  popupText?: string;
}

const defaultParams: MarkerParamsInterface = {
  zIndex: 0,
  clickHandler: null,
  isHighlighted: false,
  popupText: null,
};

export const generateMapMarker = (
  latLng: LatLngInterface,
  { isHighlighted, zIndex, clickHandler, popupText } = defaultParams
) => {
  const finalMarker = marker([latLng.lat, latLng.lng], {
    icon: icon({
      iconSize: [40, 40],
      iconAnchor: [13, 41],
      iconUrl: isHighlighted
        ? 'assets/map/recon-marker-highlighted.svg'
        : 'assets/map/recon-marker.svg',
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
