import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, Text, View } from 'react-native';
import { AuthContext } from './components/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from './screens/splashScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/registerScreen';

import AuthStack from './src/navigation/AuthStack';

const Stack = createNativeStackNavigator();

const App = () => {
  //const [isLoading, setIsLoading] = React.useState(true);
  //const [userToken, setUserToken] = React.useState(null);
  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  };
  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
      case 'REGISTER':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
    }
  }
  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => ({
    signIn: async (status,token,user_Id) => {
      //setUserToken('fffff');
      //setIsLoading(false);
      let userToken;
      userToken = null;
      if (status) {
        try {
          userToken = token;
          await AsyncStorage.setItem('userToken', userToken);
          await AsyncStorage.setItem('userID',user_Id);
        } catch (e) {
          console.log(e);
        }

      }
      console.log('user token:', userToken);
      dispatch({ type: 'LOGIN', id:user_Id , token: userToken })
    },
    signOut: async () => {
      //setUserToken(null);
      //setIsLoading(false);
      try {
        userToken = 'dfgdfg';
        await AsyncStorage.removeItem('userToken')
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: 'LOGOUT' })
    },
    signUP: () => {
      setUserToken('fftfff');
      setIsLoading(false);
    },
  }), []);
  useEffect(() => {
    setTimeout(async () => {
      // setIsLoading(false);
      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        console.log(e);
      }
      // console.log('user token:',userToken);
      dispatch({ type: 'REGISTER', token: userToken })
    }, 1000);
  }, []);


  if (loginState.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authContext}>


      <NavigationContainer >
        {loginState.userToken === null ? (
          <Stack.Navigator >
            <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        )
          : (
            <AuthStack/>
            
          )
        }

      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export default App;