import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';

const SettingsGeneral = () => {
    const router = useRouter();
    const navigation = useNavigation();

    const [userData, setUserData] = useState({
        name: '',
        surname: '',
        username: '',
        gender: '',
        birthday: '',
    });

    const handleGoBack = () => navigation.goBack();

    const formatDateToDisplay = (isoDate) => {
        if (!isoDate) return '';
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const formatDateToIso = (displayDate) => {
        const [day, month, year] = displayDate.split('.');
        return `${year}-${month}-${day}T00:00:00Z`;
    };

    const fetchProfile = async () => {
        try {
            const token = await AsyncStorage.getItem('Authorization');
    
            const response = await fetch('http://89.104.65.131/user/get-profile', {
                method: 'GET',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.status === 401) {
                await AsyncStorage.clear();
                router.push('/auth/login');
                return; // Выходим из функции
            }
    
            const data = await response.json();
            console.log(data);
    
            // Приводим gender к нижнему регистру
            const gender = data.gender ? data.gender.toLowerCase() : '';
    
            setUserData({
                name: data.name,
                surname: data.surname,
                username: data.username,
                gender, // Сохраняем gender с нижним регистром
                birthday: formatDateToDisplay(data.birthday),
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            Alert.alert('Ошибка', 'Не удалось загрузить данные профиля');
        }
    };    
    

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleInputChange = (field, value) => {
        setUserData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            const payload = {
                ...userData,
                birthday: formatDateToIso(userData.birthday),
            };

            const response = await fetch('http://89.104.65.131/user/change-profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                Alert.alert('Success', 'Data saved');
                router.push('/profile');
            } else {
                const errorData = await response.json();
                Alert.alert('Ошибка', errorData.message || 'Не удалось изменить данные');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            Alert.alert('Ошибка', 'Произошла ошибка при сохранении');
        }
    };

    const renderGenderOption = (label, value, icon) => (
        <TouchableOpacity
            style={[
                styles.genderOption,
                userData.gender === value && styles.genderOptionSelected,
            ]}
            onPress={() => handleInputChange('gender', value)}
        >
            <Image source={icon} style={styles.sexImage} />
            <Text style={styles.genderText}>{label}</Text>
        </TouchableOpacity>
    );    

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <TouchableOpacity style={styles.goback} onPress={handleGoBack}>
                        <Image source={require('./assets/arrow.png')} style={styles.arrowImage} />
                        <Text style={styles.gobackText}>Profile</Text>
                    </TouchableOpacity>

                    <Text style={styles.labelText}>Name</Text>
                    <TextInput
                        style={styles.input}
                        value={userData.name}
                        onChangeText={(text) => handleInputChange('name', text)}
                    />

                    <Text style={styles.labelText}>Surname</Text>
                    <TextInput
                        style={styles.input}
                        value={userData.surname}
                        onChangeText={(text) => handleInputChange('surname', text)}
                    />

                    <Text style={styles.labelText}>Nickname</Text>
                    <TextInput
                        style={styles.input}
                        value={userData.username}
                        onChangeText={(text) => handleInputChange('username', text)}
                    />

                    <Text style={styles.labelText}>Gender</Text>
                    <View style={styles.genderContainer}>
                        {renderGenderOption('Male', 'male', require('./assets/sex1.png'))}
                        {renderGenderOption('Female', 'female', require('./assets/sex2.png'))}
                    </View>

                    <Text style={styles.labelText}>Date of birth</Text>
                    <TextInput
                        style={styles.input}
                        value={userData.birthday}
                        onChangeText={(text) => handleInputChange('birthday', text)}
                        placeholder="dd.mm.yyyy"
                    />

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#121212',
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 75,
    },
    goback: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        marginBottom: 20,
    },
    gobackText: {
        fontSize: 22,
        color: '#FFFFFF',
        fontWeight: '700',
    },
    labelText: {
        marginBottom: 4,
        marginLeft: 15,
        fontWeight: '400',
        fontSize: 12,
        color: 'rgba(144, 144, 144, 1)',
    },
    input: {
        width: '100%',
        height: 46,
        borderRadius: 16,
        padding: 15,
        backgroundColor: 'rgba(36, 36, 36, 0.5)',
        marginBottom: 12,
        color: '#FFFFFF',
    },
    genderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        marginBottom: 12,
    },
    genderOption: {
        width: '48%',
        height: 46,
        borderRadius: 16,
        padding: 15,
        backgroundColor: 'rgba(36, 36, 36, 0.5)',
        borderWidth: 1,
        borderColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15,
        opacity: 0.5,
    },
    genderOptionSelected: {
        borderColor: 'rgba(255, 190, 23, 1)',
        opacity: 1,
    },
    sexImage: {
        width: 14,
        height: 20,
    },
    genderText: {
        color: '#FFFFFF',
        fontWeight: '400',
        fontSize: 14,
    },
    saveButton: {
        marginTop: 20,
        backgroundColor: 'rgba(255, 190, 23, 1)',
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#121212',
        fontWeight: '700',
        fontSize: 16,
    },
});

export default SettingsGeneral;
