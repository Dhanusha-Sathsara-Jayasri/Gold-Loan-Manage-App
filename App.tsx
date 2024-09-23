import HomeScreen from './HomeScreen.tsx';
import MainScreen from './MainScreen.tsx';
import LoanApplicationsScreen from './LoanApplicationsScreen.tsx';
import ItemsAddingPage from './ItemsAddingPage.tsx';
import ProjectManagerPage from './ProjectManagerPage.tsx';
import ProjectManagerPage2 from './ProjectManagerPage2.tsx';
import MonthlyInstallmentPage from './MonthlyInstallmentPage.tsx';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Orientation from 'react-native-orientation-locker';
import React, {useEffect} from 'react';

function App() {
  const Stack = createNativeStackNavigator();

  useEffect(() => {
    Orientation.lockToPortrait(); // Lock the entire app to portrait mode
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          animation: 'slide_from_right',
          animationDuration: 350,
          headerStyle: {
            backgroundColor: '#232639',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen
          options={{
            animation: 'slide_from_bottom',
            animationDuration: 350,
            headerStyle: {
              backgroundColor: '#232639',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
          name="Home Screen"
          component={HomeScreen}
        />
        <Stack.Screen
          options={{
            headerStyle: {
              backgroundColor: '#232639',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
          name="Main Screen"
          component={MainScreen}
        />
        <Stack.Screen
          options={{
            headerStyle: {
              backgroundColor: '#232639',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
          name="Loan Applications Screen"
          component={LoanApplicationsScreen}
        />
        <Stack.Screen
          options={{
            headerStyle: {
              backgroundColor: '#232639',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
          name="Items Adding Page"
          component={ItemsAddingPage}
        />
        <Stack.Screen
          options={{
            headerStyle: {
              backgroundColor: '#232639',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
          name="Project Manager Page"
          component={ProjectManagerPage}
        />
        <Stack.Screen
          options={{
            headerStyle: {
              backgroundColor: '#232639',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
          name="Previouly Updated Data Page"
          component={ProjectManagerPage2}
        />
        <Stack.Screen
          options={{
            headerStyle: {
              backgroundColor: '#232639',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
          name="Monthly Installment Page"
          component={MonthlyInstallmentPage}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
