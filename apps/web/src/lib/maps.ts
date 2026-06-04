import { Loader } from '@googlemaps/js-api-loader';
import { Coordinates } from '@/types';

const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '';
let loader: Loader | null = null;
let isLoaded = false;

export const getLoader = (): Loader => {
  if (!loader) loader = new Loader({ apiKey: GOOGLE_MAPS_KEY, version: 'weekly', libraries: ['places', 'geometry', 'routes'] });
  return loader;
};

export const loadGoogleMaps = async (): Promise<typeof google> => {
  if (typeof window === 'undefined') throw new Error('Must run in browser');
  if (isLoaded && window.google) return window.google;
  await getLoader().load();
  isLoaded = true;
  return window.google;
};

export const DARK_MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#0A0A0F' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0A0A0F' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: 'rgba(255,255,255,0.4)' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1A1A2E' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#22223A' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#060612' }] },
];

export const calculateDistance = (a: Coordinates, b: Coordinates): number => {
  if (typeof window === 'undefined' || !window.google) return 0;
  return google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(a.lat, a.lng), new google.maps.LatLng(b.lat, b.lng)) / 1000;
};

export const geocodeAddress = async (address: string): Promise<Coordinates | null> => {
  await loadGoogleMaps();
  const result = await new google.maps.Geocoder().geocode({ address });
  if (!result.results.length) return null;
  const loc = result.results[0].geometry.location;
  return { lat: loc.lat(), lng: loc.lng() };
};

export const getDirections = async (origin: Coordinates, destination: Coordinates): Promise<google.maps.DirectionsResult | null> => {
  await loadGoogleMaps();
  try {
    return await new google.maps.DirectionsService().route({ origin: new google.maps.LatLng(origin.lat, origin.lng), destination: new google.maps.LatLng(destination.lat, destination.lng), travelMode: google.maps.TravelMode.DRIVING });
  } catch { return null; }
};

export const formatDistance = (km: number): string => km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
export const formatDuration = (min: number): string => min < 60 ? `${Math.round(min)} min` : `${Math.floor(min/60)}h ${Math.round(min%60)}m`;
