import React from 'react';
import { BottomNavigation, Text, DefaultTheme } from 'react-native-paper';
import FindHunts from '../Views/findHunts';
import ActiveHunts from '../Views/activeHunts';
import CompletedHunts from '../Views/completedHunts';
import { themeColors } from '../Styles/constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const FindHuntsRoute = () => <FindHunts />;
const ActiveHuntsRoute = () => <ActiveHunts />;
// Version 1.0.0
const BottomNav = () => {
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'findHunts', title: 'Find Hunts', focusedIcon: 'magnify' },
        {
            key: 'activeHunts',
            title: 'Active Hunts',
            focusedIcon: 'ticket',
        },
        {
            key: 'completedHunts',
            title: 'Completed Hunts',
            focusedIcon: 'check',
        },
    ]);

    const renderScene = BottomNavigation.SceneMap({
        findHunts: FindHuntsRoute,
        activeHunts: ActiveHuntsRoute,
        completedHunts: CompletedHunts,
    });

    const theme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            primary: 'white',
        },
    };

    return (
        <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
            barStyle={{
                backgroundColor: themeColors.backgroundcolors,
                colors: { primary: 'white' },
            }}
            activeColor='white'
            renderIcon={(props) => {
                const color = props.focused ? 'black' : 'white';
                const iconName = props.focused
                    ? props.route.focusedIcon
                    : props.route.unfocusedIcon || props.route.focusedIcon;
                return (
                    <Icon
                        name={iconName}
                        size={24}
                        color={color}
                        style={
                            props.focused
                                ? {
                                      textShadowColor: 'white',
                                      textShadowOffset: { width: 1, height: 1 },
                                      textShadowRadius: 10,
                                  }
                                : {}
                        }
                    />
                );
            }}
            renderLabel={(props) => (
                <Text
                    style={{
                        color: 'white',
                        fontSize: 12,
                        textAlign: 'center',
                    }}>
                    {props.route.title}
                </Text>
            )}
        />
    );
};

export default BottomNav;
