import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import BackArrowOutlinedSvg from '../assets/svg/BackArrowOutlineSvg'

const History = ({navigation}) => {
  return (
    <View style={{flex: 1}}>
      <View style={styles.headerStyle}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackArrowOutlinedSvg/>
        </TouchableOpacity>
        <Text style={styles.text}>History</Text>
      </View>
    </View>
  )
}

export default History

const styles = StyleSheet.create({
  headerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#ECECEC',
    elevation: 5
  },
  text: {
    marginLeft: 15,
    fontSize: 18,
    fontWeight: '700'
  }
})