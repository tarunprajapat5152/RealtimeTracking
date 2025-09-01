import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import BackArrowOutlinedSvg from '../assets/svg/BackArrowOutlineSvg';
import {
  // Camera,
  useCameraDevice,
  useCameraPermission,
  useFrameProcessor,
} from 'react-native-vision-camera';
import CustomButton from '../components/CustomButton';
import {
  Camera,
  useFaceDetector,
} from 'react-native-vision-camera-face-detector';
import { Worklets } from 'react-native-worklets-core';

const CameraVision = () => {
  const [imagePath, setImagePath] = useState('');

  const camera = useRef(null);

  const device = useCameraDevice('front');
  const { hasPermission, requestPermission } = useCameraPermission();

  const { detectFaces } = useFaceDetector();

  useEffect(() => {
    const getCameraPermission = async () => {
      const permission = await requestPermission();
      console.log('permission', permission);
    };

    if (!hasPermission) getCameraPermission();
  }, []);

  const takePicture = async () => {
    if (!imagePath) {
      console.log('call');
      const photo = await camera.current.takePhoto();
      setImagePath(photo.path);
      console.log(photo.path);
    }
  };

  const handleDetectedFaces = Worklets.createRunOnJS(face => {
    console.log()
  })
  
  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    const faces = detectFaces(frame);
    handleDetectedFaces(faces)
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity>
          <BackArrowOutlinedSvg />
        </TouchableOpacity>
        <Text style={styles.text}>Camera</Text>
      </View>

      {hasPermission ? (
        <View style={{ flex: 1, paddingHorizontal: 20, marginTop: 70 }}>
          <View style={styles.cameraArea}>
            {device != null && hasPermission && !imagePath ? (
              <Camera
                ref={camera}
                style={{ height: '100%', width: '100%' }}
                device={device}
                isActive={true}
                photo={true}
                frameProcessor={frameProcessor}
              />
            ) : (
              <View>
                <Image
                  style={{ height: '100%', width: '100%' }}
                  source={{ uri: 'file://' + imagePath }}
                />
              </View>
            )}
          </View>
          <View style={{ marginTop: 25 }}>
            {device !== null && (
              <CustomButton
                color="#000"
                disabled={imagePath ? true : false}
                onPress={() => takePicture()}
                style={imagePath ? 'gray' : '#268F8C'}
                title="Take Photo"
              />
            )}
          </View>
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 40,
          }}
        >
          <Text style={{ fontSize: 16 }}>No Camera Permission</Text>
          <View style={{ marginTop: 10 }}>
            <CustomButton
              color="#000"
              onPress={() => requestPermission()}
              style="#268F8C"
              title="Grant Permission"
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default CameraVision;

const styles = StyleSheet.create({
  header: {
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
  cameraArea: {
    height: 200,
    width: 300,
    marginHorizontal: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
});
