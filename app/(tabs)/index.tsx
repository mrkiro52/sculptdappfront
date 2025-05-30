import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import {
    Animated,
    Easing,
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const Workouts = () => {
    const navigation = useNavigation();
    const router = useRouter();

    const animatedValue = new Animated.Value(0);
    
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 750,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 750,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }),
            ])
        ).start();
    }, []);

    const circle1Background = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['#FFBE1725', '#FFBE1740'],
    });
    
    const circle2Background = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['#FFBE1735', '#FFBE1755'],
    });

    const progress = 75;
    const size = 70;
    const strokeWidth = 4;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - progress / 100);

    return (
        <View style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.topBlock}>
                <Text style={styles.title}>Workout</Text>
                <TouchableOpacity onPress={() => router.push('/scanner')}>
                    <Image source={require('./assets/scanIcon.png')} style={styles.scanIcon} />
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.programBlock} onPress={() => router.push('/program')}>
                <ImageBackground
                    source={require('./assets/programBG.png')}
                    style={[styles.programBlock, { padding: 24 }]}
                    imageStyle={{ borderRadius: 16 }}
                >             
                    <Text style={styles.programBlockTitle}>Training program <Text style={styles.programBlockTitleSpan}>personalized</Text> for you <Text style={styles.programBlockTitleSpan}>with our AI</Text></Text>
                    <TouchableOpacity style={[styles.circle1, { backgroundColor: circle1Background }]} onPress={() => router.push('/online')}>
                        <Animated.View style={[styles.circle2, { backgroundColor: circle2Background }]}>
                            <View style={styles.circle3}>
                                <Text style={styles.circleText}>Go!</Text>
                            </View>
                        </Animated.View>
                    </TouchableOpacity>
                    <View style={styles.programBlockBottom}>
                        <View style={styles.programBlockBottomLeft}>
                            <Image source={require('./assets/calendar.png')} style={styles.calendarIcon} />
                            <Text style={styles.programBlockBottomLeftText}>7 days</Text>
                        </View>
                        <View style={styles.programBlockBottomMiddle}>
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
                            {/* Текст в центре */}
                            <Text style={styles.programBlockBottomMiddleText}>{`${progress}%`}</Text>
                        </View>
                        <View style={styles.programBlockBottomRight}>
                            <Image source={require('./assets/muscle1.png')} style={styles.muscleIcon} />
                            <Image source={require('./assets/muscle2.png')} style={styles.muscleIcon} />
                            <Image source={require('./assets/muscle3.png')} style={styles.muscleIcon} />
                        </View>
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#121212',
        display: 'flex',
        flexDirection: 'column',
        paddingHorizontal: 20,
        paddingTop: 75,
        paddingBottom: 90,
        flex: 1,
    },
    topBlock: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        color: '#FFFFFF',
        fontWeight: 700,
    },
    scanIcon: {
        width: 35,
        height: 35,
    },
    programBlock: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 15,
        borderRadius: 16,
        overflow: 'hidden',
    },
    programBlockTitle: {
        fontSize: 21,
        fontWeight: 700,
        color: '#ffffff',
    },
    programBlockTitleSpan: {
        color: '#FFBE17',
    },
    circle1: {
        backgroundColor: '#FFBE1725',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        width: 77,
        height: 77,
    },
    circle2: {
        backgroundColor: '#FFBE1735',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        width: 67,
        height: 67,
    },
    circle3: {
        backgroundColor: '#FFBE17',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        width: 57,
        height: 57,
    },
    circleText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#121212',
    },
    programBlockBottom: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    programBlockBottomLeft: {
        display: 'flex',
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
        width: '33%',
    },
    calendarIcon: {
        width: 21,
        height: 20,
    },
    programBlockBottomLeftText: {
        fontSize: 14,
        color: '#ffffff',
        fontWeight: 700,
    },
    programBlockBottomMiddle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        width: '33%',
    },
    programBlockBottomMiddleText: {
        position: 'absolute',
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 700,
    },
    programBlockBottomRight: {
        display: 'flex',
        flexDirection: 'row',
        gap: 15,
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '33%',
    },
    muscleIcon: {
        width: 20,
        height: 20,
    }
});

export default Workouts;
