import { View, Text, Modal, StyleSheet, Pressable, ToastAndroid } from 'react-native';
import React, { useEffect, useState } from 'react';
import { OtpInput } from 'react-native-otp-entry';
import CustomButton from './CustomButton';

const OtpModal = ({
  generateOtp,
  generatedOtp,
  setGenratedOtp,
  verifyOtp,
  setShowModal,
}) => {
  const [otp, setOtp] = useState('');
  const [otpValue, setOtpLength] = useState('');
  const [count, setCount] = useState(60);

  const flag = otpValue.length === 4;

  const onPress = () => {
    if (flag) {
      if (generatedOtp === otp) {
        verifyOtp(otp);
        setShowModal(false);
      } else{
        ToastAndroid.show('Invalid otp please try again', ToastAndroid.SHORT)
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (count === 0) {
        setGenratedOtp('');
        clearInterval(interval);
      } else {
        setCount(count - 1);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [count]);

  // handle

  return (
    <Modal transparent={true} animationType="fade">
      <Pressable style={styles.modalView} onPress={() => setShowModal(false)}>
        <Pressable style={styles.modal} onPress={() => {}}>
          <Text style={styles.title}>OTP Verification</Text>
          <OtpInput
            numberOfDigits={4}
            onTextChange={text => {
              setOtpLength(text);
            }}
            onFilled={text => {
              console.log(text);
              setOtp(text);
            }}
            theme={{
              pinCodeContainerStyle: {
                height: 50,
              },
              focusStickStyle: {
                height: 20, // cursor ka color
              },
              pinCodeTextStyle: {
                fontSize: 16,
                color: 'black',
              },
            }}
          />
          <View style={styles.resendBtn}>
            <Text
              style={{
                fontWeight: '700',
                color: count === 0 ? '#268F8C' : 'gray',
              }}
              onPress={() => {
                generateOtp();
                count === 0 && setCount(60);
              }}
            >
              Resend OTP
            </Text>
            {count !== 0 && (
              <Text style={{ marginLeft: 5, color: 'gray' }}>
                {count} seconds
              </Text>
            )}
          </View>
          <View style={{ marginVertical: 30 }}>
            <CustomButton
              title="Verify OTP"
              disabled={!flag}
              style={flag ? '#268F8C' : 'gray'}
              onPress={onPress}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default OtpModal;

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modal: {
    borderRadius: 20,
    marginHorizontal: 30,
    padding: 15,
    paddingHorizontal: 25,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 25,
  },
  resendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
});
