import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import BackArrowOutlinedSvg from '../assets/svg/BackArrowOutlineSvg';
import axios from 'axios';
import OrderHistory from '../components/OrderHistory';

const History = ({ navigation }) => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [orderInfo, setOrderInfo] = useState(null);
  const [orderId, setOrderId] = useState('');

  console.log(orderInfo);

  const getData = async () => {
    try {
      console.log('heyyyyyy');
      const res = await axios.get('http://192.168.137.1:3000/orderInfo');
      console.log('ress', res);
      setOrderDetails(res.data);
    } catch (error) {
      console.log('API ERROR', error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleHistory = async id => {
    if(orderId === id){
      setOrderId('');
      setOrderInfo(null);
      return;
    }

    try {
      const res = await axios.get(
        `http://192.168.137.1:3000/orderInfo/${id}`,
      );
      console.log(res);
      setOrderId(id);
      setOrderInfo(res.data);
    } catch (error) {
      console.log('API Error', error.message);
      console.log('API Status', error.response.status);
      console.log('API data', error.response.data);
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.headerStyle}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackArrowOutlinedSvg />
        </TouchableOpacity>
        <Text style={styles.text}>History</Text>
      </View>

      <View style={{ marginTop: 25, marginHorizontal: 15 }}>
        {orderDetails?.map((item, key) => (
          <View key={key}>
            <View style={styles.historyStyle}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.profile}>
                  <Image
                    style={{ height: '100%', width: '100%' }}
                    source={{ uri: item.profile }}
                  />
                </View>
                <Text style={{ marginLeft: 5 }}>{item.orderId}</Text>
              </View>
              <TouchableOpacity onPress={() => handleHistory(item.orderId)}>
                <Text style={{ color: 'green', fontSize: 14 }}>
                  See History
                </Text>
              </TouchableOpacity>
            </View>
            {orderId === item.orderId &&
              orderInfo?.map((item, key) => (
                <View key={key} style={styles.orderDetails}>
                  <OrderHistory title={'OrderTime'} value={item.orderTime} />
                  <OrderHistory title={'EstimateTime'} value={item.estimateTime} />
                  <OrderHistory title={'Distance'} value={item.distance} unit={'Km'} />
                  <OrderHistory title={'CurrentTime'} value={item.currentTime} />
                  <OrderHistory title={'CurrentDistance'} value={item.currentDistance} unit={'Km'} />
                  <OrderHistory title={'CurrentEstimateTime'} value={item.currentEstimateTime} unit={'min'} />
                  <OrderHistory title={'CurrentLocation'} value={`${item.currentLocation.lat}, ${item.currentLocation.lng}`} />
                  <OrderHistory title={'SourceLocation'} value={`${item.sourceLocation.lat}, ${item.sourceLocation.lng}`} />
                  <OrderHistory title={'InitialAddress:'} value={item.initialAddress} />
                  <OrderHistory title={'CurrentAddress:'} value={item.currentAddress} />
                </View>
              ))}
          </View>
        ))}
        {!orderDetails.length && (
          <View>
            <Text style={{ textAlign: 'center', marginTop: 50, fontSize: 16 }}>
              No History
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default History;

const styles = StyleSheet.create({
  headerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#ECECEC',
    elevation: 5,
  },
  text: {
    marginLeft: 15,
    fontSize: 18,
    fontWeight: '700',
  },
  profile: {
    height: 40,
    width: 40,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 25,
    overflow: 'hidden',
  },
  historyStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 5,
  },
  orderDetails: {
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 10
  },
});
