import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import {
    Animated,
    Easing,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const Exercise = (props) => {
    const navigation = useNavigation();
    const progress = 80;
    const size = 50;
    const strokeWidth = 3;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - progress / 100);
    return (
        <TouchableOpacity style={workoutCSS.card} onPress={() => navigation.navigate('Workout')}>
            <View style={workoutCSS.card_top}>
                <View style={workoutCSS.card_top_left}>
                    <Text style={workoutCSS.cardTitle}>Biceps</Text>
                    <Image source={require('./assets/machine.png')}  style={workoutCSS.machine_icon}></Image>
                </View>
                <View style={workoutCSS.card_top_right}>
                    <View style={workoutCSS.row}>
                        <Image style={workoutCSS.lil_icon} source={require('./assets/sets.png')}></Image>
                        <Text style={workoutCSS.lil_icon_text}>5x25 set</Text>
                    </View>
                    <View style={workoutCSS.row}>
                        <Image style={workoutCSS.lil_icon} source={require('./assets/rest.png')}></Image>
                        <Text style={workoutCSS.lil_icon_text}>2 min - break</Text>
                    </View>
                </View>
            </View>
            <View style={workoutCSS.card_bottom}>
                <View style={workoutCSS.circle_block}>
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
                    <Image source={require('./assets/muscleCircle.png')} style={workoutCSS.muscleCircle}></Image>
                    <Text style={workoutCSS.lil_icon_text}>{`${progress}%`}</Text>
                </View>
                <View style={workoutCSS.circle_block}>
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
                    <Image source={require('./assets/muscleCircle.png')} style={workoutCSS.muscleCircle}></Image>
                    <Text style={workoutCSS.lil_icon_text}>{`${progress}%`}</Text>
                </View>
                <View style={workoutCSS.circle_block}>
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
                    <Image source={require('./assets/muscleCircle.png')} style={workoutCSS.muscleCircle}></Image>
                    <Text style={workoutCSS.lil_icon_text}>{`${progress}%`}</Text>
                </View>
            </View>
            <View style={workoutCSS.workoutDay}>
                <Text style={workoutCSS.workoutDayText}>1 stage</Text>
            </View>
        </TouchableOpacity>
    )
}

const workoutCSS = StyleSheet.create({
    card: {
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 16,
        backgroundColor: 'rgba(36, 36, 36, 0.5)',
        marginBottom: 15,
        padding: 24,
        gap: 24,
    },
    card_top: {
        display: 'flex',
        flexDirection: 'row',
    },
    card_top_left: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: 130,
        gap: 12,
    },
    machine_icon: {
        width: 49,
        height: 21,
    },
    card_top_right: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center',
    },
    lil_icon: {
        width: 20,
        height: 20,
    },
    lil_icon_text: {
        fontSize: 14,
        fontWeight: 700,
        color: '#ffffff',
        opacity: 0.75,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 700,
        color: '#FFFFFF',
    },
    card_bottom: {
        display: 'flex',
        flexDirection: 'row',
        gap: 30,
        alignItems: 'center',
    },
    circle_block: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
    },
    muscleCircle: {
        width: 28,
        height: 28,
        position: 'absolute',
        top: 11,
    },
    workoutDay: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#00000070',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 25,
        borderBottomLeftRadius: 16,
    },
    workoutDayText: {
        color: '#FFFFFF',
        fontSize: 10,
    }
})

const TrainingPage = (props) => {
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

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <TouchableOpacity style={styles.goback} onPress={() => navigation.goBack()}>
                    <Image source={require('./assets/arrow.png')} style={styles.arrowImage} />
                    <Text style={styles.gobackText}>Program</Text>
                </TouchableOpacity>
                <View style={styles.infoBlock}>
                    <View style={styles.bottomBlock}>
                        <View style={styles.titleBlock}>
                            <Text style={styles.titleBlockText}>Chest training</Text>
                            <View style={styles.cardDateBlock}>
                                <Image source={require('./assets/timer.png')} style={styles.cardDateBlockIcon} />
                                <Text style={styles.cardDateBlockText}>70 minutes</Text>
                            </View>
                        </View>
                        <TouchableOpacity>
                            <Text style={styles.programDescriptionText}>
                            Big man in a suit of armour. Take that off, what are you? Genius, billionaire, playboy, philanthropist. Genius, billionaire, playboy, philanthropist...
                                <Text style={styles.programDescriptionTextMore}> more</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            <TouchableOpacity style={styles.startButtonOutside} onPress={() => router.push('/online')}>
                    <View style={styles.startButtonMiddle}>
                        <View style={styles.startButtonOutsideInside}>
                            <Text style={styles.startButtonText}>Start training</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <Text style={styles.titleTrainings}>Exercises</Text>
                <Exercise />
                <Exercise />
                <Exercise />
                <Exercise />
                <Exercise />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 75,
        paddingBottom: 100,
    },
    goback: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 15,
    },
    gobackText: {
        fontSize: 22,
        color: '#FFFFFF',
        fontWeight: '700',
    },
    infoBlock: {
        height: 135,
        borderRadius: 16,
        backgroundColor: 'rgba(36, 36, 36, 0.5)',
        marginBottom: 20,
        overflow: 'hidden',
    },
    bottomBlock: {
        display: 'flex',
        flexDirection: 'column',
        paddingHorizontal: 20,
        paddingVertical: 15,
        height: 135,
        justifyContent: 'space-between',
    },
    titleBlock: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleBlockText: {
        fontSize: 22,
        fontWeight: 700,
        color: '#FFFFFF',
    },
    cardDateBlock: {
        display: 'flex',
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center',
    },
    cardDateBlockIcon: {
        height: 20,
        width: 20,
    },
    cardDateBlockText: {
        fontSize: 14,
        color: '#FFFFFF90',
        fontWeight: 700,
    },
    programDescriptionText: {
        fontSize: 15,
        color: '#FFFFFF80'
    },
    programDescriptionTextMore: {
        fontSize: 15,
        color: '#FFBE17',
        marginBottom: 0,
    },
    startButtonOutside: {
        backgroundColor: 'rgba(255, 190, 23, 0.05)',
        borderRadius: 77,
        height: 58,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    startButtonMiddle: {
        backgroundColor: 'rgba(255, 190, 23, 0.15)',
        borderRadius: 61,
        height: 48,
        width: '97%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    startButtonOutsideInside: {
        backgroundColor: 'rgba(255, 190, 23, 1)',
        borderRadius: 30,
        height: 38,
        width: '97%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    startButtonText: {
        fontSize: 16,
        fontWeight: 800,
        color: '#121212',
    },
    titleTrainings: {
        fontSize: 22,
        color: '#FFFFFF',
        fontWeight: '700',
        marginBottom: 8,
    },
});

export default TrainingPage;
