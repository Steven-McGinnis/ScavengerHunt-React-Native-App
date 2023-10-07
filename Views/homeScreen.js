// Core
import React, { useEffect } from 'react';
import { View, Image } from 'react-native';

// Third-party libraries
import { useSelector, useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import { BottomNavigation, Text } from 'react-native-paper';
import BottomNav from '../Components/PlayerComponents/BottomNav';
import NavMenu from '../Components/navMenu';

// Custom components and utilities
import { styles } from '../Styles/styles';
import apiCall from '../Helper/apiCall';

const HomeScreen = ({ navigation }) => {
    const authTokenValue = useSelector((state) => state.authSlice.authToken);
    const dispatch = useDispatch();
    const intl = useIntl();

    return (
        <View style={styles.container}>
            <NavMenu />
            <BottomNav />
        </View>
    );
};

export default HomeScreen;
