// Core
import React, { useState, useEffect } from 'react';
import {
	View,
	Alert,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
} from 'react-native';

// Third-party libraries
import { useDispatch, useSelector } from 'react-redux';
import { useIntl, FormattedMessage } from 'react-intl';
import { useFocusEffect } from '@react-navigation/native';
import {
	Button,
	Card,
	Text,
	TextInput,
	Snackbar,
	ProgressBar,
	List,
} from 'react-native-paper';
import { Image } from 'react-native';
import { TouchableOpacity } from 'react-native';

// Custom components and utilities
import { styles } from '../Styles/styles';
import LogoutButton from '../Components/logoutButton';
import apiCall from '../Helper/apiCall';
import useLocationTracking from '../Helper/useLocationTracking';

const LocationDetailScreen = ({ navigation, route }) => {
	const { location, currentName, huntid } = route.params;
	const authTokenValue = useSelector((state) => state.authSlice.authToken);
	const { locationData, subscription } = useLocationTracking();

	// State Management for Snackbar
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [snackbarVisible, setSnackbarVisible] = useState(false);
	// Currently Displayed Values
	const [currentLocationName, setCurrentLocationName] = useState('');
	const [currentLatitude, setCurrentLatitude] = useState('');
	const [currentLongitude, setCurrentLongitude] = useState('');
	const [currentClue, setCurrentClue] = useState('');
	const [currentDescription, setCurrentDescription] = useState('');

	// New Values for Updating
	const [newLocationName, setNewLocationName] = useState('');
	const [newLatitude, setNewLatitude] = useState('');
	const [newLongitude, setNewLongitude] = useState('');
	const [newClue, setNewClue] = useState('');
	const [newDescription, setNewDescription] = useState('');

	// State Management for Loading
	const [loading, setLoading] = useState(false);

	// Edit Location State
	const [openLocationEdit, setOpenLocationEdit] = useState(false);
	const [openLocationSet, setOpenLocationSet] = useState(false);

	const dispatch = useDispatch();
	const intl = useIntl();

	// Load my States from the Hunt
	useEffect(() => {
		setCurrentLocationName(location.name);
		setCurrentClue(location.clue);
		setCurrentDescription(location.description);
		setCurrentLatitude(location.latitude);
		setCurrentLongitude(location.longitude);
		setNewLocationName(location.name);
		setNewClue(location.clue);
		setNewDescription(location.description);
		setNewLatitude(location.latitude);
		setNewLongitude(location.longitude);
	}, [location]);

	// Submit Edit Hunt
	const submitEditedLocationDetails = async () => {
		console.log('submitEditedLocationDetails');
		if (!newLocationName || newLocationName === '') {
			setSnackbarMessage(
				intl.formatMessage({
					id: 'locationDetailScreen.newLocationNameError',
					defaultMessage: 'Please enter a New location name',
				})
			);
			setSnackbarVisible(true);
			return;
		}

		if (!newClue || newClue === '') {
			setSnackbarMessage(
				intl.formatMessage({
					id: 'locationDetailScreen.newClueError',
					defaultMessage: 'Please enter a New clue',
				})
			);
			setSnackbarVisible(true);
			return;
		}

		console.log('newDescription', newDescription);
		if (!newDescription || newDescription === '') {
			setSnackbarMessage(
				intl.formatMessage({
					id: 'locationDetailScreen.newDescriptionError',
					defaultMessage: 'Please enter a New description',
				})
			);
			setSnackbarVisible(true);
			return;
		}

		const response = await apiCall({
			endpointSuffix: 'updateHuntLocation.php',

			data: {
				locationid: location.locationid,
				token: authTokenValue,
				name: newLocationName,
				description: newDescription,
				clue: newClue,
			},
			onSuccessMessageId: 'locationDetailScreen.locationUpdated',
			onFailureMessageId: 'networkError',
			intl,
		});

		if (response.success) {
			setCurrentClue(newClue);
			setCurrentDescription(newDescription);
			setCurrentLocationName(newLocationName);
			setNewClue(newClue);
			setNewDescription(newDescription);
			setNewLocationName(newLocationName);
			setOpenLocationEdit(false);
		}
	};

	// Confirm Delete Hunt
	const showConfirmDialog = () => {
		if (Platform.OS === 'web') {
			const isConfirmed = window.confirm(
				intl.formatMessage({
					id: 'locationDetailScreen.deleteLocationConfirm',
					defaultMessage: 'Are you sure you want to delete selected location?',
				})
			);
			if (isConfirmed) {
				deleteHunt();
			}
		} else {
			Alert.alert(
				intl.formatMessage({
					id: 'locationDetailScreen.deleteLocationConfirm',
					defaultMessage: 'Are you sure you want to delete selected location?',
				}),
				`Delete?`,
				[
					// The "Yes" button
					{
						text: 'Yes',
						onPress: () => {
							deleteLocation();
						},
					},
					// The "No" button
					{
						text: 'No',
					},
				]
			);
		}
	};

	const setLocation = async () => {
		const response = await apiCall({
			endpointSuffix: 'updateHuntLocationPosition.php',
			data: {
				locationid: location.locationid,
				token: authTokenValue,
				latitude: locationData.coords.latitude,
				longitude: locationData.coords.longitude,
			},
			onSuccessMessageId: 'locationDetailScreen.locationSet',
			onFailureMessageId: 'networkError',
			intl,
		});

		if (response.success) {
			console.log('location set successfully!', response.data);
			setCurrentLatitude(locationData.coords.latitude);
			setCurrentLongitude(locationData.coords.longitude);
		}
	};

	const deleteLocation = async () => {
		const response = await apiCall({
			endpointSuffix: 'deleteHuntLocation.php',
			data: {
				locationid: location.locationid,
				token: authTokenValue,
			},
			onSuccessMessageId: 'locationDetailScreen.locationDeleted',
			onFailureMessageId: 'networkError',
			intl,
		});

		if (response.success) {
			navigation.goBack();
		}
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={styles.container}>
			<LogoutButton
				dispatch={dispatch}
				intl={intl}
			/>

			<ScrollView style={{ marginBottom: 70 }}>
				<View style={styles.container}>
					<Card style={styles.card}>
						<Card.Content>
							<Text>
								<FormattedMessage id='locationDetailScreen.locationName' />
								{currentLocationName}
							</Text>
							<Text>
								<FormattedMessage id='locationDetailScreen.locationID' />
								{location.locationid ? location.locationid : 'None'}
							</Text>
							<Text>
								<FormattedMessage id='locationDetailScreen.latitude' />
								{currentLatitude ? currentLatitude : 'None'}
							</Text>
							<Text>
								<FormattedMessage id='locationDetailScreen.longitude' />
								{currentLongitude ? currentLongitude : 'None'}
							</Text>
							<Text>
								<FormattedMessage id='locationDetailScreen.locationClue' />{' '}
								{currentClue ? currentClue : 'None'}
							</Text>
							<Text>
								<FormattedMessage id='locationDetailScreen.locationDescription' />{' '}
								{currentDescription ? currentDescription : 'None'}
							</Text>

							{openLocationEdit && (
								<View>
									<View style={styles.spacer2} />
									<TextInput
										activeOutlineColor='green'
										mode='outlined'
										label={intl.formatMessage({
											id: 'locationDetailScreen.locationName',
											defaultMessage: 'Location Name',
										})}
										value={newLocationName}
										onChangeText={(text) => setNewLocationName(text)}
										style={styles.input}
									/>
									<TextInput
										activeOutlineColor='green'
										mode='outlined'
										label={intl.formatMessage({
											id: 'locationDetailScreen.clue',
											defaultMessage: 'Clue',
										})}
										value={newClue}
										onChangeText={(text) => setNewClue(text)}
										style={styles.input}
									/>
									<TextInput
										activeOutlineColor='green'
										mode='outlined'
										label={intl.formatMessage({
											id: 'locationDetailScreen.locationDescription',
											defaultMessage: 'Location Description',
										})}
										multiline={true}
										value={newDescription}
										onChangeText={(text) => setNewDescription(text)}
										style={styles.input}
									/>
									<Button
										mode='contained'
										onPress={submitEditedLocationDetails}
										style={styles.loginButton}
										buttonColor='green'>
										{intl.formatMessage({
											id: 'locationDetailScreen.locationUpdateButton',
											defaultMessage: 'Update Location',
										})}
									</Button>
								</View>
							)}
						</Card.Content>
					</Card>
				</View>

				{/* needs locationData too */}
				{openLocationSet && locationData ? (
					<View style={styles.container}>
						<Card style={styles.card}>
							<Card.Title
								title={intl.formatMessage({
									id: 'locationDetailScreen.locationPanelTitle',
									defaultMessage: 'Location Set Panel',
								})}
							/>
							<Card.Content>
								<View
									style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
									<Text>
										{intl.formatMessage({
											id: 'locationDetailScreen.touchToSetLocation',
											defaultMessage: 'Location Set Panel',
										})}
									</Text>
									<TouchableOpacity
										onPress={() => {
											setLocation();
										}}>
										<Image
											source={require('../assets/locationPrimary.png')}
											style={{ width: 150, height: 150, alignSelf: 'center' }}
										/>
									</TouchableOpacity>
								</View>
								<View style={styles.spacer2} />
								<Button
									mode='contained'
									onPress={() => setOpenLocationSet((prevState) => !prevState)}
									style={styles.loginButton}
									buttonColor='green'>
									{intl.formatMessage({
										id: 'locationDetailScreen.closeLocationSet',
										defaultMessage: 'Close Location Set Panel',
									})}
								</Button>
							</Card.Content>
						</Card>
					</View>
				) : (
					<View style={styles.container}>
						<Card style={styles.card}>
							<Card.Title
								title={intl.formatMessage({
									id: 'locationDetailScreen.openLocationSet',
									defaultMessage: 'Open Location Set Panel',
								})}
							/>
							<Card.Content>
								<Button
									mode='contained'
									onPress={() => setOpenLocationSet((prevState) => !prevState)}
									style={styles.loginButton}
									buttonColor='green'>
									{intl.formatMessage({
										id: 'locationDetailScreen.openLocationSet',
										defaultMessage: 'Open Location Set Panel',
									})}
								</Button>
							</Card.Content>
						</Card>
					</View>
				)}
			</ScrollView>
			<View style={styles.navigation}>
				<Card style={styles.card}>
					<Card.Content
						Content
						style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
						<Button
							mode='contained'
							onPress={() => !setOpenLocationEdit((prevState) => !prevState)}
							style={styles.loginButton}
							buttonColor='green'>
							{intl.formatMessage({
								id: 'locationDetailScreen.editLocationButton',
								defaultMessage: 'Edit Location',
							})}
						</Button>
						<View style={styles.spacer2} />
						<Button
							mode='contained'
							onPress={showConfirmDialog}
							style={styles.loginButton}
							buttonColor='green'>
							{intl.formatMessage({
								id: 'locationDetailScreen.deleteLocationButton',
								defaultMessage: 'Delete Location',
							})}
						</Button>
					</Card.Content>
				</Card>
			</View>
			<Snackbar
				visible={snackbarVisible}
				onDismiss={() => setSnackbarVisible(false)}
				duration={Snackbar.DURATION_SHORT}>
				{snackbarMessage}
			</Snackbar>
		</KeyboardAvoidingView>
	);
};

export default LocationDetailScreen;
