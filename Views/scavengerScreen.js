// Core
import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

// Third-party libraries
import { useDispatch, useSelector } from 'react-redux';
import {
	Button,
	Card,
	Text,
	TextInput,
	Snackbar,
	List,
	ProgressBar,
} from 'react-native-paper';
import { useIntl, FormattedMessage } from 'react-intl';
import { useFocusEffect } from '@react-navigation/native';

// Custom components and utilities
import { styles } from '../Styles/styles';
import LogoutButton from '../Components/logoutButton';
import apiCall from '../Helper/apiCall';

// Redux slices
import { addHunt, clearHunts } from '../Model/Slices/HuntSlice';

const ScavengerScreen = ({ navigation }) => {
	const dispatch = useDispatch();
	const authTokenValue = useSelector((state) => state.authSlice.authToken);
	const huntList = useSelector((state) => state.huntSlice.huntItems);
	const [snackbarVisible, setSnackbarVisible] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const intl = useIntl();
	const [loading, setLoading] = useState(false);

	const [newHuntName, setNewHuntName] = useState('');

	const createHunt = async () => {
		if (!newHuntName) {
			setSnackbarMessage(
				intl.formatMessage({
					id: 'scavenger.newHuntName',
					defaultMessage: 'Please enter a hunt name',
				})
			);
			setSnackbarVisible(true);
			return;
		}

		const response = await apiCall({
			endpointSuffix: 'addHunt.php',
			data: {
				name: newHuntName,
				token: authTokenValue,
			},
			onSuccessMessageId: null,
			onFailureMessageId: 'scavenger.failedToRegister',
			intl,
		});

		if (response.success) {
			if (response.data.huntid) {
				fetchData();
				setNewHuntName('');
				setSnackbarMessage(
					intl.formatMessage({
						id: 'scavenger.huntCreated',
						defaultMessage: 'Hunter Created Successfully!',
					})
				);
				setSnackbarVisible(true);
			}
		}
	};

	const fetchData = async () => {
		setLoading(true);

		const response = await apiCall({
			endpointSuffix: 'getMyHunts.php',
			data: {
				token: authTokenValue,
			},
			onSuccessMessageId: null,
			onFailureMessageId: 'scavenger.failedToRegister',
			intl,
		});

		if (response.success) {
			dispatch(clearHunts());
			let hunts = response.data.hunts;
			hunts.forEach((element) => {
				dispatch(addHunt(element));
			});
		}

		setLoading(false);
	};

	useFocusEffect(
		React.useCallback(() => {
			fetchData();
			return () => {};
		}, [])
	);

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={styles.container}>
			<LogoutButton
				dispatch={dispatch}
				intl={intl}
			/>
			{loading && (
				<ProgressBar
					indeterminate={true}
					color='#00FF00'
					visible={loading}
				/>
			)}
			<ScrollView>
				<View style={styles.container}>
					<Card style={styles.card}>
						{/* Translated title using FormattedMessage component */}
						<Card.Title
							title={<FormattedMessage id='ScavengerScreen' />}
							subtitle={<FormattedMessage id='scavenger.newHunt' />}
						/>
						<Card.Cover source={require('../assets/splashLogo.png')} />
						<Card.Content>
							<TextInput
								label={intl.formatMessage({
									id: 'scavenger.newHuntName',
									defaultMessage: 'Hunt Name',
								})}
								value={newHuntName}
								onChangeText={(text) => setNewHuntName(text)}
								style={styles.input}
							/>
							<Button
								mode='contained'
								onPress={createHunt}
								style={styles.loginButton}
								buttonColor='green'>
								{intl.formatMessage({
									id: 'scavenger.createHunt',
									defaultMessage: 'Create Hunt',
								})}
							</Button>
						</Card.Content>
					</Card>
				</View>
				<Card>
					<Card.Title
						title='My Hunts'
						subtitle='Select a Hunt to Edit It'
					/>
					{huntList.map((hunt, index) => {
						return (
							<List.Item
								key={index}
								title={hunt.name}
								description={`Active: ${hunt.active.toString()}`}
								left={(props) => (
									<List.Icon
										{...props}
										icon='map-search'
									/>
								)}
								onPress={() => {
									navigation.navigate('Hunt Details', hunt);
								}}
							/>
						);
					})}
				</Card>
			</ScrollView>
			<Snackbar
				visible={snackbarVisible}
				onDismiss={() => setSnackbarVisible(false)}
				duration={Snackbar.DURATION_SHORT}>
				{snackbarMessage}
			</Snackbar>
		</KeyboardAvoidingView>
	);
};

export default ScavengerScreen;
