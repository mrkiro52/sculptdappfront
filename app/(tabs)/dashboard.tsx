import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';

export default function TabTwoScreen() {

    const [selectedIndex, setSelectedIndex] = useState(2);

    const days = [
        { char: 'S', number: 18 },
        { char: 'M', number: 19 },
        { char: 'T', number: 20 },
        { char: 'W', number: 21 },
        { char: 'T', number: 22 },
        { char: 'F', number: 23 },
        { char: 'S', number: 24 },
    ];

    const trainingNames = [
        "Push",
        "Pull",
        "Legs",
        "Push",
        "Pull",
        "Legs",
        "Push"
    ]

    const progress = 50;
    const size = 70;
    const strokeWidth = 5;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - progress / 100);

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
        "workout_time": null
    });

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

          } catch (error) {
            console.error('Ошибка загрузки данных:', error);
          }
        };

        fetchUserData();
    }, []);

    return (
          <SafeAreaView style={styles.containerSafe}>
              <ScrollView
              style={styles.container}>
                <View style={styles.infoBlock}>
                    <View style={styles.infoBlockTop}>
                        <View style={styles.infoBlockTopLeft}>
                            <Text style={styles.infoBlockTopLeftTitle}>Hello, {userData.name}!</Text>
                            <Text style={styles.infoBlockTopLeftSubText}>@{userData.username}</Text>
                        </View>
                        <Image 
                            style={styles.infoBlockTopRight}
                            source={{uri: userData.image}}
                        />
                    </View>
                    <View style={styles.infoBlockDays}>
                        {days.map((day, index) => {
                            const isSelected = index === selectedIndex;
                            return (
                            <TouchableOpacity
                                key={index}
                                style={isSelected ? styles.infoBlockDayCurrent : styles.infoBlockDay}
                                onPress={() => setSelectedIndex(index)}
                            >
                                <Text style={styles.infoBlockDayChar}>{day.char}</Text>
                                <View style={isSelected ? styles.infoBlockDayNumberCurrent : styles.infoBlockDayNumber}>
                                <Text style={isSelected ? styles.infoBlockDayNumberTextCurrent : styles.infoBlockDayNumberText}>
                                    {day.number}
                                </Text>
                                </View>
                            </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
                <TouchableOpacity style={styles.currentProgram}>
                    <View style={styles.workoutDay}>
                        <Text style={styles.workoutDayText}>{selectedIndex + 1} day</Text>
                    </View>
                    <View style={styles.currentProgramTop}>
                        <Text style={styles.currentProgramTitle}>{trainingNames[selectedIndex]} training</Text>
                        <Text style={styles.currentProgramSubtext}>3 exercises</Text>
                    </View>
                    <View style={styles.currentProgramProgress}>
                        <View style={styles.currentProgramProgressBlock}>
                            <Text style={styles.currentProgramProgressBlockText}>+50 XP</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={styles.nutrition}>
                    <View style={styles.nutritionBlock}>
                        <Image  style={styles.nutritionBlockImage} source={require('./assets/cals.png')}></Image>
                        <Text style={styles.nutritionBlockText}>123 k</Text>
                    </View>
                    <View style={styles.nutritionBlock}>
                        <Image  style={styles.nutritionBlockImage} source={require('./assets/carbs.png')}></Image>
                        <Text style={styles.nutritionBlockText}>25 k</Text>
                    </View>
                    <View style={styles.nutritionBlock}>
                        <Image  style={styles.nutritionBlockImage} source={require('./assets/prots.png')}></Image>
                        <Text style={styles.nutritionBlockText}>52 k</Text>
                    </View>
                    <View style={styles.nutritionBlock}>
                        <Image  style={styles.nutritionBlockImage} source={require('./assets/fats.png')}></Image>
                        <Text style={styles.nutritionBlockText}>15 k</Text>
                    </View>
                </View>
                <View style={styles.achievements}>
                    <Text style={styles.achievementsTitle}>Achievements [Soon]</Text>
                    <View style={styles.achievementsBlock}>
                        <View style={styles.achievementsBlockLeft}>
                            <Svg width={size} height={size}>
                                {/* Фон кольца */}
                                <Circle
                                stroke="#FFFFFF33" // 20% прозрачности (hex: #33)
                                fill="none"
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                strokeWidth={strokeWidth}
                                />
                                {/* Прогресс кольцо */}
                                <Circle
                                stroke="#FFBE17"
                                fill="none"
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                strokeWidth={strokeWidth}
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round" // Закругленные концы
                                rotation="-90"
                                originX={size / 2}
                                originY={size / 2}
                                />
                            </Svg>
                            <Text style={styles.achievementsBlockLeftSubtext}>Your Rank</Text>
                        </View>
                        <View style={styles.achievementsBlockRight}>
                            <Text style={styles.achievementsBlockRightTitle}>Your points</Text>
                            <Text style={styles.achievementsBlockRightNumber}>XX <Text style={styles.achievementsBlockRightNumberOf}>/XXX</Text></Text>
                            <View style={styles.achievementsBlockRightProgressOut}>
                                <View style={styles.achievementsBlockRightProgressIn}>
                                
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
          </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    achievements: {
        marginHorizontal: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 15,
    },
    achievementsTitle: {
        fontWeight: 900,
        color: '#ffffff',
        fontSize: 24,
    },
    achievementsBlock: {
        height: 130,
        borderRadius: 16,
        backgroundColor: 'rgba(27, 27, 27, 0.3)',
        padding: 16,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    achievementsBlockLeft: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity: 0.5,
    },
    achievementsBlockLeftSubtext: {
        fontSize: 14,
        color: 'rgba(170, 170, 170, 1)',
        fontWeight: 700,
    },
    achievementsBlockRightTitle: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.61)',
        fontWeight: 400,
    },
    achievementsBlockRight: {
        width: 220,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        opacity: 0.5,
    },
    achievementsBlockRightNumber: {
        fontWeight: 900,
        color: '#ffffff',
        fontSize: 48,
    },
    achievementsBlockRightNumberOf: {
        fontSize: 32,
        color: 'rgba(170, 170, 170, 1)',
        fontWeight: 700,
    },
    achievementsBlockRightProgressOut: {
        height: 20,
        backgroundColor: 'rgba(36, 36, 36, 1)',
        borderRadius: 28,
    },
    achievementsBlockRightProgressIn: {
        height: 20,
        width: '50%',
        backgroundColor: 'rgba(255, 190, 23, 1)',
        borderRadius: 28,
    },
    containerSafe: {
        backgroundColor: 'rgba(36, 36, 36, 1)',
        flex: 1,
    },
    container: {
        backgroundColor: '#121212',
        display: 'flex',
        flexDirection: 'column',
    },
    infoBlock: {
        height: 200,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(36, 36, 36, 1)',
        borderBottomRightRadius: 30,
        borderBottomLeftRadius: 30,
        padding: 24,
        marginBottom: 24,
    },
    infoBlockTop: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    infoBlockTopLeft: {
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
    },
    infoBlockTopLeftTitle: {
        fontWeight: 900,
        fontSize: 24,
        color: '#ffffff',
    },
    infoBlockTopLeftSubText: {
        fontWeight: 400,
        fontSize: 12,
        color: 'rgba(144, 144, 144, 1)',
    },
    infoBlockTopRight: {
        width: 54,
        height: 54,
        borderRadius: 100,
        backgroundColor: 'green',
    },
    infoBlockDays: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    infoBlockDay: {
        backgroundColor: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 75,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 200,
        width: 40,
        paddingVertical: 5,
    },
    infoBlockDayCurrent: {
        backgroundColor: 'rgba(18, 18, 18, 1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 75,
        borderWidth: 1,
        borderColor: 'rgba(18, 18, 18, 1)',
        borderRadius: 200,
        width: 40,
        paddingVertical: 5,
    },
    infoBlockDayChar: {
        fontSize: 14,
        fontWeight: 700,
        color: '#ffffff',
    },
    infoBlockDayNumber: {
        width: 32,
        height: 32,
        backgroundColor: 'transparent',
        borderRadius: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoBlockDayNumberCurrent: {
        width: 32,
        height: 32,
        backgroundColor: 'rgba(255, 190, 23, 1)',
        borderRadius: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoBlockDayNumberText: {
        fontSize: 14,
        fontWeight: 700,
        color: '#ffffff',
    },
    infoBlockDayNumberTextCurrent: {
        fontSize: 14,
        fontWeight: 700,
        color: 'rgba(18, 18, 18, 1)'
    },
    currentProgram: {
        borderWidth: 1,
        borderColor: 'rgba(255, 190, 23, 1)',
        borderRadius: 16,
        height: 120,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 16,
        marginHorizontal: 16,
        backgroundColor: 'rgba(36, 36, 36, 0.5)',
        position: 'relative',
        marginBottom: 24,
    },
    currentProgramTop: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
    },
    currentProgramTitle: {
        fontWeight: 900,
        color: '#ffffff',
        fontSize: 18,
    },
    currentProgramSubtext: {
        fontWeight: 700,
        color: 'rgba(255, 255, 255, 0.75)',
        fontSize: 14,
    },
    currentProgramProgress: {
        height: 30,
        borderRadius: 28,
        backgroundColor: 'rgba(36, 36, 36, 1)',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    currentProgramProgressBlock: {
        backgroundColor: 'rgba(36, 36, 36, 1)',
        width: 65,
        height: 35,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: 'rgba(27, 27, 27, 1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    currentProgramProgressBlockText: {
        fontWeight: 900,
        color: 'rgba(72,72,72,1)',
        fontSize: 14,
    },
    workoutDay: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#00000070',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 55,
        height: 25,
        borderBottomLeftRadius: 16,
    },
    workoutDayText: {
        color: '#FFFFFF',
        fontSize: 10,
    },
    nutrition: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 16,
        marginBottom: 24,
    },
    nutritionBlock: {
        width: 80,
        height: 80,
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 9,
        backgroundColor: 'rgba(27, 27, 27, 1)',
    },
    nutritionBlockImage: {
        height: 25,
        resizeMode: 'contain',
    },
    nutritionBlockText: {
        fontSize: 18,
        fontWeight: 900,
        color: '#ffffff',
    },
});
