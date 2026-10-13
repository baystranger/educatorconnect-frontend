import { useCallback, useState } from 'react';

/** Browser "Near me" location. Never stored server-side; only sent with a search. */
export function useGeolocation() {
  const [state, setState] = useState({ loading: false, error: '' });

  const locate = useCallback(() => new Promise((resolve) => {
    if (!navigator.geolocation) {
      setState({ loading: false, error: 'Your browser can’t share its location. Enter a city or postal code instead.' });
      resolve(null);
      return;
    }
    setState({ loading: true, error: '' });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({ loading: false, error: '' });
        resolve({
          latitude: Number(position.coords.latitude.toFixed(5)),
          longitude: Number(position.coords.longitude.toFixed(5)),
        });
      },
      () => {
        setState({ loading: false, error: 'We couldn’t get your location. Enter a city or postal code instead.' });
        resolve(null);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }), []);

  return { ...state, locate };
}
