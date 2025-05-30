import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Image,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const PostItem = ({ post, navigation, userData, isSubscribed }) => {
    console.log(post);
    const formatter = new Intl.DateTimeFormat("en-EN", {
        timeZone: "Europe/Moscow",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
    const router = useRouter();
    const isoDate = new Date(post.created_at);
    const [likesCount, setLikesCount] = useState(post.likes);

    const followUser = async (userToFollow) => {
        try {
          // Получаем токен из AsyncStorage
          const token = await AsyncStorage.getItem('Authorization');
    
          if (!token) {
            console.error('Ошибка: отсутствует токен авторизации');
            return;
          }
    
          // Делаем GET-запрос с заголовком Authorization
          const response = await fetch('http://89.104.65.131/chat/follow', {
            method: 'POST',
            headers: {
              'Authorization': token,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: userToFollow,
            }),
          });
    
          if (response.status === 401) {
            console.error('Ошибка: неавторизованный доступ');
            return;
          }
        } catch (error) {
          console.error('Ошибка загрузки данных:', error);
        }
    };
    const handleOpenPost = (post_id) => {
        navigation.navigate('Post', { post_id });
    }
    
    const handleLike = async (postId) => {
      try {
        const response = await fetch(`http://89.104.65.131/chat/like-post?postID=${postId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.status === 401) {
            AsyncStorage.clear();
            router.push('/auth/login');
        }
        if (response.status === 400) {
          console.log('Сервер вернул 400. Отправляем запрос на удаление лайка...');
          const unlikeResponse = await fetch(`http://89.104.65.131/chat/unlike-post?postID=${postId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!unlikeResponse.ok) {
            const errorText = await unlikeResponse.text();
            throw new Error(`Ошибка при удалении лайка: ${unlikeResponse.status} ${unlikeResponse.statusText}. Ответ: ${errorText}`);
          }

          const unlikeData = await unlikeResponse.json();
          console.log('Лайк успешно удалён, ответ сервера:', unlikeData);

          // 👇 уменьшаем количество лайков локально
          setLikesCount((prev) => Math.max(prev - 1, 0));
          return;
        }

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Ошибка сети: ${response.status} ${response.statusText}. Ответ: ${errorText}`);
        }

        const data = await response.json();
        console.log('Лайк отправлен, ответ сервера:', data);

        // 👇 увеличиваем количество лайков локально
        setLikesCount((prev) => prev + 1);
      } catch (error) {
        console.log('Произошла ошибка:', error.message);
      }
    };



    return (
        <View style={styles.post}>
            <View style={styles.post_leftSide}>
                <TouchableOpacity
                    onPress={() => router.push(`/profileCommunity?user_id=${post.user_id}`)}>
                    <Image
                        style={styles.post_avatar_circle}
                        source={{ uri: post.user.avatar }}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.post_rightSide}>
                <TouchableOpacity onPress={() => router.push(`/profileCommunity?user_id=${post.user_id}`)}>
                    <Text style={styles.post_nickname}>@{post.user.username}</Text>
                </TouchableOpacity>
                <Text style={styles.post_text}>{post.text}</Text>
                {post.content[0] && <Image source={{uri: post.content[0]}} style={styles.post_image} />}
                <View style={styles.post_reactionsBlock}>
                    <TouchableOpacity style={styles.post_reactionsBlockLikes} onPress={() => handleLike(post.id)}>
                                <Image style={styles.post_reactionsBlockIcon} source={ likesCount === 1
                                            ? require('./assets/likeIconRed.png') // 🔥 если лайкнут
                                            : require('./assets/likeIcon.png')    // 🔥 если нет
                                    }
                                />
                        <Text style={styles.reaction_text}>{likesCount}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.post_reactionsBlockComments} onPress={() => router.push(`/post?post_id=${post.id}`)}>
                            <Image style={styles.post_reactionsBlockIcon} source={require('./assets/commentsIcon.png')}></Image>
                            <Text style={styles.reaction_text}>{post.comments}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const Community = () => {
    const [feedType, setFeedType] = useState(false);
    const [feedTopic, setFeedTopic] = useState("All");
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();
    const [postsData, setPostsData] = useState({
        "posts": [
            {
                "id": "",
                "user_id": "",
                "user": {
                    "id": "",
                    "username": "",
                    "avatar": "",
                    "followers": "",
                    "subscriptions": ""
                },
                "text": "",
                "content": [
                    ""
                ],
                "topics": "",
                "likes": 0,
                "comments": 0,
                "created_at": "2025-05-19T21:21:04.688882Z"
            },
        ]
    });

    const [userData, setUserData] = useState({
        email: "",
        image: "",
        name: "",
        surname: "",
        username: "",
        gender: "",
        age: "2003-10-21T00:00:00Z",
        height: "",
        weight: "",
        xp: "",
        description: "",
        height_type: "",
        weight_type: "",
        train_goal: "",
        nutrition_goal: "",
        training_level: "",
        training_type: "",
        available_simulators: "",
    });

    const [userSubs, setUserSubs] = useState([]);

    useEffect(() => {
        const fetchUserSubs = async () => {
          try {
            // Получаем токен из AsyncStorage
            const token = await AsyncStorage.getItem('Authorization');
      
            if (!token) {
              console.error('Ошибка: отсутствует токен авторизации');
              return;
            }
      
            // Делаем GET-запрос с заголовком Authorization
            const response = await fetch('http://89.104.65.131/chat/get-subs', {
              method: 'GET',
              headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
              },
            });
      
            if (response.status === 401) {
              console.error('Ошибка: неавторизованный доступ');
              return;
            }
      
            const data = await response.json();
            setUserSubs(data.subsc);
          } catch (error) {
            console.error('Ошибка загрузки данных:', error);
          }
        };
      
        fetchUserSubs();
    }, []);

    const feedTopics = [
        "All",
        "Workouts",
        "Nutrition",
        "Motivation",
        "Progress",
        "Cardio",
        "Recovery",
        "Challenges",
    ];

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            // Получаем токен из AsyncStorage
            const token = await AsyncStorage.getItem('Authorization');
      
            if (!token) {
              console.error('Ошибка: отсутствует токен авторизации');
              return;
            }
      
            // Делаем GET-запрос с заголовком Authorization
            const response = await fetch('http://89.104.65.131/user/get-profile', {
              method: 'GET',
              headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
              },
            });
      
            if (response.status === 401) {
              console.error('Ошибка: неавторизованный доступ');
              return;
            }
      
            const data = await response.json();
            setUserData(data);
          } catch (error) {
            console.error('Ошибка загрузки данных:', error);
          }
        };
      
        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Получаем токен из AsyncStorage
                const token = await AsyncStorage.getItem('Authorization');
        
                if (!token) {
                    console.error('Ошибка: отсутствует токен авторизации');
                    return;
                }
        
                // Делаем POST-запрос с параметрами в теле
                const response = await fetch('http://89.104.65.131/chat/load-news', {
                    method: 'POST', // Используем POST, так как нам нужно передать тело
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        limit: 10,
                        offset: 0,
                        followed: feedType,
                        topic: feedTopic === 'All' ? "" : feedTopic,
                    }),
                });
        
                if (response.status === 401) {
                    console.error('Ошибка: неавторизованный доступ');
                    return;
                }
        
                const data = await response.json();
                setPostsData(data);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            }
        };
        
        fetchPosts();
    }, [feedType, feedTopic]);
    
    const onRefresh = async () => {
        setRefreshing(true);
        const fetchPosts = async () => {
            try {
                // Получаем токен из AsyncStorage
                const token = await AsyncStorage.getItem('Authorization');
        
                if (!token) {
                    console.error('Ошибка: отсутствует токен авторизации');
                    return;
                }
        
                // Делаем POST-запрос с параметрами в теле
                const response = await fetch('http://89.104.65.131/chat/load-news', {
                    method: 'POST', // Используем POST, так как нам нужно передать тело
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        limit: 10,
                        offset: 0,
                        followed: feedType,
                        topic: feedTopic === 'All' ? "" : feedTopic,
                    }),
                });
        
                if (response.status === 401) {
                    console.error('Ошибка: неавторизованный доступ');
                    return;
                }
        
                const data = await response.json();
                setPostsData(data);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            }
        };
        fetchPosts();
        
        // Здесь можно добавить запрос к серверу или любую логику для обновления данных
        setTimeout(() => {
          // Эмулируем задержку обновления данных (например, запрос к серверу)
          setRefreshing(false);
        }, 1000); // 2 секунды для симуляции загрузки
    };

    const getFormattedDate = () => {
        return new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
            <SafeAreaView style={styles.containerSafe}>
                <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    />
                }>
                {refreshing && <Text style={styles.refreshText}>Updating</Text>}
                <View style={styles.headerBlock}>
                    <TouchableOpacity style={styles.infoblock} onPress={() => router.push(`/profileCommunity?user_id=${userData.user_id}`)}>
                        <Image source={{uri: userData.image}} style={styles.infoblockUserAvatar} />
                        <View style={styles.usernamesBlock}>
                            <Text style={styles.namesurname}>{userData.name} {userData.surname}</Text>
                            <Text style={styles.username}>@{userData.username}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.addpostbtn}
                        onPress={() => router.push('/addPost')}
                    >
                        <Text style={styles.addposttext}>Add a post</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.title}>Topics</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.topicslider}
                >
                    {feedTopics.map((topic, index) => (
                        <TouchableOpacity
                            key={index}
                            style={feedTopic === topic ? styles.topicblockSelected : styles.topicblock}
                            onPress={() => setFeedTopic(topic)}
                        >
                            <Text style={styles.topicText}>{topic}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <View style={styles.feedbtnsblock}>
                    <TouchableOpacity
                        style={!feedType ? styles.feedbtnSelected : styles.feedbtn}
                        onPress={() => setFeedType(false)}
                    >
                        <Text
                            style={[
                                styles.feedbtntext,
                                { color: !feedType ? '#FFBE17' : '#FFFFFF70' }
                            ]}
                        >
                            Main
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={feedType ? styles.feedbtnSelected : styles.feedbtn}
                        onPress={() => setFeedType(true)}
                    >
                        <Text
                            style={[
                                styles.feedbtntext,
                                { color: feedType ? '#FFBE17' : '#FFFFFF70' }
                            ]}
                        >
                            Following
                        </Text>
                    </TouchableOpacity>
                </View>
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
                          post={post}
                          navigation={navigation}
                          userData={userData}
                          isSubscribed={userSubs?.includes(post.user_id)}
                        />
                      </View>
                    ))}
                  </View>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    containerSafe: {
        backgroundColor: '#121212',
        flex: 1,
    },
    container: {
        backgroundColor: '#121212',
        display: 'flex',
        flexDirection: 'column',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    refreshText: {
        color: '#ffffff',
        fontSize: 16,
        marginHorizontal: 'auto',
        marginBottom: 20,
    },
    headerBlock: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    infoblock: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
    },
    avatarImage: {
        width: 44,
        height: 44,
        borderRadius: 50,
    },
    usernamesBlock: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    namesurname: {
        fontSize: 22,
        color: '#FFFFFF',
        fontWeight: 700,
        margin: 0,
    },
    username: {
        fontSize: 12,
        color: '#909090',
        fontWeight: 400,
        margin: 0,
    },
    addpostbtn: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        width: 140,
        height: 45,
        borderColor: '#FFFFFF50',
        borderWidth: 1,
        borderRadius: 20,
    },
    addposttext: {
        fontSize: 16,
        color: '#FFFFFF50',
        fontWeight: 500,
    },
    title: {
        fontSize: 22,
        color: '#FFFFFF',
        fontWeight: 700,
        marginBottom: 15,
    },
    topicslider: {
        flexDirection: 'row',
        height: 50,
        marginBottom: 20,
    },
    topicblock: {
        width: 80,
        height: 40,
        backgroundColor: '#242424',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 7,
        marginRight: 5,
    },
    topicblockSelected: {
        width: 80,
        height: 40,
        backgroundColor: '#242424',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FFBE17',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 7,
        marginRight: 5,
    },
    topicText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '400',
    },
    feedbtnsblock: {
        display: 'flex',
        gap: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
    },
    feedbtn: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        width: 100,
        height: 45,
        borderBottomColor: 'transparent',
        borderBottomWidth: 2,
    },
    feedbtnSelected: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        width: 100,
        height: 45,
        borderBottomColor: '#FFBE17',
        borderBottomWidth: 2,
    },
    feedbtntext: {
        fontWeight: 700,
        fontSize: 14,
        textAlign: 'center',
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
    infoblockUserAvatar: {
        width: 44,
        height: 44,
        borderRadius: 50,
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
        backgroundColor: 'gray',
        borderRadius: 50,
    },
    post_rightSide: {
        flex: 1,
        flexDirection: 'column',
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
        marginBottom: 4,
    },
    post_text: {
        fontWeight: 400,
        color: '#ffffff',
        flexWrap: 'wrap',
        fontSize: 16,
        marginBottom: 8,
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

export default Community;
