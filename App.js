import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { AntDesign, SimpleLineIcons, Feather, Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import LoginScreen from './screens/LoginScreen'; 
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import AddingScreen from './screens/AddingScreen';
import AuthContextProvider, { AuthContext } from './store/auth-context';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import ReviewsScreen from './screens/ReviewsScreen';
import FullFilmList from './screens/FullFilmList';
import Logo from './components/Logo';
import SplashAnimation from './components/SplashAnimation';
import SecurityScreen from './screens/SecurityScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

function TopTabs() {
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "grey",
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          textTransform: 'capitalize'
        },
        tabBarIndicatorStyle: {
          height: 3,
          backgroundColor: 'white'
        },
        tabBarStyle: { 
          backgroundColor: '#173d39',
          height: 50
        },
      }}
    >
      <TopTab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Films' }}
      />
      <TopTab.Screen
        name="Reviews"
        component={ReviewsScreen}
        options={{ tabBarLabel: 'Reviews' }}
      />
    </TopTab.Navigator>
  );
}

function Navigation() {
  const authContext = useContext(AuthContext);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#173d39' }, headerTintColor: "white" }}>
          {/* SplashScreen component will be shown first */}
              <Stack.Screen name="Splash" component={SplashAnimation} options={{ headerShown: false }} />
              
          {!authContext.isAuthenticated ? (
            <>
              <Stack.Screen name="WatchHub" component={MyTabs} options={{ headerShown: false }} />
              <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} options={{ headerShown: true, headerTitle: 'Edit Profile',headerBackTitleVisible: false, }} />
            </>
          ) : (
            <>
              <Stack.Screen name="WatchHub" component={AfterLoginMyTabs} options={{ headerShown: false }} />
              <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} options={{ headerShown: true, headerTitle: 'Edit Profile',headerBackTitleVisible: false, }} />
              <Stack.Screen name="FullFilmList" component={FullFilmList} options={{ headerShown: true, headerTitle: 'Movies' }} />
              <Stack.Screen name="SecurityScreen" component={SecurityScreen} options={{ headerShown: true, headerTitle: 'Password and Authentication',headerBackTitleVisible: false, }} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "grey",
        tabBarStyle: { backgroundColor: 'black', height: 80 }, 
      }}
      initialRouteName="Profile"
    >
      <Tab.Screen
        name="Profile"
        component={LoginScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <SimpleLineIcons name="user" size={24} color={color} />          
          ),
        }}
      />
      <Tab.Screen
        name="TopTabs"
        component={TopTabs}
        options={{
          tabBarLabel: 'Home',
          headerShown: true,
          headerTitle: () => <Logo />, // Logo bileşenini headerTitle olarak ekliyoruz
          headerStyle: { backgroundColor: '#173d39' }, // Header stilini belirleyin
          headerTintColor: 'white', // Başlık rengi
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          headerShown: true,
          headerTintColor: 'white',
          headerStyle: { backgroundColor: '#173d39' },
          tabBarIcon: ({ color }) => (
            <Feather name="settings" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AfterLoginMyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "grey",
        tabBarStyle: { backgroundColor: 'black', height: 80 }, 
      }}
      initialRouteName="Home"
    >
      <Tab.Screen
        name="TopTabs"
        component={TopTabs}
        options={{
          tabBarLabel: 'Home',
          headerShown: true,
          headerTitle: () => <Logo />, // Logo bileşenini headerTitle olarak ekliyoruz
          headerStyle: { backgroundColor: '#173d39' }, // Header stilini belirleyin
          headerTintColor: 'white', // Başlık rengi
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
          headerShown: true,
          headerTitle: () => <Logo />, // Logo bileşenini headerTitle olarak ekliyoruz
          headerStyle: { backgroundColor: '#173d39' }, // Header stilini belirleyin
          headerTintColor: 'white', // Başlık rengi
          tabBarIcon: ({ color }) => (
            <AntDesign name="search1" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddingScreen}
        options={{
          tabBarLabel: 'Add Review',
          headerShown: true,
          headerTitle: () => <Logo />, // Logo bileşenini headerTitle olarak ekliyoruz
          headerStyle: { backgroundColor: '#173d39' }, // Header stilini belirleyin
          headerTintColor: 'white', // Başlık rengi
          tabBarIcon: ({ color }) => (
            <Ionicons name="add-circle-outline" size={32} color="#00FF00" />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <SimpleLineIcons name="user" size={24} color={color} />          
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          headerShown: true,
          headerTintColor: 'white',
          headerStyle: { backgroundColor: '#173d39' },
          tabBarIcon: ({ color }) => (
            <Feather name="settings" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}> 
      <AuthContextProvider>
        <Navigation/>
      </AuthContextProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.5,
  },
});
