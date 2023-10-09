// Third-party libraries
import * as Localization from 'expo-localization';
import { IntlProvider } from 'react-intl';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { ActivityIndicator } from 'react-native-paper';
import React from 'react';

// Local modules and components
import { translations } from './Translations/translations';
import { store } from './Model/store';
import SplashScreen from './Views/splashScreen';
import LoginScreen from './Views/loginScreen';
import Register from './Views/registerScreen';
import HuntScreen from './Views/huntScreen';
import HuntDetailScreen from './Views/huntDetailScreen';
import LocationScreen from './Views/locationScreen';
import MapLocationScreen from './Views/mapLocationScreen';
import ConditionEdit from './Views/conditionScreen';
import HomeScreen from './Views/homeScreen';
import { customTheme } from './Styles/paperTheme';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { themeColors } from './Styles/constants';

const Stack = createNativeStackNavigator();
const persistor = persistStore(store);

export default function App() {
    const locale = Localization.locale;
    const messages = translations[locale] || translations['en'];

    return (
        <PaperProvider theme={customTheme}>
            <Provider store={store}>
                <PersistGate
                    loading={<ActivityIndicator />}
                    persistor={persistor}>
                    <IntlProvider
                        locale={locale}
                        messages={messages}>
                        <NavigationContainer>
                            <StatusBar
                                style='light'
                                backgroundColor={themeColors.backgroundcolors}
                            />
                            <Stack.Navigator
                                initialRouteName='Splash'
                                screenOptions={{
                                    headerStyle: {
                                        backgroundColor:
                                            themeColors.backgroundcolors,
                                    },
                                    headerTintColor: themeColors.textColor,
                                    headerTitleStyle: {
                                        fontWeight: 'bold',
                                    },
                                }}>
                                <Stack.Screen
                                    name='Splash'
                                    component={SplashScreen}
                                    options={{
                                        headerShown: false,
                                    }}
                                />
                                <Stack.Screen
                                    name='Login'
                                    component={LoginScreen}
                                    options={{ title: 'Login' }}
                                />
                                <Stack.Screen
                                    name='Register'
                                    component={Register}
                                    options={{ title: 'Register' }}
                                />
                                <Stack.Screen
                                    name='HuntScreen'
                                    component={HuntScreen}
                                    options={{ title: 'Hunts Screen' }}
                                />
                                <Stack.Screen
                                    name='Hunt Details'
                                    component={HuntDetailScreen}
                                    options={{ title: 'Hunt Details' }}
                                />
                                <Stack.Screen
                                    name='LocationDetails'
                                    component={LocationScreen}
                                    options={{ title: 'Location Details' }}
                                />
                                <Stack.Screen
                                    name='Map Location'
                                    component={MapLocationScreen}
                                    options={{ title: 'Map Location' }}
                                />
                                <Stack.Screen
                                    name='EditCondition'
                                    component={ConditionEdit}
                                    options={{ title: 'Edit Condition' }}
                                />
                                <Stack.Screen
                                    name='HomeScreen'
                                    component={HomeScreen}
                                    options={{ title: 'Home Screen' }}
                                />
                            </Stack.Navigator>
                        </NavigationContainer>
                    </IntlProvider>
                </PersistGate>
            </Provider>
        </PaperProvider>
    );
}
