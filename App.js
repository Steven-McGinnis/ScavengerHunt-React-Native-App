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
import InitializeScreen from './Views/initializeScreen';
import Authentication from './Views/authenticationScreen';
import Register from './Views/registerScreen';
import ScavengerScreen from './Views/scavengerScreen';
import HuntDetailScreen from './Views/huntDetailScreen';
import LocationDetailScreen from './Views/locationDetailScreen';
import MapLocationScreen from './Views/mapLocationScreen';
import ConditionEditScreen from './Views/conditionEditScreen';
import ChooseRoleScreen from './Views/chooseRoleScreen';
import PlayerHomeScreen from './Views/playerHomeScreen';
import { customTheme } from './Styles/paperTheme';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';

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
								backgroundColor='#1DB954'
							/>
							<Stack.Navigator
								initialRouteName='Splash'
								screenOptions={{
									headerStyle: {
										backgroundColor: 'white',
									},
									headerTintColor: 'green',
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
								<Stack.Screen
									name='Edit Condition'
									component={ConditionEditScreen}
								/>
								<Stack.Screen
									name='Choose Role Player/Builder'
									component={ChooseRoleScreen}
								/>
								<Stack.Screen
									name='Player Home Screen'
									component={PlayerHomeScreen}
								/>
							</Stack.Navigator>
						</NavigationContainer>
					</IntlProvider>
				</PersistGate>
			</Provider>
		</PaperProvider>
	);
}
