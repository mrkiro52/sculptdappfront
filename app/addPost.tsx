import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';

const AddPost = () => {
    const router = useRouter();
    const navigation = useNavigation();

    const [text, setText] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const [feedTopic, setFeedTopic] = useState("All");

    const feedTopics = [
        "All",
        "Workouts",
        "Nutrition",
        "Motivation",
        "Progress",
        "Cardio",
        "Recovery",
        "Challenges",
    ];

    const pickImage = async () => {
        console.log('[STEP 1] Запрос доступа к галерее');
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        console.log('[STEP 2] Результат выбора изображения:', result);

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            console.log('[STEP 3] Изображение выбрано:', result.assets[0].uri);
        } else {
            console.log('[INFO 4] Пользователь отменил выбор изображения');
        }
    };

    const uploadImage = async (uri: string) => {
        console.log('[STEP 5] Загружаем изображение:', uri);

        const randomLetters = Array.from({ length: 20 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
        const randomNumbers = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)).join('');
        const randomFileName = `${randomLetters}${randomNumbers}.jpg`;

        console.log('[INFO] Сгенерировано случайное имя файла:', randomFileName);

        try {
            const fileInfo = await FileSystem.getInfoAsync(uri);
            console.log('[STEP 6] Информация о файле:', fileInfo);

            const formData = new FormData();
            formData.append('myFile', {
                uri,
                name: randomFileName,
                type: 'image/jpeg'
            } as any);

            console.log('[STEP 7] Отправляем запрос на загрузку');
            formData.forEach((value, key) => {
                console.log(`${key}:`, value);
            });

            const response = await fetch('http://89.111.169.51/upload/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            });

            if (!response.ok) {
                console.error('[ERROR] Ошибка ответа сервера:', response.status);
                throw { message: `Ошибка загрузки: ${response.status}`, status: response.status };
            }

            const data = await response.json();
            console.log('[STEP 8] Получен ответ от сервера:', data);
            return data.uploadedFiles[0].s3_path;
        } catch (error: any) {
            console.error('[ERROR 1] Ошибка при загрузке изображения:', error.message || error);
            if (error.status) {
                console.error('Статус ошибки:', error.status);
            }
            throw new Error('Не удалось загрузить изображение');
        }
    };

    const handleSubmit = async () => {
        try {
            console.log('[STEP 9] Отправка данных поста...');

            setUploading(true);

            let imageUrl = '';
            if (imageUri) {
                console.log('[STEP 10] Загружаем изображение перед созданием поста');
                imageUrl = await uploadImage(imageUri);
                console.log('[STEP 11] Получена ссылка на изображение:', imageUrl);
            }

            const postBody = {
                text: text,
                content: [imageUrl],
                topics: feedTopic,
            };

            console.log('[STEP 12] Отправляем запрос на создание поста:', postBody);

            const postResponse = await fetch('http://89.104.65.131/chat/make-post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postBody)
            });

            if (postResponse.status === 401) {
                console.warn('[WARNING] Получен 401 Unauthorized. Выполняем обработку...');
                const token = await AsyncStorage.getItem('Authorization');
                console.log('[DEBUG] Текущий токен:', token);

                await AsyncStorage.clear();
                console.log('[DEBUG] AsyncStorage очищен');

                router.push('/auth/login');
                console.log('[INFO] Перенаправлено на страницу логина');

                return;
            }

            if (!postResponse.ok) {
                throw new Error(`Ошибка создания поста: ${postResponse.status}`);
            }

            const postData = await postResponse.json();
            console.log('[STEP 13] Ответ от сервера с данными поста:', postData);

            Alert.alert('Успех', 'Пост успешно создан!');
            setText('');
            setImageUri(null);
        } catch (error: any) {
            console.error('[ERROR 2] Ошибка при создании поста:', error);
            Alert.alert('Ошибка', error.message);
        } finally {
            setUploading(false);
            console.log('[STEP 14] Процесс завершён');
            router.push('/community');
        }
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.topBlock}>
                    <TouchableOpacity style={styles.goback} onPress={handleGoBack}>
                        <Image source={require('./assets/arrow.png')} />
                        <Text style={styles.gobackText}>Community</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.publishBlock} onPress={handleSubmit}>
                        <Text style={styles.publishText}>Publish</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.categoriesRow}>
                    {feedTopics.map((topic, index) => (
                        <TouchableOpacity
                            key={index}
                            style={feedTopic === topic ? styles.topicblockSelected : styles.topicblock}
                            onPress={() => setFeedTopic(topic)}
                        >
                            <Text style={styles.topicText}>{topic}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <TextInput
                    style={styles.input}
                    value={text}
                    onChangeText={setText}
                    placeholder="What’s up?"
                    multiline
                />
                {imageUri && (
                    <Image
                        source={{ uri: imageUri }}
                        style={styles.image}
                    />
                )}
                <TouchableOpacity style={styles.buttonAddPhoto} onPress={pickImage}>
                    <Text style={styles.buttonAddPhotoText}>Add a photo</Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#121212',
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 75,
    },
    topBlock: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    goback: {
        display: 'flex',
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center',
    },
    gobackText: {
        fontSize: 22,
        color: '#FFFFFF',
        fontWeight: '700',
    },
    publishBlock: {
        width: 118,
        height: 30,
        backgroundColor: 'rgba(255, 190, 23, 1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    publishText: {
        fontSize: 16,
        fontWeight: '700',
        color: 'rgb(18,18,18)',
    },
    input: {
        fontSize: 19,
        paddingVertical: 12,
        borderRadius: 8,
        marginBottom: 12,
        textAlignVertical: 'top',
        color: 'rgb(255, 255, 255)',
    },
    image: {
        width: '100%',
        aspectRatio: 1,
        marginBottom: 12,
        borderRadius: 8,
    },
    categoriesRow: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    topicblock: {
        width: 80,
        height: 40,
        backgroundColor: '#242424',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        marginBottom: 10,
    },
    topicblockSelected: {
        width: 80,
        height: 40,
        backgroundColor: '#242424',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FFBE17',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        marginBottom: 10,
    },
    topicText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '400',
    },
    buttonAddPhoto: {
        borderWidth: 1,
        borderColor: 'rgba(255, 190, 23, 1)',
        borderRadius: 16,
        height: 50,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonAddPhotoText: {
        fontSize: 16,
        color: '#ffffff',
        fontWeight: 700,
    },
});

export default AddPost;
