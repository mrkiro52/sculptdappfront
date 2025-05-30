import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const PostItem = (props: any) => {

    const [avatarImage, setAvatarImage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserAvatar = async () => {
        try {
            const url = `http://89.104.65.131/user/get-user-profile?userID=${props.userid}`;
            const response = await fetch(url);

            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const avatar = data.image;

            setAvatarImage(avatar);
        } catch (error) {
            console.error('Ошибка при получении аватара пользователя:', error);
        } finally {
            setLoading(false);
        }
        };

        fetchUserAvatar();
    }, []);

    return (
        <View style={styles.post}>
            <View style={styles.post_leftSide}>
                <Image
                    style={styles.post_avatar_circle}
                    source={{uri: avatarImage}}
                />
            </View>
            <View style={styles.post_rightSide}>
                    <Text style={styles.post_nickname}>{props.username}</Text>
                <Text style={styles.post_text}>{props.text}</Text>
                <Image style={styles.post_image} source={{uri: props.content}}></Image>
                <View style={styles.post_reactionsBlock}>
            <TouchableOpacity style={styles.post_reactionsBlockComments}>
                            <Image style={styles.post_reactionsBlockIcon} source={require('./assets/commentsIcon.png')}></Image>
                            <Text style={styles.reaction_text}>{props.comments}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.post_reactionsBlockLikes} onPress={() => handleLike(post.id)}>
                                <Image style={styles.post_reactionsBlockIcon} source={require('./assets/likeIconRed.png')
                                    }
                                />
                                <Text style={styles.reaction_text}>{props.likes}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const ProfileCommunity = () => {
    const router = useRouter();
    const { user_id } = useLocalSearchParams();
    const navigation = useNavigation();
    const handleGoBack = () => {
        navigation.goBack();
    };
    
    const getFormattedDate = () => {
        return new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };
    
    const [postsData, setPostsData] = useState({
        "posts": [
            {
                "id": '',
                "topics": '',
                "username": '',
                "user_id": '',
                "header": '',
                "text": '',
                "content": '',
                "likes": '',
                "comments": '',
                "created_at": '2025-02-12T23:26:0',
            }
        ]
    });
    
    useEffect(() => {
            const fetchUserPosts = async () => {
                try {
                    const response = await fetch(`http://89.104.65.131/chat/get-user-posts?postOwnerID=${user_id}`);

                    if (response.status === 401) {
                        console.warn('Unauthorized, clearing storage and redirecting...');
                        await AsyncStorage.clear();
                        router.push('/auth/login');
                        return;
                    }

                    if (!response.ok) {
                        throw new Error(`Network response was not ok: ${response.status}`);
                    }

                    const data = await response.json();
                    setPostsData(data);
                } catch (error) {
                    console.error('Ошибка при получении постов:', error);
                }
            };

            if (user_id) {
                fetchUserPosts();
            }
    }, [user_id]);

    const followUser = async (user_id: any) => {
        try {
            const response = await fetch('http://89.104.65.131/chat/follow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: user_id })
            });
    
            if (!response.ok) {
                throw new Error(`Ошибка: ${response.status}`);
            }

            console.log(user_id);
    
            const data = await response.json();

            // Здесь можно сделать что-то с результатом
        } catch (error) {
            console.error('Произошла ошибка:', error);
        }
    };    
    
    return (
            <ScrollView style={styles.container}>
                <TouchableOpacity style={styles.goback} onPress={handleGoBack}>
                    <Image source={require('./assets/arrow.png')} style={styles.arrowImage} />
                    <Text style={styles.gobackText}>Community</Text>
                </TouchableOpacity>
                <View style={styles.infoBlock}>
                    <View style={styles.infoBlockInside}>
                        <Image 
                            style={styles.avatar}
                            source={{uri: "https://sun9-22.userapi.com/impg/z-WHvS2qvEs7RiqTH4sBtSz66AX6KD0tdg1PfA/BFopaJ9xYS4.jpg?size=1280x1280&quality=95&sign=d2c0723d48b8fe608b9b611f9f5a45df&type=album"}}
                        />
                        <View style={styles.infoBlockInsideTop}>
                            <TouchableOpacity style={styles.buttonSubscribe} onPress={() => followUser(user_id)}>
                            <Text style={styles.buttonSubscribeText}>Subscribe</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.infoBlockInsideMiddle}>
                            <View style={styles.infoBlockCol}>
                                <Text style={styles.infoBlockColName}>Khanil Kireev</Text>
                                <Text style={styles.infoBlockColUsername}>@kiro</Text>
                            </View>
                            <View style={styles.infoBlockCol}>
                                <Text style={styles.infoBlockColTitle}>15K</Text>
                                <Text style={styles.infoBlockColSubtext}>Following</Text>
                            </View>
                            <View style={styles.infoBlockCol}>
                                <Text style={styles.infoBlockColTitle}>1.2M</Text>
                                <Text style={styles.infoBlockColSubtext}>Followers</Text>
                            </View>
                        </View>
                        <Text style={styles.descriptionText}>Big man in a suit of armour. Take that off, what are you? Genius, billionaire, playboy, philanthropist.
                        </Text>
                    </View>
                </View>
                <Text style={styles.titleText}>Posts</Text>
                <View style={styles.datecontainer}>
                    <View style={styles.line}></View>
                    <View style={styles.dateBlock}>
                        <Text style={styles.datetext}>{getFormattedDate()}</Text>
                    </View>
                    <View style={styles.line}></View>
                </View>
                {postsData.posts.length > 0 && (
                  <View>
                    {postsData.posts.map((post, index) => (
                      <View key={index} style={{ marginBottom: index === postsData.posts.length - 1 ? 60 : 30 }}>
                        <PostItem
                          username={post.username}
                          text={post.text}
                          likes={post.likes}
                          comments={post.comments}
                          content={post.content[0]}
                          userid={user_id}
                        />
                      </View>
                    ))}
                  </View>
                )}
            </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#121212',
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 75,
    },
    goback: {
          display: 'flex',
          flexDirection: 'row',
          gap: 15,
          alignItems: 'center',
          marginBottom: 40,
    },
    gobackText: {
          fontSize: 22,
          color: '#FFFFFF',
          fontWeight: 700,
    },
    infoBlock: {
        minHeight: 255,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        marginBottom: 25,
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 100,
        backgroundColor: 'blue',
        position: 'absolute',
        top: -55,
        left: 0,
    },
    infoBlockInside: {
        minHeight: 200,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        padding: 24,
        backgroundColor: 'rgba(36, 36, 36, 0.5)',
        borderRadius: 16,
    },
    infoBlockInsideTop: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    buttonSubscribe: {
        width: 105,
        height: 25,
        backgroundColor: '#FFBE17',
        borderRadius: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonSubscribeText: {
        fontSize: 10,
        fontWeight: 500,
        color: '#000000',
    },
    infoBlockInsideMiddle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    infoBlockCol: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
    },
    infoBlockColName: {
        fontWeight: 900,
        color: '#ffffff',
        fontSize: 22,
    },
    infoBlockColUsername: {
        fontSize: 16,
        color: '#ffffff',
        opacity: 0.6,
        fontWeight: 400,
    },
    infoBlockColTitle: {
        fontSize: 22,
        fontWeight: 900,
        color: '#ffffff',
        opacity: 0.6,
    },
    infoBlockColSubtext: {
        fontSize: 12,
        fontWeight: 400,
        color: '#ffffff',
        opacity: 0.6,
    },
    descriptionText: {
        fontSize: 16,
        color: '#ffffff',
        fontWeight: 400,
    },
    titleText: {
        fontWeight: 900,
        fontSize: 22,
        color: '#ffffff',
        marginBottom: 25,
    },
    datecontainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
        marginBottom: 15,
    },
    line: {
        height: 2,
        backgroundColor: '#242424',
        flex: 1,
        borderRadius: 10,
    },
    dateBlock: {
        backgroundColor: '#242424',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 130,
        height: 20,
        borderRadius: 60,
    },
    datetext: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: 700,
    },
    post: {
        backgroundColor: '#121212',
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    post_leftSide: {
        width: 55,
        marginRight: 8,
    },
    post_avatar_circle: {
        width: 55,
        height: 55,
        backgroundColor: 'green',
        borderRadius: 50,
    },
    post_rightSide: {
        flex: 1,
        flexDirection: 'column',
        gap: 10,
    },
    post_image: {
        width: '100%',   // Занимает всю ширину контейнера/ Высота будет автоматически подстраиваться по пропорциям
        aspectRatio: 1, 
        borderRadius: 20,
        marginBottom: 10,
    },
    post_nickname: {
        fontWeight: 400,
        color: '#687684',
        fontSize: 16,
    },
    post_text: {
        fontWeight: 400,
        color: '#ffffff',
        flexWrap: 'wrap',
        fontSize: 16,
    },
    post_reactionsBlock: {
        display: 'flex',
        flexDirection: 'row',
        gap: 20,
    },
    post_reactionsBlockComments: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    post_reactionsBlockLikes: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    post_reactionsBlockIcon: {
        width: 19,
        height: 18,
    },
    reaction_text: {
      color: '#687684',
      fontWeight: 400,
      fontSize: 15,
    },
});

export default ProfileCommunity;
