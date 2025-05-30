import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const Profile = () => {
    const navigation = useNavigation();
    const router = useRouter();
    const [userData, setUserData] = useState({
        "user_id": null,
        "email": "",
        "image": null,
        "name": "",
        "surname": "",
        "username": "",
        "gender": "",
        "birthday": "2000-01-01T00:00:00Z",
        "height": null,
        "height_type": "cm",
        "weight": null,
        "weight_type": "kg",
        "fitness_level": "",
        "improve_body_parts": [
        ],
        "exercise_limitations": [
        ],
        "nutrition_goal": "",
        "equipment_list": [
        ],
        "training_days": null,
        "workout_time": null,
        "description": ""
    });
    
    const [postsCount, setPostsCount] = useState("-");
    const [subsCount, setSubsCount] = useState("-");
    const [followersCount, setFollowersCount] = useState("-");

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const token = await AsyncStorage.getItem('Authorization');
            if (!token) {
              console.error('Ошибка: отсутствует токен авторизации');
              AsyncStorage.clear();
              router.push('/auth/login');
              return;
            }

            const profileRes = await fetch('http://89.104.65.131/user/get-profile', {
              method: 'GET',
              headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
              },
            });

            if (profileRes.status === 401) {
              console.error('Ошибка: неавторизованный доступ');
              AsyncStorage.clear();
              router.push('/auth/login');
              return;
            }

            const data = await profileRes.json();
            setUserData(data);

            const userId = data.user_id;

            // Запрашиваем посты
            const postsRes = await fetch(`http://89.104.65.131/chat/get-posts-number?userID=${userId}`);
            const postsData = await postsRes.json();
            setPostsCount(postsData["posts number"] ?? '-');

            // Подписки
            const subsRes = await fetch(`http://89.104.65.131/chat/get-subs-and-followers-number?user_id=${userId}`);
            const someData = await subsRes.json();
            setFollowersCount(someData["followers"] ?? '-');
            setSubsCount(someData["subscriptions"] ?? '-');

          } catch (error) {
            console.error('Ошибка загрузки данных:', error);
          }
        };

        fetchUserData();
    }, []);

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={styles.nickname}>Profile {userData?.username}</Text>
            <View style={styles.infoblock}>
                <View style={styles.infoblockTop}>
                    <Image 
                        style={styles.infoblockTopCircle}
                        source={{uri: userData.image}}
                    />
                    <View style={styles.infoblockTopInfo}>
                        <Text style={styles.infoblockTopInfoText}>{userData.name} {userData.surname}</Text>
                        <View style={styles.infoblockTopInfoNumbers}>
                            <View style={styles.infoblockTopInfoNumbersCol}>
                                <Text style={styles.infoblockTopInfoNumbersColNum}>{postsCount}</Text>
                                <Text style={styles.infoblockTopInfoNumbersColText}>Posts</Text>
                            </View>
                            <View style={styles.infoblockTopInfoNumbersCol}>
                                <Text style={styles.infoblockTopInfoNumbersColNum}>{followersCount}</Text>
                                <Text style={styles.infoblockTopInfoNumbersColText}>Followers</Text>
                            </View>
                            <View style={styles.infoblockTopInfoNumbersCol}>
                                <Text style={styles.infoblockTopInfoNumbersColNum}>{subsCount}</Text>
                                <Text style={styles.infoblockTopInfoNumbersColText}>Following</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.infoblockDesc}>
                    <Text style={styles.infoblockDescText}>{userData.description}</Text>
                    <View style={styles.infoblockDescEditBlock}>
                        <Text style={styles.infoblockDescEditBlockText}>Edit</Text>
                    </View>
                </View>
                <View style={styles.infoblockRows}>
                    <TouchableOpacity style={styles.infoblockRow} onPress={() => router.push('/settingsGeneral')}>
                        <Text style={styles.infoblockRowTitle}>Edit General</Text>
                        <Text style={styles.infoblockRowText}>Edit Main information of your profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.infoblockRow} onPress={() => router.push('/settingsSecurity')}>
                        <Text style={styles.infoblockRowTitle}>Security</Text>
                        <Text style={styles.infoblockRowText}>Password and account data</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.infoblockRow} onPress={() => router.push('/settingsCharacteristics')}>
                        <Text style={styles.infoblockRowTitle}>Characteristics</Text>
                        <Text style={styles.infoblockRowText}>Your physical characteristics</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.infoblockRow} onPress={() => router.push('/settingsPolitics')}>
                        <Text style={styles.infoblockRowTitle}>Politics</Text>
                        <Text style={styles.infoblockRowText}>Community stats</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#121212',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 75,
    },
    nickname: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: 700,
        marginBottom: 20,
    },
    infoblock: {
        display: 'flex',
        flexDirection: 'column',
    },
    infoblockTop: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 15,
        marginBottom: 15,
    },
    infoblockTopCircle: {
        width: 83,
        height: 83,
        backgroundColor: '#5B626A',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '100%',
        overflow: 'hidden',
    },
    infoblockTopInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        flex: 1,
    },
    infoblockTopInfoText: {
        fontSize: 14,
        fontWeight: 400,
        color: '#909090',
    },
    infoblockTopInfoNumbers: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
    },
    infoblockTopInfoNumbersCol: {
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
    },
    infoblockTopInfoNumbersColNum: {
        fontSize: 20,
        fontWeight: 700,
        color: '#FFFFFF',
    },
    infoblockTopInfoNumbersColText: {
        fontSize: 15,
        fontWeight: 400,
        color: '#FFFFFF75',
    },
    infoblockDesc: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        paddingBottom: 15,
        borderBottomColor: '#282828',
        borderBottomWidth: 2,
    },
    infoblockDescText: {
        fontSize: 16,
        fontWeight: 400,
        color: 'white',
    },
    infoblockDescEditBlock: {
        display: 'flex',
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center',
    },
    infoblockDescEditBlockText: {
        fontSize: 16,
        fontWeight: 400,
        color: '#1D9BF0',
    },
    infoblockRows: {
        display: 'flex',
        flexDirection: 'column',
    },
    infoblockRow: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        paddingVertical: 15,
        borderBottomColor: '#282828',
        borderBottomWidth: 2,
    },
    infoblockRowTitle: {
        fontSize: 16,
        fontWeight: 500,
        color: '#FFFFFF',
    },
    infoblockRowText: {
        fontSize: 14,
        fontWeight: 400,
        color: '#FFFFFF75',
    },
});

export default Profile;
