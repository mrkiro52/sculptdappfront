import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const SettingsPolitics = () => {
    const router = useRouter();
    const navigation = useNavigation();

    const handleGoBack = () => navigation.goBack();

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.goback} onPress={handleGoBack}>
                <Image source={require('./assets/arrow.png')} style={styles.arrowImage} />
                <Text style={styles.gobackText}>Profile</Text>
            </TouchableOpacity>
            <Text style={styles.text}>Soon: App Politics</Text>
        </View>
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
    text: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 900,
        opacity: 0.5,
    },
});

export default SettingsPolitics;
