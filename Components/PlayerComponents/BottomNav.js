// BottomNav.js
import React from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import FindHunts from '../../Views/findHunts';

const HomeRoute = () => <Text>Home</Text>;
const SettingsRoute = () => <Text>Settings</Text>;
const ProfileRoute = () => <Text>Profile</Text>;
const FindHuntsRoute = () => <FindHunts />;

const BottomNav = () => {
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'findHunts', title: 'Find Hunts', icon: 'map' },
        { key: 'home', title: 'Home', icon: 'home' },
        { key: 'settings', title: 'Settings', icon: 'cog' },
        { key: 'profile', title: 'Profile', icon: 'account' },
    ]);

    const renderScene = BottomNavigation.SceneMap({
        findHunts: FindHuntsRoute,
        home: HomeRoute,
        settings: SettingsRoute,
        profile: ProfileRoute,
    });

    return (
        <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
        />
    );
};

export default BottomNav;
