import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Alert,
  StatusBar,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useFrameProcessor,
} from 'react-native-vision-camera';
import { useFaceDetector } from 'react-native-vision-camera-face-detector';
import { Worklets } from 'react-native-worklets-core';

const { width } = Dimensions.get('window');

export default function FaceDetectionApp() {
  const [hasPermission, setHasPermission] = useState(false);
  const [faces, setFaces] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const device = useCameraDevice('front');

  const faceDetectionOptions = useRef({
    performanceMode: 'fast',
    landmarkMode: 'all',
    contourMode: 'all',
    classificationMode: 'all',
    minFaceSize: 0.1,
    tracking: true,
  }).current;

  const { detectFaces, stopListeners } = useFaceDetector(faceDetectionOptions);

  useEffect(() => {
    const requestPermissions = async () => {
      const cameraStatus = await Camera.requestCameraPermission();
      if (cameraStatus === 'authorized' || cameraStatus === 'granted') {
        setHasPermission(true);
      } else {
        Alert.alert(
          'Camera Permission Required',
          'Please grant camera permission to use face detection.',
        );
      }
    };

    requestPermissions();
    return () => stopListeners();
  }, [stopListeners]);

  const handleFacesDetected = detectedFaces => {
    setFaces(detectedFaces);
  };

  const handleFacesDetectedJS = Worklets.createRunOnJS(handleFacesDetected);

  const frameProcessorr = useFrameProcessor(
    frame => {
      'worklet';
      console.log("hey")
      try {
        const detectedFaces = detectFaces(frame);
        console.log(detectFaces);
        handleFacesDetectedJS(detectedFaces);
      } catch (error) {
        console.log('Frame processing error:', error?.message);
      }
    },
    [detectFaces],
  );

  const renderFaceOverlays = () => {
    if (!faces || faces.length === 0) return null;

    return faces.map((face, index) => {
      if (!face || !face.bounds) return null;

      const { bounds } = face;
      const faceStyle = {
        position: 'absolute',
        left: bounds.x * 0.8,
        top: bounds.y * 0.8,
        width: bounds.width * 0.8,
        height: bounds.height * 0.8,
        borderWidth: 2,
        borderColor: '#00FF00',
        borderRadius: 10,
        backgroundColor: 'transparent',
      };

      return (
        <View key={`face-${index}`} style={faceStyle}>
          <View style={styles.faceLabel}>
            <Text style={styles.faceLabelText}>Face {index + 1}</Text>
            {face.smilingProbability > 0.5 && (
              <Text style={styles.faceLabelText}>😊</Text>
            )}
          </View>
        </View>
      );
    });
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          Camera permission is required for face detection
        </Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Front camera not available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Text style={styles.title}>Face Detection</Text>

      <View style={styles.cameraContainer}>
        <Camera
          style={styles.camera}
          device={device}
          isActive={isActive && hasPermission}
          frameProcessor={frameProcessorr}
          photo={true}
        />
        {renderFaceOverlays()}
        <View style={styles.faceGuide} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Faces Detected: {faces.length}</Text>
        {faces.length > 0 && (
          <View style={styles.faceInfo}>
            {faces.map((face, index) => (
              <View key={index} style={styles.faceDetails}>
                <Text style={styles.faceDetailText}>Face {index + 1}:</Text>
                <Text style={styles.faceDetailText}>
                  Smile: {(face.smilingProbability * 100).toFixed(0)}%
                </Text>
                <Text style={styles.faceDetailText}>
                  Left Eye:{' '}
                  {face.leftEyeOpenProbability > 0.5 ? 'Open' : 'Closed'}
                </Text>
                <Text style={styles.faceDetailText}>
                  Right Eye:{' '}
                  {face.rightEyeOpenProbability > 0.5 ? 'Open' : 'Closed'}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  cameraContainer: {
    position: 'relative',
    width: width * 0.8,
    height: width * 0.8,
    marginBottom: 30,
  },
  camera: {
    width: '100%',
    height: '100%',
    borderRadius: width * 0.4,
    overflow: 'hidden',
  },
  faceGuide: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: width * 0.4,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderStyle: 'dashed',
  },
  faceLabel: {
    position: 'absolute',
    top: -25,
    left: 0,
    backgroundColor: 'rgba(0, 255, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  faceLabelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 4,
  },
  infoContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  infoText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  faceInfo: {
    width: '100%',
  },
  faceDetails: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    marginBottom: 8,
    borderRadius: 8,
  },
  faceDetailText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 2,
  },
  permissionText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
