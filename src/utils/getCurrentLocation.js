import Geolocation from '@react-native-community/geolocation';

export const getCurrentLocation = (resolve) => {
  const coordinates = Geolocation.watchPosition(
    pos => {
      console.log('currentLocation', pos.coords);
      resolve({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      })
    },
    error => {
      console.log(error)
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    },
  );

  return coordinates
};
