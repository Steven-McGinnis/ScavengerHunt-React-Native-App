import * as Localization from "expo-localization";
import { IntlProvider } from "react-intl";
import { translations } from "./Translations/translations";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";
import { store } from "./Model/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { ActivityIndicator } from "react-native-paper";
import InitializeScreen from "./Views/initializeScreen";

const Stack = createNativeStackNavigator();
const persistor = persistStore(store);

export default function App() {
  const locale = Localization.locale;
  const messages = translations[locale] || translations["en"];

  return (
    <Provider store={store}>
      <PersistGate
        loading={<ActivityIndicator />}
        persistor={persistor}
      >
        <IntlProvider
          locale={locale}
          messages={messages}
        >
          <NavigationContainer>
            <Stack.Navigator initialRouteName='Home'>
              <Stack.Screen
                name='Initialize'
                component={InitializeScreen}
              />
              {/* My Other screens */}
            </Stack.Navigator>
          </NavigationContainer>
        </IntlProvider>
      </PersistGate>
    </Provider>
  );
}
