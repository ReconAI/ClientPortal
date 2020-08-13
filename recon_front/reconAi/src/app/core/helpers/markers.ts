import { marker, icon } from 'leaflet';

export interface LatLngInterface {
  lat: number;
  lng: number;
}

export const generateMapMarker = (
  latLng: LatLngInterface,
  isHighlighted = false
) =>
  marker([latLng.lat, latLng.lng], {
    icon: icon({
      iconSize: [40, 40],
      iconAnchor: [13, 41],
      iconUrl: isHighlighted
        ? 'assets/map/recon-marker-highlighted.png'
        : 'assets/map/recon-marker.svg',
    }),
  });
