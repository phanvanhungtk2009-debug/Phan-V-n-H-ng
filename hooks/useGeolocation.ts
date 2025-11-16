import React from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
}

export const useGeolocation = () => {
  const [location, setLocation] = React.useState<GeolocationState>({
    latitude: null,
    longitude: null,
    loading: true,
    error: null,
  });

  React.useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({
        latitude: null,
        longitude: null,
        loading: false,
        error: 'Trình duyệt không hỗ trợ định vị.',
      });
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        loading: false,
        error: null,
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: `Lỗi định vị: ${error.message}`,
      }));
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);

  }, []);

  return location;
};
