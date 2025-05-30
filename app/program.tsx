import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import {
    Animated,
    Easing,
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const Workout = (props: any) => {
    const navigation = useNavigation();
    const router = useRouter();
    
    const cardStyle = [
        workoutCSS.card,
        props.current && { borderWidth: 1, borderColor: '#FFBE17' }
    ];

    return (
        <TouchableOpacity style={cardStyle} onPress={() => router.push('/training')}>
            <View style={workoutCSS.cardLeft}>
                <Text style={workoutCSS.cardTitle}>Chest training</Text>
                <Text style={workoutCSS.trainingType}>Push</Text>
            </View>
            <View style={workoutCSS.cardRight}>
                <View style={workoutCSS.workoutDay}>
                    <Text style={workoutCSS.workoutDayText}>{props.day} day</Text>
                </View>
                {props.done && (
                    <View style={workoutCSS.workoutDone}>
                        <Text style={workoutCSS.workoutDoneText}>Done!</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    )
}

const workoutCSS = StyleSheet.create({
    card: {
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        borderRadius: 16,
        backgroundColor: '#24242480',
        height: 85,
        marginBottom: 15,
    },
    cardLeft: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 15,
        width: '50%',
    },
    trainingType: {
        fontSize: 14,
        fontWeight: 700,
        color: '#FFFFFFBF',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 700,
        color: '#FFFFFF',
    },
    cardRight: {
        width: '50%',
        position: 'relative',
        overflow: 'hidden',
    },
    workoutDone: {
        position: 'absolute',
        backgroundColor: '#FFBE17',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '110%',
        bottom: 0,
        height: 30,
        left: 30,
        transform: 'rotate(-25deg)',
    },
    workoutDoneText: {
        fontSize: 16,
        fontWeight: 800,
        marginLeft: 20,
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
    }
});

const Restday = (props: any) => {
    return (
        <View style={restdayCSS.restdayBlock}>
            <Text style={restdayCSS.restdayBlockTitle}>Day off</Text>
            <View style={restdayCSS.restdayBlockDay}>
                <Text style={restdayCSS.restdayBlockDayText}>{props.day} day</Text>
            </View>
        </View>
    )
}

const restdayCSS = StyleSheet.create({
    restdayBlock: {
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 16,
        backgroundColor: 'rgba(36, 36, 36, 0.5)',
        marginBottom: 15,
        padding: 15,
        height: 57,
        gap: 24,
        position: 'relative',
    },
    restdayBlockTitle:{
        fontSize: 18,
        fontWeight: 700,
        color: '#FFFFFF',
    },
    restdayBlockDay: {
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
    restdayBlockDayText: {
        color: '#FFFFFF',
        fontSize: 10,
    }
});

const ProgramPage = (props) => {
    const navigation = useNavigation();
    const animatedValue = new Animated.Value(0);
    const router = useRouter();
    
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
        <ScrollView style={styles.container}>
            <TouchableOpacity style={styles.goback} onPress={() => navigation.goBack()}>
                <Image source={require('./assets/arrow.png')} style={styles.arrowImage} />
                <Text style={styles.gobackText}>Workout</Text>
            </TouchableOpacity>
            <View style={styles.infoBlock}>
                <ImageBackground source={require('./assets/programBG.png')} style={styles.topBlock}>
                    <TouchableOpacity style={[styles.circle1, { backgroundColor: circle1Background }]} onPress={() => router.push('/online')}>
                        <Animated.View style={[styles.circle2, { backgroundColor: circle2Background }]}>
                            <View style={styles.circle3}>
                                <Text style={styles.circleText}>Go!</Text>
                            </View>
                        </Animated.View>
                    </TouchableOpacity>
                </ImageBackground>
                <View style={styles.bottomBlock}>
                    <View style={styles.titleBlock}>
                        <Text style={styles.titleBlockText}>Mass Gain Program</Text>
                        <View style={styles.cardDateBlock}>
                            <Image source={require('./assets/calendar.png')} style={styles.cardDateBlockIcon}></Image>
                            <Text style={styles.cardDateBlockText}>7 days</Text>
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
            <Text style={styles.titleTrainings}>Trainings</Text>
            <Workout day={1} done/>
            <Workout day={2} done/>
            <Workout day={3} current/>
            <Restday day={4} />
            <Workout day={5} />
            <Restday day={6} />
            <Workout day={7} />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#121212',
        display: 'flex',
        flexDirection: 'column',
        paddingHorizontal: 20,
        paddingTop: 75,
        flex: 1,
    },
    goback: {
        display: 'flex',
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center',
        marginBottom: 20,
    },
    gobackText: {
        fontSize: 22,
        color: '#FFFFFF',
        fontWeight: 700,
    },
    infoBlock: {
        display: 'flex',
        overflow: 'hidden',
        borderRadius: 16,
        backgroundColor: '#24242480',
        marginBottom: 20,
    },
    topBlock: {
        backgroundColor: '#313131',
        height: 240,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 20,
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
    bottomBlock: {
        padding: 16,
        display: 'flex',
        justifyContent: 'space-between',
        flex: 1,
        gap: 15,
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
        width: 21,
    },
    cardDateBlockText: {
        fontSize: 14,
        color: '#FFFFFF90',
        fontWeight: 700,
    },
    programDescriptionText: {
        fontSize: 14,
        color: '#FFFFFF80'
    },
    programDescriptionTextMore: {
        fontSize: 14,
        color: '#FFBE17',
        marginBottom: 0,
    },
    titleTrainings: {
        fontSize: 22,
        color: "#FFFFFF",
        fontWeight: 700,
        marginBottom: 20,
    },
})

export default ProgramPage;
