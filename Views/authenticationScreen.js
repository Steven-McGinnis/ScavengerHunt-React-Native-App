import React, { useState } from 'react';
import { View, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { styles } from '../Styles/styles';
import { useDispatch } from 'react-redux';
import { addAuthToken } from '../Model/Slices/authSlice';
import { Button, Card, TextInput } from 'react-native-paper';
import { Snackbar } from 'react-native-paper';
import { useIntl, FormattedMessage } from 'react-intl';

const Authentication = ({ navigation }) => {
	const dispatch = useDispatch();
	const intl = useIntl();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [snackbarVisible, setSnackbarVisible] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');

	const handleLogin = () => {
		if (!username || !password) {
			setSnackbarMessage(
				intl.formatMessage({ id: 'authentication.emptyFieldsError' })
			);
			setSnackbarVisible(true);
			return;
		}

		let formData = new FormData();
		formData.append('userid', username);
		formData.append('password', password);

		fetch('https://cpsc345sh.jayshaffstall.com/login.php', {
			method: 'POST',
			body: formData,
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.status === 'okay') {
					console.log('Login successfully!', data);
					dispatch(addAuthToken(data.token));
					navigation.replace('ScavengerScreen');
				} else if (data.status === 'error') {
					console.error('Registration error:', data.error);

					setSnackbarMessage(data.error[0]);
					setSnackbarVisible(true);
				}
			})
			.catch((error) => {
				console.error('Network or other error:', error);
				setSnackbarMessage(
					intl.formatMessage({ id: 'authentication.loginError' })
				);
				setSnackbarVisible(true);
			});
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={styles.container}>
			<ScrollView>
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
					<Snackbar
						visible={snackbarVisible}
						onDismiss={() => setSnackbarVisible(false)}
						duration={Snackbar.DURATION_SHORT}>
						{snackbarMessage}
					</Snackbar>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

export default Authentication;
