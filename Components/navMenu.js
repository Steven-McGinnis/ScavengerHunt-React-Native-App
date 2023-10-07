import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Menu } from 'react-native-paper';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux'; // Import the useDispatch hook
import { addAuthToken } from '../Model/Slices/authSlice';

const NavMenu = () => {
    const navigation = useNavigation();
    const [visible, setVisible] = useState(false);
    const intl = useIntl();
    const dispatch = useDispatch();

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: 'row', paddingRight: 5 }}>
                    <Menu
                        visible={visible}
                        onDismiss={closeMenu}
                        anchor={
                            <Button
                                onPress={openMenu}
                                icon='menu'>
                                Menu
                            </Button>
                        }>
                        {/* Home Button */}
                        <Menu.Item
                            icon='home'
                            onPress={() => {
                                closeMenu();
                                navigation.navigate('HomeScreen');
                            }}
                            title={intl.formatMessage({ id: 'navBar.home' })}
                        />

                        {/* Edit Hunts/Create Hunts */}
                        <Menu.Item
                            icon='map-search'
                            onPress={() => {
                                closeMenu();
                                navigation.navigate('HuntScreen');
                            }}
                            title={intl.formatMessage({ id: 'navBar.hunts' })}
                        />

                        {/* Logout Button */}
                        <Menu.Item
                            icon='logout'
                            onPress={() => {
                                closeMenu();
                                dispatch(addAuthToken(null));
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'Login' }],
                                });
                            }}
                            title={intl.formatMessage({ id: 'navBar.logout' })}
                        />
                    </Menu>
                </View>
            ),
        });
    }, [intl, visible]);

    return null;
};

export default NavMenu;
