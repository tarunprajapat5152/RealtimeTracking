import ImagePicker from 'react-native-image-crop-picker';

export const handleCameraPicker = (onImagePick) => {
  ImagePicker.openCamera({
    width: 300,
    height: 400,
    cropping: true,
    useFrontCamera: true
  }).then(image => {
    onImagePick(image.path)
  });
};
