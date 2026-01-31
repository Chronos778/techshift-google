/**
 * Google Maps Service - Integration Point
 * 
 * This file is a placeholder for Google Maps JavaScript API integration.
 * In production, this will handle:
 * - Interactive map display
 * - Custom marker placement
 * - Geocoding (address to coordinates)
 * - Reverse geocoding (coordinates to address)
 * - Geolocation (user's current position)
 * 
 * Required APIs:
 * - Google Maps JavaScript API
 * - Google Geocoding API
 * - Google Places API (optional, for address autocomplete)
 */

// Google Maps JavaScript API - Using new functional API (v2.0+)
// Documentation: https://github.com/googlemaps/js-api-loader
import { importLibrary, setOptions } from '@googlemaps/js-api-loader'

// Configure API key for all library imports
setOptions({
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  version: 'weekly'
})

/**
 * Initialize Google Map
 * @param {HTMLElement} element - DOM element to render map
 * @param {Object} options - Map configuration options
 * @returns {Promise<google.maps.Map>} - Google Maps instance
 */
export async function initializeMap(element, options = {}) {
  try {
    const { Map } = await importLibrary('maps')
    return new Map(element, {
      center: options.center || { lat: 40.7128, lng: -74.0060 },
      zoom: options.zoom || 13,
      styles: darkMapStyles,
      ...options
    })
  } catch (error) {
    console.error('[Google Maps] Failed to initialize map:', error)
    return null
  }
}

/**
 * Get user's current location
 * @returns {Promise<{lat: number, lng: number}>} - User's coordinates
 */
export async function getCurrentLocation() {
  const getPosition = (options) => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };

  if (!navigator.geolocation) {
    throw new Error('Geolocation is not supported by your browser');
  }

  try {
    // Try high accuracy first with a 5s timeout
    const position = await getPosition({ enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });
    return await processPosition(position);
  } catch (error) {
    console.warn('[Google Maps] High accuracy geolocation failed:', error.message);

    // Retry with low accuracy (approximate location)
    try {
      const position = await getPosition({ enableHighAccuracy: false, timeout: 10000, maximumAge: 0 });
      return await processPosition(position);
    } catch (retryError) {
      console.warn('[Google Maps] GPS failed, trying IP fallback:', retryError);

      // Final fallback: IP-based location
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) throw new Error('IP API failed');
        const data = await response.json();
        return {
          lat: data.latitude,
          lng: data.longitude,
          address: `${data.city}, ${data.region}`
        };
      } catch (ipError) {
        console.error('[Google Maps] All location methods failed:', ipError);
        throw retryError; // Throw original error if IP fails
      }
    }
  }
}

async function processPosition(position) {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;

  // Attempt to reverse geocode to get a readable address
  let address;
  try {
    address = await reverseGeocode(lat, lng);
  } catch (error) {
    console.warn('[Google Maps] Reverse geocoding failed, using coordinates:', error);
    address = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }

  return { lat, lng, address };
}

/**
 * Reverse geocode coordinates to address
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<string>} - Formatted address
 */
export async function reverseGeocode(lat, lng) {
  try {
    const { Geocoder } = await importLibrary('geocoding')
    const geocoder = new Geocoder()
    const response = await geocoder.geocode({ location: { lat, lng } })
    return response.results[0]?.formatted_address || 'Unknown location'
  } catch (error) {
    console.error('[Google Maps] Reverse geocoding failed:', error)
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
  }
}

/**
 * Add custom marker to map
 * @param {google.maps.Map} map - Map instance
 * @param {Object} position - Marker position
 * @param {Object} options - Marker options
 */
export async function addMarker(map, position, options = {}) {
  try {
    const { AdvancedMarkerElement } = await importLibrary('marker')
    return new AdvancedMarkerElement({
      map,
      position,
      ...options
    })
  } catch (error) {
    console.error('[Google Maps] Failed to add marker:', error)
    return null
  }
}

/**
 * Dark theme map styles for the app
 */
export const darkMapStyles = [
  { elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8a8a8a' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a2e' }] },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#2a2a3e' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0f3460' }],
  },
]

export default {
  initializeMap,
  getCurrentLocation,
  reverseGeocode,
  addMarker,
  darkMapStyles,
}
