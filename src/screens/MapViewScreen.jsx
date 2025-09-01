import {
  View,
  StyleSheet,
  Button,
  Alert,
  Text,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { requestLocationPermission } from '../utils/requestLocationPermission';
import { getCurrentLocation } from '../utils/getCurrentLocation';
import io from 'socket.io-client';
import MapViewDirections from 'react-native-maps-directions';
import CustomButton from '../components/CustomButton';
import { handleCameraPicker } from '../utils/imagePicker';
import OtpModal from '../components/OtpModal';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';

// const socket = io('http://13.202.12.138:3000', {
//   transports: ['websocket'],
// });

const MapViewScreen = ({ navigation }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [isDestination, setIsDestination] = useState(false);
  const [image, setImage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [generatedOtp, setGenratedOtp] = useState('');

  const [orderDetails, setOrderDetails] = useState({
    orderId: '',
    orderTime: '',
    estimateTime: '',
    distance: '',
    duration: '',
    showDistance: '',
    currentTime: '',
  });

  const mapRef = useRef();
  const socketRef = useRef();

  // Generate Current Time
  const getFormattedTime = () =>
    new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

  // Handle Coordinates On Clik Map
  const handleCoordinates = e => {
    if (isDestination) {
      setDestination(e.nativeEvent.coordinate);
      setOrderDetails(prev => ({
        ...prev,
        orderTime: getFormattedTime(),
        estimateTime: '',
      }));
      setIsDestination(false);
    }
  };

  // Get Permission & Current Location
  const handleCurrentLocation = async () => {
    const granted = await requestLocationPermission();
    if (!granted) return;

    try {
      getCurrentLocation(newCoordinates => {
        setCurrentLocation(newCoordinates);
        console.log(newCoordinates);
        socketRef.current.emit('send-location', newCoordinates);
      });
    } catch (error) {
      Alert.alert('Error', 'Please turn on location service');
    }
  };

  // Generate OrderId
  const generatedOrderId = () => {
    let orderId = 'ORD';
    const id = Math.floor(1000000 + Math.random() * 9000000).toString();
    orderId += id;
    setOrderDetails(prev => ({
      ...prev,
      orderId: orderId,
    }));
  };

  // Current Time Interval
  useEffect(() => {
    const interval = setInterval(() => {
      setOrderDetails(prev => ({ ...prev, currentTime: getFormattedTime() }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Socket Setup
  useEffect(() => {
    // Scoket Connection
    socketRef.current = io('http://13.202.12.138:3000', {
      transports: ['websocket'],
    });

    socketRef.current.on('connect', () => {
      console.log('connected');
    });

    socketRef.current.on('receive-location', data => {
      console.log('rec', data);
      // setOrderDetails(prev => ({ ...prev, orderId: data.id }));
    });

    generatedOrderId();

    handleCurrentLocation();

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const generateOtp = () => {
    if (!orderDetails.estimateTime) {
      Alert.alert('Error', 'Estimate time not calculated yet');
      return;
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGenratedOtp(otp);
    ToastAndroid.show(`Your OTP is ${otp}`, ToastAndroid.LONG);
    setShowModal(true);
  };

  const verifyOtp = enteredOtp => {
    console.log(enteredOtp, generatedOtp);
    if (enteredOtp === generatedOtp) {
      handleDelyedCondition();
    }
  };

  // Store data in MongoDB
  const orderInfo = async imagePath => {
    console.log('orderInfo');
    try {
      const res = await axios.post('http://192.168.137.1:3000/orderDetails', {
        orderId: orderDetails.orderId,
        profile: imagePath,
        currentLocation: '27.262072',
        orderTime: orderDetails.orderTime,
        estimateTime: orderDetails.estimateTime,
        distance: orderDetails.showDistance,
        currentTime: orderDetails.currentTime,
        currentDistance: orderDetails.distance,
        currentEstimateTime: orderDetails.duration,
      });
      console.log('res', res);
    } catch (error) {
      console.log('API Error', error.message);
      console.log('API Status', error.response.status);
      console.log('API data', error.response.data);
    }
  };

  // Handle Delyed Condition
  const handleDelyedCondition = () => {
    // Camera Picker
    handleCameraPicker(imagePath => {
      setImage(imagePath);

      // Convert estimateTime (string) to Date object
      const userTime = new Date();
      const [estimateHour, estimateMinute] = orderDetails.estimateTime
        .replace(/[^0-9:]/g, '')
        .split(':');

      const isPm = orderDetails.estimateTime.toLowerCase().includes('pm');
      let hour = parseInt(estimateHour, 10);
      let min = parseInt(estimateMinute, 10);

      if (isPm && hour !== 12) hour += 12;
      if (!isPm && hour === 12) hour = 0;

      const estimateTimeNum = new Date();
      estimateTimeNum.setHours(hour);
      estimateTimeNum.setMinutes(min);
      estimateTimeNum.setSeconds(0);

      const diffMs = userTime - estimateTimeNum;
      const diffMin = Math.abs(Math.floor(diffMs / 60000));

      orderInfo(imagePath);

      navigation.navigate('OrderInformation', {
        ...orderDetails,
        image: imagePath,
        currentLocation,
        estimateTimeNum: estimateTimeNum.toISOString(),
        userTime: userTime.toISOString(),
        diffMin,
      });
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.text}>Home</Text>
        <TouchableOpacity onPress={() => navigation.navigate('History')}>
          <Icon name="history" size={24} />
        </TouchableOpacity>
      </View>

      {currentLocation && destination && (
        <View style={styles.info}>
          <View>
            <Text>Order: {orderDetails.orderTime}</Text>
            <Text>Estimate: {orderDetails.estimateTime}</Text>
            <Text>Distance: {orderDetails.showDistance} Km</Text>
          </View>
          <View>
            <Text>Current Time: {orderDetails.currentTime}</Text>
            <Text>Distance: {orderDetails.distance} Km</Text>
            <Text>Estimate Time: {orderDetails.duration} min</Text>
          </View>
        </View>
      )}

      {/* Show MapView */}
      <MapView
        ref={mapRef}
        style={styles.map}
        region={currentLocation}
        onPress={handleCoordinates}
        showsUserLocation
      >
        {/* Markers */}
        {currentLocation && (
          <Marker coordinate={currentLocation} title={'marker'} />
        )}
        {destination && <Marker coordinate={destination} title={'marker'} />}

        {/* Draw Stroke On Map */}
        {currentLocation && destination && (
          <MapViewDirections
            apikey="AIzaSyDJ0vdzfj6Uwr2WECgEsbhn-rAGBoJpm_Q"
            origin={currentLocation}
            destination={destination}
            strokeColor="hotpink"
            optimizeWaypoints={true}
            onReady={result => {
              const distance = result.distance.toFixed(0);
              const duration = result.duration.toFixed(0);

              setOrderDetails(prev => {
                if (!prev.estimateTime) {
                  const newEstimate = new Date();
                  newEstimate.setMinutes(
                    newEstimate.getMinutes() + Number(duration),
                  );

                  return {
                    ...prev,
                    distance,
                    duration,
                    showDistance: distance,
                    estimateTime: newEstimate.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    }),
                  };
                }
                return { ...prev, distance, duration };
              });

              //Center Map
              mapRef.current.fitToCoordinates(result.coordinates, {
                edgePadding: {
                  right: 50,
                  bottom: 50,
                  left: 50,
                  top: 50,
                },
              });
            }}
          />
        )}
      </MapView>

      {/* <CustomButton/> */}

      {destination ? (
        <Button
          title="Change Destination"
          onPress={() => setIsDestination(true)}
        />
      ) : (
        <Button
          title="Choose Destination"
          onPress={() => setIsDestination(true)}
        />
      )}
      <Button title="Reached" onPress={generateOtp} />
      {showModal && (
        <OtpModal
          generateOtp={generateOtp}
          generatedOtp={generatedOtp}
          setGenratedOtp={setGenratedOtp}
          verifyOtp={verifyOtp}
          setShowModal={setShowModal}
        />
      )}
    </View>
  );
};

export default MapViewScreen;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#ECECEC',
    elevation: 5,
  },
  text: {
    fontSize: 18,
    padding: 10,
    fontWeight: '600',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    paddingVertical: 10,
  },
});
