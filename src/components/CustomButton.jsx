import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';

const CustomButton = ({
  title = 'CustomButton',
  disabled,
  color = '#fff',
  style = 'transparent',
  onPress,

}) => {
  return (
    <TouchableOpacity disabled={disabled} activeOpacity={0.5} onPress={onPress}>
      <Text style={[styles.btn, { color: '', backgroundColor: style }]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  btn: {
    color: '#fff',
    fontWeight: '700',
    borderRadius: 10,
    padding: 8,
    textAlign: 'center',
  },
});
