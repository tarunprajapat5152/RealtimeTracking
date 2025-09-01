import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { use, useEffect } from 'react';
import BackArrowOutlinedSvg from '../assets/svg/BackArrowOutlineSvg';
import CustomButton from '../components/CustomButton';
import axios from 'axios';

const OrderInformation = ({ navigation, route }) => {
  console.log(route.params);
  const {
    image,
    orderId,
    orderTime,
    estimateTime,
    showDistance,
    currentTime,
    distance,
    duration,
    currentLocation,
    diffMin,
  } = route.params;

  const estimateTimeNum = new Date(route.params.estimateTimeNum);
  const userTime = new Date(route.params.userTime);

  // const onPress = () => {
  //   navigatio
  // }

  const getCurrentAddress = async (lat, log) => {
    console.log("call")
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${log}&key=AIzaSyDJ0vdzfj6Uwr2WECgEsbhn-rAGBoJpm_Q`;
    const res = await axios.get(url);
    console.log(res);
  };

  useEffect(() => {
    getCurrentAddress(currentLocation.latitude, currentLocation.longitude);
  }, []);

  const ListComponent = ({ title, value, unit }) => (
    <View style={styles.details}>
      <Text style={styles.title}>{title}: </Text>
      <Text>{`${value}${unit || ''}`}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headerStyle}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackArrowOutlinedSvg />
        </TouchableOpacity>
        <Text style={styles.text}>Order Information</Text>
      </View>

      <View>
        {estimateTimeNum >= userTime ? (
          <Text style={{ textAlign: 'center', marginTop: 15, color: 'green' }}>
            🎉 On Time! {diffMin > 0 && `(${diffMin} min early)`}
          </Text>
        ) : (
          <Text style={{ textAlign: 'center', marginTop: 15, color: 'red' }}>
            ⏰ Delayed! {diffMin > 0 && `(${diffMin} min late)`}
          </Text>
        )}
      </View>

      <View style={{ marginTop: 15, paddingHorizontal: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.img}>
            <Image
              style={{ height: '100%', width: '100%' }}
              source={{ uri: image }}
            />
          </View>
          <View style={styles.details}>
            <Text style={[styles.title, { marginLeft: 5 }]}>Order Id: </Text>
            <Text>{orderId}</Text>
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <View style={styles.details}>
            <Text style={styles.title}>Latitue: </Text>
            <Text>{currentLocation.latitude.toFixed(8)}</Text>
          </View>
          <View style={styles.details}>
            <Text style={styles.title}>Longitude: </Text>
            <Text>{currentLocation.longitude.toFixed(8)}</Text>
          </View>
        </View>

        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <View>
            <ListComponent title={'Order Time'} value={orderTime} />
            <ListComponent title={'Estimate Time'} value={estimateTime} />
            <ListComponent
              title={'Distance'}
              value={showDistance}
              unit={'Km'}
            />
          </View>

          <View>
            <ListComponent title={'Cureent Time'} value={currentTime} />
            <ListComponent
              title={'Current Distance'}
              value={distance}
              unit={'Km'}
            />
            <ListComponent
              title={'Estimate Time'}
              value={duration}
              unit={'min'}
            />
          </View>
        </View>
        <View style={{ marginTop: 10 }}>
          <CustomButton
            color="#000"
            onPress={() => navigation.navigate('History')}
            style="#268F8C"
            title="History"
          />
        </View>
      </View>
    </View>
  );
};

export default OrderInformation;

const styles = StyleSheet.create({
  headerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#ECECEC',
    elevation: 5,
  },
  text: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: '600',
  },
  img: {
    height: 40,
    width: 40,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 25,
    overflow: 'hidden',
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
});
