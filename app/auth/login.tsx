import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, Image, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import AppLogo from './assets/AppLogo.png';
import Eric from './assets/Eric.png';

const Auth = () => {
    const navigation = useNavigation();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isFocusedEmailInput, setIsFocusedEmailInput] = useState(false);
    const [isFocusedPasswordInput, setIsFocusedPasswordInput] = useState(false);

    const handleChangeEmail = (text) => setEmail(text);
    const handleChangePassword = (text) => setPassword(text);

    const formContainerPosition = useRef(new Animated.Value(0)).current;

    const moveFormContainerUp = () => {
        Animated.timing(formContainerPosition, {
            toValue: -300,
            duration: 250,
            useNativeDriver: true,
        }).start();
    };

    const moveFormContainerDown = () => {
        Animated.timing(formContainerPosition, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
        }).start();
    };

    const handleFocusEmailInput = () => {
        setIsFocusedEmailInput(true);
        moveFormContainerUp();
    };

    const handleBlurEmailInput = () => {
        setIsFocusedEmailInput(false);
        if (!isFocusedPasswordInput) moveFormContainerDown();
    };

    const handleFocusPasswordInput = () => {
        setIsFocusedPasswordInput(true);
        moveFormContainerUp();
    };

    const handleBlurPasswordInput = () => {
        setIsFocusedPasswordInput(false);
        if (!isFocusedEmailInput) moveFormContainerDown();
    };

    const dismissKeyboard = () => {
        Keyboard.dismiss();
        setIsFocusedEmailInput(false);
        setIsFocusedPasswordInput(false);
        moveFormContainerDown();
    };

    const handleLogin = async () => {
        try {
            const response = await fetch('http://89.104.65.131/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                const allHeaders = response.headers;
                const setCookieHeader = allHeaders.get('Set-Cookie') || allHeaders.get('set-cookie');

                if (setCookieHeader) {
                    const match = setCookieHeader.match(/Authorization=([^;]+)/);
                    if (match) {
                        const token = match[1];
                        await AsyncStorage.setItem('Authorization', token);
                        router.replace('/(tabs)');
                        console.log('Token saved:', token);
                    } else {
                        console.warn('Authorization cookie not found in Set-Cookie header');
                    }
                } else {
                    console.warn('No Set-Cookie header found');
                }
            } else {
                console.log('Ошибка', data.message || 'Неверный e-mail или пароль');
            }
        } catch (error) {
            console.log(error, 'Произошла ошибка при авторизации');
        }
    };

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={styles.container}>
                <View style={[
                    styles.backgroundContainer,
                    (isFocusedEmailInput || isFocusedPasswordInput) ? {opacity: 0} : null,
                ]} />
                <View style={styles.imageContainer}>
                    <Image
                        source={Eric}
                        style={[
                            styles.image,
                            (isFocusedEmailInput || isFocusedPasswordInput) ? {opacity: 0.2} : null,
                        ]}
                        resizeMode="contain"
                    />
                </View>
                <View style={styles.logoContainer}>
                    <Image
                        source={AppLogo}
                        style={[
                            styles.logo,
                            (isFocusedEmailInput || isFocusedPasswordInput) ? {opacity: 0.5} : null,
                        ]}
                    />
                </View>
                <Animated.View
                    style={[
                        styles.formContainer,
                        { transform: [{ translateY: formContainerPosition }] },
                    ]}
                >
                    <Text style={styles.loginText}>Login</Text>
                    <TextInput
                        style={[styles.input, isFocusedEmailInput ? styles.focusedInput : null]}
                        placeholder="E-mail"
                        keyboardType="email-address"
                        placeholderTextColor="#FFFFFF70"
                        value={email}
                        onChangeText={handleChangeEmail}
                        onFocus={handleFocusEmailInput}
                        onBlur={handleBlurEmailInput}
                    />
                    <TextInput
                        style={[styles.input, isFocusedPasswordInput ? styles.focusedInput : null]}
                        placeholder="Password"
                        secureTextEntry
                        placeholderTextColor="#FFFFFF70"
                        value={password}
                        onChangeText={handleChangePassword}
                        onFocus={handleFocusPasswordInput}
                        onBlur={handleBlurPasswordInput}
                    />
                    <TouchableOpacity>
                        <Text style={styles.forgotPassword}>Forgot Password?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>
                    <View style={styles.signUpContainer}>
                        <Text style={styles.signUpText}>You don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
                            <Text style={styles.signUpLink}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    // ... твои стили остаются без изменений ...
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    backgroundContainer: {
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        height: '50%',
        backgroundColor: '#FFBE17',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    imageContainer: {
        flex: 1,
        backgroundColor: '#121212',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    logoContainer: {
        position: 'absolute',
        right: '10%',
        top: '10%',
        width: 90,
        height: 90,
        backgroundColor: '#242424',
        borderRadius: 12,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 60,
        height: 60,
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    loginText: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        fontFamily: 'WorkSans-Bold',
        color: 'white',
        textAlign: 'left',
    },
    input: {
        width: '100%',
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 20,
        paddingRight: 20,
        borderWidth: 1,
        borderColor: '#222222',
        borderRadius: 16,
        backgroundColor: '#0F0F0F',
        paddingHorizontal: 10,
        marginBottom: 10,
        color: '#FFFFFF',
    },
    focusedInput: {
        borderColor: '#FFBE17',
    },
    forgotPassword: {
        color: '#FFFFFF',
        opacity: 0.7,
        textDecorationLine: 'underline',
        marginBottom: 20,
        textAlign: 'right',
        fontSize: 14,
        fontWeight: '500',
    },
    loginButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#FFBE17',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        marginBottom: 20,
    },
    loginButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0F0F0F',
    },
    signUpContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 4,
        justifyContent: 'center',
    },
    signUpText: {
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.7,
    },
    signUpLink: {
        fontSize: 14,
        color: '#FFBE17',
        textDecorationLine: 'underline',
    },
});

export default Auth;
