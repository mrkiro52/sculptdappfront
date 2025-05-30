import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';

const CommentsSection = ({ data }) => {
    return (
        <View style={styles.commentsSection}>
            {data.length === 0 ? (
                <Text style={styles.noComments}>No comments</Text>
            ) : (
                data.map((comment, index) => (
                    <View key={index} style={styles.commentItem}>
                        <View style={styles.commentItemLeft}>
                            <Image style={styles.commentItemLeftCircle} source={{ uri: comment.user.avatar }} />
                        </View>
                        <View style={styles.commentItemRight}>
                            <Text style={styles.commentAuthor}>@{comment.user.username}</Text>
                            <Text style={styles.commentText}>{comment.text}</Text>
                        </View>
                    </View>
                ))
            )}
        </View>
    );
};

const Post = () => {
    const navigation = useNavigation();
    const { post_id } = useLocalSearchParams();
    const [newComment, setNewComment] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [userData, setUserData] = useState({});
    const [commentsData, setCommentsData] = useState([]);
    const [postData, setPostData] = useState({
        id: '',
        user_id: '',
        text: '',
        content: [''],
        topics: '',
        username: '',
        likes: 0,
        comments: 0,
        created_at: '',
        avatar: '',
        is_liked: false,
    });
    const [likesCount, setLikesCount] = useState(0);

    const handleGoBack = () => navigation.goBack();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = await AsyncStorage.getItem('Authorization');
            if (!token) return;
            const response = await fetch('http://89.104.65.131/user/get-profile', {
                method: 'GET',
                headers: { 'Authorization': token, 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                const data = await response.json();
                setUserData(data);
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchPost = async () => {
            const token = await AsyncStorage.getItem('Authorization');
            if (!token) return;
            const response = await fetch(`http://89.104.65.131/chat/get-post?postID=${post_id}`, {
                method: 'GET',
                headers: { 'Authorization': token, 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                const data = await response.json();
                setPostData(data.post);
                setLikesCount(data.post.likes);
            }
        };
        fetchPost();
    }, []);

    const handleLike = async (postId) => {
        const likeURL = `http://89.104.65.131/chat/like-post?postID=${postId}`;
        const unlikeURL = `http://89.104.65.131/chat/unlike-post?postID=${postId}`;
        const token = await AsyncStorage.getItem('Authorization');
        const headers = {
            'Authorization': token,
            'Content-Type': 'application/json'
        };

        try {
            const res = await fetch(likeURL, { method: 'POST', headers });
            if (res.status === 400) {
                await fetch(unlikeURL, { method: 'DELETE', headers });
                setLikesCount(prev => Math.max(prev - 1, 0));
                setPostData(prev => ({ ...prev, is_liked: false }));
            } else if (res.ok) {
                setLikesCount(prev => prev + 1);
                setPostData(prev => ({ ...prev, is_liked: true }));
            }
        } catch (e) {
            console.log('Ошибка лайка:', e.message);
        }
    };

    useEffect(() => {
        const fetchComments = async () => {
            const token = await AsyncStorage.getItem('Authorization');
            if (!token) return;
            const response = await fetch('http://89.104.65.131/chat/load-comments', {
                method: 'POST',
                headers: { 'Authorization': token, 'Content-Type': 'application/json' },
                body: JSON.stringify({ limit: 10, offset: 0, post_id: Number(post_id) }),
            });
            if (response.ok) {
                const data = await response.json();
                setCommentsData(data.comments);
            }
        };
        fetchComments();
    }, []);

    const handleSendComment = async () => {
        if (!newComment.trim()) return;

        try {
            setIsSending(true);
            const token = await AsyncStorage.getItem('Authorization');
            if (!token) return;

            const response = await fetch('http://89.104.65.131/chat/make-comment', {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    post_id: Number(post_id),
                    text: newComment.trim(),
                }),
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Ошибка при отправке: ${response.status} ${errText}`);
            }

            const data = await response.json();
            setCommentsData(prev => [data.comment, ...prev]);
            setNewComment('');
        } catch (error) {
            console.error('Ошибка при отправке комментария:', error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <ScrollView style={styles.container} showsVerticalScrollIndicator={true}>
                    <TouchableOpacity style={styles.goback} onPress={handleGoBack}>
                        <Image source={require('./assets/arrow.png')} style={styles.arrowImage} />
                        <Text style={styles.gobackText}>Community</Text>
                    </TouchableOpacity>
                    <View style={styles.post}>
                        <View style={styles.post_leftSide}>
                            <Image style={styles.post_avatar_circle} source={{ uri: postData.avatar }} />
                        </View>
                        <View style={styles.post_rightSide}>
                            <Text style={styles.post_nickname}>@{postData.username}</Text>
                            <Text style={styles.post_text}>{postData.text}</Text>
                            {postData.content[0] && <Image style={styles.post_image} source={{ uri: postData.content[0] }} />}
                            <View style={styles.post_reactionsBlock}>
                                <TouchableOpacity style={styles.post_reactionsBlockComments}>
                                    <Image style={styles.post_reactionsBlockIcon} source={require('./assets/commentsIcon.png')} />
                                    <Text style={styles.reaction_text}>{postData.comments}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.post_reactionsBlockLikes} onPress={() => handleLike(postData.id)}>
                                    <Image
                                        style={styles.post_reactionsBlockIcon}
                                        source={postData.is_liked ? require('./assets/likeIconRed.png') : require('./assets/likeIcon.png')}
                                    />
                                    <Text style={styles.reaction_text}>{likesCount}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={styles.line}></View>
                    <CommentsSection data={commentsData} />
                    <View style={styles.commentInputContainer}>
                        <TextInput
                            style={styles.commentInput}
                            placeholder="Write a comment..."
                            placeholderTextColor="#888"
                            value={newComment}
                            onChangeText={setNewComment}
                            multiline
                        />
                        <TouchableOpacity
                            style={styles.sendButton}
                            onPress={handleSendComment}
                            disabled={isSending}
                        >
                            <Text style={styles.sendButtonText}>
                                {isSending ? '...' : 'Send'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
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
        marginBottom: 20,
    },
    arrowImage: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    gobackText: {
        fontSize: 22,
        color: '#FFFFFF',
        fontWeight: '700',
    },
    post: {
        borderRadius: 12,
        flexDirection: 'row',
        marginBottom: 15,
    },
    post_leftSide: {
        marginRight: 10,
    },
    post_avatar_circle: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    post_rightSide: {
        flex: 1,
    },
    post_nickname: {
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontSize: 16,
    },
    post_text: {
        color: '#FFFFFF',
        fontSize: 14,
        marginVertical: 6,
    },
    post_image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginVertical: 8,
    },
    post_reactionsBlock: {
        flexDirection: 'row',
        marginTop: 6,
    },
    post_reactionsBlockComments: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },
    post_reactionsBlockLikes: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    post_reactionsBlockIcon: {
        width: 20,
        height: 20,
        marginRight: 4,
    },
    reaction_text: {
        color: '#FFFFFF',
        fontSize: 14,
    },
    line: {
        height: 1,
        backgroundColor: '#333',
        marginVertical: 12,
    },
    commentsSection: {
        marginBottom: 20,
    },
    commentItem: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    commentItemLeft: {
        marginRight: 10,
    },
    commentItemLeftCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    commentItemRight: {
        flex: 1,
    },
    commentAuthor: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    commentText: {
        color: '#CCCCCC',
        fontSize: 14,
        marginTop: 2,
    },
    noComments: {
        color: '#777',
        fontStyle: 'italic',
        textAlign: 'center',
    },
    commentInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#333',
        paddingTop: 10,
        paddingBottom: 30,
    },
    commentInput: {
        flex: 1,
        backgroundColor: '#1E1E1E',
        color: '#FFF',
        borderRadius: 8,
        padding: 10,
        fontSize: 14,
        maxHeight: 100,
    },
    sendButton: {
        marginLeft: 10,
        backgroundColor: '#FFBE17',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    sendButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
});

export default Post;
