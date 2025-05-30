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

const settingsCharacteristics = () => {
    const router = useRouter();
    const navigation = useNavigation();

    const [userData, setUserData] = useState({
        height: '',
        height_type: '',
        weight: '',
        weight_type: '',
        fitness_level: '',
        nutrition_goal: '',
    });

    const handleGoBack = () => navigation.goBack();

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
                return;
            }

            const data = await response.json();

            setUserData({
                height: data.height?.toString() ?? '',
                height_type: data.height_type ?? '',
                weight: data.weight?.toString() ?? '',
                weight_type: data.weight_type ?? '',
                fitness_level: data.fitness_level ?? '',
                nutrition_goal: data.nutrition_goal ?? '',
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
                height: parseFloat(userData.height),
                height_type: userData.height_type,
                weight: parseFloat(userData.weight),
                weight_type: userData.weight_type,
                fitness_level: userData.fitness_level,
                nutrition_goal: userData.nutrition_goal,
            };

            const token = await AsyncStorage.getItem('Authorization');

            const response = await fetch('http://89.104.65.131/user/change-profile', {
                method: 'PATCH',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
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

    const renderFitnessOption = (label, value) => (
        <TouchableOpacity
            style={[
                styles.genderOption,
                userData.fitness_level === value && styles.genderOptionSelected,
            ]}
            onPress={() => handleInputChange('fitness_level', value)}
        >
            <Text style={styles.genderText}>{label}</Text>
        </TouchableOpacity>
    );

    const renderNutritionOption = (label, value) => (
        <TouchableOpacity
            style={[
                styles.genderOption,
                userData.nutrition_goal === value && styles.genderOptionSelected,
            ]}
            onPress={() => handleInputChange('nutrition_goal', value)}
        >
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
                    <Text style={styles.labelText}>Height</Text>
                    <TextInput
                        style={styles.input}
                        value={userData.height}
                        keyboardType="numeric"
                        onChangeText={(text) => handleInputChange('height', text)}
                    />
                    <Text style={styles.labelText}>Weight</Text>
                    <TextInput
                        style={styles.input}
                        value={userData.weight}
                        keyboardType="numeric"
                        onChangeText={(text) => handleInputChange('weight', text)}
                    />
                    <Text style={styles.labelText}>Fitness level</Text>
                    <View style={styles.genderContainer}>
                        {renderFitnessOption('Beginner', 'Beginner')}
                        {renderFitnessOption('Intermediate', 'Intermediate')}
                        {renderFitnessOption('Advanced', 'Advanced')}
                    </View>
                    <Text style={styles.labelText}>Nutrition goal</Text>
                    <View style={styles.genderContainer}>
                        {renderNutritionOption('Gain weight', 'Gain weight')}
                        {renderNutritionOption('Lose weight', 'Lose weight')}
                        {renderNutritionOption('Maintain weight', 'Maintain weight')}
                    </View>
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
        marginBottom: 12,
    },
    genderOption: {
        width: '31%',
        borderRadius: 16,
        height: 45,
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
    genderText: {
        color: '#FFFFFF',
        fontWeight: '400',
        fontSize: 12,
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

export default settingsCharacteristics;
