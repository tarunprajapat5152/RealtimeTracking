import { Alert, PermissionsAndroid, Platform } from 'react-native';

export const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log(granted);
        return true;
      } else {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to show your current location in map',
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
};
