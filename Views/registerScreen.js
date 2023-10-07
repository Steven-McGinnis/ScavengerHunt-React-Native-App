// Core
import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';

// Third-party libraries
import { useDispatch } from 'react-redux';
import {
    Avatar,
    Button,
    Card,
    Text,
    TextInput,
    Snackbar,
} from 'react-native-paper';
import { useIntl, FormattedMessage } from 'react-intl';

// Custom components and utilities
import { styles } from '../Styles/styles';
import { themeColors } from '../Styles/constants';
import apiCall from '../Helper/apiCall';
import CustomSnackbar from '../Components/customSnackBar';

// Redux slices
import { addAuthToken } from '../Model/Slices/authSlice';

const Register = ({ navigation }) => {
    const dispatch = useDispatch();
    const intl = useIntl();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarIconName, setSnackbarIconName] = useState(null);

    const handleRegister = async () => {
        if (!username || !password || !password2) {
            setSnackbarMessage(
                intl.formatMessage({
                    id: 'register.enterUsernameAndPassword',
                    defaultMessage: 'Please enter a username and password',
                })
            );
            setSnackbarIconName('error-outline');
            setSnackbarVisible(true);
            return;
        }

        if (password !== password2) {
            setSnackbarMessage(
                intl.formatMessage({
                    id: 'register.passwordMismatch',
                    defaultMessage: 'Passwords do not match',
                })
            );
            setSnackbarIconName('error-outline');
            setSnackbarVisible(true);
            return;
        }

        const response = await apiCall({
            endpointSuffix: 'register.php',
            data: {
                userid: username,
                password: password,
            },
            onSuccessMessageId: null,
            onFailureMessageId: 'Failed to register. Please try again.',
            intl,
        });

        if (!response.success) {
            setSnackbarMessage(
                response.message ||
                    intl.formatMessage({
                        id: 'defaultErrorMessage',
                        defaultMessage:
                            'An error occurred. Please try again later.',
                    })
            );
            setSnackbarIconName('error-outline');
            setSnackbarVisible(true);
            return; // Ensure we exit the function after handling the error
        }

        if (response.success) {
            dispatch(addAuthToken(response.data.token));
            navigation.navigate('ScavengerScreen');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <Card style={styles.card}>
                    <Card.Title
                        title={
                            <FormattedMessage
                                id='register.subtitle'
                                defaultMessage='Create Account'
                            />
                        }
                        titleStyle={styles.cardTitle}
                    />
                    <Card.Content>
                        <TextInput
                            activeOutlineColor={
                                themeColors.textactiveOutlineColor
                            }
                            mode={themeColors.textMode}
                            label={intl.formatMessage({
                                id: 'register.usernameLabel',
                                defaultMessage: 'Username',
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
                                id: 'register.passwordLabel',
                                defaultMessage: 'Password',
                            })}
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            secureTextEntry
                            style={styles.input}
                            textColor={themeColors.cardTextColor}
                        />
                        <TextInput
                            activeOutlineColor={
                                themeColors.textactiveOutlineColor
                            }
                            mode={themeColors.textMode}
                            label={intl.formatMessage({
                                id: 'register.reenterPasswordLabel',
                                defaultMessage: 'Re-enter Password',
                            })}
                            value={password2}
                            onChangeText={(text) => setPassword2(text)}
                            secureTextEntry
                            style={styles.input}
                            textColor={themeColors.cardTextColor}
                        />
                        <View style={styles.spacer} />
                        <Button
                            mode={themeColors.buttonMode}
                            onPress={handleRegister}
                            style={styles.loginButton}
                            buttonColor={themeColors.buttonColor}>
                            {intl.formatMessage({
                                id: 'register.registerButton',
                                defaultMessage: 'Register',
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

export default Register;
