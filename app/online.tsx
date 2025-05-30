import { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    ImageBackground
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';

const { height, width } = Dimensions.get('window');

const reelsData = ['Exercise 1', 'Exercise 2', 'Exercise 3', 'Exercise 4', 'Exercise 5', 'Exercise 6'];

const Online = () => {
    const navigation = useNavigation();
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = (event) => {
        const index = Math.round(event.nativeEvent.contentOffset.y / (height - 250));
        setActiveIndex(index);
    };
    
    const progress = 80;
    const size = 50;
    const strokeWidth = 3;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - progress / 100);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.goback} onPress={() => navigation.goBack()}>
                <Image source={require('./assets2/arrow.png')} style={styles.arrowImage} />
            <Text style={styles.gobackText}>Biceps training <Text style={styles.gobackTextSpan}>{activeIndex+1}/{reelsData.length}</Text></Text>
            </TouchableOpacity>
            <View style={styles.reelsContainer}>
                <ScrollView
                    style={styles.reels}
                    pagingEnabled
                    horizontal={false}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={height - 200}
                    snapToAlignment="start"
                    decelerationRate="fast"
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                >
                    {reelsData.map((reel, index) => (
                        <ImageBackground
                            key={index}
                            source={require('./assets2/bg.png')}
                            style={styles.reelItem}
                        >
                            <View style={styles.reelItemTop}>
                                <View style={styles.reelItemTopLeft}>
                                    <Image source={require('./assets2/sets.png')} style={styles.arrowImage} />
                                    <Text style={styles.reelItemTopLeftText}>10x4 set</Text>
                                </View>
                                <View style={styles.reelItemBigRight}>
                                     <View style={styles.reelItemTopRight}>
                                         <Text style={styles.reelItemTopRightText}>?? kg</Text>
                                         <Image source={require('./assets2/editWeight.png')} style={styles.arrowImage} />
                                     </View>
                                     <TouchableOpacity>
                                        <Image source={require('./assets2/info.png')} style={styles.infoIcon}></Image>
                                     </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.reelItemBottom}>
                                <View style={styles.reelItemBottomTop}>
                                    <Text style={styles.reelItemBottomTopText}>Biceps training</Text>
                                    <View style={styles.reelItemBottomTopMuscles}>
                                         <View style={styles.circle_block}>
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
                                             <Image source={require('./assets/muscleCircle.png')} style={styles.muscleCircle}></Image>
                                         </View>
                                        <Image source={require('./assets2/machine.png')} />
                                    </View>
                                </View>
                            </View>
                        </ImageBackground>
                    ))}
                </ScrollView>
                <View style={styles.indicatorContainer}>
                    {reelsData.map((_, index) => (
                        <View
                            key={index}
                            style={[styles.indicator, activeIndex === index && styles.activeIndicator]}
                        />
                    ))}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#121212',
        flexDirection: 'column',
        paddingTop: 75,
        flex: 1,
    },
    goback: {
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    gobackText: {
        fontSize: 22,
        color: '#FFFFFF',
        fontWeight: '900',
    },
    gobackTextSpan: {
        color: '#FFBE17',
    },
    reelsContainer: {
        height: height - 200,
        overflow: 'hidden',
        position: 'relative',
    },
    reels: {
        flex: 1,
    },
    reelItem: {
        height: height - 200,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        position: 'relative',
    },
    arrowShow: {
        position: 'absolute',
        top: 50,
        right: 150,
    },
    youCanChangeWeight: {
        position: 'absolute',
        top: 200,
        width: '130%',
        backgroundColor: '#FFBE17',
        height: 60,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: 'rotate(-2deg)',
    },
    youCanChangeWeightText: {
        fontWeight: 800,
        fontSize: 16,
        color: '#121212',
    },
    reelItemTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    reelItemTopLeft: {
        backgroundColor: '#121212',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
        alignItems: 'center',
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    reelItemTopLeftText: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '700',
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
    reelItemBigRight: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    infoIcon: {
        width: 20,
        height: 20,
    },
    reelItemTopRight: {
        backgroundColor: '#121212',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: 100,
    },
    reelItemTopRightText: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '700',
    },
    reelItemBottom: {
        gap: 25,
        width: '100%',
    },
    reelItemBottomTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    reelItemBottomTopText: {
        fontWeight: '900',
        fontSize: 22,
        color: '#FFFFFF',
    },
    reelItemBottomTopMuscles: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    indicatorContainer: {
        position: 'absolute',
        right: 10,
        top: '30%',
    },
    indicator: {
        width: 3,
        height: 30,
        borderRadius: 4,
        backgroundColor: '#555555',
        marginVertical: 5,
    },
    activeIndicator: {
        backgroundColor: '#FFBE17',
    }
});

export default Online;
