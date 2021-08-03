import React ,{useState,useEffect}  from 'react'
import { useSelector,useDispatch } from 'react-redux';
import {View} from 'react-native';
import TopBar  from './src/layouts/TopBar';
import PushNotification from "react-native-push-notification";
import Home from "./src/screens/home";
import Travels from "./src/screens/travels";
import { NavigationContainer } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import AddTravel from './src/screens/add';
import Login from "./src/screens/Login"
import get_regions from './src/functions/GetRegions';
import get_token from './src/functions/get_token';
import send_notification_token from './src/functions/notification_token';


const theme = {
  ...DefaultTheme,
  roundness: 2,
  dark:false,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0675bc',
    accent: 'green',
    background:"#fff"
  },
};

const Tab = createMaterialTopTabNavigator();

export default function App() {

  const dispatch = useDispatch();
  const is_authenticated=useSelector(state => state.sessions.isLoggedIn)

  useEffect(()=>{ //component did mount
      get_regions(dispatch);
      get_token(dispatch);
    return ()=>{ //component  unmount
    }
  },[])

  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function (token) {
      console.log("Notification TOKEN:", token.token);
      send_notification_token(token.token)
      // dispatch({type:"SET_NOTIFICATION_TOKEN",payload:token.token})
      // if(is_authenticated)
      // get_storage('token').then(auth_token=>send_notification_token(auth_token,token.token))
      
    },
  
    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function (notification) {
      console.log("NOTIFICATION:", notification);
  
      // process the notification
  
      // (required) Called when a remote is received or opened, or local notification is opened
      // notification.finish(PushNotificationIOS.FetchResult.NoData);
    },
  
    // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    onAction: function (notification) {
      console.log("ACTION:", notification.action);
      console.log("NOTIFICATION:", notification);
  
      // process the action
    },
  
    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: function(err) {
      console.error(err.message, err);
    },
  
    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
  
    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,
  
    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     * - if you are not using remote notification or do not have Firebase installed, use this:
     *     requestPermissions: Platform.OS === 'ios'
     */
    requestPermissions: true,
  });


  if (is_authenticated)
  return (
    
       <PaperProvider theme={theme}>
        
        <NavigationContainer>
        <TopBar />
          <Tab.Navigator


            tabBarOptions={{
              activeTintColor: '#00a157',
              inactiveTintColor: 'darkgray',
              showIcon: true,
              pressColor: 'green',
              scrollEnabled: false,
              tabStyle: {  justifyContent: 'center', alignContent: 'center' },
              indicatorStyle: { backgroundColor: '#00a157', },
              // style: { backgroundColor: '#ffffff', borderRadius: 30, margin: 24, height: 72, width: '90%' },
              labelStyle: { fontSize: 14 },

            }}
            >
            <Tab.Screen 
              name="Home" 
              component={Travels} 
              options={{
                tabBarLabel: 'courses',
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="car" color={color} size={26} />
                ),
              }}
            />
            <Tab.Screen 
              name="Settings" 
              component={AddTravel} 
              options={{
                tabBarLabel: 'ajouter',
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="plus" color={color} size={26} />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
       </PaperProvider>
    
  )
  else 
  return(
    <Login/>
  )
}
