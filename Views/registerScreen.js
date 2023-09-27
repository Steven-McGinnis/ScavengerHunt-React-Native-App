// Core
import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

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
import apiCall from '../Helper/apiCall';

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

	const handleRegister = async () => {
		if (!username || !password || !password2) {
			setSnackbarMessage(
				intl.formatMessage({
					id: 'register.enterUsernameAndPassword',
					defaultMessage: 'Please enter a username and password',
				})
			);
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

		if (response.success) {
			console.log('Registered successfully!', response.data);
			dispatch(addAuthToken(response.data.token));
			navigation.navigate('ScavengerScreen');
		}
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={styles.container}>
			<ScrollView>
				<View style={styles.container}>
					<Snackbar
						visible={snackbarVisible}
						onDismiss={() => setSnackbarVisible(false)}
						duration={Snackbar.DURATION_SHORT}>
						{snackbarMessage}
					</Snackbar>
					<Card style={styles.card}>
						<Card.Title
							title={
								<FormattedMessage
									id='register.title'
									defaultMessage='Register'
								/>
							}
							subtitle={
								<FormattedMessage
									id='register.subtitle'
									defaultMessage='Create Account'
								/>
							}
						/>
						<Card.Content>
							<TextInput
								label={intl.formatMessage({
									id: 'register.usernameLabel',
									defaultMessage: 'Username',
								})}
								value={username}
								onChangeText={(text) => setUsername(text)}
								style={styles.input}
							/>
							<TextInput
								label={intl.formatMessage({
									id: 'register.passwordLabel',
									defaultMessage: 'Password',
								})}
								value={password}
								onChangeText={(text) => setPassword(text)}
								secureTextEntry
								style={styles.input}
							/>
							<TextInput
								label={intl.formatMessage({
									id: 'register.reenterPasswordLabel',
									defaultMessage: 'Re-enter Password',
								})}
								value={password2}
								onChangeText={(text) => setPassword2(text)}
								secureTextEntry
								style={styles.input}
							/>
							<View style={styles.spacer} />
							<Button
								mode='contained'
								onPress={handleRegister}
								style={styles.loginButton}
								buttonColor='green'>
								{intl.formatMessage({
									id: 'register.registerButton',
									defaultMessage: 'Register',
								})}
							</Button>
						</Card.Content>
					</Card>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

export default Register;
