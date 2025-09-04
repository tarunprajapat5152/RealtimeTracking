import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';

const CustomButton = ({
  title = 'CustomButton',
  disabled,
  color = '#fff',
  style = 'transparent',
  padding = '',
  onPress,
}) => {
  return (
    <TouchableOpacity disabled={disabled} activeOpacity={0.5} onPress={onPress}>
      <Text
        style={[
          styles.btn,
          { color: '', backgroundColor: style, paddingHorizontal: padding },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  btn: {
    color: '#fff',
    backgroundColor: '#268F8C',
    fontWeight: '700',
    borderRadius: 10,
    padding: 8,
    textAlign: 'center',
  },
});
