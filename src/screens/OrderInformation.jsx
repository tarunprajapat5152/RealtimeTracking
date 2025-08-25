import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { use } from 'react';
import BackArrowOutlinedSvg from '../assets/svg/BackArrowOutlineSvg';
import CustomButton from '../components/CustomButton';

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
            <View style={styles.details}>
              <Text style={styles.title}>Order Time: </Text>
              <Text>{orderTime}</Text>
            </View>

            <View style={styles.details}>
              <Text style={styles.title}>Estimate Time: </Text>
              <Text>{estimateTime}</Text>
            </View>

            <View style={styles.details}>
              <Text style={styles.title}>Distance: </Text>
              <Text>{showDistance} Km</Text>
            </View>
          </View>

          <View>
            <View style={styles.details}>
              <Text style={styles.title}>Current Time: </Text>
              <Text>{currentTime}</Text>
            </View>

            <View style={styles.details}>
              <Text style={styles.title}>Current Distance: </Text>
              <Text>{distance} Km</Text>
            </View>

            <View style={styles.details}>
              <Text style={styles.title}>Estimate Time: </Text>
              <Text>{duration} min</Text>
            </View>
          </View>
        </View>
        <View style={{marginTop: 10}}>
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
