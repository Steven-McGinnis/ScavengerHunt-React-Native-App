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

// Custom components and utilities
import { styles } from '../Styles/styles';
import { themeColors } from '../Styles/constants';
import LogoutButton from '../Components/logoutButton';
import apiCall from '../Helper/apiCall';

// Redux slices
import {
	clearHuntLocations,
	addHuntLocations,
} from '../Model/Slices/HuntSlice';

const HuntDetailScreen = ({ navigation, route }) => {
	const { active, huntid, name } = route.params;
	const hunt = useSelector((state) =>
		state.huntSlice.huntItems.find((h) => h.huntid === huntid)
	);

	const authTokenValue = useSelector((state) => state.authSlice.authToken);

	// State Management for Hunt Name
	const [currentName, setCurrentName] = useState('');
	const [newHuntName, setNewHuntName] = useState('');
	const [newHuntLocations, setNewHuntLocations] = useState('');
	const [locations, setLocations] = useState([]);
	// State Management for Snackbar
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [snackbarVisible, setSnackbarVisible] = useState(false);

	const [loading, setLoading] = useState(false);

	// Edit Hunt State
	const [openEditHunt, setOpenEditHunt] = useState(false);

	const dispatch = useDispatch();
	const intl = useIntl();

	useEffect(() => {
		setNewHuntName(name);
		setCurrentName(name);
	}, [name]);

	// Submit Edit Hunt
	const submitEditHunt = async () => {
		if (!newHuntName || newHuntName === '') {
			setSnackbarMessage(
				intl.formatMessage({
					id: 'huntDetailScreen.newHuntNameError',
					defaultMessage: 'Please enter a New hunt name',
				})
			);
			setSnackbarVisible(true);
			return;
		}

		const response = await apiCall({
			endpointSuffix: 'updateHunt.php',
			data: {
				name: newHuntName,
				huntid: huntid,
				token: authTokenValue,
			},
			onSuccessMessageId: 'huntDetailScreen.huntUpdated',
			onFailureMessageId: 'networkError',
			intl,
		});

		if (response.success) {
			setCurrentName(newHuntName);
			setOpenEditHunt(false);
		}
	};

	// Confirm Delete Hunt
	const showConfirmDialog = () => {
		if (Platform.OS === 'web') {
			const isConfirmed = window.confirm(
				intl.formatMessage({
					id: 'huntDetailScreen.deleteHuntConfirm',
					defaultMessage: 'Are you sure you want to delete selected Hunt?',
				})
			);
			if (isConfirmed) {
				deleteHunt();
			}
		} else {
			Alert.alert(
				intl.formatMessage({
					id: 'huntDetailScreen.deleteHuntConfirm',
					defaultMessage: 'Are you sure you want to delete selected Hunt?',
				}),
				`Delete?`,
				[
					// The "Yes" button
					{
						text: 'Yes',
						onPress: () => {
							deleteHunt();
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

	// Add on Location to the Hunt
	const addLocationToTheHunt = async () => {
		if (!newHuntLocations || newHuntLocations === '') {
			setSnackbarMessage(
				intl.formatMessage({
					id: 'huntDetailScreen.newLocationNameError',
					defaultMessage: 'Please enter a New Location name',
				})
			);
			setSnackbarVisible(true);
			return;
		}

		const response = await apiCall({
			endpointSuffix: 'addHuntLocation.php',
			data: {
				name: newHuntLocations,
				huntid: huntid,
				token: authTokenValue,
			},
			onSuccessMessageId: 'huntDetailScreen.locationCreatedSuccessfully',
			onFailureMessageId: 'networkError',
			intl,
		});

		if (response.success) {
			fetchLocations();
			setOpenEditHunt(false);
		}
	};

	useEffect(() => {
		if (hunt) {
			setLocations(hunt.locations);
		}
	}, [hunt]);

	const deleteHunt = async () => {
		const response = await apiCall({
			endpointSuffix: 'deleteHunt.php',
			data: {
				huntid: huntid,
				token: authTokenValue,
			},
			onSuccessMessageId: 'huntDetailScreen.huntDeleted',
			onFailureMessageId: 'networkError',
			intl,
		});

		if (response.success) {
			navigation.replace('ScavengerScreen');
		}
	};

	// Fetch Locations for the Hunt
	const fetchLocations = async () => {
		setLoading(true);

		const response = await apiCall({
			endpointSuffix: 'getHuntLocations.php',
			data: {
				huntid: huntid,
				token: authTokenValue,
			},
			onSuccessMessageId: null,
			onFailureMessageId: 'networkError',
		});

		if (response.success) {
			dispatch(clearHuntLocations({ huntid: huntid }));

			const locations = response.data.locations;
			dispatch(addHuntLocations({ huntid: huntid, locations: locations }));
		}
		setLoading(false);
	};

	useFocusEffect(
		React.useCallback(() => {
			fetchLocations();
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
			<Snackbar
				visible={snackbarVisible}
				onDismiss={() => setSnackbarVisible(false)}
				duration={Snackbar.DURATION_SHORT}>
				{snackbarMessage}
			</Snackbar>
			<ScrollView style={{ marginBottom: 70 }}>
				<View style={styles.container}>
					<Card style={styles.card}>
						<Card.Content>
							<Text>
								<FormattedMessage id='huntDetailScreen.huntName' /> {currentName}
							</Text>
							<Text>
								<FormattedMessage id='huntDetailScreen.huntID' /> {huntid}
							</Text>
							<Text>
								<FormattedMessage id='huntDetailScreen.active' />{' '}
								{active ? 'Yes' : 'No'}
							</Text>
							{openEditHunt && (
								<View>
									<View style={styles.spacer2} />
									<TextInput
										activeOutlineColor={themeColors.textactiveOutlineColor}
										mode={themeColors.textMode}
										label={intl.formatMessage({
											id: 'huntDetailScreen.huntName',
											defaultMessage: 'Hunt Name',
										})}
										value={newHuntName}
										onChangeText={(text) => setNewHuntName(text)}
										style={styles.input}
									/>
									<View style={styles.spacer2} />
									<Button
										mode={themeColors.buttonMode}
										onPress={submitEditHunt}
										style={styles.loginButton}
										buttonColor={themeColors.buttonColor}>
										{intl.formatMessage({
											id: 'huntDetailScreen.submitEditHunt',
											defaultMessage: 'Submit',
										})}
									</Button>
								</View>
							)}
						</Card.Content>
					</Card>
				</View>

				{openEditHunt && (
					<View style={styles.container}>
						<Card style={styles.card}>
							<Card.Title
								title={intl.formatMessage({
									id: 'huntDetailScreen.locationTitle',
									defaultMessage: 'Add Location to Hunt',
								})}
								subtitle={intl.formatMessage({
									id: 'huntDetailScreen.selectLocationText',
									defaultMessage: 'Select a Location to Edit It',
								})}
							/>
							<Card.Content>
								{/* Add Location to Hunt */}
								<TextInput
									activeOutlineColor={themeColors.textactiveOutlineColor}
									mode={themeColors.textMode}
									label={intl.formatMessage({
										id: 'huntDetailScreen.addLocation',
										defaultMessage: 'Add Location to Hunt',
									})}
									value={newHuntLocations}
									onChangeText={(text) => setNewHuntLocations(text)}
									style={styles.input}
								/>
								<View style={styles.spacer2} />
								<Button
									mode={themeColors.buttonMode}
									onPress={addLocationToTheHunt}
									style={styles.loginButton}
									buttonColor={themeColors.buttonColor}>
									{intl.formatMessage({
										id: 'huntDetailScreen.addLocationButton',
										defaultMessage: 'Add Location',
									})}
								</Button>
							</Card.Content>
						</Card>
					</View>
				)}

				{loading && (
					<ProgressBar
						indeterminate={true}
						color='#00FF00'
						visible={loading}
						style={{ marginBottom: 10 }}
					/>
				)}

				{locations && Array.isArray(locations) && locations.length > 0 && (
					<Card>
						<Card.Title
							title='Locations in this Hunt'
							subtitle='Select a Location to Edit It'
						/>
						{locations.map((location, index) => (
							<List.Item
								key={location.locationid}
								title={location.name}
								left={(props) => (
									<List.Icon
										{...props}
										icon='map-marker-radius'
									/>
								)}
								onPress={() => {
									navigation.navigate('Location Details', {
										location,
										currentName,
										huntid,
									});
								}}
							/>
						))}
					</Card>
				)}
			</ScrollView>
			<View style={styles.navigation}>
				<Card style={styles.card}>
					<Card.Content
						Content
						style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
						<Button
							mode={themeColors.buttonMode}
							onPress={() => !setOpenEditHunt((prevState) => !prevState)}
							style={styles.loginButton}
							buttonColor={themeColors.buttonColor}>
							{intl.formatMessage({
								id: 'huntDetailScreen.editHuntButton',
								defaultMessage: 'Edit Hunt',
							})}
						</Button>
						<View style={styles.spacer2} />
						<Button
							mode={themeColors.buttonMode}
							onPress={showConfirmDialog}
							style={styles.loginButton}
							buttonColor={themeColors.buttonColor}>
							{intl.formatMessage({
								id: 'huntDetailScreen.deleteHuntButton',
								defaultMessage: 'Edit Hunt',
							})}
						</Button>
					</Card.Content>
				</Card>
			</View>
		</KeyboardAvoidingView>
	);
};

export default HuntDetailScreen;
