// Third-party libraries
import * as Localization from 'expo-localization';
import { IntlProvider } from 'react-intl';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { ActivityIndicator } from 'react-native-paper';
import * as Location from 'expo-location';
import React, { useEffect } from 'react';

// Local modules and components
import { translations } from './Translations/translations';
import { store } from './Model/store';
import InitializeScreen from './Views/initializeScreen';
import Authentication from './Views/authenticationScreen';
import Register from './Views/registerScreen';
import ScavengerScreen from './Views/scavengerScreen';
import HuntDetailScreen from './Views/huntDetailScreen';
import LocationDetailScreen from './Views/locationDetailScreen';
import MapLocationScreen from './Views/mapLocationScreen';
import { customTheme } from './Styles/paperTheme';
import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();
const persistor = persistStore(store);

export default function App() {
	const locale = Localization.locale;
	const messages = translations[locale] || translations['en'];

	return (
		<Provider
			store={store}
			theme={customTheme}>
			<PersistGate
				loading={<ActivityIndicator />}
				persistor={persistor}>
				<IntlProvider
					locale={locale}
					messages={messages}>
					<NavigationContainer>
						<StatusBar
							style='light'
							backgroundColor='#1DB954'
						/>
						<Stack.Navigator
							initialRouteName='Splash'
							screenOptions={{
								headerStyle: {
									backgroundColor: 'white',
								},
								headerTintColor: '#1DB954',
								headerTitleStyle: {
									fontWeight: 'bold',
								},
							}}>
							<Stack.Screen
								name='Splash'
								component={InitializeScreen}
								options={{
									headerShown: false,
								}}
							/>
							<Stack.Screen
								name='Authentication'
								component={Authentication}
							/>
							<Stack.Screen
								name='Register'
								component={Register}
							/>
							<Stack.Screen
								name='ScavengerScreen'
								component={ScavengerScreen}
							/>
							<Stack.Screen
								name='Hunt Details'
								component={HuntDetailScreen}
							/>
							<Stack.Screen
								name='Location Details'
								component={LocationDetailScreen}
							/>
							<Stack.Screen
								name='Map Location'
								component={MapLocationScreen}
							/>
							{/* My Other screens */}
						</Stack.Navigator>
					</NavigationContainer>
				</IntlProvider>
			</PersistGate>
		</Provider>
	);
}
