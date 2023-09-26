import * as Localization from 'expo-localization';
import { IntlProvider } from 'react-intl';
import { translations } from './Translations/translations';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { store } from './Model/store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { ActivityIndicator } from 'react-native-paper';
import InitializeScreen from './Views/initializeScreen';
import Authentication from './Views/authenticationScreen';
import Register from './Views/registerScreen';
import ScavengerScreen from './Views/scavengerScreen';
import HuntDetailScreen from './Views/huntDetailScreen';
import { customTheme } from './Styles/paperTheme';

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
							{/* My Other screens */}
						</Stack.Navigator>
					</NavigationContainer>
				</IntlProvider>
			</PersistGate>
		</Provider>
	);
}
