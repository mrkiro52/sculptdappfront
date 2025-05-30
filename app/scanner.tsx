import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [hasTakenPhoto, setHasTakenPhoto] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer !== null && timer > 0) {
      console.log(`⏳ Countdown: ${timer} seconds remaining`);
      interval = setInterval(() => {
        setTimer((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
      console.log('📸 Timer reached 0, taking picture...');
      takePicture();
    }
    return () => clearInterval(interval);
  }, [timer]);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    console.log('🔄 Flip camera pressed');
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      console.log('📸 Taking picture now...');
      const photoData = await cameraRef.current.takePictureAsync();
      console.log('✅ Picture taken, URI:', photoData.uri);
      setPhoto(photoData.uri);
      setHasTakenPhoto(true);
    }
  };

  const goBack = () => {
    console.log('⬅️ Go back pressed');
    navigation.goBack();
  };

  const retakePicture = () => {
    console.log('🔁 Retake picture pressed');
    setPhoto(null);
    setHasTakenPhoto(false);
  };

  const startBodyAnalysis = () => {
    console.log('🚀 Starting body analysis');
    setStarted(true);
  };

  const startTimer = () => {
    console.log('⏲️ Timer started: 10 seconds');
    setTimer(10);
  };

  const uploadAndProcess = async () => {
    if (!photo) return;
    try {
      console.log('⬆️ Upload started');
      setIsLoading(true);
  
      const fileInfo = await FileSystem.getInfoAsync(photo);
      const fileUri = fileInfo.uri;
      const fileName = fileUri.split('/').pop();
      const fileType = 'image/jpeg';
  
      const formData = new FormData();
      formData.append('myFile', {
        uri: fileUri,
        name: fileName,
        type: fileType,
      });
  
      console.log('📤 Sending photo to upload server...');
      const uploadResponse = await fetch('http://89.111.169.51/upload/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      });
  
      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        console.log('❌ Upload failed:', error);
        Alert.alert('Upload Error', error.error || 'Unknown error');
        setIsLoading(false);
        return;
      }
  
      const uploadResult = await uploadResponse.json();
      const imageUrl = uploadResult.uploadedFiles[0].s3_path;
      console.log('✅ Upload success, image URL:', imageUrl);
  
      if (!imageUrl) {
        Alert.alert('Upload Error', 'No image URL returned');
        setIsLoading(false);
        return;
      }
  
      console.log('👤 Fetching user profile...');
      const token = await AsyncStorage.getItem('Authorization');
      if (!token) {
        Alert.alert('Auth Error', 'No authorization token found');
        setIsLoading(false);
        return;
      }
  
      const userResponse = await fetch('http://89.104.65.131/user/get-profile', {
        method: 'GET',
        headers: {
          'Authorization': token,
        },
      });
  
      if (!userResponse.ok) {
        const error = await userResponse.json();
        console.log('❌ User profile fetch failed:', error);
        Alert.alert('Profile Error', error.error || 'Unknown error');
        setIsLoading(false);
        return;
      }
  
      const userInfo = await userResponse.json();
      console.log('✅ User profile received:', userInfo);
  
      const finalPayload = { image_url: imageUrl, user_info: userInfo };
  
      console.log('🚀 Sending final request for analysis...');
      const finalResponse = await fetch('http://5.199.168.69:8888/generate_scanner_description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPayload),
      });
  
      if (!finalResponse.ok) {
        const error = await finalResponse.json();
        console.log('❌ Final request failed:', error);
        Alert.alert('Final Request Error', error.error || 'Unknown error');
        setIsLoading(false);
        return;
      }
  
      const finalResult = await finalResponse.json();
      console.log('🎉 Final analysis result:', finalResult);
      setIsLoading(false);

      console.log('📝 Sending scan result to server...');
      const saveResponse = await fetch('http://89.104.65.131/user/create-scan-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({
          results: finalResult,
        }),
      });

      if (!saveResponse.ok) {
        const error = await saveResponse.json();
        console.log('❌ Saving scan result failed:', error);
        Alert.alert('Save Error', error.error || 'Unknown error');
        return;
      }

      const saveResult = await saveResponse.json();
      console.log('✅ Scan result sent successfully:', saveResult);
  
      const encodedResult = encodeURIComponent(JSON.stringify(finalResult));
      router.push('/scannerResults?result');
    } catch (err) {
      console.error('🔥 Error during process:', err);
      Alert.alert('Error', err.message);
      setIsLoading(false);
    }
  };
  
  

  return (
    <View style={styles.container}>
      {!started ? (
        <View style={styles.startContainer}>
          <Text style={styles.startText}><Text style={styles.startTextSpan}>Start body analysis</Text> and create a training program with AI</Text>
          <Text style={styles.startSubText}>Click "Take picture", stand in the frame, flex your muscles, and in 10 seconds the scanner will take a photo.</Text>
          <TouchableOpacity onPress={startBodyAnalysis}>
            <Image source={require('./assets/scanButton.png')} style={styles.startButton}></Image>
          </TouchableOpacity>
        </View>
      ) : hasTakenPhoto ? (
        <View style={styles.photoContainer}>
          <Text style={styles.photoContainerTitle}>Photo taken!</Text>
          <Image source={{ uri: photo }} style={styles.photoContainerPhoto} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.photoContainerButtonRetake} onPress={retakePicture}>
              <Text style={styles.buttonContainerText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.photoContainerButtonDone} onPress={uploadAndProcess}>
              <Text style={styles.buttonContainerText}>Done</Text>
            </TouchableOpacity>
          </View>
          {isLoading && <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />}
        </View>
      ) : (
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <Image source={require('./assets/siluet.png')} style={styles.siluet}></Image>
          {timer !== null && timer > 0 && (
            <View style={styles.timerBlock}>
              <Text style={styles.timerBlockText}>{timer}</Text>
            </View>
          )}
          <View style={styles.buttonContainerSiluet}>
            <TouchableOpacity style={styles.buttonContainerSiluetBorder} onPress={goBack}>
              <Text style={styles.buttonContainerSiluetText}>Go Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonContainerSiluetOrange} onPress={startTimer}>
              <Text style={styles.buttonContainerSiluetText}>Take Picture</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonContainerSiluetBorder} onPress={toggleCameraFacing}>
              <Text style={styles.buttonContainerSiluetText}>Flip Camera</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainerSiluet: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  timerBlock: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 190, 23, 1)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 200,
    top: 100,
    left: '50%',
    transform: [
      { translateX: -25 }
    ]
  },  
  timerBlockText: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 900
  },
  buttonContainerSiluetOrange: {
    backgroundColor: 'rgba(255, 190, 23, 1)',
    borderColor: 'transparent',
    borderRadius: 12,
    borderWidth: 1,
    height: 36,
    paddingHorizontal: 12,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainerSiluetBorder: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(255, 190, 23, 1)',
    borderRadius: 12,
    borderWidth: 1,
    height: 36,
    paddingHorizontal: 12,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    gap: 24,
    width: '100%'
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#121212',
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    paddingBottom: 10,
    textAlign: 'center'
  },
  photo: {
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 20,
    width: '95%'
  },
  photoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    width: '100%',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  photoContainerButtonRetake: {
    width: 100,
    height: 36,
    backgroundColor: 'transparent',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 190, 23, 1)',
  },
  photoContainerButtonDone: {
    width: 100,
    height: 36,
    backgroundColor: 'rgba(255, 190, 23, 1)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 190, 23, 1)',
  },
  buttonContainerText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 700,
  },
  photoContainerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 900,
  },
  photoContainerPhoto: {
    width: 250,
    height: 440,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  siluet: {
    height: 406,
    opacity: 0.5,
    width: 224,
  },
  startButton: {
    height: 140,
    width: 170
  },
  startContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  startSubText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 20,
    textAlign: 'center'
  },
  startText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 20,
    textAlign: 'center'
  },
  startTextSpan: {
    color: 'rgba(255, 190, 23, 1)',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 20,
    textAlign: 'center'
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16
  },
  buttonContainerSiluetText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

