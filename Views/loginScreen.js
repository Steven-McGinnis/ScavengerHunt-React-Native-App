// Core
import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';

// Third-party libraries
import { useDispatch } from 'react-redux';
import { Button, Card, TextInput, Snackbar } from 'react-native-paper';
import { useIntl } from 'react-intl';

// Custom components and utilities
import { styles } from '../Styles/styles';
import { themeColors } from '../Styles/constants';
import apiCall from '../Helper/apiCall';
import CustomSnackbar from '../Components/customSnackBar';

// Redux slices
import { addAuthToken } from '../Model/Slices/authSlice';

const LoginScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const intl = useIntl();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarIconName, setSnackbarIconName] = useState(null);

    const handleLogin = async () => {
        if (!username || !password) {
            setSnackbarMessage(
                intl.formatMessage({ id: 'login.emptyFieldsError' })
            );
            setSnackbarVisible(true);
            return;
        }

        const response = await apiCall({
            endpointSuffix: 'login.php',
            data: {
                userid: username,
                password: password,
            },
            onSuccessMessageId: null,
            onFailureMessageId: 'login.loginError',
            intl,
        });

        if (!response.success) {
            setSnackbarMessage(response.message);
            setSnackbarIconName('error-outline');
            setSnackbarVisible(true);
            return;
        }

        if (response.success) {
            setSnackbarIconName('check-circle-outline');
            setSnackbarMessage(response.message);
            dispatch(addAuthToken(response.data.token));
            navigation.replace('HomeScreen');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.backgroundColor}>
                <Card style={styles.card}>
                    <Card.Content>
                        <TextInput
                            activeOutlineColor={
                                themeColors.textactiveOutlineColor
                            }
                            mode={themeColors.textMode}
                            label={intl.formatMessage({
                                id: 'login.usernameLabel',
                            })}
                            value={username}
                            onChangeText={(text) => setUsername(text)}
                            style={styles.input}
                            textColor={themeColors.cardTextColor}
                        />
                        <TextInput
                            activeOutlineColor={
                                themeColors.textactiveOutlineColor
                            }
                            mode={themeColors.textMode}
                            label={intl.formatMessage({
                                id: 'login.passwordLabel',
                            })}
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            secureTextEntry
                            style={styles.input}
                            textColor={themeColors.cardTextColor}
                        />
                        <View style={styles.spacer} />
                        <Button
                            mode={themeColors.buttonMode}
                            onPress={handleLogin}
                            style={styles.loginButton}
                            buttonColor={themeColors.buttonColor}>
                            {intl.formatMessage({
                                id: 'login.loginButton',
                            })}
                        </Button>
                        <View style={styles.spacer2} />
                        <Button
                            mode={themeColors.buttonMode}
                            onPress={() => navigation.navigate('Register')}
                            style={styles.loginButton}
                            buttonColor={themeColors.buttonColor}>
                            {intl.formatMessage({
                                id: 'login.registerButton',
                            })}
                        </Button>
                    </Card.Content>
                </Card>
            </ScrollView>
            <CustomSnackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                message={snackbarMessage}
                iconName={snackbarIconName}
                duration={Snackbar.DURATION_SHORT}
            />
        </View>
    );
};

export default LoginScreen;
