import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import BackArrowOutlinedSvg from '../assets/svg/BackArrowOutlineSvg';
import faceDetection from '../assets/img/facedetection.png';
import CustomButton from '../components/CustomButton';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useFrameProcessor,
} from 'react-native-vision-camera';
import { useFaceDetector } from 'react-native-vision-camera-face-detector';
import { Worklets } from 'react-native-worklets-core';

const CameraVision = ({ navigation }) => {
  const [imagePath, setImagePath] = useState('');
  const [imgPlaceholder, setImgPlaceholder] = useState(true);
  const [hasCaptured, setHasCaptured] = useState(false);
  const [isDetect, setIsDetect] = useState(false);
  const [faceTimer, setFaceTimer] = useState(0);

  const camera = useRef(null);
  const timerRef = useRef(null);
  const faceDetectionOptions = useRef({
    performanceMode: 'fast',
    landmarkMode: 'all',
    contourMode: 'all',
    classificationMode: 'all',
    minFaceSize: 10,
    tracking: true,
  }).current;

  const device = useCameraDevice('front');
  const { detectFaces } = useFaceDetector(faceDetectionOptions);
  const { hasPermission, requestPermission } = useCameraPermission();

  useEffect(() => {
    const requestPermissionCamera = async () => {
      if (!hasPermission)
        Alert.alert(
          'Camera Permission Required',
          'Please grant camera permission to use face detection.',
        );

      const res = await requestPermission();
      console.log(res);
    };

    requestPermissionCamera();
  }, []);

  const takePicture = async () => {
    const res = await camera.current.takePhoto();
    setImagePath(res.path);
    setHasCaptured(true);
    console.log(res);
  };

  const handleFaceDetected = detectedFace => {
    const faceData = detectedFace[0];
    if (!faceData) {
      setIsDetect(false);
      setFaceTimer(0);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const { height, width } = faceData.bounds;

    // const landmarks = [
    //   faceData?.landmarks?.LEFT_CHEEK,
    //   faceData?.landmarks?.LEFT_EAR,
    //   faceData?.landmarks?.LEFT_EYE,
    //   faceData?.landmarks?.MOUTH_BOTTOM,
    //   faceData.landmarks?.MOUTH_LEFT,
    //   faceData?.landmarks?.MOUTH_RIGHT,
    //   faceData?.landmarks?.NOSE_BASE,
    //   faceData?.landmarks?.RIGHT_CHEEK,
    //   faceData?.landmarks?.RIGHT_EAR,
    //   faceData?.landmarks?.RIGHT_EYE,
    // ];

    // const allVisible = landmarks.every(point => point !== undefined);

    const leftEye = faceData?.landmarks?.LEFT_EYE;
    const rightEye = faceData?.landmarks?.RIGHT_EYE;
    const nose = faceData?.landmarks?.NOSE_BASE;
    const mouthLeft = faceData?.landmarks?.MOUTH_LEFT;
    const mouthRight = faceData?.landmarks?.MOUTH_RIGHT;
    const mouthFullVisible = mouthRight.x > 200;

    const allVisible = leftEye && rightEye && nose && mouthLeft && mouthRight && mouthFullVisible;

    const isValid =
      height > 200 &&
      width > 200 &&
      allVisible &&
      Math.abs(faceData?.yawAngle) < 15 &&
      Math.abs(faceData?.pitchAngle) < 10 &&
      Math.abs(faceData?.rollAngle) < 10;

    setIsDetect(isValid);

    if (isValid && !hasCaptured) {
      if (!timerRef.current) {
        timerRef.current = setInterval(() => {
          setFaceTimer(prev => {
            if (prev === 2) {
              clearInterval(timerRef.current);
              timerRef.current = null;
              takePicture();
              return 0;
            } else {
              return prev + 1;
            }
          });
        }, 1000);
      }
    } else {
      if (!isValid) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        setFaceTimer(0);
      }
    }
  };

  const handleFaceDetectedJS = Worklets.createRunOnJS(handleFaceDetected);

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    try {
      const face = detectFaces(frame);
      console.log('face', face);
      handleFaceDetectedJS(face);
    } catch (error) {
      console.log('Frame processing error:', error?.message);
    }
  });

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackArrowOutlinedSvg />
        </TouchableOpacity>
        <Text style={styles.title}>CameraVision</Text>
      </View>

      <View style={{ flex: 1, alignItems: 'center', marginTop: 100 }}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.cameraBox,
            { borderColor: isDetect ? 'green' : 'red', borderWidth: 2 },
          ]}
          onPress={() => setImgPlaceholder(false)}
        >
          <View style={styles.faceBox}>
            {imgPlaceholder ? (
              <Image
                style={{ height: '100%', width: '100%' }}
                source={faceDetection}
              />
            ) : (
              !imagePath && (
                <Camera
                  ref={camera}
                  style={{ height: '100%', width: '100%' }}
                  device={device}
                  isActive={true}
                  frameProcessor={frameProcessor}
                  photo={true}
                />
              )
            )}

            {imagePath && (
              <Image
                style={{ height: '100%', width: '100%' }}
                source={{ uri: `file://${imagePath}` }}
              />
            )}
          </View>
        </TouchableOpacity>
        <View style={{ marginTop: 20 }}>
          <CustomButton
            color="#000"
            onPress={() => {
              setImagePath(''),
                setIsDetect(false),
                setHasCaptured(false),
                setFaceTimer(0);
            }}
            style="backgroundColor: '#268F8C'"
            padding="40"
            title="ReTake"
          />
        </View>
        <View style={{ marginTop: 10 }}>
          <CustomButton
            color="#000"
            onPress={() => console.log('hey')}
            style="backgroundColor: '#268F8C'"
            padding="50"
            title="Done"
          />
        </View>
      </View>
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
  title: {
    fontWeight: '700',
    fontSize: 18,
    marginLeft: 15,
  },
  cameraBox: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 270,
    width: 270,
    borderRadius: 150,
    borderColor: 'black',
    borderWidth: 1,
  },
  faceBox: {
    height: 260,
    width: 260,
    borderRadius: 150,
    borderColor: '#fff',
    borderWidth: 1,
    overflow: 'hidden',
  },
  box: {
    position: 'absolute',
    borderColor: 'green',
    borderWidth: 2,
  },
});
