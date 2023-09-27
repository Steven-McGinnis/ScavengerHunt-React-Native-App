// Core
import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';

// Third-party libraries
import { useDispatch } from 'react-redux';
import { Button, Card, TextInput, Snackbar } from 'react-native-paper';
import { useIntl } from 'react-intl';

// Custom components and utilities
import { styles } from '../Styles/styles';
import apiCall from '../Helper/apiCall';

// Redux slices
import { addAuthToken } from '../Model/Slices/authSlice';

const Authentication = ({ navigation }) => {
	const dispatch = useDispatch();
	const intl = useIntl();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [snackbarVisible, setSnackbarVisible] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');

	const handleLogin = async () => {
		if (!username || !password) {
			setSnackbarMessage(
				intl.formatMessage({ id: 'authentication.emptyFieldsError' })
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
			onFailureMessageId: 'authentication.loginError',
			intl,
		});

		if (response.success) {
			dispatch(addAuthToken(response.data.token));
			navigation.replace('ScavengerScreen');
		}
	};

	return (
		<ScrollView style={{ backgroundColor: '#444654' }}>
			<Snackbar
				visible={snackbarVisible}
				onDismiss={() => setSnackbarVisible(false)}
				duration={Snackbar.DURATION_SHORT}>
				{snackbarMessage}
			</Snackbar>
			<View style={styles.container}>
				<Card style={styles.card}>
					<Card.Title
						title={intl.formatMessage({ id: 'authentication.title' })}
						subtitle={intl.formatMessage({ id: 'authentication.subtitle' })}
					/>
					<Card.Content>
						<TextInput
							label={intl.formatMessage({
								id: 'authentication.usernameLabel',
							})}
							value={username}
							onChangeText={(text) => setUsername(text)}
							style={styles.input}
						/>
						<TextInput
							label={intl.formatMessage({
								id: 'authentication.passwordLabel',
							})}
							value={password}
							onChangeText={(text) => setPassword(text)}
							secureTextEntry
							style={styles.input}
						/>
						<View style={styles.spacer} />
						<Button
							mode='contained'
							onPress={handleLogin}
							style={styles.loginButton}
							buttonColor='green'>
							{intl.formatMessage({ id: 'authentication.loginButton' })}
						</Button>
						<View style={styles.spacer2} />
						<Button
							mode='contained'
							onPress={() => navigation.navigate('Register')}
							style={styles.loginButton}
							buttonColor='green'>
							{intl.formatMessage({ id: 'authentication.registerButton' })}
						</Button>
					</Card.Content>
				</Card>
			</View>
		</ScrollView>
	);
};

export default Authentication;
