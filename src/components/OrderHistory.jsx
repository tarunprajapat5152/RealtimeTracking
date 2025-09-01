import { View, Text } from 'react-native'
import React from 'react'

const OrderHistory = ({title, value, unit}) => {
  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2}}>
      <Text>{title}</Text>
      <Text>{`${value}${unit || ''}`}</Text>
    </View>
  )
}

export default OrderHistory