import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MainScreen from '../../screens/Main/main.screen';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';

export type MainStackParamList = {
    Main: {}
  };


const Stack = createStackNavigator<MainStackParamList>()


const MainStack = () => {
    return (
        <Stack.Navigator initialRouteName={'Main'}>
            <Stack.Screen name='Main' component={gestureHandlerRootHOC(MainScreen)}/>
        </Stack.Navigator>
    )
}


export default MainStack;