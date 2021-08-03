import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import List  from "./List"
import Details from './Details';


const Stack = createStackNavigator();

export default function index() {
    return (
            <Stack.Navigator>
                <Stack.Screen
                name="List" 
                component={List} 
                options={{ title: 'Liste des courses',headerShown: false }}
                />
                <Stack.Screen
                name="Details" 
                component={Details} 
                options={{ 
                    title: 'Details de la course',
                    headerStyle: { backgroundColor: '#000' },
                    headerTitleStyle: { color: 'white' },
                    headerTintColor: '#ffffff',
                }}
                />
            </Stack.Navigator>
    )
}
