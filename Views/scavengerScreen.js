import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import { styles } from '../Styles/styles';
import { useDispatch } from 'react-redux';
import {
	Avatar,
	Button,
	Card,
	Text,
	TextInput,
	Snackbar,
} from 'react-native-paper';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { addAuthToken } from '../Model/Slices/authSlice';
import { useIntl, FormattedMessage } from 'react-intl';
import LogoutButton from '../Components/logoutButton';

const ScavengerScreen = ({ navigation }) => {
	const dispatch = useDispatch();
	const [snackbarVisible, setSnackbarVisible] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const intl = useIntl(); // Use the intl hook

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={styles.container}>
			<LogoutButton
				dispatch={dispatch}
				intl={intl}
			/>
			<ScrollView>
				<View style={styles.container}>
					<Snackbar
						visible={snackbarVisible}
						onDismiss={() => setSnackbarVisible(false)}
						duration={Snackbar.DURATION_SHORT}>
						{snackbarMessage}
					</Snackbar>
					<Card style={styles.card}>
						{/* Translated title using FormattedMessage component */}
						<Card.Title
							title={<FormattedMessage id='ScavengerScreen' />}
							subtitle={<FormattedMessage id='CreateAccount' />}
						/>
						<Card.Content></Card.Content>
					</Card>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

export default ScavengerScreen;
