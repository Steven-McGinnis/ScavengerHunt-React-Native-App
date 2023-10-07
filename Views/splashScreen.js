// Core
import React, { useEffect } from 'react';
import { View, Image } from 'react-native';

// Third-party libraries
import { useSelector, useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';

// Custom components and utilities
import { styles } from '../Styles/styles';
import apiCall from '../Helper/apiCall';

// Redux slices
import { addAuthToken } from '../Model/Slices/authSlice';

const SplashScreen = ({ navigation }) => {
    const authTokenValue = useSelector((state) => state.authSlice.authToken);
    const dispatch = useDispatch();
    const intl = useIntl();

    useEffect(() => {
        setTimeout(async () => {
            console.log(authTokenValue);
            if (!authTokenValue) {
                navigation.replace('Login');
            } else {
                const response = await apiCall({
                    endpointSuffix: 'verifyToken.php',
                    data: { token: authTokenValue },
                    onFailureMessageId: 'networkError',
                    intl,
                });

                console.log(response);
                if (response.success) {
                    navigation.replace('HomeScreen');
                } else {
                    dispatch(addAuthToken(null));
                    navigation.replace('Login');
                }
            }
        }, 3000);
    }, [authTokenValue, navigation, dispatch, intl]);

    return (
        <View style={styles.splash}>
            <Image
                source={require('../assets/splashLogo.png')}
                style={{ width: 400, height: 400 }}
            />
        </View>
    );
};

export default SplashScreen;
