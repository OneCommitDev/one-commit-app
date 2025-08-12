import React, { JSX, useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import TitleText from '~/components/TitleText';
import AppText from '~/components/AppText';
import { PREF_KEYS } from '~/utils/Prefs';
import { getItem, setItem } from 'expo-secure-store';
import Loader from '~/components/Loader';
import { Api_Url, httpRequest2 } from '~/services/serviceRequest';
import { HomeToDo, SimpleResponse, todo_items } from '~/services/DataModals';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '~/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getFCMToken } from '~/utils/AppFunctions';

type CardItem = {
  id: string;
  title: string;
  icon: JSX.Element;
  items: string[];
  todoItems?: todo_items[];
};

type EmailRouteProp = RouteProp<RootStackParamList, 'EmailCommunication'>;

export default function HomeScreen({ onRedirect }: { onRedirect: (tab: 'Explore') => void }) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);
  const [todoList, setTodoList] = useState<HomeToDo | null>(null);

  useEffect(() => {
    fetchTODO();
    fcmTokenSavingAPi();
  }, []);

  const fetchTODO = async () => {
    try {
      setLoading(true);
      const accessToken = await getItem(PREF_KEYS.accessToken);
      const url = Api_Url.homeToDo;

      const res = await httpRequest2<HomeToDo>(
        url,
        'get',
        {},
        accessToken ?? ''
      );

      console.log('res_res ' , res);

      if (res.status && res.data) {
        setTodoList(res);
        setItem(PREF_KEYS.displayName , res.data.profile.name);
        setItem(PREF_KEYS.connected_id , res.data.connected_email.email);
         setItem(PREF_KEYS.connected_id_provider , res.data.connected_email.provider);
      } else {
        Alert.alert('Notice', 'No To-Do items found.');
      }
    } catch (err) {
      console.log('Error fetching to-do list:', err);
      Alert.alert('Error', 'Unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const fcmTokenSavingAPi = async () => {
    try {
      const accessToken = await getItem(PREF_KEYS.accessToken);
      const fcm = await getItem(PREF_KEYS.fcmToken);
      const url = Api_Url.fcmTokenAPI;

      await getFCMToken();

      const res = await httpRequest2<SimpleResponse>(
        url,
        'post',
        { fcmToken: fcm },
        accessToken ?? '',
        true
      );

      console.log('FCM token saved:', fcm);
    } catch (err) {
      Alert.alert('Error', 'Unexpected error occurred.');
    }
  };

  const buildCardData = (): CardItem[] => [
    {
      id: '1',
      title: 'TO-DO',
      icon: <Ionicons name="checkmark-done-circle" size={20} color="#14532D" />,
      items: todoList?.data?.todo_items?.map((item) => item.notification) ?? [],
      todoItems: todoList?.data?.todo_items ?? [],
    },
    // Add more cards here if needed
  ];

  const handleTodoClick = (item: todo_items) => {
    console.log('Clicked To-Do Item:', item);

    if (item.redirect_type === 'dashboard_school' && item.school_id) {
      navigation.navigate('EmailCommunication', {
        id: item.school_id,
        type: item.notification,
      });
    } else if (item.redirect_type === 'explorer') {
      onRedirect('Explore');
    } else {
      Alert.alert('Info', 'No action available for this item.');
    }
  };

 const renderCard = ({ item }: { item: CardItem }) => (
  <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-200">
    <View className="flex-row items-center">
      {item.icon}
      <TitleText className="ml-2">{item.title}</TitleText>
    </View>

    {item.todoItems && item.todoItems.length > 0 ? (
      item.items.map((text, idx) => {
        const todoItem = item.todoItems?.[idx];

        const content = (
          <View key={idx} className="flex-row items-start">
            <AppText className="ml-5">•</AppText>
            <AppText className="ml-5">{text}</AppText>
          </View>
        );

        return item.id === '1' && todoItem ? (
          <TouchableOpacity key={idx} onPress={() => handleTodoClick(todoItem)}>
            {content}
          </TouchableOpacity>
        ) : (
          content
        );
      })
    ) : (
      <AppText className="ml-5 mt-2 text-gray-500 italic">
        No data available
      </AppText>
    )}
  </View>
);


  const today = new Date();
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  }).format(today);

  return (
    <View className="flex-1 bg-background pt-14">
      <View className="px-4 mb-6">
        <TitleText size="text-24">
          Hi, {todoList?.data?.profile?.name ?? 'User'} 👋
        </TitleText>
        <AppText className="-mt-3">{formattedDate}</AppText>
      </View>

      <FlatList
        data={buildCardData()}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      />

      <Loader show={loading} />
    </View>
  );
}
