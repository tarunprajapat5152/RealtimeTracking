import { View, Text } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapViewScreen from '../screens/MapViewScreen';
import OrderInformation from '../screens/OrderInformation';
import History from '../screens/History';
import CameraVision from '../screens/CameraVision';

const StackNavigation = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Camera" component={CameraVision} />
      <Stack.Screen name="MapView" component={MapViewScreen} />
      <Stack.Screen name="OrderInformation" component={OrderInformation} />
      <Stack.Screen name="History" component={History} />
    </Stack.Navigator>
  );
};

export default StackNavigation;
