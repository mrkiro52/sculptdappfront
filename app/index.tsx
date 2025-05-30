import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('Authorization');
      setLoggedIn(!!token);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) return null;

  return <Redirect href={loggedIn ? '/(tabs)' : '/auth/login'} />;
}
